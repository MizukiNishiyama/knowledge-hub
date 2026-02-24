#!/bin/bash
set -euo pipefail

# ============================================================
# research.sh — reference.md に従って Codex でリサーチを実行
#
# Usage:
#   ./scripts/research.sh <ディレクトリ名>
#   ./scripts/research.sh 000_AI人流分析
#   ./scripts/research.sh 000_AI人流分析 --step questions
#
# Options:
#   --step <step>  特定のステップのみ実行
#                  questions | research | analysis | summary | all (default: all)
# ============================================================

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IDEAS_DIR="${REPO_ROOT}/ideas/data"
REFERENCE="${REPO_ROOT}/ideas/reference.md"

# --- 引数パース ---
DIR_NAME=""
STEP="all"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --step)
      STEP="$2"
      shift 2
      ;;
    *)
      DIR_NAME="$1"
      shift
      ;;
  esac
done

if [[ -z "$DIR_NAME" ]]; then
  echo "Usage: $0 <ディレクトリ名> [--step questions|research|analysis|summary|all]"
  echo ""
  echo "利用可能なディレクトリ:"
  ls -1 "$IDEAS_DIR" 2>/dev/null | sed 's/^/  /'
  exit 1
fi

TARGET_DIR="${IDEAS_DIR}/${DIR_NAME}"
MEMO="${TARGET_DIR}/memo.md"

# --- バリデーション ---
if [[ ! -d "$TARGET_DIR" ]]; then
  echo "Error: ディレクトリが見つかりません: ${TARGET_DIR}"
  echo ""
  echo "利用可能なディレクトリ:"
  ls -1 "$IDEAS_DIR" 2>/dev/null | sed 's/^/  /'
  exit 1
fi

if [[ ! -f "$MEMO" ]]; then
  echo "Error: memo.md が見つかりません: ${MEMO}"
  echo "memo.md を作成してから再実行してください。"
  exit 1
fi

if [[ ! -f "$REFERENCE" ]]; then
  echo "Error: reference.md が見つかりません: ${REFERENCE}"
  exit 1
fi

# --- ステップ定義 ---
run_step() {
  local step_name="$1"
  local output_file="$2"
  local prompt="$3"

  echo "========================================"
  echo "  Step: ${step_name}"
  echo "  Output: ${output_file}"
  echo "========================================"

  codex exec \
    --full-auto \
    --search \
    -C "$REPO_ROOT" \
    "$prompt"

  if [[ -f "$output_file" ]]; then
    echo "  -> 生成完了: ${output_file}"
  else
    echo "  -> Warning: ファイルが生成されませんでした"
  fi
  echo ""
}

TODAY=$(date +%Y-%m-%d)

# --- questions.md ---
run_questions() {
  run_step "questions.md（事業明確化のための問い）" \
    "${TARGET_DIR}/questions.md" \
    "$(cat <<PROMPT
あなたは事業アイディアを深掘りするリサーチャーです。

以下のリファレンスに厳密に従って作業してください:
- リファレンス: ideas/reference.md
- 対象ディレクトリ: ideas/data/${DIR_NAME}/

## タスク
1. ideas/reference.md を読み、questions.md の仕様を確認する
2. ideas/data/${DIR_NAME}/memo.md を読む
3. 仕様に従って ideas/data/${DIR_NAME}/questions.md を生成する

generated_at は ${TODAY} とすること。
既存の questions.md がある場合は、内容を改善して上書きすること。
PROMPT
)"
}

# --- research.md ---
run_research() {
  run_step "research.md（競合・市場調査）" \
    "${TARGET_DIR}/research.md" \
    "$(cat <<PROMPT
あなたは事業アイディアを深掘りするリサーチャーです。

以下のリファレンスに厳密に従って作業してください:
- リファレンス: ideas/reference.md
- 対象ディレクトリ: ideas/data/${DIR_NAME}/

## タスク
1. ideas/reference.md を読み、research.md の仕様を確認する
2. ideas/data/${DIR_NAME}/memo.md を読む
3. Web検索を活用して競合・市場調査を行う
4. 競合は最低5社調査する
5. 市場規模(TAM/SAM/SOM)の推定も含める
6. 仕様に従って ideas/data/${DIR_NAME}/research.md を生成する

generated_at は ${TODAY} とすること。
既存の research.md がある場合は、内容を改善して上書きすること。
PROMPT
)"
}

# --- analysis.md ---
run_analysis() {
  run_step "analysis.md（VC視点の勝ち筋分析）" \
    "${TARGET_DIR}/analysis.md" \
    "$(cat <<PROMPT
あなたはプロのVCアナリストです。忖度せず、投資判断に耐える厳しさで評価してください。

以下のリファレンスに厳密に従って作業してください:
- リファレンス: ideas/reference.md
- 対象ディレクトリ: ideas/data/${DIR_NAME}/

## タスク
1. ideas/reference.md を読み、analysis.md の仕様を確認する
2. ideas/data/${DIR_NAME}/ 配下の全ファイル（memo.md, questions.md, research.md, summary.md 等）を読む
3. 仕様に従って ideas/data/${DIR_NAME}/analysis.md を生成する

注意:
- 忖度しない。厳しい評価こそ価値がある
- 「やめたほうがいい」も立派な結論
- 勝ち筋の候補は「なぜ今・なぜ自分たちがやるべきか」を必ず含める
- generated_at は ${TODAY} とすること
- 既存の analysis.md がある場合は、内容を改善して上書きすること
PROMPT
)"
}

# --- summary.md ---
run_summary() {
  run_step "summary.md（サマリー・ネクストアクション）" \
    "${TARGET_DIR}/summary.md" \
    "$(cat <<PROMPT
あなたは事業アイディアを整理するアナリストです。

以下のリファレンスに厳密に従って作業してください:
- リファレンス: ideas/reference.md
- 対象ディレクトリ: ideas/data/${DIR_NAME}/

## タスク
1. ideas/reference.md を読み、summary.md の仕様を確認する
2. ideas/data/${DIR_NAME}/ 配下の全ファイルを読む
3. 仕様に従って ideas/data/${DIR_NAME}/summary.md を生成する

updated_at は ${TODAY} とすること。
既存の summary.md がある場合は、内容を改善して上書きすること。
PROMPT
)"
}

# --- 実行 ---
echo ""
echo "=== Codex Research: ${DIR_NAME} ==="
echo "=== Step: ${STEP} ==="
echo ""

case "$STEP" in
  questions)
    run_questions
    ;;
  research)
    run_research
    ;;
  analysis)
    run_analysis
    ;;
  summary)
    run_summary
    ;;
  all)
    run_questions
    run_research
    run_analysis
    run_summary
    ;;
  *)
    echo "Error: 不明なステップ: ${STEP}"
    echo "有効な値: questions | research | analysis | summary | all"
    exit 1
    ;;
esac

echo "=== 完了 ==="
