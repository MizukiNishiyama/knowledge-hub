# Daily AI Briefing — 2026-03-29

generated_at: 2026-03-29 08:00 JST

---

## 1. フロンティアモデル更新

### OpenAI
- **GPT-5.4** がリリース済み（直近）。コンテキストウィンドウ 1M トークン、マルチステップワークフローの自律実行に対応。API 価格: 入力 $2.50 / 出力 $15（1M トークンあたり）。ChatGPT Plus/Team/Pro で利用可。([llm-stats.com](https://llm-stats.com/llm-updates))
- Pentagon 契約に伴い OpenAI のサービス規約が改定済み。大量監視・自律兵器への利用制限について批判が続いている。([TechCrunch](https://techcrunch.com/2026/03/01/openai-shares-more-details-about-its-agreement-with-the-pentagon/))

### Anthropic
- **Claude Sonnet 4.6**（2/17）・**Claude Opus 4.6**（2/5）リリース済み。1M トークンコンテキスト（ベータ）、コーディング性能向上。
- 3月初旬、全ユーザー向けに **メモリ機能**（会話をまたいだ記憶保持）をロールアウト。([renovateqr.com](https://renovateqr.com/blog/ai-model-releases-2026))
- Pentagon との交渉が再開したと報道（3/26, Axios）。供給チェーンリスク指定の解除を目指す。([Axios](https://www.axios.com/2026/03/26/anthropic-pentagon-ai-deal))

### Google DeepMind
- **Gemini 3.1 Flash-Lite** 公開。従来比 2.5× 高速・45% 速いアウトプット生成、価格 $0.25/M 入力トークン。([llm-stats.com](https://llm-stats.com/llm-updates))
- **Genie 3** 発表。720p / 24fps でインタラクティブな 3D 環境を生成できるワールドモデル。([llm-stats.com](https://llm-stats.com/llm-updates))

### Meta AI
- **Llama 4** シリーズ（Scout・Maverick）リリース済み（2026年初旬）。Scout はコンテキストウィンドウ最大 10M トークン。ネイティブマルチモーダル対応。([shakudo.io](https://www.shakudo.io/blog/top-9-large-language-models))

### 中国AI勢
- **Qwen 3.5**（Alibaba）: 全パラメータサイズが 3月初旬に出揃う。コーディング・数学・命令追従・長文脈推論の各ベンチマークで上位。([aimagicx.com](https://www.aimagicx.com/blog/qwen-3-5-vs-llama-vs-mistral-china-open-source-ai-2026))
- **DeepSeek-Prover-V2** 公開。Lean 4 での形式的定理証明に特化したオープンソースモデル。
- **DeepSeek V3.2**: GPT-5 に並ぶ推論性能と報告されている。([programming-helper.com](https://www.programming-helper.com/tech/deepseek-open-source-ai-models-2026-python-enterprise-adoption))

### その他
- 特記事項なし

---

## 2. AIエージェント・開発ツール動向

- **MCP v1.27** (TypeScript SDK): Streamable HTTP スケーリング、タスクライフサイクル管理、エンタープライズ向け監査証跡・SSO 認証が優先ロードマップに掲載。月間 SDK ダウンロード数が 2月に **9,700万** を突破。OpenAI・Google・Microsoft・Amazon がすべて MCP をサポート。([contextstudios.ai](https://www.contextstudios.ai/blog/mcp-ecosystem-in-2026-what-the-v127-release-actually-tells-us))
- **SurePath AI** が MCP Policy Controls を 3/12 にローンチ。セキュリティチームが MCP サーバー・ツールへのアクセスをリアルタイム制御できる。([qualys.com](https://blog.qualys.com/product-tech/2026/03/19/mcp-servers-shadow-it-ai-qualys-totalai-2026))
- **Cursor 2.0**: 最大 8 エージェントを並列実行（エージェントスワーム）。隔離された git worktree を使用。JetBrains サポートも追加。([logrocket.com](https://blog.logrocket.com/ai-dev-tool-power-rankings/))
- **Claude Code** が AI コーディングツールランキング 1 位に（2026年）。([tldl.io](https://www.tldl.io/resources/ai-coding-tools-2026))
- **GitHub Copilot** が Agent Mode を追加し、完全エージェント型への移行を加速中。

---

## 3. AI政策・規制

### 日本
- **AIプロモーション法**（AI利活用促進法）: 2025/9/1 施行済み。罰則なし「名指し・協力義務」モデルで、EU AI Act とは対照的なイノベーション優先アプローチ。([fpf.org](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/))
- 政府向け生成 AI プラットフォーム **「Gennai」** の 10万ユーザー規模ロールアウトが 2026年5月に予定。
- 総務省が 2026年より NICT を通じた生成 AI 信頼性評価基盤の整備を開始予定。

### 海外
- **EU AI Act**: 高リスク AI 規制の全面適用は 2026年8月予定。欧州委員会が「Digital Omnibus」提案（2025/11）で実施延期を検討中。違反時の罰則は €3,500万 または全世界年間売上の 7% の高い方。([unifiedaihub.com](https://www.unifiedaihub.com/blog/current-state-of-ai-regulation-in-2026))
- **米国**: 規制分散モデルを維持。「America's AI Action Plan」で AI 分野のグローバル覇権確保を国家安全保障上の最優先事項と位置づけ、規制緩和を推進。Colorado・California の AI 規制法が 2026年に施行。
- **Pentagon × OpenAI 契約**: 大量監視・自律兵器への使用制限に関して批判継続中。([MIT Technology Review](https://www.technologyreview.com/2026/03/02/1133850/openais-compromise-with-the-pentagon-is-what-anthropic-feared/))

---

## 4. 注目の発言・ポジション

### Dario Amodei（2026-03-04〜06）
> 「OpenAIの軍事契約に関するメッセージングは完全な嘘だ（straight up lies）」
> ——漏洩した社内メモより（ソース: [TechCrunch](https://techcrunch.com/2026/03/04/anthropic-ceo-dario-amodei-calls-openais-messaging-around-military-deal-straight-up-lies-report-says/)）

**文脈**: Anthropic が Pentagon から「供給チェーンリスク」に指定された直後の混乱期に書かれたメモ。その後 Amodei は「トーンについて謝罪する」と公式謝罪したが内容の撤回はしていない。AI 安全性と国家安全保障の両立をめぐる OpenAI との根本的対立が表面化した。([Fortune](https://fortune.com/2026/03/06/anthropic-openai-ceo-apologizes-leaked-memo-supply-chain-risk-designation/))

---

### Sam Altman（2026-03-03〜26）
> 「民主的規範を嫌いな権力者のために捨てることは社会にとって有害だ」
> ——Anthropic 批判を念頭にした発言（ソース: [Axios](https://www.axios.com/2026/03/26/sam-altman-openai-anthropic-pentagon)）

**文脈**: Amodei から「Trump への独裁者賛美」と批判されたことへの間接的な反論。一方で Pentagon 契約を「opportunistic and sloppy に見えた」と認め、規約を修正。軍事 AI をめぐる企業倫理と現実路線の間でのせめぎ合いを露わにした。([CNBC](https://www.cnbc.com/2026/03/03/openai-sam-altman-pentagon-deal-amended-surveillance-limits.html))

---

### Jensen Huang（Nvidia GTC 2026）
> 「（AI で雇用が消えると言うのは）想像力が足りないからだ。想像力がある企業は、より多くでより多くをやり遂げる」
> ——Amodei の「5年以内に白カラー就業者の半数が職を失う」警告への反論（ソース: [AI Doomsday / Fortune](https://fortune.com/2026/03/04/sam-altman-jensen-huang-only-themselves-to-blame-ai-scare/)）

**文脈**: AI による雇用破壊論を明確に否定。Huang の「AI はツールであり人間の能力を拡張する」という従来ポジションを再確認。GTC での発言として広く報じられた。

---

## 5. GitHub Trending

### AI/ML関連
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [SakanaAI/AI-Scientist-v2](https://github.com/SakanaAI/AI-Scientist-v2) | +507 | Python | エージェント型ツリーサーチによるワークショップレベルの自動科学的発見 |
| 2 | [virattt/dexter](https://github.com/virattt/dexter) | +583 | TypeScript | 包括的な財務リサーチを行う自律エージェント |
| 3 | [onyx-dot-app/onyx](https://github.com/onyx-dot-app/onyx) | +870 | Python | 各種LLM対応のオープンソースAIチャットプラットフォーム |
| 4 | [datalab-to/chandra](https://github.com/datalab-to/chandra) | +679 | Python | 複雑な表・フォーム・手書き文字を扱うOCRモデル（レイアウト保持） |
| 5 | [agentscope-ai/agentscope](https://github.com/agentscope-ai/agentscope) | +379 | Python | 透明性・可読性を重視したエージェント構築・実行フレームワーク |
| 6 | [obra/superpowers](https://github.com/obra/superpowers) | +2,293 | Shell | エージェント型スキルフレームワーク＆ソフトウェア開発方法論 |
| 7 | [hacksider/Deep-Live-Cam](https://github.com/hacksider/Deep-Live-Cam) | +1,789 | Python | 1枚の画像でリアルタイムフェイススワップ・ディープフェイク動画生成 |

### その他注目
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [twentyhq/twenty](https://github.com/twentyhq/twenty) | +562 | TypeScript | コミュニティ主導のオープンソース Salesforce 代替 CRM |
| 2 | [apache/superset](https://github.com/apache/superset) | +67 | TypeScript | インタラクティブダッシュボード付きデータ可視化・探索プラットフォーム |

**補足**:
- `obra/superpowers` が本日最多増分（+2,293）。エージェント開発方法論への関心の高さを反映。
- `SakanaAI/AI-Scientist-v2` はSakana AIによる自動研究エージェントの第2世代。HNでも注目されている。
- `hacksider/Deep-Live-Cam` は累計 84K スターを持つ長期人気リポジトリ。引き続き高いトラフィックを維持。

---

*このレポートはClaude Codeにより自動生成されています。*
*ソースの正確性は可能な限り検証していますが、速報性を優先しているため誤りを含む可能性があります。*
