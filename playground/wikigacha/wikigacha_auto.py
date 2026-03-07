"""
WikiGacha自動ガチャ回しスクリプト

Playwrightでブラウザを開き、ページ操作を自動化する。
Cloudflare認証は人間が手動で通す。

使い方:
  1. python3 wikigacha_auto.py を実行
  2. ブラウザが開いて wikigacha.com にアクセスする
  3. Cloudflare認証が表示されたら手動でチェックを通す
  4. メインページが表示されたら自動でガチャが始まる
  5. Ctrl+C で停止
"""
import re
import signal
import sys

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(line_buffering=True)

running = True


def signal_handler(sig, frame):
    global running
    print("\n停止シグナルを受信。終了します...")
    running = False


signal.signal(signal.SIGINT, signal_handler)

URL = "https://wikigacha.com/?lang=JP"


def get_body_text(page):
    """ページのbodyテキストを取得"""
    try:
        return page.evaluate("document.body.innerText || ''")
    except Exception:
        return ""


def click_by_text(page, text, exact=False):
    """テキストを含む要素をクリック"""
    try:
        locator = page.get_by_text(text, exact=exact)
        if locator.count() > 0:
            locator.first.click()
            return True
        return False
    except Exception:
        return False


def click_center(page):
    """ページ中央（パック画像）をクリック"""
    try:
        vw = page.evaluate("window.innerWidth")
        vh = page.evaluate("window.innerHeight")
        page.mouse.click(vw // 2, int(vh * 0.45))
    except Exception:
        pass


def run():
    global running
    draw_count = 0

    print("=" * 50)
    print("WikiGacha 自動ガチャスクリプト (Playwright)")
    print("=" * 50)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, channel="chrome")
        page = browser.new_page()

        print(f"\nブラウザで {URL} を開きます...")
        page.goto(URL, wait_until="domcontentloaded", timeout=60000)

        # Cloudflare通過待機
        print("\n" + "-" * 50)
        print("[待機] Cloudflare認証が表示されたらブラウザ上で")
        print("       手動でチェックボックスをクリックしてください。")
        print("       通過後、自動でガチャを開始します。")
        print("-" * 50 + "\n")

        passed = False
        for i in range(600):
            if not running:
                break
            page.wait_for_timeout(1000)
            body_text = get_body_text(page)
            if "ガチャ" in body_text or "タップで開ける" in body_text:
                print(">>> Cloudflare通過！ メインページを検出")
                passed = True
                break
            if i > 0 and i % 15 == 0:
                snippet = body_text[:60].replace("\n", " ")
                print(f"  ... {i}秒経過 | {snippet}")

        if not passed:
            print("タイムアウトまたは中断")
            browser.close()
            return

        page.wait_for_timeout(3000)

        # 自動化ループ
        print("\n" + "=" * 50)
        print("自動ガチャ開始！ (Ctrl+C で停止)")
        print("=" * 50 + "\n")

        while running:
            try:
                page.wait_for_timeout(1000)
                body_text = get_body_text(page)

                if not body_text:
                    page.wait_for_timeout(2000)
                    continue

                # --- パック切れ → 広告を見て回復 ---
                if "パック切れ" in body_text:
                    print(f"\n[パック切れ] 広告を見て回復...")
                    page.wait_for_timeout(1000)
                    result = click_by_text(page, "広告を見て回復")
                    print(f"  クリック: {'成功' if result else '失敗'}")
                    page.wait_for_timeout(3000)

                    # 広告カウントダウン待機
                    print("  広告カウントダウン待機...")
                    for _ in range(90):
                        if not running:
                            break
                        page.wait_for_timeout(1000)
                        ct = get_body_text(page)

                        if "閉じるまで" in ct:
                            m = re.search(r'閉じるまで\s*(\d+)\s*秒', ct)
                            if m:
                                print(f"  閉じるまで {m.group(1)} 秒...   ", end="\r")
                        elif "スポンサー広告" in ct and "閉じるまで" not in ct:
                            print("\n  広告終了 → 閉じる")
                            click_by_text(page, "閉じる", exact=True)
                            page.wait_for_timeout(2000)
                            break
                        elif "パック切れ" not in ct and "スポンサー" not in ct:
                            print("\n  メインページに復帰")
                            break
                    page.wait_for_timeout(2000)

                # --- スポンサー広告表示中 ---
                elif "スポンサー広告" in body_text:
                    if "閉じるまで" in body_text:
                        m = re.search(r'閉じるまで\s*(\d+)\s*秒', body_text)
                        if m:
                            w = int(m.group(1))
                            print(f"  広告: 閉じるまで {w} 秒...")
                            page.wait_for_timeout((w + 1) * 1000)
                    click_by_text(page, "閉じる", exact=True)
                    print("  広告を閉じました")
                    page.wait_for_timeout(2000)

                # --- カード結果画面 → パック画面に戻る ---
                elif "パック画面に戻る" in body_text:
                    draw_count += 1
                    print(f"[{draw_count}回目] カード結果 → パック画面に戻る")
                    click_by_text(page, "パック画面に戻る")
                    page.wait_for_timeout(2000)

                # --- パック画面（タップで開ける） ---
                elif "タップで開ける" in body_text or "本日のパック" in body_text:
                    print("  パック → タップで開封")
                    click_center(page)
                    page.wait_for_timeout(3000)

                # --- メイン画面 ---
                elif "ガチャ" in body_text:
                    print("  メイン → パックをクリック")
                    click_center(page)
                    page.wait_for_timeout(3000)

                else:
                    print(f"  不明な状態。3秒待機...")
                    page.wait_for_timeout(3000)

            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f"\nエラー: {e}")
                page.wait_for_timeout(3000)

        print(f"\n=== 終了 === 合計ガチャ回数: {draw_count}")
        browser.close()


if __name__ == "__main__":
    run()
