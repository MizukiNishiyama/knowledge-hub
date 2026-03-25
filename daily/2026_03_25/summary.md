# Daily AI Briefing — 2026-03-25

generated_at: 2026-03-25 09:00 JST

---

## 1. フロンティアモデル更新

### OpenAI
- **GPT-5.4** が公開済み。100万トークンコンテキストウィンドウ、デスクトップ操作を含む多段ワークフローの自律実行に対応。OSWorld-Vベンチマーク **75%**（人間ベースライン72.4%を超過）。Artificial Analysis Intelligence Index では Gemini 3.1 Pro と同スコア（57点）で首位タイ。（[llm-stats.com](https://llm-stats.com/llm-updates) / [renovateqr.com](https://renovateqr.com/blog/ai-model-releases-2026)）

### Anthropic
- **Claude コンピューター操作（Computer Use）を一般公開**（2026-03-24）。Pro・Max サブスクライバー向けに macOS で提供開始。スマートフォンから指示を出すと Claude がアプリ起動・ブラウザ操作・スプレッドシート入力を自律実行する。新機能「Dispatch」（Claude Cowork内）と連携して継続タスク管理が可能。（[CNBC](https://www.cnbc.com/2026/03/24/anthropic-claude-ai-agent-use-computer-finish-tasks.html) / [MacRumors](https://www.macrumors.com/2026/03/24/claude-use-mac-remotely-iphone/)）
- Claude Sonnet 4.6（2/17）・Opus 4.6（2/5）はすでにリリース済み。100万トークンコンテキストをベータ提供中。

### Google DeepMind
- **Gemini 3.1 Pro**（2026-02-19リリース）が Gemini 3 Pro 比 2x+ の推論性能。コンテキスト100万トークン、API価格 $2/$12 per million tokens。Artificial Analysis Index で GPT-5.4 と首位タイ（57点）。（[renovateqr.com](https://renovateqr.com/blog/ai-model-releases-2026)）
- **Genie 3** 公開。世界モデルとして数分間の3D環境（720p/24fps）をリアルタイム生成・インタラクション可能に。Genie 2の10-20秒制約を大幅突破。

### Meta AI
- **Llama 4** を2026年初頭にリリース。推論・コンテキストウィンドウを強化。GPT-4.5性能の89%を達成しつつ、十分なVRAMがあれば民生ハードでのフルファインチューニングが可能。（[shakudo.io](https://www.shakudo.io/blog/top-9-large-language-models)）

### 中国AI勢
- **DeepSeek**: DeepSeek-Prover-V2（Lean 4による定理証明特化オープンソースモデル）を公開。最新NVIDIAチップで学習した次世代モデルをMarch中にリリース予定（未確認）。（[programming-helper.com](https://www.programming-helper.com/tech/deepseek-open-source-ai-models-2026-python-enterprise-adoption)）
- **Alibaba Qwen**: Qwen3シリーズ（ハイブリッドMoE）がGPT-4o・DeepSeek-V3を多くのベンチマークで上回ると主張。Qwen3-Next・Qwen2.5-Max を展開中。

### その他
- 特記事項なし

---

## 2. AIエージェント・開発ツール動向

- **Anthropic Claude Computer Use 正式公開**（2026-03-24）: Pro/Max向けにmacOSで提供開始。スマホからタスク指示→PC上でブラウザ・アプリを自律操作。（[CNBC](https://www.cnbc.com/2026/03/24/anthropic-claude-ai-agent-use-computer-finish-tasks.html)）
- **LangChain × NVIDIA エンタープライズ連携**（2026-03-16）: LangSmith + NVIDIA Agent Toolkit を組み合わせたエンタープライズ向けエージェントAI開発プラットフォームを発表。（[blog.langchain.com](https://blog.langchain.com/nvidia-enterprise/)）
- **LangChain Deep Agents リリース**（2026-03-15）: LangGraph上で動く計画・メモリ・コンテキスト分離対応のマルチステップエージェントハーネス。`write_todos` ツールでタスク分解、サブエージェント生成機能を内蔵。（[marktechpost.com](https://www.marktechpost.com/2026/03/15/langchain-releases-deep-agents-a-structured-runtime-for-planning-memory-and-context-isolation-in-multi-step-ai-agents/)）
- **Cursor Composer 2 & Cursor Glass 登場**: Composer 2 は Claude Opus 4.6 と同等性能を86%低コスト（$0.50/Mtok）で実現（CursorBench: 61.3）。Cursor Glass はクラウド↔ローカルのハンドオフ機能を持つ統合エージェントコーディング環境（アルファ版）。（[handyai.substack.com](https://handyai.substack.com/p/cursor-punches-up-with-composer-2)）
- **CrewAI v1.10.1** がGitHub stars 45,900+ に到達。MCP・A2A ネイティブ対応済み。（[digitalapplied.com](https://www.digitalapplied.com/blog/mcp-vs-langchain-vs-crewai-agent-framework-comparison)）
- **Claude Code の市場シェア**: 開発者の「最も好きなツール」ランキングで46%（Cursor 19%、GitHub Copilot 9%）。GitHub Copilot Pro+ ($39/月) が Claude Opus 4.6・Gemini 2.5 Pro に対応。（[tldl.io](https://www.tldl.io/resources/ai-coding-tools-2026)）

---

## 3. AI政策・規制

### 日本
- **東京AI安全担当閣僚会合**が3月に閉幕。政府AI「源内（Gennai）」を5月に10万ユーザー規模で展開予定と発表。（[CSIS](https://www.csis.org/analysis/japans-agile-ai-governance-action-fostering-global-nexus-through-pluralistic)）
- **AIプロモーション法**（2025年9月1日施行済み）が継続運用中。EU型の横断規制ではなく「展開支援＋ガイダンス＋安全評価」モデル。違反に対しては罰金ではなく「名前の公開（Name and Shame）」と協力義務で対処。（[fpf.org](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/)）

### 海外
- **EU AI Act**: 高リスクAIシステムへの厳格な義務規定が **2026年8月** に完全施行予定。ただし実装課題を理由に一部規定の延期案が検討されている（決定ではなく検討段階）。（[unifiedaihub.com](https://www.unifiedaihub.com/blog/current-state-of-ai-regulation-in-2026)）
- **米国**: 連邦統一法なし。Colorado・California の州法が2026年から施行。連邦方針はトランプ政権下で「AI分野での米国の揺るぎない技術的優位確立」を国家安全保障上の最重要課題と位置付け、規制緩和路線を継続。（[onetrust.com](https://www.onetrust.com/blog/where-ai-regulation-is-heading-in-2026-a-global-outlook/)）
- **Anthropic vs 国防総省（ペンタゴン）訴訟**: 2026-03-25 にサンフランシスコ連邦地裁で口頭弁論。Judge Rita Lin は「ペンタゴンの Anthropic Claude ブラックリスト決定は同社を潰そうとする試みに見える」と発言。（[CNBC](https://www.cnbc.com/2026/03/24/anthropic-lawsuit-pentagon-supply-chain-risk-claude.html)）

---

## 4. 注目の発言・ポジション

### Dario Amodei（Anthropic CEO）（2026-03-04〜06）
> 「OpenAI の（ペンタゴン契約に関する）メッセージングはまったくの嘘だ（straight up lies）」（リーク内部メモより。後に謝罪）

**文脈**: AnthropicがペンタゴンのAIサプライチェーンリスク指定を受けた直後に書かれた社内メモが流出。Amodei は「Altman が自分を平和的交渉者として演じているが、それは誤りだ」と批判した。翌日に「混乱の中で書いた慎重でない発言だった」と公式謝罪。AI安全を旗印とした両社の路線対立が表面化した事件として注目される。（[TechCrunch](https://techcrunch.com/2026/03/04/anthropic-ceo-dario-amodei-calls-openais-messaging-around-military-deal-straight-up-lies-report-says/) / [Fortune](https://fortune.com/2026/03/06/anthropic-openai-ceo-apologizes-leaked-memo-supply-chain-risk-designation/)）

### Andrej Karpathy（2026年初頭）
> 「2026年は "slopacolypse（スロパカリプス）" の年になる」

**文脈**: AIが生成する低品質コンテンツが爆増するという警告。「モデルはそこまで来ていない（The models are not there）」とも述べており、AGI楽観論への懐疑的立場を継続。AI業界のバブル論争における重要なカウンターポイント。（[cybernews.com](https://cybernews.com/ai-news/andrej-karpathy-slopacolypse/)）

---

## 5. GitHub Trending

### AI/ML関連
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [bytedance/deer-flow](https://github.com/bytedance/deer-flow) | +4,319 | Python | ByteDance製オープンソーススーパーエージェントハーネス。リサーチ・コーディング・コンテンツ生成を自律実行 |
| 2 | [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | +1,746 | Python | マルチエージェントLLMによる金融取引フレームワーク |
| 3 | [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | +1,397 | TypeScript | Claude エージェント向けオーケストレーションプラットフォーム |
| 4 | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | +1,251 | Python | Nous Research による進化型エージェントフレームワーク |
| 5 | [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | +993 | Python | Claude Code 向けスキル・アプリ・MCP等のキュレーション集 |
| 6 | [supermemoryai/supermemory](https://github.com/supermemoryai/supermemory) | +407 | TypeScript | AI時代向け高速・スケーラブルなメモリエンジン |
| 7 | [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | +208 | Python | Reddit等を横断して過去30日の情報を調査・要約するAIエージェントスキル |

**注目**: `bytedance/deer-flow` が4,319★増で断トツ首位。ByteDanceによるオープンソースエージェントフレームワーク参入は、同社のAI戦略のOSS化シフトを示す動きとして注目される。`hesreallyhim/awesome-claude-code` のトレンド入りは Claude Computer Use 発表と同日であり、Claude エコシステムへの開発者関心の高さを反映している。

### その他注目
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [pascalorg/editor](https://github.com/pascalorg/editor) | +1,513 | TypeScript | 高機能テキストエディター |
| 2 | [FujiwaraChoki/MoneyPrinterV2](https://github.com/FujiwaraChoki/MoneyPrinterV2) | +2,937 | Python | オンライン収益プロセスの自動化ツール |
| 3 | [Crosstalk-Solutions/project-nomad](https://github.com/Crosstalk-Solutions/project-nomad) | +2,450 | TypeScript | オフライン対応サバイバルコンピューター（ツール・知識・AI搭載） |
| 4 | [ruvnet/RuView](https://github.com/ruvnet/RuView) | +1,020 | Rust | WiFi信号からリアルタイム姿勢推定を実現する技術 |
| 5 | [aquasecurity/trivy](https://github.com/aquasecurity/trivy) | +103 | Go | 脆弱性・設定ミス・シークレットを検出するセキュリティスキャンツール |

---

*このレポートはClaude Codeにより自動生成されています。*
*ソースの正確性は可能な限り検証していますが、速報性を優先しているため誤りを含む可能性があります。*
