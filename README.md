# knowledge-hub

outarc の経営・リサーチ・事業アイデアを一元管理するナレッジベース。

## ディレクトリ構成

```
knowledge-hub/
├── playground/       # テーマ別リサーチレポート（summary.md + source.md + PDF）
├── ideas/data/       # 事業アイデアの探索・検証メモ
├── daily/            # Daily AI Briefing（毎朝自動生成）
├── books/            # 読書メモ・Kindleハイライト取り込み
├── people/           # 人物別の思想・発言アーカイブ（40名超）
├── setup/            # 環境構築手順
├── terraform/        # GCPインフラ定義
└── reference.MD      # 全体リファレンス
```

## 主要機能

### playground/ — テーマ別リサーチ
`/play` コマンドでリサーチを実行。reference.md の品質基準に従い、論点設計→Web検索→レポート作成→PDF生成を一気通貫で行う。

| 日付 | テーマ |
|------|--------|
| 2026-03-12 | Alibaba PageAgent 技術評価 |
| 2026-03-11 | AgentMailのビジネスモデル分析 |
| 2026-03-11 | 自民党AI政策の批判的国際比較 |
| 2026-03-08 | AGI後のコンサルティング・SIer市場 |
| 2026-03-08 | AGI到来後の政府側のアクション |
| 2026-03-08 | Elon Musk / Peter Thiel の思想分析 |
| 2026-03-08 | 政治思想マッピング |

### ideas/data/ — 事業アイデア検証
市場魅力度 × 技術実現性 × 差別化可能性の3軸でスクリーニング。

### daily/ — Daily AI Briefing
macOS launchd で毎朝8:00に自動実行。Claude Code（`claude -p`）がWeb検索・GitHub Trending取得を行い、summary.md + PDF を生成してgit push。

**カバー領域**: フロンティアモデル更新 / AIエージェント・開発ツール / AI政策・規制 / 注目の発言 / GitHub Trending

### people/ — 人物アーカイブ
AI・テック・政治・投資領域のキーパーソン40名超の思想・発言を構造化して蓄積。

## 技術スタック

- **リサーチ実行**: Claude Code（OAuth認証、ローカル実行）
- **自動化**: macOS launchd + `claude -p` ヘッドレスモード
- **通知**: AgentMail API（セッション完了時にメール送信）
- **PDF生成**: Python（markdown + WeasyPrint）
- **インフラ**: GCP（Terraform管理）
