# Kindle Web 自動スクリーンショット & PDF化 リファレンス

## 目的
`./data` 配下にある本ディレクトリを指定し、以下を自動実行する Python スクリプトの実装例。

1. 指定ディレクトリの `metadata.md` から Kindle URL を取得
2. ルート `.env` の `AMAZON_ID`, `AMAZON_PASS` で Amazon にログイン
3. Kindle Web 画面を開く
4. ページを順に移動しながらスクリーンショットを `{page}.png` で保存
5. 全ページ取得後、`{directory_name}.pdf` を生成

## 前提

- Python 3.10+
- Playwright (ブラウザ操作)
- Pillow (PNG→PDF変換)

```bash
pip install playwright pillow python-dotenv
playwright install chromium
```

## 実装コード

```python
#!/usr/bin/env python3
import argparse
import hashlib
import re
import sys
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from PIL import Image
from playwright.sync_api import BrowserContext, Page, TimeoutError, sync_playwright
import os


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
        "--headless",
        action="store_true",
        help="Run browser in headless mode.",
    )
    return parser.parse_args()


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
    load_dotenv()
    amazon_id = os.getenv("AMAZON_ID")
    amazon_pass = os.getenv("AMAZON_PASS")
    if not amazon_id or not amazon_pass:
        raise ValueError("AMAZON_ID / AMAZON_PASS are required in .env")
    return amazon_id, amazon_pass


def login_if_required(page: Page, amazon_id: str, amazon_pass: str) -> None:
    # ログイン画面に遷移していれば入力し、すでにログイン済みならスキップする。
    try:
        page.wait_for_selector("#ap_email", timeout=5000)
    except TimeoutError:
        return

    page.fill("#ap_email", amazon_id)
    page.click("#continue")
    page.wait_for_selector("#ap_password", timeout=10000)
    page.fill("#ap_password", amazon_pass)
    page.click("#signInSubmit")

    try:
        page.wait_for_load_state("networkidle", timeout=30000)
    except TimeoutError:
        pass


def dismiss_popups(page: Page) -> None:
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


def wait_reader_ready(page: Page) -> None:
    candidates = [
        "div#KindleReaderContainer",
        "div[id*='Kindle']",
        "canvas",
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


def content_digest(page: Page) -> str:
    png = page.screenshot(full_page=False)
    return hashlib.sha256(png).hexdigest()


def click_next_page(page: Page) -> bool:
    # 要件に合わせて「左矢印」を優先して探す（見つからなければ左キー）。
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
                if disabled is not None or aria_disabled == "true" or "disabled" in class_name:
                    return False
                loc.click(timeout=3000)
                return True
        except Exception:
            continue

    page.keyboard.press("ArrowLeft")
    return True


def capture_pages(page: Page, output_dir: Path, pages: Optional[int]) -> int:
    output_dir.mkdir(parents=True, exist_ok=True)

    captured = 0
    previous_digest = None
    stable_count = 0

    idx = 1
    while True:
        if pages is not None and idx > pages:
            break

        page.wait_for_timeout(800)
        shot_path = output_dir / f"{idx}.png"
        page.screenshot(path=str(shot_path), full_page=False)
        captured += 1

        now_digest = content_digest(page)
        moved = click_next_page(page)
        if not moved:
            break

        page.wait_for_timeout(1200)
        next_digest = content_digest(page)

        if previous_digest is not None and (next_digest == now_digest or next_digest == previous_digest):
            stable_count += 1
        else:
            stable_count = 0

        previous_digest = now_digest

        # 同一画面が続く場合は末尾に到達した可能性が高い。
        if stable_count >= 2:
            break

        idx += 1

    return captured


def build_pdf(image_dir: Path, pdf_path: Path) -> None:
    pngs = sorted(image_dir.glob("*.png"), key=lambda p: int(p.stem))
    if not pngs:
        raise RuntimeError("No screenshots found to build PDF.")

    images = [Image.open(p).convert("RGB") for p in pngs]
    first, rest = images[0], images[1:]
    first.save(pdf_path, save_all=True, append_images=rest)
    for img in images:
        img.close()


def main() -> int:
    args = parse_args()
    target_dir = resolve_target_dir(args.directory)
    book_name = target_dir.name

    url = read_url_from_metadata(target_dir)
    amazon_id, amazon_pass = load_credentials()

    screenshots_dir = target_dir / "screenshots"
    pdf_path = target_dir / f"{book_name}.pdf"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=args.headless)
        context: BrowserContext = browser.new_context(
            viewport={"width": 1600, "height": 1000}
        )
        page = context.new_page()
        page.goto(url, wait_until="domcontentloaded")

        login_if_required(page, amazon_id, amazon_pass)
        page.goto(url, wait_until="domcontentloaded")
        wait_reader_ready(page)
        dismiss_popups(page)

        total = capture_pages(page, screenshots_dir, args.pages)
        browser.close()

    build_pdf(screenshots_dir, pdf_path)
    print(f"Captured pages: {total}")
    print(f"PDF saved: {pdf_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

## 実行例

```bash
python kindle_capture.py --directory "001_参政党の研究"
```

または:

```bash
python kindle_capture.py --directory "data/001_参政党の研究"
```

ページ数を指定する場合:

```bash
python kindle_capture.py --directory "001_参政党の研究" --pages 30
```

## 注意点

- Amazon の追加認証（画像認証・2段階認証）が出る場合は自動化が止まるため、手動対応が必要。
- Kindle Web の UI 変更で矢印ボタンのセレクタが変わることがある。その場合は `click_next_page()` のセレクタを調整する。
- 保存先は `data/<directory>/screenshots/*.png` と `data/<directory>/<directory_name>.pdf`。
