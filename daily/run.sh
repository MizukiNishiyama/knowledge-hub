#!/bin/bash
# Daily AI Briefing - ローカル自動実行スクリプト
# launchd から毎日実行される

set -euo pipefail

REPO_DIR="/Users/nishiyamasuisei/business/outarc/knowledge-hub"
DATE=$(date +%Y_%m_%d)
DATE_DISPLAY=$(date +%Y-%m-%d)
OUT_DIR="$REPO_DIR/daily/$DATE"
LOG_FILE="$REPO_DIR/daily/run.log"

# ログ開始
echo "[$DATE_DISPLAY $(date +%H:%M)] Daily Briefing 開始" >> "$LOG_FILE"

# 既に生成済みならスキップ
if [ -f "$OUT_DIR/summary.md" ]; then
  echo "[$DATE_DISPLAY] $DATE は生成済み。スキップ" >> "$LOG_FILE"
  exit 0
fi

mkdir -p "$OUT_DIR"
cd "$REPO_DIR"

# 最新をpull
git pull origin main --rebase 2>/dev/null || true

# Claude Code で生成（OAuth認証を使用、APIキー不要）
claude -p "$(cat <<PROMPT
あなたは Daily AI Briefing を生成するリサーチャーです。

## 指示
1. daily/reference.md を読み、セクション構成・フォーマット・品質基準を把握せよ
2. 各セクションについて Web検索 を実行し、直近24時間の最新情報を収集せよ
3. GitHub Trending は https://github.com/trending?since=daily を WebFetch で取得せよ
4. 収集した情報を reference.md のフォーマットに従い daily/${DATE}/summary.md に書き出せ
5. summary.md を reference.md 記載の Python スクリプトで daily/${DATE}/summary.pdf に変換せよ

## 重要ルール
- 日付は ${DATE_DISPLAY} を使用
- 情報がないセクションは「特記事項なし」と記載（無理に埋めない）
- すべての情報にソースURLを付記
- 噂・リークは「未確認」と明記
PROMPT
)" \
  --model sonnet \
  --max-turns 30 \
  --allowedTools "WebSearch,WebFetch,Read,Write,Edit,Bash,Glob,Grep"

# 成果物チェック
if [ -f "$OUT_DIR/summary.md" ]; then
  echo "[$DATE_DISPLAY $(date +%H:%M)] summary.md 生成完了 ($(wc -l < "$OUT_DIR/summary.md") 行)" >> "$LOG_FILE"

  # git commit & push
  cd "$REPO_DIR"
  git add "daily/$DATE/"
  git commit -m "ドキュメント: Daily AI Briefing ${DATE_DISPLAY} を自動生成" || true
  git push origin main || true

  echo "[$DATE_DISPLAY $(date +%H:%M)] commit & push 完了" >> "$LOG_FILE"
else
  echo "[$DATE_DISPLAY $(date +%H:%M)] ERROR: summary.md 未生成" >> "$LOG_FILE"
  exit 1
fi
