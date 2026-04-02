# Daily AI Briefing — 2026-04-03

generated_at: 2026-04-03 08:00 JST

---

## 1. フロンティアモデル更新

### OpenAI

- **GPT-5.4**（2026-03-05リリース）: 現在の最新フロンティアモデル。OSWorld-VerifiedおよびWebArena Verifiedのコンピューター使用ベンチマークで最高スコア。GPT-5.2比で個別クレームのエラー率33%減、全体応答エラー18%減。APIでは最大1Mトークンコンテキスト（OpenAI史上最大）を提供。Pro版・Thinking版・標準版の3バリアントあり。（ソース: [TechCrunch](https://techcrunch.com/2026/03/05/openai-launches-gpt-5-4-with-pro-and-thinking-versions/) / [OpenAI](https://openai.com/index/introducing-gpt-5-4/)）
- **GPT-5.5（コードネーム: Spud）**（未確認）: 事前学習完了済みで、Q2（4〜6月）リリースがコンセンサス予測。公式発表はなし。（ソース: [llm-stats.com](https://llm-stats.com/ai-news)）
- **API更新（直近）**: Message Batches APIのmax_tokensキャップを300kに引き上げ（`output-300k-2026-03-24` betaヘッダーで有効化）。（ソース: [Releasebot](https://releasebot.io/updates/openai)）

### Anthropic

- **Claude Sonnet 4.6**（2026-02-17リリース）: コーディング・コンピューター使用・長文推論・エージェント計画全般で前世代比大幅改善。1Mトークンコンテキストウィンドウをbeta提供。価格はSonnet 4.5と同一（$3/$15 per Mトークン）。Free/Proプランのデフォルトモデルに昇格。（ソース: [Anthropic](https://www.anthropic.com/news/claude-sonnet-4-6) / [Axios](https://www.axios.com/2026/02/17/anthropic-new-claude-sonnet-faster-cheaper)）
- **API更新（直近）**: Message Batches APIのmax_tokensキャップをOpus 4.6/Sonnet 4.6向けに300kへ引き上げ。プロンプトキャッシュのキャッシュヒット率改善も実施。（ソース: [Releasebot](https://releasebot.io/updates/anthropic)）
- **重要: コンテキストwindow beta退役予定**: Claude Sonnet 4.5・Sonnet 4の1Mトークンbetaは2026-04-30に廃止。`context-1m-2025-08-07`ヘッダーはその日以降無効となり、200kトークン超のリクエストはエラーを返す。（ソース: [Claude API Docs](https://platform.claude.com/docs/en/release-notes/overview)）
- **Claude Mythos 5 / コードネーム Capybara**（未確認・リーク）: セキュリティ研究者がAnthropicのインフラ上の設定ミスにより社内ドラフトを発見。Mythos 5は10兆パラメータでサイバーセキュリティ・コーディング特化、Capabaraは軽量汎用版との内容。Anthropic公式確認なし。（ソース: [renovateqr.com](https://renovateqr.com/blog/ai-models-april-2026)）

### Google DeepMind

- **Gemini 3.1 Pro**（2026-02-19リリース）: 16ベンチマーク中13でトップスコアを記録し、2026年前半の業界ベンチマークリーダー。リアルタイム音声・画像解析機能を追加。（ソース: [llm-stats.com](https://llm-stats.com/llm-updates)）

### Meta AI

- **Llama 4**: 4月リリースも「フロンティアに届いていない」と業界から酷評。中国勢・OpenAI・Anthropicとの差を縮められず、Metaにとって大きな後退と見られている。（ソース: [llm-stats.com](https://llm-stats.com/ai-news)）

### 中国AI勢

- **Alibaba Qwen3.6-Plus**: 数日間で3本目の独自モデルとしてリリース。Qwen系列はオープンウェイトモデルのダウンロード数で全Western競合を超え、業界標準の地位を確立しつつある。Meta社がQwenを内部採用したとの報道あり（真偽確認中）。（ソース: [Yahoo Tech](https://tech.yahoo.com/ai/meta-ai/articles/role-reversal-meta-adopts-qwen-093000433.html) / [llm-stats.com](https://llm-stats.com/ai-news)）
- **DeepSeek**: 直近24時間に特記すべき新リリースなし。

### その他

- 特記事項なし

---

## 2. AIエージェント・開発ツール動向

- **MCP（Model Context Protocol）エコシステム拡大**: SDK月間ダウンロード数が9,700万（Python+TypeScript合計）を突破。MCP対応サーバー5,800件超、クライアント300件超。Anthropic・OpenAI・Google・Microsoft・Amazonの全主要AIプロバイダーが採用済み。（ソース: [Wikipedia](https://en.wikipedia.org/wiki/Model_Context_Protocol)）
- **MCP ガバナンス移管**: 2025年12月、AnthropicはMCPをLinux Foundation傘下のAgentic AI Foundation（AAIF）に寄贈。Anthropic・Block・OpenAIが共同創設。（ソース: [Qualys Blog](https://blog.qualys.com/product-tech/2026/03/19/mcp-servers-shadow-it-ai-qualys-totalai-2026)）
- **A2A（Agent-to-Agent）**: Googleが2025年4月に策定、2025年6月にLinux Foundationへ寄贈。MCPとA2Aが並立するエージェント間通信プロトコルの二本柱として定着。（ソース: [DEV Community](https://dev.to/pockit_tools/mcp-vs-a2a-the-complete-guide-to-ai-agent-protocols-in-2026-30li)）
- **Claude Code が AIコーディングツール首位に**: 2025年5月ローンチから8ヶ月でNo.1へ。開発者の「最も好きなツール」評価で46%（Cursor 19%、GitHub Copilot 9%）。ほとんどのプロ開発者はCursor（日常編集）＋Claude Code（複雑タスク）の組み合わせを利用。（ソース: [NxCode](https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison)）
- **Cursor**: JetBrains対応を追加し、VS CodeのみだったCopilotの強みに対抗。ProプランでGPT-5.4・Claude Opus 4.6・Sonnet 4.6・Gemini 3 Pro・Grok Codeが利用可能。（ソース: [NxCode](https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison)）
- **GitHub Copilot**: 2026年2月よりClaude・Codex・Copilotモデルを選択可能に。Pro+（$39/月）ではClaude Opus 4.6を利用可能。（ソース: [DEV Community](https://dev.to/alexcloudstar/claude-code-vs-cursor-vs-github-copilot-the-2026-ai-coding-tool-showdown-53n4)）

---

## 3. AI政策・規制

### 日本

- **AI促進法（AI Promotion Act）**: 2025年5月成立、2025年9月1日全面施行済み。主要経済大国で唯一、強制義務なし・罰則なしのAI専門立法。「世界で最もAIフレンドリーな国」を標榜し、ソフトロー（ガイドライン）中心のアプローチを維持。（ソース: [FPF](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/)）
- **AI基本計画**: 2025年12月23日閣議決定。AI研究開発支援・データ利活用基盤整備・AIガバナンス強化・人材育成・社会実装推進・リスク管理体制構築の6本柱。（ソース: [SBBiT](https://www.sbbit.jp/article/cont1/177617)）
- 2026年4月3日時点で直近24時間内の新規政策発表は確認できず。

### 海外

- **EU AI Act（米国外で最大の動き）**: 2026年3月26日、欧州議会本会議でAI Act改正案の立場を正式採択。4月28日の第2回trilogue交渉で最終合意を目指す。主要規定の適用開始は2026年8月2日。AIコンテンツへのウォーターマーク義務は2026年11月2日から。（ソース: [Kennedy's Law](https://www.kennedyslaw.com/en/thought-leadership/article/2026/the-eu-ai-act-implementation-timeline-understanding-the-next-deadline-for-compliance/) / [OneTrust](https://www.onetrust.com/blog/how-the-eu-digital-omnibus-reshapes-ai-act-timelines-and-governance-in-2026/)）
- **EU Digital Omnibus**: 2025年11月にEU委員会が提案。AI・データアクセス・プライバシー・サイバーセキュリティの規制を統合簡素化する改革案。高リスクAI規定の施行を順次延期する内容を含む。（ソース: [OneTrust](https://www.onetrust.com/blog/how-the-eu-digital-omnibus-reshapes-ai-act-timelines-and-governance-in-2026/)）
- **米国**: 2025年1月のEO 14179（バイデン政権EO 14110を撤回、pro-innovation路線に転換）以降、連邦レベルの新規規制動向は直近24時間内に特記事項なし。

---

## 4. 注目の発言・ポジション

### Jensen Huang（直近）

> 「短期的に、AIはあなたをより忙しくするだけだ。放射線科医を見てほしい。AIによって仕事を失った者はいない。むしろ効率が上がり、多くの病院がより多くの患者を受け入れるようになり、医師はより忙しくなった。」（ソース: [36kr.com](https://eu.36kr.com/en/p/3560646166108289)）

**文脈**: 米サウジアラビア投資フォーラムで、イーロン・マスクの「10〜20年後には労働はオプションになる」という発言に対する反論として提示。Huangは近中期の生産性革命を主張し、AIによる大量失業論に慎重姿勢を示した。過去から一貫した「AIはコパイロット」論のポジション。

---

### Dario Amodei vs. Sam Altman — 軍事AI対応の分岐点（2026年3月）

> Amodei（Anthropic）: 米国防総省（Department of War）の要求するAI用途には、「AIの準備が整っていない領域がある」として契約締結を拒否。
> Altman（OpenAI）: 同条件での契約に迅速に応じた。（ソース: [Diginomica](https://diginomica.com/what-dario-amodei-wouldnt-do-sam-altman-would-heres-why-openai-ceo-signed-deal-us-department-war)）

**文脈**: 両社の「安全性重視 vs. 実用性優先」というポジションの差が、軍事AIという具体的な場面で可視化された。安全性を旗印に創業したAnthropicが軍事用途に「No」と言える一方、OpenAIはビジネス優先の姿勢を示した形。業界全体の軍事AI受注競争において重要な分岐点。

---

*本日特記すべきその他の発言（Sam Altman、Andrej Karpathy、Yann LeCun等）は直近24時間内に確認できず。*

---

## 5. GitHub Trending

### AI/ML関連

| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [Yeachan-Heo/oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) | +2,852 | TypeScript | OmX — OpenAI Codexにフック・エージェントチーム・HUDを追加する拡張フレームワーク |
| 2 | [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks) | +323 | — | ChatGPT・Claude・Gemini・Grok・Perplexityなど主要AIのシステムプロンプト抽出集 |

### その他注目

| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [siddharthvaddem/openscreen](https://github.com/siddharthvaddem/openscreen) | +2,496 | TypeScript | Screen Studioの無料OSSオルタナティブ。透かしなし・商用利用可のデモ動画作成ツール |
| 2 | [sherlock-project/sherlock](https://github.com/sherlock-project/sherlock) | +807 | Python | SNSのユーザー名横断検索ツール（OSINTツール）。総計77,192★ |

**補足**:
- `oh-my-codex` はOpenAI Codexのリリースを受けて急浮上。Codexエコシステムに対するコミュニティの高い関心を示す。
- `system_prompts_leaks` は継続的に高スター数を維持。AIプロンプトエンジニアリングへの関心の深さを反映。
- `openscreen` はデザイン・マーケティング系開発者の間でScreen Studioの有料代替として注目。

---

*このレポートはClaude Codeにより自動生成されています。*
*ソースの正確性は可能な限り検証していますが、速報性を優先しているため誤りを含む可能性があります。*
