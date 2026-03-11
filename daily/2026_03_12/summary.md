# Daily AI Briefing — 2026-03-12

generated_at: 2026-03-12 08:00 JST

---

## 1. フロンティアモデル更新

### OpenAI
- **GPT-5.1** がリリース済み。「Instant」（高速）と「Thinking」（推論強化）の2モードを提供。ベンチマーク詳細は未確認。（ソース: [Superhuman AI](https://www.superhuman.ai/p/openai-google-and-anthropic-release-new-models)）

### Anthropic
- **Claude 5 は未リリース**。Q2 2026（5〜9月）のリリースが有力視。Google Vertex AI のエラーログに `claude-sonnet-5@20260203` の識別子が露出したとの報告あり（**未確認**）。（ソース: [Claude5.com](https://claude5.com/news/when-is-claude-5-coming-out-release-date-prediction)）
- Claude Code に複数アップデート: Claude API スキル追加、セッション命名機能、キーパッドサポート、`/loop` コマンド（定期実行）、Cron スケジューリング機能が追加。（ソース: [Releasebot](https://releasebot.io/updates/anthropic/claude-code)）

### Google DeepMind
- **Gemini 3 Flash** リリース済み。フロンティア級モデルでスピード最適化。Google Search でグローバルロールアウト開始。
- **Gemini 3.1 Pro**: ARC-AGI-2 で 77.1%、1Mトークンコンテキストウィンドウ、テキスト・画像・音声・動画・コードのマルチモーダル推論に対応。
- **Veo 3**: 新世代の動画生成モデルとして公開。（ソース: [llm-stats.com](https://llm-stats.com/llm-updates)）

### Meta AI
- 特記事項なし（3月12日時点で新規リリースの確認なし）

### 中国AI勢
- **Qwen 3.5**（Alibaba）: 2026年2月16日リリース済み。Hybrid MoE アーキテクチャ。GPT-4o・DeepSeek-V3 をほぼ全ベンチマークで上回ると主張、かつ少ない計算コストで動作。DeepSeek・Qwen合計の世界AI市場シェアは1年で1%→15%に拡大。（ソース: [Particula Tech](https://particula.tech/blog/deepseek-v4-qwen-open-source-ai-disruption)）
- **DeepSeek V4**: **未リリース**。3月10日時点でも出荷されていない。中国テックメディアが「V4 Lite」というラベルを報告（3/9）したが、DeepSeek は公式コメントなし。仕様は ~1兆パラメータMoE・約32B活性パラメータ・1Mトークンコンテキスト・Huawei Ascend チップ最適化と伝えられる。HumanEval 90%・SWE-bench 80%超との**未確認**リークあり。（ソース: [leaveit2ai.com](https://leaveit2ai.com/ai-tools/language-model/deepseek-v4)）

### その他
- 特記事項なし

---

## 2. AIエージェント・開発ツール動向

- **Google Managed MCP Servers 公開プレビュー**（3/9）: Google が完全マネージドリモートMCPサーバーを正式プレビュー公開。Developer Knowledge API（`search_document`/`get_document` ツール搭載）のMCPサーバーも同時公開。チュートリアル「Getting Started with Google MCP Servers」をリリース。（ソース: [TechCrunch](https://techcrunch.com/2025/12/10/google-is-going-all-in-on-mcp-servers-agent-ready-by-design/)）
- **MCPのデファクト標準化が加速**: Anthropic が2024年末に公開した MCP 仕様は、Google・OpenAI・Microsoft など主要プレイヤー全社が採用。Linux Foundation 傘下の Agentic AI Foundation（AAIF）に寄贈済み。（ソース: [InfoQ](https://www.infoq.com/articles/mcp-connector-for-building-smarter-modular-ai-agents/)）
- **Claude Code が AI コーディングツール首位**に: 2025年5月ローンチから8ヶ月でシェア1位へ。開発者の "most loved" 評価 46%（Cursor 19%、GitHub Copilot 9%）。SWE-bench Verified 80.9%（現時点最高記録）。1月よりVS Code・JetBrains・デスクトップアプリ・ブラウザ IDE に対応。（ソース: [TLDL](https://www.tldl.io/resources/ai-coding-tools-2026)）
- **GitHub Copilot** が Claude エージェント・Codex エージェントを VS Code に直接統合（2026年1月〜）。（ソース: [Ryz Labs](https://learn.ryzlabs.com/ai-coding-assistants/github-copilot-vs-claude-code-which-ai-assistant-is-right-for-you-in-2026)）

---

## 3. AI政策・規制

### 日本
- **AI振興法（AI Promotion Act）**: 2025年5月28日可決・6月4日施行済み。AI戦略本部設置とAI基本計画に関する条項は2025年9月1日に発効。「世界最もAIフレンドリーな国」をスローガンに掲げ、バインディングな義務ではなく自主ガイドラインと評判圧力による運用が特徴（EU AI Act との最大の違い）。（ソース: [FPF](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/)）
- **日米英「グリーンレーン」協定**: 非機微データセットについてGDPR式の障壁を迂回し、AI学習データを共有できる協定を締結済み。（ソース: [IAPP](https://iapp.org/news/a/global-ai-law-and-policy-tracker-highlights-and-takeaways)）

### 海外
- **EU AI Act**: 家庭内監視・ソーシャルスコアリング等の禁止条項は2024年2月施行済み。健康・雇用・教育・法執行など高リスクAIへの厳格規制は**2026年8月より完全適用**予定。違反時の制裁: 3500万ユーロまたは全世界年間売上高7%の高い方。欧州委員会は2025年11月に「デジタルオムニバス」案を公開し、施行遅延を提案中（主管当局の指定遅れが理由）。（ソース: [Unified AI Hub](https://www.unifiedaihub.com/blog/current-state-of-ai-regulation-in-2026)）
- **米国**: 連邦レベルの包括的AI法なし。コロラド州・カリフォルニア州が独自AI法を2026年に施行。（ソース: [GDPR Local](https://gdprlocal.com/ai-regulations-around-the-world/)）

---

## 4. 注目の発言・ポジション

### Dario Amodei（2026-03-04〜06）
> 「OpenAI のメッセージングは mendacious（欺瞞的）だ。Sam Altman のコメントの多くは straight up lies（真っ赤な嘘）であり、gaslighting（ガスライティング）だ。彼らが国防総省の案件を受け入れ、我々が断った主な理由は、彼らが従業員をなだめることを優先し、我々は実際に悪用防止を優先したからだ。」
> （ソース: [The Information 経由 TechCrunch](https://techcrunch.com/2026/03/04/anthropic-ceo-dario-amodei-calls-openais-messaging-around-military-deal-straight-up-lies-report-says/)）

**文脈**: OpenAI が国防総省（DoD）との大型AI契約を締結した直後、Anthropic は「国内大量監視や自律兵器への使用を行わないと DoD が確約しなければ受け入れられない」として交渉決裂。Trump 政権は Anthropic を全連邦システムから排除することを発表。Amodei はその数時間後に社内向け1,600語のメモを書き、それが The Information にリーク。翌3月6日にはメモの「トーン」について謝罪し、Pentagon との交渉再開を模索中。AI安全を訴えてきた Amodei が商業的局面で強硬な競合批判を行った点で、姿勢の複雑さが露呈した。（ソース: [Fortune](https://fortune.com/2026/03/05/anthropic-openai-feud-pentagon-dispute-ai-safety-dilemma-personalities/), [Axios](https://www.axios.com/2026/03/06/pentagon-anthropic-amodei-apology)）

---

### Andrej Karpathy（2026年初頭）
> 「2026年は『slopacolypse（スロパカリプス）』の年になると身構えている。GitHub・Substack・arXiv・X/Instagram、あらゆるデジタルメディアが低品質なAI生成コンテンツに溢れる。」
> （ソース: [Cybernews](https://cybernews.com/ai-news/andrej-karpathy-slopacolypse/)）

**文脈**: AI生成コンテンツの質の低下（slop）が情報エコシステムに与える影響を警告。Karpathy は以前から「LLM は確率的オートコンプリートに過ぎない」などの冷静な見方を示しており、今回も熱狂論への牽制として業界で広く引用されている。

---

## 5. GitHub Trending

### AI/ML関連
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) | +6,205 | Shell | 専門エージェントを組み合わせた完全AIエージェンシーフレームワーク |
| 2 | [666ghj/MiroFish](https://github.com/666ghj/MiroFish) | +2,909 | Python | 予測能力を持つ汎用スウォームインテリジェンスエンジン |
| 3 | [obra/superpowers](https://github.com/obra/superpowers) | +1,477 | Shell | エージェント型スキルフレームワーク・ソフトウェア開発方法論 |
| 4 | [alibaba/page-agent](https://github.com/alibaba/page-agent) | +1,206 | TypeScript | 自然言語でWebページをコントロールするJS in-page GUIエージェント（Alibaba製） |
| 5 | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | +1,204 | Python | 成長・適応機能を持つエージェントフレームワーク（Nous Research製） |
| 6 | [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | +728 | TypeScript | プロンプト・エージェント・RAGのテストフレームワーク、レッドチーミング機能付き |
| 7 | [virattt/ai-hedge-fund](https://github.com/virattt/ai-hedge-fund) | +633 | Python | AI駆動ヘッジファンドチームのシミュレーション実装 |
| 8 | [AstrBotDevs/AstrBot](https://github.com/AstrBotDevs/AstrBot) | +391 | Python | マルチプラットフォーム・マルチLLM統合型チャットボットインフラ |
| 9 | [fishaudio/fish-speech](https://github.com/fishaudio/fish-speech) | +277 | Python | オープンソースSOTA音声合成（TTS）ソリューション |

### その他注目
特記事項なし（本日のトレンド上位はAI/ML関連が大半を占めた）

**注目背景**: `agency-agents`・`superpowers`・`hermes-agent`・`alibaba/page-agent` など、エージェント系リポジトリが上位を独占。MCPとエージェントフレームワーク熱の高まりを反映している。`promptfoo` はAIシステムのテスト・評価ニーズの高まりを示している。

---

*このレポートはClaude Codeにより自動生成されています。*
*ソースの正確性は可能な限り検証していますが、速報性を優先しているため誤りを含む可能性があります。*
