# Career リファレンス

## 概要

`career/` ディレクトリは、西山瑞生のキャリアについて深く考えるための作業空間。
思考のメモから論点整理・リサーチ・サマリー生成までを一気通貫で行い、常に最新のキャリアプランを維持する。

---

## ディレクトリ構造

```
career/
├── reference.md              # 本ファイル。仕様・運用ルールを定義
├── {YYYYMMDD}_latest_plan.md # 常に最新のキャリアプラン（1ファイルのみ存在）
├── archive/                  # 過去の latest_plan のアーカイブ
│   └── {YYYYMMDD}_latest_plan.md
└── thoughts/                 # 各問い・論点を格納するディレクトリ
    └── {YYYYMMDD}_{問いの超簡潔な要約}/
        ├── note.md           # ユーザーが書いたメモ（原文）
        ├── summary.md        # リサーチ・論点整理の成果物
        └── summary.pdf       # summary.md のPDF版
```

---

## トリガー：/career コマンド

`/career` コマンドが実行されたら、以下の順で処理する。

1. `career/thoughts/` 配下の最新ディレクトリにある `note.md` を読む
2. `career/{YYYYMMDD}_latest_plan.md` を読む（現在のキャリアプランの把握）
3. note.md の内容を分析・リサーチし、`summary.md` と `summary.pdf` を生成する
4. リサーチ結果から新たな論点が浮上した場合、ユーザーに「追加したいですか？」と確認する
5. Yes の場合、latest_plan を更新する（後述のオペレーション参照）

---

## thoughts の運用

### ユーザーの操作
- `career/thoughts/{YYYYMMDD}_{問いの超簡潔な要約}/note.md` を作成し、自由にメモを記載する
- `/career` コマンドで処理を開始する

### Claude の処理
1. note.md を読み、問いと背景を把握する
2. 論点を設計する（問いを調査可能な形に分解）
3. Web検索を使ったリサーチを実施する（最低3回以上、日英両方）
4. `summary.md` と `summary.pdf` を同ディレクトリに生成する

### summary.md の章立て

```markdown
# 問い（原文）
（note.md の原文をそのまま引用）

# 問い（フォーマット後）
（問いを明確化・構造化したもの。背景・核心的関心・暗黙の前提を整理）

# 結論
（リサーチ全体を通じた結論を3文以内で。確度の高い結論と不確実な点を分離）

# 論点整理
（問いを調査可能な具体的論点に分解。表形式で整理）

# リサーチ結果
（論点ごとに「ファクト → 分析・考察 → 小括」の構造で記述。ソース番号を付記）

# 説明
（結論に至った思考プロセスの補足説明。なぜそう考えるかのロジックを展開）

# ソース
（参照した全ソースの一覧。番号・タイトル・URL・種別・概要）

# 追加論点候補
（リサーチを通じて新たに浮上した問い。latest_plan への追加候補）
```

### summary.pdf の生成
以下の Python スクリプトを使用する（`markdown` と `WeasyPrint` が必要）。

```python
import markdown
from weasyprint import HTML

with open("summary.md", "r") as f:
    md_text = f.read()

html_body = markdown.markdown(md_text, extensions=["tables", "fenced_code"])

html_full = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body {{ font-family: "Hiragino Sans", "Noto Sans CJK JP", sans-serif; font-size: 11pt; line-height: 1.7; margin: 40px; }}
  h1 {{ font-size: 18pt; border-bottom: 2px solid #333; padding-bottom: 4px; }}
  h2 {{ font-size: 15pt; border-bottom: 1px solid #999; padding-bottom: 3px; margin-top: 28px; }}
  h3 {{ font-size: 13pt; margin-top: 20px; }}
  h4 {{ font-size: 11pt; margin-top: 16px; }}
  table {{ border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 10pt; }}
  th, td {{ border: 1px solid #ccc; padding: 6px 10px; text-align: left; }}
  th {{ background: #f5f5f5; font-weight: bold; }}
  blockquote {{ border-left: 4px solid #ccc; margin: 12px 0; padding: 8px 16px; color: #555; }}
  code {{ background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-size: 10pt; }}
  pre {{ background: #f4f4f4; padding: 12px; border-radius: 4px; overflow-x: auto; }}
</style>
</head><body>{html_body}</body></html>"""

HTML(string=html_full).write_pdf("summary.pdf")
```

---

## latest_plan の運用

### ファイル仕様
- ファイル名：`career/{YYYYMMDD}_latest_plan.md`（日付は更新日）
- 常に1ファイルのみ存在する

### latest_plan.md の章立て

```markdown
# キャリアパス概要
（現時点で検討しているキャリアパスの一覧と簡潔な説明）

# キャリアパス詳細
（各パスについて、具体的な道筋・必要なアクション・タイムラインを記述）

# 各パスの理論的裏付け
（なぜそのパスが自分に合っているか。強み・興味・市場環境との接続）

# ソース
（参照した情報・考え方の根拠となるソース）

# 前回のlatestとの差分
（前バージョンからの変更点・追加点・削除点をまとめる）
```

### 更新オペレーション（thoughts の追加論点を反映する場合）

1. ユーザーが「追加したいですか？」に Yes で回答
2. 現在の `{YYYYMMDD}_latest_plan.md` を `career/archive/` にそのままコピー（アーカイブ）
3. 追加論点の内容を反映した新しい latest_plan を作成
4. ファイル名のプレフィックスを**本日の日付**に更新して `career/` 直下に保存
5. 旧ファイルは archive に残し、`career/` 直下には新ファイルのみを置く

---

## リサーチの姿勢

- **一次情報を優先する**：公式発表・統計・論文・キャリア事例を重視する
- **数字で語る**：「〜が多い」ではなく「〜%」「〜件」「〜万円」で示す
- **反証を探す**：自分の仮説に都合の悪い情報も積極的に探す
- **日英両方で検索する**：日本固有のテーマでも英語圏に有益な分析があることが多い
- **「なぜ？」を繰り返す**：表面的な事実の裏にある構造・メカニズムまで掘り下げる
- **キャリア文脈を忘れない**：リサーチの目的は「西山瑞生の意思決定に使えること」

---

## /career スキルの実装仕様

`/career` コマンドは以下の手順で動作する。

```
Phase 0: 準備
  - career/thoughts/ 配下の最新ディレクトリの note.md を読む
  - career/{YYYYMMDD}_latest_plan.md を読む

Phase 1: 論点設計
  - note.md の問いを構造化し、調査可能な論点に分解する
  - summary.md のセクション「問い（フォーマット後）」「論点整理」のドラフトを設計する

Phase 2: リサーチ
  - 各論点に対してWeb検索を最低3回以上実施する（日英両方）
  - 一次情報（統計・論文・公式発表）を優先する
  - 反証情報も積極的に収集する

Phase 3: 成果物生成
  - summary.md を上記の章立てで作成する
  - summary.pdf を Python（WeasyPrint）で生成する

Phase 4: latest_plan との接続
  - summary.md の「追加論点候補」セクションを確認する
  - 新たに追加すべき論点があればユーザーに「追加したいですか？」と確認する
  - Yes の場合、latest_plan の更新オペレーションを実行する

Phase 5: Git
  - git add -A && git commit -m "運用: ..." && git push origin main
```
