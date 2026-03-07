"""Inspect the DOM structure of wikigacha.com to find selectors."""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("https://wikigacha.com/?lang=JP", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(5000)

    # Find clickable elements and buttons
    buttons = page.query_selector_all("button")
    print("=== BUTTONS ===")
    for btn in buttons:
        text = btn.inner_text().strip()[:80]
        classes = btn.get_attribute("class") or ""
        id_attr = btn.get_attribute("id") or ""
        print(f"  text='{text}' class='{classes}' id='{id_attr}'")

    print("\n=== LINKS ===")
    links = page.query_selector_all("a")
    for link in links:
        text = link.inner_text().strip()[:50]
        href = link.get_attribute("href") or ""
        print(f"  text='{text}' href='{href}'")

    print("\n=== IMAGES ===")
    imgs = page.query_selector_all("img")
    for img in imgs:
        src = img.get_attribute("src") or ""
        alt = img.get_attribute("alt") or ""
        print(f"  src='{src[:80]}' alt='{alt}'")

    print("\n=== KEY TEXT ELEMENTS ===")
    for text in ["ガチャ", "パック", "タップ", "広告", "開ける"]:
        els = page.query_selector_all(f"text={text}")
        for el in els:
            tag = el.evaluate("el => el.tagName")
            classes = el.get_attribute("class") or ""
            inner = el.inner_text().strip()[:80]
            print(f"  [{text}] <{tag}> class='{classes}' '{inner}'")

    print("\n=== CANVAS ===")
    canvases = page.query_selector_all("canvas")
    print(f"  Found {len(canvases)} canvas elements")

    print("\n=== MAIN STRUCTURE (first 3 levels) ===")
    structure = page.evaluate("""() => {
        function describe(el, depth) {
            if (depth > 3) return null;
            const children = [];
            for (const child of el.children) {
                const desc = describe(child, depth + 1);
                if (desc) children.push(desc);
            }
            return {
                tag: el.tagName,
                id: el.id || undefined,
                class: el.className ? el.className.substring(0, 100) : undefined,
                text: el.children.length === 0 ? el.textContent?.substring(0, 50) : undefined,
                children: children.length > 0 ? children : undefined
            };
        }
        return describe(document.getElementById('__next') || document.body, 0);
    }""")
    import json
    print(json.dumps(structure, indent=2, ensure_ascii=False))

    browser.close()
