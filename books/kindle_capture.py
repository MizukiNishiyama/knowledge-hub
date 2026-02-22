#!/usr/bin/env python3
from __future__ import annotations
import argparse
import hashlib
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Optional


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Capture Kindle Web pages and export as PDF."
    )
    parser.add_argument(
        "--directory",
        required=True,
        help="Target book directory under ./data (name or relative path).",
    )
    parser.add_argument(
        "--pages",
        type=int,
        default=None,
        help="Number of pages to capture. If omitted, capture all pages.",
    )
    parser.add_argument(
        "--browser",
        choices=["chrome", "chromium"],
        default="chrome",
        help="Browser engine to launch. Default: chrome.",
    )
    parser.add_argument(
        "--headless",
        action="store_true",
        help="Run browser in headless mode.",
    )
    parser.add_argument(
        "--skip-ocr",
        action="store_true",
        help="Skip OCR overlay and keep image-only PDF as final output.",
    )
    args = parser.parse_args()
    if args.pages is not None and args.pages <= 0:
        parser.error("--pages must be greater than 0")
    return args


def resolve_target_dir(directory_arg: str) -> Path:
    root = Path.cwd()
    data_root = root / "data"
    candidate = Path(directory_arg)
    if not candidate.is_absolute():
        if candidate.parts and candidate.parts[0] == "data":
            candidate = root / candidate
        else:
            candidate = data_root / candidate
    candidate = candidate.resolve()
    if not candidate.exists() or not candidate.is_dir():
        raise FileNotFoundError(f"Directory not found: {candidate}")
    return candidate


def read_url_from_metadata(book_dir: Path) -> str:
    metadata_path = book_dir / "metadata.md"
    if not metadata_path.exists():
        raise FileNotFoundError(f"metadata.md not found: {metadata_path}")
    text = metadata_path.read_text(encoding="utf-8")
    m = re.search(r"https?://\S+", text)
    if not m:
        raise ValueError(f"URL not found in metadata.md: {metadata_path}")
    return m.group(0).strip()


def load_credentials() -> tuple[str, str]:
    from dotenv import load_dotenv

    load_dotenv()
    amazon_id = os.getenv("AMAZON_ID")
    amazon_pass = os.getenv("AMAZON_PASS")
    if not amazon_id or not amazon_pass:
        raise ValueError("AMAZON_ID / AMAZON_PASS are required in .env")
    return amazon_id, amazon_pass


def is_signin_page(page) -> bool:
    if "/ap/signin" in page.url:
        return True
    selectors = [
        "#ap_email",
        "#ap_password",
        "form[name='signIn']",
    ]
    for sel in selectors:
        try:
            if page.locator(sel).count() > 0:
                return True
        except Exception:
            continue
    return False


def login_if_required(page, amazon_id: str, amazon_pass: str) -> None:
    from playwright.sync_api import TimeoutError

    # リダイレクトでサインイン画面が遅れて出る場合があるため少し待つ。
    try:
        page.wait_for_function(
            "() => location.href.includes('/ap/signin') || !!document.querySelector('#ap_email')",
            timeout=20000,
        )
    except TimeoutError:
        return

    if not is_signin_page(page):
        return

    if page.locator("#ap_email").count() > 0:
        page.fill("#ap_email", amazon_id)
        if page.locator("#continue").count() > 0:
            page.click("#continue")

    page.wait_for_selector("#ap_password", timeout=20000)
    page.fill("#ap_password", amazon_pass, timeout=10000)
    page.click("#signInSubmit")

    try:
        page.wait_for_function(
            "() => !location.href.includes('/ap/signin')",
            timeout=30000,
        )
    except TimeoutError:
        if is_signin_page(page):
            raise RuntimeError(
                "Login did not complete. Check credentials, CAPTCHA, or 2FA challenge."
            )


def dismiss_popups(page) -> None:
    popup_selectors = [
        "button[aria-label*='閉じる']",
        "button[aria-label*='Close']",
        ".kp-notification .close",
    ]
    for sel in popup_selectors:
        try:
            if page.locator(sel).first.is_visible():
                page.locator(sel).first.click(timeout=1000)
        except Exception:
            continue


def wait_reader_ready(page) -> None:
    candidates = [
        "div#KindleReaderContainer",
        "div[id*='Kindle']",
        "#kr-renderer",
        "[id*='kr-renderer']",
        "canvas",
        "iframe[src*='kindle']",
        "iframe[src*='read.amazon']",
        "[data-testid='reader']",
    ]
    last_error: Optional[Exception] = None
    for sel in candidates:
        try:
            page.wait_for_selector(sel, timeout=15000)
            return
        except Exception as e:
            last_error = e
    if last_error:
        raise RuntimeError("Kindle reader did not become ready.") from last_error


def dump_debug_state(page, target_dir: Path, prefix: str) -> None:
    debug_dir = target_dir / "debug"
    debug_dir.mkdir(parents=True, exist_ok=True)
    safe_prefix = re.sub(r"[^A-Za-z0-9_.-]+", "_", prefix)

    (debug_dir / f"{safe_prefix}_url.txt").write_text(
        f"url: {page.url}\n"
        f"title: {page.title()}\n",
        encoding="utf-8",
    )
    (debug_dir / f"{safe_prefix}.html").write_text(page.content(), encoding="utf-8")
    page.screenshot(path=str(debug_dir / f"{safe_prefix}.png"), full_page=True)


def content_digest(page) -> str:
    png = page.screenshot(full_page=False)
    return hashlib.sha256(png).hexdigest()


def click_next_page(page) -> bool:
    selectors = [
        "button[aria-label*='左']",
        "button[aria-label*='Left']",
        "div[role='button'][aria-label*='左']",
        "div[role='button'][aria-label*='Left']",
        "[data-testid*='left']",
        ".leftArrow",
    ]

    for sel in selectors:
        try:
            loc = page.locator(sel).first
            if loc.is_visible():
                disabled = loc.get_attribute("disabled")
                aria_disabled = loc.get_attribute("aria-disabled")
                class_name = (loc.get_attribute("class") or "").lower()
                if (
                    disabled is not None
                    or aria_disabled == "true"
                    or "disabled" in class_name
                ):
                    return False
                loc.click(timeout=3000)
                return True
        except Exception:
            continue

    page.keyboard.press("ArrowLeft")
    return True


def capture_pages(page, output_dir: Path, pages: Optional[int]) -> int:
    output_dir.mkdir(parents=True, exist_ok=True)

    captured = 0
    previous_digest = None
    stable_count = 0

    idx = 1
    while True:
        if pages is not None and idx > pages:
            break

        # Wait 2 seconds after page transition/load before taking screenshot.
        page.wait_for_timeout(2000)
        shot_path = output_dir / f"{idx}.png"
        page.screenshot(path=str(shot_path), full_page=False)
        captured += 1

        now_digest = content_digest(page)
        moved = click_next_page(page)
        if not moved:
            break

        page.wait_for_timeout(1200)
        next_digest = content_digest(page)

        if previous_digest is not None and (
            next_digest == now_digest or next_digest == previous_digest
        ):
            stable_count += 1
        else:
            stable_count = 0

        previous_digest = now_digest

        if stable_count >= 2:
            break

        idx += 1

    return captured


def build_pdf(image_dir: Path, pdf_path: Path) -> None:
    from PIL import Image

    pngs = sorted(image_dir.glob("*.png"), key=lambda p: int(p.stem))
    if not pngs:
        raise RuntimeError("No screenshots found to build PDF.")

    images = [Image.open(p).convert("RGB") for p in pngs]
    first, rest = images[0], images[1:]
    first.save(pdf_path, save_all=True, append_images=rest)
    for img in images:
        img.close()


def launch_browser(playwright, args):
    if args.browser == "chrome":
        browser = playwright.chromium.launch(channel="chrome", headless=args.headless)
    else:
        browser = playwright.chromium.launch(headless=args.headless)
    context = browser.new_context(viewport={"width": 1600, "height": 1000})
    return browser, context


def run_ocr_m7(input_pdf: Path, output_pdf: Path) -> None:
    if not shutil.which("ocrmypdf"):
        raise RuntimeError(
            "ocrmypdf is not installed. Install with: brew install ocrmypdf"
        )

    cmd = [
        "ocrmypdf",
        "-l",
        "jpn_vert+jpn",
        "--mode",
        "force",
        "--pdf-renderer",
        "sandwich",
        "--tesseract-pagesegmode",
        "5",
        "--output-type",
        "pdf",
    ]
    cmd.extend([str(input_pdf), str(output_pdf)])

    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        err = (proc.stderr or proc.stdout or "").strip()
        if len(err) > 2000:
            err = err[-2000:]
        raise RuntimeError(f"OCR failed: {err}")


def main() -> int:
    args = parse_args()

    try:
        from playwright.sync_api import sync_playwright
    except ImportError as exc:
        raise RuntimeError(
            "playwright is not installed. Run: pip install playwright pillow python-dotenv "
            "and then: playwright install chromium"
        ) from exc

    target_dir = resolve_target_dir(args.directory)
    book_name = target_dir.name

    url = read_url_from_metadata(target_dir)
    amazon_id, amazon_pass = load_credentials()

    screenshots_dir = target_dir / "screenshots"
    image_pdf_path = target_dir / f"{book_name}_image.pdf"
    final_pdf_path = target_dir / f"{book_name}.pdf"

    with sync_playwright() as p:
        browser, context = launch_browser(p, args)
        try:
            page = context.new_page()
            page.goto(url, wait_until="domcontentloaded")

            login_if_required(page, amazon_id, amazon_pass)
            page.goto(url, wait_until="domcontentloaded")
            login_if_required(page, amazon_id, amazon_pass)
            if is_signin_page(page):
                dump_debug_state(page, target_dir, "login_failed")
                raise RuntimeError("Still on Amazon sign-in page after login attempt.")
            try:
                wait_reader_ready(page)
            except Exception:
                dump_debug_state(page, target_dir, "reader_not_ready")
                raise
            dismiss_popups(page)

            total = capture_pages(page, screenshots_dir, args.pages)
        finally:
            browser.close()

    build_pdf(screenshots_dir, image_pdf_path)
    print(f"Captured pages: {total}")
    print(f"Image PDF saved: {image_pdf_path}")
    if args.skip_ocr:
        shutil.copy2(image_pdf_path, final_pdf_path)
        print(f"Final PDF saved (image-only): {final_pdf_path}")
    else:
        run_ocr_m7(image_pdf_path, final_pdf_path)
        print(f"Final PDF saved (m7 OCR): {final_pdf_path}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
