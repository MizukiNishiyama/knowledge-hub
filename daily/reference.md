# Daily AI Briefing リファレンス

## 概要

毎朝8時にGitHub Actionsから `claude -p` で自動実行される日次リサーチ。
AIフロンティアの動向を定点観測し、`daily/{YYYY_MM_DD}/summary.md` と `summary.pdf` を生成する。

---

## 実行仕様

- **トリガー**: GitHub Actions cron（JST 08:00 / UTC 23:00前日）
- **出力先**: `daily/{YYYY_MM_DD}/summary.md`, `daily/{YYYY_MM_DD}/summary.pdf`
- **対象期間**: 前日0:00〜当日0:00（24時間分）
- **読了目安**: 5分

---

## セクション構成

summary.md は以下の5セクション構成とする。

### セクション1: フロンティアモデル更新

**対象企業・プロダクト**:
- OpenAI（GPT、o-series、Sora、Codex）
- Anthropic（Claude、MCP）
- Google DeepMind（Gemini、Veo、AlphaFold）
- Meta AI（Llama、FAIR）
- DeepSeek、Alibaba Qwen、ByteDance Doubao/Seed
- Mistral、Cohere、その他注目モデル

**収集すべき情報**:
- 新モデル・新バージョンのリリース（ベンチマーク数値を含む）
- API・価格変更
- 重要な技術論文（arXiv）
- オープンソースモデルの公開

**情報ソース（検索クエリ例）**:
- Web検索: `"OpenAI" OR "Anthropic" OR "DeepMind" OR "DeepSeek" new model release {date}`
- Web検索: `site:openai.com/blog OR site:anthropic.com/research OR site:deepmind.google {date}`
- X検索: `from:OpenAI OR from:AnthropicAI OR from:GoogleDeepMind OR from:deepaboratory`

**フォーマット**:
```markdown
## 1. フロンティアモデル更新

### OpenAI
- （更新内容。なければ「特記事項なし」）

### Anthropic
- ...

### Google DeepMind
- ...

### Meta AI
- ...

### 中国AI勢
- ...

### その他
- ...
```

**品質基準**:
- リリースがあった場合、モデル名・パラメータ数・ベンチマーク・価格を可能な限り記載
- 噂・リークは「未確認」と明記して区別
- 何もなければ「特記事項なし」と書く（無理に埋めない）

---

### セクション2: AIエージェント・開発ツール動向

**対象領域**:
- AIエージェントフレームワーク（LangChain、LlamaIndex、CrewAI、AutoGen、Mastra等）
- MCP（Model Context Protocol）エコシステム
- Google A2A、その他エージェント間通信プロトコル
- AIコーディングツール（Cursor、Claude Code、Copilot、Windsurf、Codex等）
- AIインフラ（Vercel AI SDK、Supabase、Replicate等）

**収集すべき情報**:
- 新バージョン・新機能のリリース
- 注目のMCPサーバー・統合
- 開発者体験に影響する変更
- 新興スタートアップのローンチ

**情報ソース**:
- Web検索: `AI agent framework release update {date}`
- Web検索: `MCP server new integration {date}`
- Hacker News: `Show HN AI agent` `Launch HN AI`

**フォーマット**:
```markdown
## 2. AIエージェント・開発ツール動向

- （箇条書きで。各項目にソースリンク付記）
- 特記事項なし（何もなければ）
```

---

### セクション3: AI政策・規制

**対象地域・機関**:
- 日本: 自民党AIPT、デジタル庁、経産省、文化庁、AISI
- 米国: ホワイトハウス、NIST、FTC、州法（特にカリフォルニア）
- EU: AI Office、AI Act施行状況
- 中国: CAC（サイバー空間管理局）、国務院
- 国際: OECD、G7、国連AI諮問機関

**収集すべき情報**:
- 新たな法律・規制・ガイドラインの発表
- 執行アクション（罰金、調査開始等）
- 政策提言・ホワイトペーパーの公開
- 国際交渉・合意

**情報ソース**:
- Web検索: `AI regulation policy {country} {date}`
- Web検索: `AI法 規制 日本 {date}`
- X検索: `from:TAIRAMASAAKI OR from:digital_jpn OR from:maboroshi_suzu`

**フォーマット**:
```markdown
## 3. AI政策・規制

### 日本
- ...

### 海外
- ...
```

**品質基準**:
- 法律名・条文番号・施行日など正確な情報を記載
- 「検討中」と「決定済み」を明確に区別

---

### セクション4: 注目の発言・ポジション

**対象人物（優先順）**:

Tier 1（毎日チェック）:
- Sam Altman（@sama）
- Dario Amodei（@DarioAmodei）
- Elon Musk（@elonmusk）— AI関連発言のみ
- Jensen Huang — 公式発表・講演のみ
- Andrej Karpathy（@kaboratory）

Tier 2（発言があれば拾う）:
- Demis Hassabis、Yann LeCun、Ilya Sutskever、Mark Zuckerberg
- Marc Andreessen、Peter Thiel、Satya Nadella
- 平将明、安野たかひろ、孫正義

**収集すべき情報**:
- AI業界の方向性に関する発言
- 他社・他者への批判や反論
- ポジションの変化（以前と異なる見解を示した場合は特に重要）
- 重要なブログ記事・エッセイの公開

**情報ソース**:
- X検索: `from:sama OR from:DarioAmodei OR from:kaboratory AI`
- Web検索: `Sam Altman OR Dario Amodei interview statement {date}`

**フォーマット**:
```markdown
## 4. 注目の発言・ポジション

### {人物名}（{日付}）
> 「引用」（ソース: URL）

**文脈**: （なぜこの発言が重要か1-2文で）

---
（該当なしの場合は「本日特記すべき発言なし」）
```

**品質基準**:
- 必ず原文（または忠実な要約）とソースURLを付記
- 「すごいと言った」レベルの薄い発言は拾わない。戦略・思想・方向転換に関わるもののみ
- 過去の発言との比較ができる場合は「以前は〜と述べていたが」と文脈を付与

---

### セクション5: GitHub Trending

**対象**:
- GitHub Trending（Daily）の全言語トップ
- 特にAI/ML関連リポジトリを優先ピックアップ

**収集すべき情報**:
- リポジトリ名、スター数（増分）、言語
- 何をするツール/ライブラリか（1行説明）
- AI/ML関連は詳しめに記載（アーキテクチャ、ユースケース）

**情報ソース**:
- `https://github.com/trending` （WebFetchで取得）
- `https://github.com/trending?since=daily` （日次）

**フォーマット**:
```markdown
## 5. GitHub Trending

### AI/ML関連
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | owner/repo | +1,234 | Python | 一行説明 |
| ... | ... | ... | ... | ... |

### その他注目
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | owner/repo | +567 | Rust | 一行説明 |
| ... | ... | ... | ... | ... |
```

**品質基準**:
- AI/ML関連は全件拾い、概要を丁寧に書く
- その他は上位5件程度をピックアップ
- 「なぜトレンドか」の背景がわかる場合は補足（例: HNで話題、新バージョンリリース等）

---

## 全体の品質基準

### やるべきこと
- **ファクトベース**: すべての記述にソースURL or 出典を付記
- **変化を追う**: 「何が新しいか」にフォーカス。既知の情報の繰り返しは不要
- **数字で語る**: モデルのベンチマーク、スター数、資金調達額、市場規模は必ず数値記載
- **簡潔に**: 各項目は1-3文。詳細が必要な場合のみ段落で書く
- **正直に**: 情報がない日は「特記事項なし」。無理に埋めない

### やってはいけないこと
- ソースなしで断定する
- 噂・リークを確定情報として記載する
- 前日と同じ内容を繰り返す（変化がなければ記載しない）
- 1セクションに10項目以上詰め込む（重要度で絞る）

---

## ヘッダー・フッター

```markdown
# Daily AI Briefing — {YYYY-MM-DD}

generated_at: {YYYY-MM-DD HH:MM} JST

（セクション1〜5）

---
*このレポートはClaude Codeにより自動生成されています。*
*ソースの正確性は可能な限り検証していますが、速報性を優先しているため誤りを含む可能性があります。*
```

---

## PDF変換

summary.md と同じディレクトリに summary.pdf を生成する。

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
