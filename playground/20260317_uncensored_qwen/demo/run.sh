#!/bin/bash
# ============================================================
#  Uncensored Qwen Local Chat — 起動スクリプト
#  Usage: ./run.sh [port] [model]
#    port  : HTTPサーバーのポート (デフォルト: 8080)
#    model : 使用するモデル名 (デフォルト: jaahas/qwen3.5-uncensored:2b)
# ============================================================

PORT="${1:-8080}"
MODEL="${2:-jaahas/qwen3.5-uncensored:2b}"
DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║       Uncensored Qwen Local Chat — Launcher          ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ── 1. Ollama 起動確認 ─────────────────────────────────────
echo "▶ [1/3] Ollama を確認中..."
if ! command -v ollama &>/dev/null; then
  echo "  ✗ ollama コマンドが見つかりません。"
  echo "    https://ollama.com からインストールしてください。"
  exit 1
fi

if ! curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo "  Ollama が起動していません。起動します..."
  ollama serve &>/dev/null &
  sleep 2
fi
echo "  ✓ Ollama 起動済み (localhost:11434)"

# ── 2. モデル確認・Pull ───────────────────────────────────
echo ""
echo "▶ [2/3] モデル確認: $MODEL"

if ollama list 2>/dev/null | grep -q "^${MODEL%:*}"; then
  echo "  ✓ モデル取得済み"
else
  echo "  モデルが見つかりません。ダウンロードします..."
  echo "  (数分かかる場合があります)"
  echo ""
  ollama pull "$MODEL"
  if [ $? -ne 0 ]; then
    echo ""
    echo "  ✗ Pull に失敗しました。手動で試してください:"
    echo "    ollama pull $MODEL"
    echo ""
    echo "  利用可能な代替モデル:"
    ollama list 2>/dev/null | tail -n +2 | awk '{print "    -", $1}'
    echo ""
    echo "  続行しますか？ [y/N]"
    read -r ans
    [[ "$ans" != "y" && "$ans" != "Y" ]] && exit 1
  fi
fi

# ── 3. HTTPサーバー起動 ───────────────────────────────────
echo ""
echo "▶ [3/3] HTTP サーバーを起動 (ポート $PORT)..."
echo ""
echo "  ┌─────────────────────────────────────────────┐"
echo "  │  ブラウザで開く:  http://localhost:$PORT      │"
echo "  │  停止: Ctrl+C                                │"
echo "  └─────────────────────────────────────────────┘"
echo ""

# ブラウザを自動で開く（macOS）
sleep 0.5
if command -v open &>/dev/null; then
  open "http://localhost:$PORT" &
fi

cd "$DIR"
python3 -m http.server "$PORT" --bind 127.0.0.1
