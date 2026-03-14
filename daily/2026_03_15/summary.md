# Daily AI Briefing — 2026-03-15

generated_at: 2026-03-15 09:00 JST

---

## 1. フロンティアモデル更新

### OpenAI
- **GPT-5.4**（3月5日リリース）: ネイティブのコンピューター操作機能（スクリーンショット・マウス・キーボード）を備えた初の汎用フロンティアモデル。OSWorld-V: 75%。GPT-5.4 / GPT-5.4 Pro がAPI経由で利用可能、priority processing対応。([出典](https://cybersecuritynews.com/gpt-5-4-launched/))
- **GPT-5.1 系モデル廃止**（3月11日）: GPT-5.1 Instant / Thinking / Pro が ChatGPT から削除。既存会話はGPT-5.3 Instant / GPT-5.4 Thinking / GPT-5.4 Pro へ自動移行。([出典](https://releasebot.io/updates/openai))
- **GPT-5.2-Codex**: 有料ChatGPTユーザー向けにリリース済み。API提供は近日公開予定。([出典](https://openai.com/index/introducing-gpt-5-2-codex/))

### Anthropic
- **Claudeメモリ機能**を3月上旬に全ユーザーへ展開。Claude Sonnet 4.6（2月17日）・Opus 4.6（2月5日）リリース済みで、100万トークンコンテキストウィンドウ（ベータ）とコーディング能力が強化。([出典](https://llm-stats.com/llm-updates))

### Google DeepMind
- **Gemini 3.1 Pro**: 1Mトークンコンテキスト・ARC-AGI-2スコア77.1%・テキスト/画像/音声/動画/コードのマルチモーダル推論。([出典](https://llm-stats.com/llm-updates))
- **Genie 3**: インタラクティブ3D環境を720p・24fpsで数分間生成できるFoundation World Model（前作Genie 2は10〜20秒のシミュレーションのみ）。([出典](https://llm-stats.com/llm-updates))
- Gemini 3がLMArenaリーダーボード首位（Elo: 1501）・Humanity's Last Exam 37.5%。

### Meta AI
- 特記事項なし

### 中国AI勢
- **Alibaba Qwen 3.5**（2月16日リリース）: 397B MoEアーキテクチャ・Apache 2.0・ネイティブ256Kコンテキスト・201言語対応。数学ビジョンベンチマークでGPT-5.2を上回ると主張。([出典](https://particula.tech/blog/deepseek-v4-qwen-open-source-ai-disruption))
- **DeepSeek 新モデル（未確認）**: Nvidiaの最新AIチップで学習した新モデルを3月中にリリース予定との報道。詳細・リリース日は未確認。([出典](https://www.bloomberg.com/news/articles/2026-02-16/alibaba-unveils-major-ai-model-upgrade-ahead-of-deepseek-release))
- DeepSeek + Qwen の合計グローバル市場シェアは約15%（1年前は1%）。([出典](https://particula.tech/blog/deepseek-v4-qwen-open-source-ai-disruption))

### その他
- 特記事項なし

---

## 2. AIエージェント・開発ツール動向

- **MCP 2026ロードマップ公開**: Anthropicがトランスポートスケーラビリティ（Streamable HTTP の水平スケーリング課題解消）、エージェント間通信（MCPサーバー自体がエージェントとして他サーバーと交渉）、エンタープライズ対応（監査証跡・SSO統合・設定ポータビリティ）を優先課題に設定。([出典](http://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/))
- **MCP新機能**: Audio Content Supportにより音声分析・TTS APIとの連携が可能に。Tool Annotations（readOnly / destructive）でホストアプリが危険操作前にHuman-in-the-loopを義務化。([出典](http://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/))
- **MCP普及状況**: 月間SDKダウンロード数が9,700万回（Python + TypeScript合計）に到達。Anthropic・OpenAI・Google・Microsoft・Amazonが採用。([出典](http://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/))
- **volcengine/OpenViking**がGitHub Trendingに登場: AIエージェント専用の「コンテキストDB」で、階層型メモリとスキル管理を提供。+1,557★（本日）。([出典](https://github.com/trending?since=daily))

---

## 3. AI政策・規制

### 日本
- **AI促進法（AI利活用推進法）**: 2025年9月1日施行済み。「世界で最もAIフレンドリーな国」を標榜し、既存法制を活用したアジャイル・マルチステークホルダー型ガバナンスを採用。罰則は「公表（Name and Shame）」と「協力義務」モデル。([出典](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/))
- **ガバメントAI「源内（Gennai）」**: デジタル庁主導の政府向け生成AI基盤。2026年1月から一部省庁への展開を開始しており、2026年5月頃から全省庁への本格展開を予定（決定済み）。([出典](https://digital-agency-news.digital.go.jp/articles/2025-12-11))

### 海外
- **EU AI Act（欧州）**: 高リスクAIシステムへの厳格規制が2026年8月に全面施行予定。欧州委員会が2025年11月に「Digital Omnibus」を提案し、一部条項の適用開始を延期する方向で検討中。罰則は最大€35百万または全世界年間売上高の7%。([出典](https://gdprlocal.com/ai-regulations-around-the-world/))
- **米国**: コロラド州・カリフォルニア州のAI規制法が2026年より施行。連邦レベルでは引き続き分野別・ユースケース別のセクター規制アプローチを維持。([出典](https://www.unifiedaihub.com/blog/current-state-of-ai-regulation-in-2026))

---

## 4. 注目の発言・ポジション

### Andrej Karpathy（3月上旬）
> 「One day, frontier AI research used to be done by meat computers in between eating, sleeping, having other fun… That era is long gone.」
> （ソース: [VentureBeat](https://venturebeat.com/technology/andrej-karpathys-new-open-source-autoresearch-lets-you-run-hundreds-of-ai)）

**文脈**: Karpathyは `autoresearch`（[GitHub](https://github.com/karpathy/autoresearch)）をオープンソース公開。シングルGPU上でML実験をAIエージェントが一晩中自律実行するフレームワーク。「これがpost-AGIの感覚だ」と述べ、2日間で860万ビューを獲得。次ステップとして、SETI@home型の分散・非同期エージェント協調（複数エージェントによる仮説分散探索）を構想しており、AI研究自動化の新たなパラダイムとして注目を集めている。

---

### Dario Amodei（2026-03-04〜06）
> 「[OpenAIのメッセージングは] mendacious、safety theater、そして彼らの本当の姿を示している。Altmanのコメントは straight up lies であり gaslighting だ。」
> （ソース: [TechCrunch](https://techcrunch.com/2026/03/04/anthropic-ceo-dario-amodei-calls-openais-messaging-around-military-deal-straight-up-lies-report-says/)）

**文脈**: OpenAIが国防総省（Pentagon）へのAI提供契約を発表し、国防長官がAnthropicを「サプライチェーンリスク」と指定したことを受け、Amodeiが全社Slackに激怒した内部メモを送付。後日Amodei氏は「トーンについて謝罪する」と公式声明を発表したが、内容の実質的な撤回は行っていない。Anthropic-OpenAI間の競争が安全性論争・軍事契約を巡る公開対立へと激化した重要局面。([出典](https://fortune.com/2026/03/06/anthropic-openai-ceo-apologizes-leaked-memo-supply-chain-risk-designation/))

---

### Sam Altman（2026-03上旬）
> 「AIの文化・経済への普及・吸収への抵抗が、自分が予想していたよりもはるかに多い」
> （ソース: [Fortune](https://fortune.com/2026/03/04/sam-altman-jensen-huang-only-themselves-to-blame-ai-scare/)）

**文脈**: 業界カンファレンスでの発言。AI技術の進歩ではなく社会的な受容の遅さへの失望を表明。技術的フロンティアから社会実装フェーズへの移行の難しさを認めた発言として注目される。

---

### Jensen Huang（2026-03-12）
> 「Compute equals revenue（コンピュートは収益に等しい）」
> （ソース: [Fortune](https://fortune.com/2026/03/12/ai-jobs-future-morgan-stanley-tmt-conference-ceos/)）

**文脈**: Morgan Stanley TMTカンファレンスでの発言。AIインフラ需要が「incredibly highを超えた」水準にあると強調。NvidiaのAIチップ需要が依然として旺盛であることを示す。

---

## 5. GitHub Trending

### AI/ML関連
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | volcengine/OpenViking | +1,557 | Python | AIエージェント専用コンテキストDB。階層型メモリ・スキル管理機能を提供 |
| 2 | p-e-w/heretic | +661 | Python | LLMの「制限除去」を自動化するツール（用途注意） |
| 3 | langflow-ai/openrag | +568 | Python | Langflow・Docling・OpenSearchを組み合わせたRAGプラットフォーム |
| 4 | InsForge/InsForge | +477 | TypeScript | エージェント駆動フルスタック開発向けバックエンドインフラ |
| 5 | anthropics/claude-plugins-official | +411 | Python | Claude Code公式プラグインディレクトリ（高品質プラグインのキュレーション） |
| 6 | fishaudio/fish-speech | +377 | Python | 高品質オープンソースTTSシステム |
| 7 | dimensionalOS/dimos | +64 | Python | AI開発向けDimensional Framework |

### その他注目
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | msitarzewski/agency-agents | +4,329 | Shell | 個性を持つ専門エキスパートエージェントを揃えたAIエージェンシーフレームワーク |
| 2 | lightpanda-io/browser | +2,100 | Zig | AI・自動化ワークフロー向けに設計されたヘッドレスブラウザ |
| 3 | obra/superpowers | +1,451 | Shell | ソフトウェア開発手法を取り込んだエージェントスキルフレームワーク |

> **備考**: 本日のトレンドはAIエージェントインフラ（コンテキストDB・エージェントフレームワーク）への集中が顕著。msitarzewski/agency-agents (+4,329★) は Hacker News での大きな反響が牽引とみられる。

---

*このレポートはClaude Codeにより自動生成されています。*
*ソースの正確性は可能な限り検証していますが、速報性を優先しているため誤りを含む可能性があります。*
