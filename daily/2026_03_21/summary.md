# Daily AI Briefing — 2026-03-21

generated_at: 2026-03-21 08:00 JST

---

## 1. フロンティアモデル更新

### OpenAI
- **gpt-oss-120b / gpt-oss-20b（オープンソース）公開**: OpenAIが120Bおよび20Bパラメータのオープンウェイトモデルを公開。120B版はo3・o4-miniに近い性能をベンチマークで示し、単一GPUで動作。20B版はハイエンドコンシューマーラップトップでのローカル実行が可能。（[labla.org](https://www.labla.org/latest-ai-model-releases-past-24-hours/latest-ai-model-releases-industry-pulse-past-24-hours-march-19-2026/)）
- **GPT-5.4 Thinking** がフラッグシップモデルに昇格。最大100万トークンコンテキストをサポートし、スプレッドシート・プレゼンテーション・ドキュメントの新ツール群を統合。（[neuralbuddies.com](https://www.neuralbuddies.com/p/ai-news-recap-march-20-2026)）

### Anthropic
- **Claude Sonnet 4.6**（2/17リリース）・**Opus 4.6**（2/5リリース）: 100万トークンコンテキストウィンドウ（ベータ）とコーディング性能の向上。3月初頭に全ユーザーへのメモリ機能ロールアウトを完了。（[renovateqr.com](https://renovateqr.com/blog/ai-model-releases-2026)）
- 本日（3/21）時点での新リリースは特記事項なし。

### Google DeepMind
- **Gemini 3.1 Pro**（2/19リリース）: Gemini 3 Proから推論性能2倍以上向上。100万トークンコンテキスト。API価格: 入力$2/百万トークン・出力$12/百万トークン。（[renovateqr.com](https://renovateqr.com/blog/ai-model-releases-2026)）
- **Genie 3**（世界基盤モデル）: 数分間のインタラクティブ3D環境を720p/24fpsでリアルタイム生成可能。Genie 2の10〜20秒制限を大幅に超えた。（[llm-stats.com](https://llm-stats.com/llm-updates)）
- Geminiの**Personal Intelligence**機能を米国の無料ユーザー全員に拡大。Docs・Sheets・Slides・Drive統合も強化。（[neuralbuddies.com](https://www.neuralbuddies.com/p/ai-news-recap-march-20-2026)）

### Meta AI
- **Llama 4**（2026年初頭リリース）: 改良された推論能力と拡張コンテキストウィンドウ。GPT-4.5性能の89%を達成しつつ、十分なVRAMのコンシューマーハードウェアでフルファインチューニングが可能。（[shakudo.io](https://www.shakudo.io/blog/top-9-large-language-models)）

### 中国AI勢
- **DeepSeek-Prover-V2**: Lean 4での形式定理証明に特化したオープンソースモデルをリリース。（[llm-stats.com](https://llm-stats.com/ai-news)）
- **Alibaba Qwen3系列**: ハイブリッドMoEアーキテクチャ。1兆パラメータ超、119言語対応、AIME25で92.3%精度達成。Qwen3-NextはGPT-4o・DeepSeek-V3以上と主張。（[shakudo.io](https://www.shakudo.io/blog/top-9-large-language-models)）

### その他
- 特記事項なし

---

## 2. AIエージェント・開発ツール動向

- **Google Colab MCPサーバー公開**（3/17）: ローカルAIエージェントのワークフローをGoogle Colabのクラウド環境に直接接続可能なオープンソースMCPサーバーをGoogle Developersが公開。（[developers.googleblog.com](https://developers.googleblog.com/announcing-the-colab-mcp-server-connect-any-ai-agent-to-google-colab/)）
- **MCPプロトコル2026ロードマップ公開**（3/9）: Streamable HTTPトランスポートのスケーリング、Tasksプリミティブのライフサイクル補完、監査証跡・SSOなどエンタープライズ対応、サーバーディスカバリー向けメタデータ標準フォーマットの4軸を発表。（[dev.to](https://dev.to/alexmercedcoder/ai-weekly-agents-take-over-mcp-evolves-and-models-battle-for-code-5cm0)）
- **Claude Agent SDK v0.1.48**リリース: Anthropicが「Claude Code SDK」を「Claude Agent SDK」に改名（3月）。コーディング用途を超えた幅広いエージェント用途を反映。Google ADKもv1.26.0に更新。（[dev.to](https://dev.to/alexmercedcoder/ai-weekly-agents-take-over-mcp-evolves-and-models-battle-for-code-5cm0)）
- **Microsoft Agent Framework**がリリース候補（RC）に到達。3月末のGA予定。（[cloudproinc.com.au](https://www.cloudproinc.com.au/index.php/2026/03/16/what-microsoft-agent-framework-means-for-real-world-ai-delivery/)）
- **CrewAI v1.10.1**: ネイティブMCPおよびA2A（Agent-to-Agent）サポートを追加。（[dev.to](https://dev.to/alexmercedcoder/ai-weekly-agents-take-over-mcp-evolves-and-models-battle-for-code-5cm0)）
- **SurePath AI MCPポリシーコントロール**（3/12）: セキュリティチームがAIクライアントからのMCPサーバー・ツールアクセスをリアルタイムで制御可能に。MCPサーバーの「シャドーIT化」リスクへの対応として注目。（[blog.qualys.com](https://blog.qualys.com/product-tech/2026/03/19/mcp-servers-shadow-it-ai-qualys-totalai-2026)）
- **Cursor**がComposer 2の開発計画を発表。日次アクティブユーザー100万人・企業50,000社を突破。（[neuralbuddies.com](https://www.neuralbuddies.com/p/ai-news-recap-march-20-2026)）
- **Andrej Karpathy / autoresearch**: 自律型LLM実験ループを実現するGitHubプロジェクトを公開。単一GPU・~630行のコードで700実験/2日を実現し20のトレーニング最適化を自動発見。（[nextbigfuture.com](https://www.nextbigfuture.com/2026/03/andrej-karpathy-on-code-agents-autoresearch-and-the-self-improvement-loopy-era-of-ai.html)）

---

## 3. AI政策・規制

### 日本
- **AI促進法（2025年成立）**が完全施行中。「世界最もAIフレンドリーな国」を目標に、罰則より「名指し公表（Name and Shame）」と「協力義務」をベースとした運用。バインディングな罰金規制ではなく、任意ガイドラインと評判メカニズムを採用。（[fpf.org](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/)）

### 海外

**米国**
- **ワシントン州議会**（3/12閉会）が以下5本のAI関連法案を可決:
  - HB 1170: AIディスクロージャー
  - HB 2225: 子ども向けチャットボット安全規制
  - SB 5395: 健康保険分野でのAI利用
  - SB 5105: AIディープフェイク・未成年の露骨表現
  - SB 5886: デジタル肖像権
  （[transparencycoalition.ai](https://www.transparencycoalition.ai/news/ai-legislative-update-march20-2026)）
- 連邦レベルでは規制緩和姿勢継続。「AI分野での圧倒的な技術的覇権確立」を安全保障上の最優先目標と位置づけ。（[unifiedaihub.com](https://www.unifiedaihub.com/blog/current-state-of-ai-regulation-in-2026)）
- **SuperMicro関連起訴**: 先端Nvidia GPUチップ搭載サーバーを中国へ迂回輸出した疑いで3名を連邦起訴。（[neuralbuddies.com](https://www.neuralbuddies.com/p/ai-news-recap-march-20-2026)）

**EU**
- **EU AI Act**: 高リスクAIシステムへの完全適用は2026年8月に予定。欧州委員会が「Digital Omnibus」改革提案（2025年11月）で実装遅延を認め、高リスクAI規定の施行延期を含む複数の変更を提案中（決定済みではない）。（[iapp.org](https://iapp.org/news/a/global-ai-law-and-policy-tracker-highlights-and-takeaways)）

---

## 4. 注目の発言・ポジション

### Dario Amodei（Anthropic CEO）（2026-03-04〜06）
> 「OpenAIのメッセージングは "mendacious"（虚偽的）で "safety theater"（安全劇）であり、"who they really are" を示す事例だ。Altmanのコメントの多くは "straight up lies" かつ "gaslighting" だ」（社内メモ、後に流出）
> （ソース: [TechCrunch](https://techcrunch.com/2026/03/04/anthropic-ceo-dario-amodei-calls-openais-messaging-around-military-deal-straight-up-lies-report-says/)）

**文脈**: OpenAIがPentagon（国防総省）との契約を発表した後、国防省がAnthropicを「サプライチェーンリスク（SCR）」に指定。Amodeiはこれを受けて社員向けに激烈なメモを書いたが、翌日「慎重に書いたものではなかった」と謝罪し、トーンを撤回。OpenAI-Anthropic間の公開的な対立として3月最大の炎上案件となった。

---

### Sam Altman（OpenAI CEO）（2026-03上旬）
> 「民主主義的規範を、政権が気に入らないという理由で放棄することは、社会にとって有害だ」（Amodeiへの暗黙の反論）
> （ソース: [diginomica.com](https://diginomica.com/what-dario-amodei-wouldnt-do-sam-altman-would-heres-why-openai-ceo-signed-deal-us-department-war)）

**文脈**: AmodeiがAltmanを「トランプへの独裁者的な賛辞」と批判したことへの間接的な応答。OpenAIとAnthropicの企業哲学の根本的な対立が顕在化。

---

### Andrej Karpathy（2026-03-17前後）
> 「全てのLLMフロンティアラボがこれ（自律的研究ループ）をやるようになる。これが最後のボスバトルだ」
> （ソース: [Fortune](https://fortune.com/2026/03/17/andrej-karpathy-loop-autonomous-ai-agents-future/)）

**文脈**: autoresearchプロジェクト公開に際してXで発言。AI研究の主役が「人間による手動実験」から「エージェントによる自律最適化ループ」へ移行するというパラダイムシフトを宣言。RLVR（検証可能な報酬による強化学習）が新たな主要トレーニングステージとして台頭している流れと連動。

---

## 5. GitHub Trending

### AI/ML関連
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [obra/superpowers](https://github.com/obra/superpowers) | +2,886 | Shell | エージェント型スキルフレームワーク＆ソフトウェア開発方法論 |
| 2 | [langchain-ai/open-swe](https://github.com/langchain-ai/open-swe) | +640 | Python | LangChain製オープンソース非同期コーディングエージェント |
| 3 | [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | +579 | Python | マルチエージェントLLM金融トレーディングフレームワーク |
| 4 | [newton-physics/newton](https://github.com/newton-physics/newton) | +267 | Python | NVIDIA Warp上に構築されたGPUアクセラレーション物理シミュレーションエンジン（ロボティクス向け） |
| 5 | [vas3k/TaxHacker](https://github.com/vas3k/TaxHacker) | +136 | TypeScript | セルフホスト型AIアカウンティングアプリ。レシート・請求書をLLMで解析 |

### その他注目
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) | +1,848 | Java | AI対応データ用PDFパーサー。PDFアクセシビリティの自動化 |
| 2 | [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) | +1,074 | JavaScript | Claude Code用プラグイン。コンテキスト使用量・アクティブツール・エージェント・TODOの進捗をリアルタイム表示 |
| 3 | [louis-e/arnis](https://github.com/louis-e/arnis) | +1,073 | Rust | 現実世界の任意の場所を高詳細でMinecraftに生成するツール |
| 4 | [openrocket/openrocket](https://github.com/openrocket/openrocket) | +132 | Java | モデルロケットの空力・軌道シミュレーションソフト |

> **補足**: `obra/superpowers`（+2,886）がダントツのトップ。Claude CodeなどAIコーディングエージェントと組み合わせるエージェント型スキル開発フレームワークとして注目を集めている模様。`jarrodwatts/claude-hud`はClaude Code活用層からの需要が急増していると推察。

---

*このレポートはClaude Codeにより自動生成されています。*
*ソースの正確性は可能な限り検証していますが、速報性を優先しているため誤りを含む可能性があります。*
