# Daily AI Briefing — 2026-04-04

generated_at: 2026-04-04 08:00 JST

---

## 1. フロンティアモデル更新

### OpenAI

- **GPT-5.4**（3月5日リリース）: OSWorld-Verified・WebArena Verifiedのコンピュータ使用ベンチマークで記録更新。OpenAIの社内ナレッジ評価 GDPval で83%を達成。Gemini 3.1 Proと Artificial Analysis Intelligence Index で同スコアだがAPIコストは約3倍。（出典: [AI Models in April 2026](https://renovateqr.com/blog/ai-models-april-2026)）
- **GPT-5.5（開発コード: Spud）**: 事前学習完了済み、Q2リリースが有力視。（未確認）（出典: [renovateqr.com](https://renovateqr.com/blog/ai-models-april-2026)）
- **セキュリティインシデント（未確認）**: Anthropic の Claude AIエージェントのソースコード漏洩報道あり。プロプライエタリなアルゴリズム・学習手法が露出した可能性。（出典: [AI News April 4 2026](https://radicaldatascience.wordpress.com/2026/04/02/ai-news-briefs-bulletin-board-for-april-2026/)）

### Anthropic

- **Claude Sonnet 4.6**: 実務作業系ベンチマーク（real-world work evals）でリードを確保。GPT-5.4・Gemini 3.1 Proと世界トップクラスの競合状態。（出典: [llm-stats.com](https://llm-stats.com/ai-news)）
- **Claude Mythos 5（未確認）**: 10兆パラメータ、サイバーセキュリティ・コーディング特化の次世代モデルとされる。April 30以前の何らかの公表確率25%（市場インプライド）。アクセシブルな中位モデル「Capabara」も同時公開予定との情報あり。（出典: [blog.mean.ceo](https://blog.mean.ceo/new-ai-model-releases-news-april-2026/)）

### Google DeepMind

- **Gemini 3.1 Pro**（2月19日リリース）: 16主要ベンチマーク中13項目でトップ。GPT-5.4と Artificial Analysis Intelligence Index で同スコアながらAPIコストは約1/3。リアルタイム音声・画像解析機能を追加。（出典: [renovateqr.com](https://renovateqr.com/blog/ai-models-april-2026)）
- **KVキャッシュ圧縮アルゴリズム**: Googleが新圧縮アルゴリズムを公開。KV-cacheメモリを6分の1に削減し、推論速度・コスト双方を改善。（出典: [llm-stats.com](https://llm-stats.com/llm-updates)）
- **Gemini 3.2（未確認）**: 現在開発中との情報あり。

### Meta AI

- **Llama 4 Maverick**（3月リリース）: 400Bパラメータ、コンテキストウィンドウ10M。オープンウェイトモデルとして最強クラス。自己インフラで無償運用可能。（出典: [VentureBeat](https://venturebeat.com/ai/metas-answer-to-deepseek-is-here-llama-4-launches-with-long-context-scout-and-maverick-models-and-2t-parameter-behemoth-on-the-way)）
- **Llama 4 Behemoth（未確認）**: 2兆パラメータの超大規模モデルが開発中とされる。

### 中国AI勢

- **DeepSeek V3.2**: 入力100万トークンあたり約$0.28という驚異的なコスト効率を実現。欧米フラグシップ（$2以上/1Mトークン）と比較してほぼ同等性能を維持。（出典: [renovateqr.com](https://renovateqr.com/blog/ai-models-april-2026)）
- **DeepSeek V4（未確認）**: Q2後半リリース予定との情報あり。

### その他

- **xAI Grok 4.20**: マルチエージェントアーキテクチャを採用した新世代モデルとして登場。（出典: [humai.blog](https://www.humai.blog/ai-news-trends-april-2026-complete-monthly-digest/)）
- **全体トレンド**: GPT-5.4・Gemini 3.1 Pro・Claude Sonnet 4.6の三強構造が確立。性能差は縮小し、ワークフロー適合性とコストが選択基準に。オープンソース（Llama 4 / DeepSeek V3.2）もプロプライエタリモデルと真剣に競合する段階へ。

---

## 2. AIエージェント・開発ツール動向

- **Google Colab MCPサーバー公開**: Google がオープンソースの Colab MCP サーバーをリリース。任意のMCP互換エージェントからGoogle Colabの全機能をプログラマブルに操作可能に。ノートブック開発ライフサイクルの完全自動化を実現。（出典: [Google Developers Blog](https://developers.googleblog.com/announcing-the-colab-mcp-server-connect-any-ai-agent-to-google-colab/)）
- **MCPエコシステム規模**: 2026年2月時点でSDKの月間ダウンロード数が9,700万件（Python+TypeScript合算）を突破。Anthropic・OpenAI・Google・Microsoft・Amazonが全社採用。（出典: [Wikipedia - MCP](https://en.wikipedia.org/wiki/Model_Context_Protocol)）
- **MCP → AAIF移管済み**: 2025年12月、AnthropicはMCP仕様をLinux Foundation傘下の Agentic AI Foundation（AAIF）に寄贈。OpenAI・Block等も共同設立者として参加し、業界標準化が進む。（出典: [Wikipedia - MCP](https://en.wikipedia.org/wiki/Model_Context_Protocol)）
- **Cursor Composer 2**（3月19日リリース）: Moonshot AI の Kimi K2.5 ベースの第3世代コーディングモデル。CursorBench 61.3（Composer 1.5比+37%）、SWE-bench Multilingual 73.7を達成。（出典: [digitalapplied.com](https://www.digitalapplied.com/blog/ai-coding-assistants-april-2026-cursor-copilot-claude)）
- **GitHub Copilot Agent Mode GA**: エージェントモードがVS Code・JetBrainsで一般提供開始。セマンティックコード検索（キーワードでなく概念的関連性で検索）も実装済み。（出典: [nxcode.io](https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison)）
- **Claude Code の普及**: 2025年5月のリリース以降、開発者アンケートで「最も気に入っている」46%（Cursor 19%、GitHub Copilot 9%）を記録。ターミナルネイティブ・エージェント型という独自アーキテクチャが差別化点。（出典: [abhs.in](https://www.abhs.in/blog/cursor-vs-claude-code-vs-github-copilot-ai-coding-agent-comparison-2026)）

---

## 3. AI政策・規制

### 日本

- **AI振興法（2025年5月成立・2025年9月施行）**: 正式名称「AI関連技術の研究開発・利活用促進法」。全主要国で唯一、強制的なコンプライアンス義務を一切持たない国内AI専門立法。「世界で最もAIフレンドリーな国」を目標に掲げ、アジャイルかつマルチステークホルダー型のプロセスで継続的に改定。（出典: [FPF.org](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/)）
- **規制スタンス**: リスクベース・セクター別規制を基本方針とし、医療・金融・自動運転等の個別分野に既存法を適用する形で対応。米国と同方向の「ライトタッチ」アプローチを維持。（出典: [CSIS](https://www.csis.org/analysis/japans-agile-ai-governance-action-fostering-global-nexus-through-pluralistic-interoperability)）

### 海外

- **EU AI Act 施行見直し**: 欧州委員会が2025年11月に Digital Omnibus で AI Act の実施課題を公表。リスクの高いAIシステムに関する条項の適用延期を提案中。管轄当局の指定遅延・調和標準の欠如が主因。（出典: [IAPP](https://iapp.org/news/a/global-ai-law-and-policy-tracker-highlights-and-takeaways)）
- **米国**: トランプ政権がバイデン政権のAI大統領令を就任初日に撤回済み。EU同様にセクター別・ユースケース別アプローチに回帰。連邦包括立法は引き続き見送り。（出典: [anecdotes.ai](https://www.anecdotes.ai/learn/ai-regulations-in-2025-us-eu-uk-japan-china-and-more)）
- **AI立法動向（4月3日付）**: Transparency Coalition が4月3日付でAI透明性関連の立法アップデートを公表。詳細は要確認。（出典: [Transparency Coalition](https://www.transparencycoalition.ai/news/ai-legislative-update-april3-2026)）

---

## 4. 注目の発言・ポジション

### Andrej Karpathy（2026年初頭）
> 「I am bracing for 2026 as the year of the slopacolypse across all of GitHub, Substack, arXiv, X/Instagram, and generally all digital media.」（ソース: [cybernews.com](https://cybernews.com/ai-news/andrej-karpathy-slopacolypse/)）

**文脈**: AI生成コンテンツが GitHub・学術論文・SNS等のあらゆるデジタルメディアを「低品質コンテンツ」で埋め尽くす懸念を表明。量産化による品質劣化リスクへの警鐘として業界で広く引用されている。

---

### Dario Amodei vs Sam Altman（2026年3月、Pentagon契約を巡る公開対立）

**Amodei（3月4日）**:
> OpenAIのメッセージを「mendacious（虚偽的）」「safety theater（安全性の茶番）」と批判し、Altmanの発言を「straight up lies（露骨な嘘）」「gaslighting（ガスライティング）」と断言。（ソース: [TechCrunch](https://techcrunch.com/2026/03/04/anthropic-ceo-dario-amodei-calls-openais-messaging-around-military-deal-straight-up-lies-report-says/)）

**Amodei（3月6日、謝罪）**:
> 「メモのトーンについて謝罪する。混乱した発表から数時間で書いたもので、慎重かつ熟慮した見解を反映していない」（ソース: [Fortune](https://fortune.com/2026/03/06/anthropic-openai-ceo-apologizes-leaked-memo-supply-chain-risk-designation/)）

**Altman（間接的反論）**:
> 「政権が気に入らないからといって民主主義的規範を捨てるのは社会にとって悪いことだ」— トランプへの「独裁者賞賛」との批判に対する間接的反論。（ソース: [diginomica.com](https://diginomica.com/what-dario-amodei-wouldnt-do-sam-altman-would-heres-why-openai-ceo-signed-deal-us-department-war)）

**文脈**: AI企業の国防省契約をめぐる「安全性 vs 成長」の根本的対立が表面化した事例。OpenAI（軍事契約推進）vs Anthropic（安全性優先）の価値観の差異が初めて公開の場で激しく衝突した。

---

## 5. GitHub Trending

### AI/ML関連

| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [Yeachan-Heo/oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) | +2,984 | TypeScript | OpenAI Codexにフック・エージェントチーム・HUDを追加する拡張フレームワーク「OmX」 |
| 2 | [onyx-dot-app/onyx](https://github.com/onyx-dot-app/onyx) | +1,872 | Python | あらゆるLLMに対応するオープンソースAIチャットプラットフォーム |
| 3 | [google-research/timesfm](https://github.com/google-research/timesfm) | +912 | Python | Google Research製の事前学習済み時系列予測Foundation Model「TimesFM」 |
| 4 | [dmtrKovalenko/fff.nvim](https://github.com/dmtrKovalenko/fff.nvim) | +767 | Rust | AIエージェント・Neovim・Rust・C・Node.js向けの超高速ファイル検索ツールキット |

### その他注目

| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [siddharthvaddem/openscreen](https://github.com/siddharthvaddem/openscreen) | +2,855 | TypeScript | 透かし・サブスクなし・商用利用可のオープンソースデモ動画作成ツール（Screen Studio代替） |
| 2 | [sherlock-project/sherlock](https://github.com/sherlock-project/sherlock) | +1,230 | Python | SNSユーザー名から複数プラットフォームのアカウントを横断検索するOSINTツール |
| 3 | [f/prompts.chat](https://github.com/f/prompts.chat) | +369 | HTML | コミュニティ発のプロンプト共有・発見プラットフォーム（自己ホスト対応・完全プライバシー） |

**備考**: `oh-my-codex`は OpenAI Codex CLI のエコシステム拡張として急浮上。`timesfm`はGoogle Researchによる時系列予測の基盤モデルで、企業向け需要予測ユースケースへの注目が背景と推測される。

---

*このレポートはClaude Codeにより自動生成されています。*
*ソースの正確性は可能な限り検証していますが、速報性を優先しているため誤りを含む可能性があります。*
