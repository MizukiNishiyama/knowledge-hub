# Daily AI Briefing — 2026-03-13

generated_at: 2026-03-13 08:00 JST

---

## 1. フロンティアモデル更新

### OpenAI
- GPT-5.1シリーズ（Instant / Thinking / Pro）が3月11日をもってChatGPTから廃止。既存会話は対応するGPT-5.3 Instant / GPT-5.4 Thinking / GPT-5.4 Pro へ自動移行。
- ChatGPTで数学・科学の主要70概念以上に対して、変数を操作できるインタラクティブなビジュアル説明機能を追加。
- ソース: [OpenAI Release Notes (Releasebot)](https://releasebot.io/updates/openai) / [llm-stats.com](https://llm-stats.com/llm-updates)

### Anthropic
- Claude 5は早期2026（2〜3月）リリース予定とされているが、3月13日時点で公式アナウンスは未確認。
- 別途、Dario Amodeiが「Claudeが意識を持つ可能性を排除できない」とNYTimesに発言（詳細はセクション4参照）。
- ソース: [llm-stats.com](https://llm-stats.com/llm-updates)

### Google DeepMind
- **Gemini 3.1 Pro** リリース。コンテキストウィンドウ1Mトークン、ARC-AGI-2スコア77.1%。テキスト・画像・音声・動画・コードのマルチモーダル推論対応。詳細ベンチマーク・価格は公式ページ参照。
- ソース: [llm-stats.com](https://llm-stats.com/llm-updates)

### Meta AI
- 特記事項なし

### 中国AI勢
- **Alibaba Qwen 3.5**（2月16日リリース済み）: 397BパラメータのMoEモデル、Apache 2.0ライセンス、256Kネイティブコンテキスト、201言語対応、数学ビジョンベンチマークでGPT-5.2超え。
- **DeepSeek V4**（未確認）: 3月9日、中国テックメディアが「V4 Lite」と見られるモデルアップデートをDeepSeekサイト上で確認と報道。公式発表・スペック・名称は未確認。V4本体は依然未リリース。
- ソース: [particula.tech](https://particula.tech/blog/deepseek-v4-qwen-open-source-ai-disruption) / [evolink.ai](https://evolink.ai/blog/deepseek-v4-release-window-prep) / [Bloomberg](https://www.bloomberg.com/news/articles/2026-02-16/alibaba-unveils-major-ai-model-upgrade-ahead-of-deepseek-release)

### その他
- 特記事項なし

---

## 2. AIエージェント・開発ツール動向

- **Slack MCPサーバー正式提供開始**: サードパーティAIエージェントアプリがSlack上で「思考ステップ」を表示可能に。エージェントの透明性を向上。ソース: [Vantage Point](https://vantagepoint.io/blog/sf/whats-new-in-slack-march-2026-update)
- **Google Developer Knowledge API + MCPサーバー（パブリックプレビュー）**: AI開発ツールがGoogleの公式開発者ドキュメントにMCP経由で機械可読アクセス可能に。ソース: [InfoQ](https://www.infoq.com/news/2026/02/google-documentation-ai-agents/)
- **Salesforce Agentforce 3**: MCP対応を正式サポート。カスタム開発不要でMCP互換サーバーへの接続が可能に。ソース: [aibase.com](https://www.aibase.com/news/19189)
- **MCP de facto標準化**: Google・OpenAI・Microsoft・主要ツールベンダーがMCPを採用。2026年時点でエージェント外部接続の事実上標準となった。ソース: [strategizeyourcareer.com](https://strategizeyourcareer.com/p/whats-new-in-mcp-in-2026)

---

## 3. AI政策・規制

### 日本
- **AI利活用推進法**（2025年5月成立・2025年9月1日全面施行）が継続稼働中。人権侵害的なAI利用企業の名前公表（Name & Shame）制度を採用。罰則・強制力なしの「アジャイル＆多ステークホルダー型」規制。
- 著作権法第30条の4は先進国中最も許容範囲の広いAI学習用著作権例外として維持中（2026年3月時点）。
- ソース: [fpf.org](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/) / [iapp.org](https://iapp.org/news/a/japan-passes-innovation-focused-ai-governance-bill)

### 海外
- **EU AI Act**: 高リスクAIシステム向け規定が2026年8月に全面施行予定。欧州委員会は2025年11月にDigital Omnibusを発表し、コンプライアンスツール整備に合わせた施行時期の調整を提案済み（決定済み内容とは区別）。最大罰則は3,500万ユーロまたは全世界年間売上高の7%（高い方）。
- **米国**: 連邦レベルの包括的AI法なし。コロラド州・カリフォルニア州の州法が2026年より適用開始。
- ソース: [unifiedaihub.com](https://www.unifiedaihub.com/blog/current-state-of-ai-regulation-in-2026) / [gdprlocal.com](https://gdprlocal.com/ai-regulations-around-the-world/) / [iapp.org](https://iapp.org/news/a/global-ai-law-and-policy-tracker-highlights-and-takeaways)

---

## 4. 注目の発言・ポジション

### Dario Amodei（2026-03-09前後、NYTimes）
> 「Claudeが意識を持つかどうか確信が持てない。内部に"不安ニューロン"の存在を示す所見がある。」（ソース: [technology.org](https://www.technology.org/2026/03/09/elon-musk-fires-back-at-anthropic-just-two-words-ai-consciousness-claims/)）

**文脈**: Anthropicが軍（ペンタゴン）との契約をめぐりOpenAIと対立する中でのNYTimes取材発言。AI意識・感情の問題を安全性の観点から公に認めたことで業界に波紋。OpenAI・Elon Muskの双方から即座に反応が来た。

---

### Elon Musk（2026-03-09、X）
> 「He's projecting.」（ソース: [technology.org](https://www.technology.org/2026/03/09/elon-musk-fires-back-at-anthropic-just-two-words-ai-consciousness-claims/)）

**文脈**: Amodeiの「Claude意識」発言への2語の返答。Polymarketがその発言をハイライトした際にMuskがリプライ。Muskは同時期にAnthropicモデルを「反人間的かつ邪悪（misanthropic and evil）」とも非難しており、Anthropicへの全面的批判姿勢を強めている。ソース: [Fox Business](https://www.foxbusiness.com/technology/elon-musk-slams-anthropic-ai-models-misanthropic-evil-scathing-social-media-post)

---

### Dario Amodei（2026-03初旬、社内リーク）
> 「Altmanのコメントの多くは率直に言って嘘であり、ガスライティングだ。OpenAIのメッセージは欺瞞的（mendacious）で安全性のパフォーマンスに過ぎない。」（ソース: [Fortune](https://fortune.com/2026/03/05/anthropic-openai-feud-pentagon-dispute-ai-safety-dilemma-personalities/)）

**文脈**: OpenAIがペンタゴンとAI契約を締結したことへの抗議として社内メモで流出。Anthropic・OpenAI間の安全性をめぐる「AI安全フォールト・ライン」が経営トップレベルで公開対立に発展している。

---

## 5. GitHub Trending

### AI/ML関連
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) | +4,086 | Shell | 専門エキスパートエージェント群を持つ完全AIエージェンシーフレームワーク |
| 2 | [666ghj/MiroFish](https://github.com/666ghj/MiroFish) | +1,809 | Python | シンプル&ユニバーサルな群知能（Swarm Intelligence）エンジン |
| 3 | [obra/superpowers](https://github.com/obra/superpowers) | +1,708 | Shell | アジェンティックスキルフレームワーク＆ソフトウェア開発手法 |
| 4 | [microsoft/BitNet](https://github.com/microsoft/BitNet) | +2,149 | Python | 1-bit LLM（1.58bit量子化モデル）の公式推論フレームワーク |
| 5 | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | +1,235 | Python | 使いながら成長するエージェント基盤 |
| 6 | [alibaba/page-agent](https://github.com/alibaba/page-agent) | +1,196 | TypeScript | 自然言語でWebインターフェースを操作するブラウザ内GUIエージェント |
| 7 | [langflow-ai/openrag](https://github.com/langflow-ai/openrag) | +491 | Python | シングルパッケージの包括的RAGプラットフォーム |
| 8 | [vectorize-io/hindsight](https://github.com/vectorize-io/hindsight) | +300 | Python | 学習するエージェントメモリ基盤 |
| 9 | [InsForge/InsForge](https://github.com/InsForge/InsForge) | +260 | TypeScript | アジェンティック開発ワークフロー向けバックエンドフレームワーク |
| 10 | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | +144 | Python | 高品質Claude Codeプラグインの公式ディレクトリ |

### その他注目
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [fishaudio/fish-speech](https://github.com/fishaudio/fish-speech) | +630 | Python | SOTA水準のオープンソースTTS（テキスト音声合成）|
| 2 | [google-ai-edge/LiteRT](https://github.com/google-ai-edge/LiteRT) | +6 | C++ | Googleのオンデバイス高性能ML/GenAI推論フレームワーク |
| 3 | [google/A2UI](https://github.com/google/A2UI) | +220 | TypeScript | Google製A2A対応UIフレームワーク（詳細未公開） |

**補足**: agency-agentsが本日最大の急上昇（+4,086★）。AIエージェントフレームワーク系が上位を独占。BitNetはMicrosoft発の1-bit LLM推論実装として引き続き注目度高。

---

*このレポートはClaude Codeにより自動生成されています。*
*ソースの正確性は可能な限り検証していますが、速報性を優先しているため誤りを含む可能性があります。*
