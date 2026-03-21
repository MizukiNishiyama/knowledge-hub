#!/usr/bin/env python3
"""
jaahas/qwen3.5-uncensored:2b ストリーミング安定性テスト

Tests:
  1. thinking vs content フィールドの分布（UIの表示バグを検出）
  2. チャンク分割 (partial JSON) の頻度
  3. think=false オプションの効果
  4. 会話履歴送信時の挙動（コンテキスト累積）
  5. renderMarkdown 的な文字列処理でトークンが壊れないか
"""
import json
import time
import urllib.request
import urllib.error
import sys

MODEL = "jaahas/qwen3.5-uncensored:2b"
OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_TAGS = "http://localhost:11434/api/tags"
SEP = "─" * 64

def ollama_stream(prompt, system=None, history=None, think=True, temperature=0.7):
    """Ollama /api/chat をストリームで呼び出し、全チャンクを返す"""
    msgs = []
    if system:
        msgs.append({"role": "system", "content": system})
    if history:
        msgs.extend(history)
    msgs.append({"role": "user", "content": prompt})

    payload = {
        "model": MODEL,
        "messages": msgs,
        "stream": True,
        "options": {"temperature": temperature},
    }
    if not think:
        payload["think"] = False  # Qwen3.5 thinking mode OFF

    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        OLLAMA_URL, data=data,
        headers={"Content-Type": "application/json"}
    )

    chunks = []
    partial_buffer = ""
    split_events = 0

    with urllib.request.urlopen(req, timeout=120) as resp:
        raw_buf = b""
        while True:
            raw = resp.read(512)
            if not raw:
                break
            raw_buf += raw
            while b"\n" in raw_buf:
                line_bytes, raw_buf = raw_buf.split(b"\n", 1)
                line = line_bytes.decode("utf-8", errors="replace").strip()
                if not line:
                    continue
                # Handle partial JSON across reads
                if partial_buffer:
                    line = partial_buffer + line
                    partial_buffer = ""
                    split_events += 1
                try:
                    obj = json.loads(line)
                    chunks.append(obj)
                except json.JSONDecodeError:
                    partial_buffer = line  # incomplete – accumulate

        # flush remaining
        if raw_buf:
            line = raw_buf.decode("utf-8", errors="replace").strip()
            if partial_buffer:
                line = partial_buffer + line
            if line:
                try:
                    chunks.append(json.loads(line))
                except json.JSONDecodeError:
                    pass

    return chunks, split_events


def analyze(chunks, split_events, label, elapsed):
    thinking_chunks = [c for c in chunks if c.get("message", {}).get("thinking")]
    content_chunks  = [c for c in chunks if c.get("message", {}).get("content")]
    done_chunk      = next((c for c in chunks if c.get("done")), None)

    full_thinking = "".join(c["message"]["thinking"] for c in thinking_chunks)
    full_content  = "".join(c["message"]["content"]  for c in content_chunks)

    total = len(thinking_chunks) + len(content_chunks)

    print(f"\n{'='*64}")
    print(f"  {label}")
    print(f"{'='*64}")
    print(f"  ⏱  経過時間        : {elapsed:.2f}s")
    print(f"  🧠 thinking chunks : {len(thinking_chunks):4d}  ({100*len(thinking_chunks)//max(total,1):3d}%)")
    print(f"  💬 content chunks  : {len(content_chunks):4d}  ({100*len(content_chunks)//max(total,1):3d}%)")
    print(f"  🔀 chunk split発生 : {split_events:4d}  ← JSON が TCP 境界で分断された回数")
    print(f"  ⚡ 速度 (chunk/s)  : {total/elapsed:.1f}")
    if done_chunk:
        d = done_chunk
        pt = d.get("prompt_eval_count", "?")
        et = d.get("eval_count", "?")
        ed = d.get("eval_duration", 0) / 1e9
        print(f"  📊 prompt tokens   : {pt}")
        print(f"  📊 eval tokens     : {et}")
        print(f"  📊 eval time       : {ed:.2f}s")
        if isinstance(et, int) and ed > 0:
            print(f"  📊 実測 tok/s      : {et/ed:.1f}")
    print()
    # Show thinking preview
    if full_thinking:
        preview = full_thinking[:300].replace("\n", "↵")
        print(f"  🧠 Thinking (先頭300文字):")
        print(f"     {preview}")
    else:
        print(f"  🧠 Thinking: なし")
    print()
    print(f"  💬 Content:")
    for line in full_content.split("\n"):
        print(f"     {line}")

    return {
        "thinking_chunks": len(thinking_chunks),
        "content_chunks": len(content_chunks),
        "split_events": split_events,
        "full_content": full_content,
        "elapsed": elapsed,
    }


def test_thinking_distribution():
    """Test 1: thinking vs content の比率を確認"""
    print(f"\n{SEP}")
    print("Test 1: thinking vs content フィールドの分布")
    print("  UIは content フィールドのみ表示 → thinking 中は画面が止まって見える")
    print(SEP)

    prompt = "1から5まで数えてください。"
    t0 = time.time()
    chunks, splits = ollama_stream(prompt, think=True)
    elapsed = time.time() - t0
    result = analyze(chunks, splits, "think=True (デフォルト)", elapsed)

    thinking_pct = 100 * result["thinking_chunks"] // max(
        result["thinking_chunks"] + result["content_chunks"], 1)

    print()
    if thinking_pct > 50:
        print(f"  ⚠️  診断: thinking が全体の {thinking_pct}% を占める")
        print(f"     → UI が content='' のチャンクを受け取り続けるため、")
        print(f"        ユーザーには {thinking_pct/100 * result['elapsed']:.1f}s 間「フリーズ」に見える")
    else:
        print(f"  ✅ thinking 比率は {thinking_pct}%（問題なし）")

    return result


def test_think_false():
    """Test 2: think=false で thinking を無効化した場合の比較"""
    print(f"\n{SEP}")
    print("Test 2: think=false での比較")
    print("  Qwen3.5 系は /api/chat の think:false で推論トークンを抑制できる")
    print(SEP)

    prompt = "1から5まで数えてください。"
    t0 = time.time()
    chunks, splits = ollama_stream(prompt, think=False)
    elapsed = time.time() - t0
    return analyze(chunks, splits, "think=False", elapsed)


def test_chunk_splitting():
    """Test 3: チャンク分割 (partial JSON) の検出"""
    print(f"\n{SEP}")
    print("Test 3: TCP チャンク分割 / partial JSON の検出")
    print("  分割が発生すると、UIの split('\n').filter(Boolean) が JSON を欠損させる")
    print(SEP)

    prompt = "Pythonでバブルソートのコードを書いてください。コードのみ出力してください。"
    t0 = time.time()
    chunks, splits = ollama_stream(prompt, think=False)
    elapsed = time.time() - t0
    result = analyze(chunks, splits, "長めのレスポンス (think=False)", elapsed)

    print()
    if result["split_events"] > 0:
        print(f"  ⚠️  診断: {result['split_events']} 回のチャンク分割を検出")
        print(f"     → UIの単純な split('\\n') では一部トークンがサイレントドロップされる可能性")
    else:
        print(f"  ✅ チャンク分割なし（このプロンプトでは問題なし）")

    return result


def test_context_accumulation():
    """Test 4: 会話履歴の累積によるコンテキスト肥大化"""
    print(f"\n{SEP}")
    print("Test 4: 会話履歴累積（UIは全ターンを毎回送信する実装）")
    print("  会話が長くなると prompt_eval_count が増加し応答が遅くなる")
    print(SEP)

    history = []
    for i, q in enumerate([
        "こんにちは。",
        "今日の天気は？",
        "AIについて一言で教えて。",
    ], 1):
        t0 = time.time()
        chunks, splits = ollama_stream(q, history=history, think=False)
        elapsed = time.time() - t0
        full_content = "".join(
            c["message"]["content"] for c in chunks if c.get("message", {}).get("content")
        )
        done = next((c for c in chunks if c.get("done")), {})
        pt = done.get("prompt_eval_count", "?")
        et = done.get("eval_count", "?")
        print(f"  ターン{i}: prompt={pt} tok  eval={et} tok  {elapsed:.2f}s  → {full_content[:60]!r}")
        history.append({"role": "user", "content": q})
        history.append({"role": "assistant", "content": full_content})


def test_markdown_token_integrity():
    """Test 5: renderMarkdown が Markdown 途中で呼ばれたときに壊れる文字列がないか"""
    print(f"\n{SEP}")
    print("Test 5: ストリーミング中の Markdown 部分文字列の健全性")
    print("  UIは毎チャンクで renderMarkdown(fullResponse) を呼ぶ")
    print("  Markdown の開き記号 (```, **) が未完了の状態でパースすると視覚的ノイズが出る")
    print(SEP)

    prompt = "Pythonのリスト内包表記を`code`と**強調**を混ぜて3行で説明して。"
    t0 = time.time()
    chunks, splits = ollama_stream(prompt, think=False)
    elapsed = time.time() - t0

    content_pieces = [c["message"]["content"] for c in chunks if c.get("message", {}).get("content")]
    accumulated = ""
    incomplete_at = []
    for i, piece in enumerate(content_pieces):
        accumulated += piece
        # Check for unclosed markdown markers
        backtick_pairs = accumulated.count("```")
        bold_pairs = accumulated.count("**")
        if backtick_pairs % 2 != 0 or bold_pairs % 2 != 0:
            incomplete_at.append(i)

    print(f"  総チャンク数: {len(content_pieces)}")
    print(f"  Markdown 未完了状態で renderMarkdown が呼ばれた回数: {len(incomplete_at)}")
    if incomplete_at:
        print(f"  ⚠️  これにより毎チャンクで HTML 構造が変動 → チラツキ・レイアウトシフトが発生")
        pct = 100 * len(incomplete_at) // max(len(content_pieces), 1)
        print(f"     全体の {pct}% のチャンクで不完全な Markdown 状態")
    else:
        print(f"  ✅ このレスポンスでは Markdown の未完了状態なし")
    analyze(chunks, splits, "Markdown integrity test", elapsed)


if __name__ == "__main__":
    # Check Ollama is running
    try:
        with urllib.request.urlopen(OLLAMA_TAGS, timeout=3) as r:
            data = json.loads(r.read())
        models = [m["name"] for m in data.get("models", [])]
        if MODEL not in models:
            print(f"✗ {MODEL} が見つかりません。ollama pull {MODEL} を実行してください。")
            sys.exit(1)
        print(f"✅ Ollama 接続OK  |  {MODEL} を確認")
    except Exception as e:
        print(f"✗ Ollama に接続できません: {e}")
        sys.exit(1)

    print()
    print("=" * 64)
    print("  jaahas/qwen3.5-uncensored:2b  ストリーミング安定性テスト")
    print("=" * 64)

    r1 = test_thinking_distribution()
    r2 = test_think_false()
    r3 = test_chunk_splitting()
    test_context_accumulation()
    test_markdown_token_integrity()

    # サマリー
    print(f"\n{'='*64}")
    print("  テスト結果サマリー（UI改修ポイント）")
    print(f"{'='*64}")

    total1 = r1["thinking_chunks"] + r1["content_chunks"]
    total2 = r2["content_chunks"]
    pct_thinking = 100 * r1["thinking_chunks"] // max(total1, 1)

    issues = []
    if pct_thinking > 30:
        issues.append(f"[BUG-1] thinking フィールド未表示: 全体の {pct_thinking}% が非表示（UI が止まって見える）")
    if r1["split_events"] > 0 or r3["split_events"] > 0:
        issues.append(f"[BUG-2] partial JSON: チャンク分割時にトークンがサイレントドロップされる")
    if r1["elapsed"] > r2["elapsed"] * 1.5:
        issues.append(f"[OPT-1] think=false で {r1['elapsed']:.1f}s → {r2['elapsed']:.1f}s に高速化可能")
    issues.append("[BUG-3] obj.done の break が for ループのみ脱出（while は継続）→ 冗長なリード")
    issues.append("[OPT-2] 毎トークンで innerHTML = renderMarkdown() → 不完全 Markdown による視覚ノイズ")

    for i, issue in enumerate(issues, 1):
        print(f"  {i}. {issue}")

    print()
    print("  推奨修正:")
    print("  1. thinking フィールドを折りたたみ表示（▶ 思考中...）として UI に追加")
    print("  2. TextDecoder を stateful に使い partial chunk を正しくバッファリング")
    print("  3. think オプションをトグルで UI に追加")
    print("  4. obj.done で while ループも break するフラグを追加")
    print("  5. Markdown レンダリングをデバウンス（16ms = 60fps 相当）")
    print()
