# Daily AI Briefing — 2026-03-26

generated_at: 2026-03-26 08:00 JST

---

## 1. フロンティアモデル更新

### OpenAI
- **GPT-5.4**: 100万トークンコンテキストウィンドウを搭載し、マルチステップワークフローを自律実行する能力を持つ。Artificial Analysis Intelligence Indexで57点（Gemini 3.1 Proと同点首位）。API価格は未公開。（[ソース](https://renovateqr.com/blog/ai-model-releases-2026)）

### Anthropic
- **Claude Sonnet 4.6**（2026-02-17リリース）・**Claude Opus 4.6**（2026-02-05リリース）: 100万トークンコンテキストウィンドウ（ベータ）を導入。コーディング性能が向上。3月25-26日時点で追加の新モデルリリース情報なし。（[ソース](https://renovateqr.com/blog/ai-model-releases-2026)）

### Google DeepMind
- **Gemini 3.1 Pro**（2026-02-19リリース）: Gemini 3 Proから推論性能が2倍以上向上。100万トークンコンテキスト。API価格は入力$2/出力$12（100万トークンあたり）。GPT-5.4と並び首位。（[ソース](https://renovateqr.com/blog/ai-model-releases-2026)）
- **Genie 3**: インタラクティブな3D環境を720p・24fpsで数分間生成できる基盤ワールドモデル。Genie 2の10-20秒から大幅拡張。（[ソース](https://renovateqr.com/blog/ai-model-releases-2026)）

### Meta AI
- **Llama 4**: 2026年初頭リリース。GPT-4.5の89%のパフォーマンスをコンシューマーハードウェア（VRAM十分）でフルファインチューニング可能。（[ソース](https://llm-stats.com/ai-news)）

### 中国AI勢
- **Alibaba Qwen 3.5**: 全パラメータサイズへのロールアウトを2026年3月初旬に完了。コーディング・数学・長文脈推論のベンチマークで競合他社をリード。（[ソース](https://www.aimagicx.com/blog/qwen-3-5-vs-llama-vs-mistral-china-open-source-ai-2026)）
- **DeepSeek V4**: 未リリース（2026-03-26時点）。ポリマーケット予測では3/31までのリリース確率が依然低い。FTによるとネイティブマルチモーダル（画像・動画・テキスト生成）モデルになる見通し。長文脈コーディングでClaudeとChatGPTを超えるとも報告あり（【未確認】）。（[ソース](https://evolink.ai/blog/deepseek-v4-release-window-prep)）

### その他
- フロンティアモデル間の性能差は縮小傾向。GPT-5.4 / Gemini 3.1 Pro / Claude Opus 4.6 は実用タスクの大半で差が僅少との評価あり。（[ソース](https://llm-stats.com/llm-updates)）

---

## 2. AIエージェント・開発ツール動向

- **LangChain × NVIDIA エンタープライズプラットフォーム**（2026-03-16発表）: LangSmith、LangGraph、Deep Agentsと NVIDIA Agent Toolkit を統合した企業向けエージェントAI開発プラットフォームを発表。（[ソース](https://blog.langchain.com/nvidia-enterprise/)）
- **LangChain Deep Agents**（2026-03-15リリース）: LangGraph上に構築されたエージェントハーネス。計画立案・大規模コンテキスト管理・サブエージェント委譲・会話間メモリ保持を単体ライブラリで実現。MCP連携は `langchain-mcp-adapters` 経由でサポート。（[ソース](https://www.marktechpost.com/2026/03/15/langchain-releases-deep-agents-a-structured-runtime-for-planning-memory-and-context-isolation-in-multi-step-ai-agents/)）
- **AIコーディングツール市場**: Claude Code が2026年に入りシェアを急拡大（開発者の「最も愛用」率46%）。GitHub Copilot はSWE-benchで56%解決率（Cursor 52%を上回る）を記録（2026-03-16最新ベンチマーク）。Cursor 2.0は8並列エージェント実行に対応。（[ソース](https://dev.to/alexcloudstar/claude-code-vs-cursor-vs-github-copilot-the-2026-ai-coding-tool-showdown-53n4)）
- **GitHub Trending**: `bytedance/deer-flow`（+3,787★）がトレンド首位。SuperAgentハーネスとして調査・コーディング・コンテンツ生成をサンドボックス+メモリ+サブエージェントで実現。（[GitHub Trending](https://github.com/trending?since=daily)）

---

## 3. AI政策・規制

### 日本
- **AI促進法（2025-09-01 全面施行済み）**: EUのような包括的事前規制ではなく、企業の自主的取り組みを重視する促進型の基本法。「ネーム＆シェーム」と「協力義務」モデルを採用。（[ソース](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/)）
- **東京AIセーフティ閣僚会議**（2026-03-03閉幕）: 5月ロールアウト予定の「政府AI げんない」（官公庁向け10万ユーザーLLMプラットフォーム）の方針を確認。（[ソース](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/)）
- **総務省・NICT**: 生成AIの信頼性・安全性評価システム開発を2026年から開始すると発表。（[ソース](https://arakiplaw.com/insight/2658/)）

### 海外
- **EU AI Act**: 高リスクAIシステムへの厳格ルールが2026年8月に完全施行予定。違反の場合は最高3,500万ユーロまたは全世界年間売上7%の制裁。（[ソース](https://www.unifiedaihub.com/blog/current-state-of-ai-regulation-in-2026)）
- **米国**: 連邦法は不在のまま分権モデルを継続。カリフォルニア・コロラド両州のAI法が2026年に効力発生。米国AI行動計画は「規制緩和を通じたAI覇権確立」を国家安全保障上の最優先事項と位置づけ。（[ソース](https://www.unifiedaihub.com/blog/current-state-of-ai-regulation-in-2026)）

---

## 4. 注目の発言・ポジション

### Dario Amodei（Anthropic CEO）（2026-03-04〜06）
> 「OpenAIの軍事契約に関するメッセージは『真っ赤な嘘』であり、ガスライティングだ」（TechCrunch報道）。また内部メモでOpenAIスタッフを「騙されやすい」と表現し、Altmanの言動を「欺瞞的」「安全性の茶番」と批判した。

**文脈**: Anthropicが「サプライチェーンリスク」に指定される中、OpenAIが国防総省と契約を締結したことへの反発。Amodeiは翌日「メモのトーンは謝罪する」と声明を撤回したが、AIと軍事利用に関する両社の思想的断絶が明確になった重要事例。（[ソース](https://techcrunch.com/2026/03/04/anthropic-ceo-dario-amodei-calls-openais-messaging-around-military-deal-straight-up-lies-report-says/)）

---

### Sam Altman（OpenAI CEO）（2026-03月）
> 「（AI企業が）政権を好まないからといって民主主義的規範を捨てることは社会にとって有害だ」（Amodeiへの暗示的な反論とみられる発言）

**文脈**: Amodeiから「トランプへの独裁者的賛辞」を贈ったと批判されたことへの応答。OpenAIの軍事・政府連携に対する倫理的スタンスの違いが公然化。（[ソース](https://diginomica.com/what-dario-amodei-wouldnt-do-sam-altman-would-heres-why-openai-ceo-signed-deal-us-department-war)）

---

### Andrej Karpathy（2025年10月発言、依然引用継続中）
> 「AGIの到達は世間の誇張より大幅に遅い。最低でも10年は先。多くの企業がエージェント能力を誇大広告している」

**文脈**: AIバブル懐疑論の代表的発言として業界で参照が続く。現在の「エージェントAI」ブームと対照的なポジション。（[ソース](https://fortune.com/2025/10/21/andrej-karpathy-openai-ai-bubble-pop-dwarkesh-patel-interview/)）

---

## 5. GitHub Trending

### AI/ML関連
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [bytedance/deer-flow](https://github.com/bytedance/deer-flow) | +3,787 | Python | ByteDance製オープンソースSuperAgentハーネス。調査・コーディング・コンテンツ生成をサンドボックス+メモリ+サブエージェントで実現 |
| 2 | [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | +1,342 | Python | Reddit・X・YouTube・HN・Polymarket・Webを横断調査するAIエージェントスキル |
| 3 | [BerriAI/litellm](https://github.com/BerriAI/litellm) | +289 | Python | 100以上のLLM APIをOpenAI互換フォーマットで呼び出すPython SDK/プロキシ。コスト追跡・ガードレール・ロードバランシング機能付き |
| 4 | [letta-ai/claude-subconscious](https://github.com/letta-ai/claude-subconscious) | +71 | TypeScript | Claude Codeに「潜在意識」を与えるプロジェクト（Letta AI製） |
| 5 | [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | +1,173 | TypeScript | Claude向けマルチエージェントスウォームオーケストレーションプラットフォーム |
| 6 | [usestrix/strix](https://github.com/usestrix/strix) | +215 | Python | アプリの脆弱性を発見・修正するオープンソースAIハッカー |
| 7 | [hsliuping/TradingAgents-CN](https://github.com/hsliuping/TradingAgents-CN) | +449 | Python | 中国語強化版金融取引AIエージェントフレームワーク |
| 8 | [supermemoryai/supermemory](https://github.com/supermemoryai/supermemory) | +809 | TypeScript | AI時代向けの高速・スケーラブルなメモリエンジン/APIサービス |

### その他注目
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [pascalorg/editor](https://github.com/pascalorg/editor) | +2,353 | TypeScript | 3D建築プロジェクトの作成・共有エディタ |
| 2 | [Crosstalk-Solutions/project-nomad](https://github.com/Crosstalk-Solutions/project-nomad) | +1,717 | TypeScript | オフライン動作する自己完結型サバイバルコンピュータ（重要ツール+知識+AI内蔵） |
| 3 | [ruvnet/RuView](https://github.com/ruvnet/RuView) | +1,083 | Rust | WiFi信号からリアルタイム人体姿勢推定・バイタルサイン計測（WiFi DensePose） |
| 4 | [FujiwaraChoki/MoneyPrinterV2](https://github.com/FujiwaraChoki/MoneyPrinterV2) | +1,065 | Python | オンライン収益化プロセスの自動化ツール |

**補足**: `bytedance/deer-flow` はByteDanceがオープンソース化したSuperAgentハーネスとして本日最大の注目を集めている。`letta-ai/claude-subconscious` はClaude Codeのメモリ・コンテキスト管理を強化する試みとして開発者コミュニティで話題。

---

*このレポートはClaude Codeにより自動生成されています。*
*ソースの正確性は可能な限り検証していますが、速報性を優先しているため誤りを含む可能性があります。*
