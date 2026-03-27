# Daily AI Briefing — 2026-03-28

generated_at: 2026-03-28 08:00 JST

---

## 1. フロンティアモデル更新

### OpenAI

- **GPT-5.4シリーズ**（2026-03-05リリース、3/27〜28追加動向なし）: GPT-5.4 / GPT-5.4 Thinking / GPT-5.4 Pro / GPT-5.4 miniの4バリアント展開済み。BigLaw Bench 91%、API価格: 入力 $2.50 / 出力 $20.00（per 1Mトークン）、最大1Mコンテキスト。
- 3月27〜28日に新規リリース・発表なし。
- ソース: [TechCrunch](https://techcrunch.com/2026/03/05/openai-launches-gpt-5-4-with-pro-and-thinking-versions/) / [OpenAI Pricing](https://openai.com/api/pricing/)

### Anthropic

- **【未確認・速報】Claude Mythos（コードネーム: Capybara）リーク（2026-03-27）**: AnthropicのCMS設定ミスで内部ドラフトが流出。「これまでで最もパワフルなAIモデル」と内部文書が記述。Opus 4.6を大幅に上回る新モデルティアとして開発中。コーディング・学術推論・サイバーセキュリティで「劇的に高いスコア」とされるが、具体的ベンチマーク値は未公表。内部で「サイバーセキュリティリスクが前例なく高い」と警告されており、正式リリースを留保中。
- **既存モデル（参考）**: Claude Sonnet 4.6（SWE-bench 79.6%、$3.00/$15.00 per 1M）、Haiku 4.5（$1.00/$5.00 per 1M）、いずれも1Mコンテキストベータ対応。
- ソース: [Fortune](https://fortune.com/2026/03/26/anthropic-says-testing-mythos-powerful-new-ai-model-after-data-leak-reveals-its-existence-step-change-in-capabilities/) / [The Decoder](https://the-decoder.com/anthropic-leak-reveals-new-model-claude-mythos-with-dramatically-higher-scores-on-tests-than-any-previous-model/) / [Futurism](https://futurism.com/artificial-intelligence/anthropic-step-change-new-model-claude-mythos)

### Google DeepMind

- **Gemini 3.1 Flash Live プレビュー公開（2026-03-26）**: リアルタイム音声・視覚エージェント向けLive APIのプレビュー開放。音声+映像入力をリアルタイム処理するエージェント開発向け。
- **Gemini 3シリーズ（既存）**: Gemini 3 Pro（MMLU-Pro 89.8% / ARC-AGI-2 77.1%、$2.00/$12.00 per 1M）、Gemini 3 Flash（$0.50/$3.00 per 1M）。Gemini 2.5 Pro比で解決ベンチマークタスク数50%以上改善。
- ソース: [Google Blog](https://blog.google/products-and-platforms/products/gemini/gemini-3/) / [Google: Build with Gemini 3.1 Flash Live](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-3-1-flash-live/)

### Meta AI

- **Llama 4 Scout / Maverick**（2025-04リリース、3/27〜28追加動向なし）: Maverick（MMLU-Pro 80.5% / GPQA Diamond 69.8%）、Scout（最大1,000万トークンコンテキスト、MMLU-Pro 74.3%）。MoE構造、ネイティブマルチモーダル。
- ソース: [Meta AI Blog](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)

### 中国AI勢

- **Qwen 3.5**（Alibaba、2026年3月全サイズ展開完了）: フラッグシップ397B MoEモデルがMMU-Pro 86.1% / GPQA Diamond 85.5%。9Bクラスでもコーディングベンチマーク首位。API価格（Qwen3.5 Plus）: 入力 $0.26 / 出力 $1.56 per 1M。
- **【未確認】DeepSeek V4**: 公式リリースなし。「V4 Lite」がウェブサイトに登場（2026-03-09）したが未検証。流出数値はHumanEval 90% / SWE-bench 83.7%とされるが第三者未確認。正式リリースは遅延継続中。
- **DeepSeek V3.2（参考）**: API価格 入力 $0.28 / 出力 $0.42 per 1M（キャッシュ時 $0.028）。
- ソース: [AI Magicx: Qwen 3.5](https://www.aimagicx.com/blog/qwen-3-5-vs-llama-vs-mistral-china-open-source-ai-2026) / [NxCode: DeepSeek V4](https://www.nxcode.io/resources/news/deepseek-v4-release-specs-benchmarks-2026)

### その他

- **arXiv新ベンチマーク（2026年3月）**: ARC-AGI-3（エージェント知能向け抽象推論）、FinMCP-Bench（金融問題解決LLM評価、613サンプル・10シナリオ）、GAMEPLAYQA（マルチモーダルLLMの3D仮想環境推論評価）が公開。
- ソース: [arXiv cs.AI 2026年3月](https://arxiv.org/list/cs.AI/current)

---

## 2. AIエージェント・開発ツール動向

- **Google Colab MCPサーバー公開（2026-03-17）**: OSSとして公開。MCP互換エージェントからGoogle Colabに直接アクセス可能になり、ローカルワークフローとクラウド環境を接続。 ([Google Developers Blog](https://developers.googleblog.com/announcing-the-colab-mcp-server-connect-any-ai-agent-to-google-colab/))

- **MCP TypeScript SDK v1.27.1**: 認証統合・セッション管理・ストリーミングツールレスポンスが本番対応。Python SDK v1.26も最新安定版リリース済み。 ([MCP Blog: 2026 Roadmap](http://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/))

- **Cursor Composer 2**: 独自コーディングモデルをリリース（3月）。同等性能モデル比約4倍の生成速度。IntelliJ / PyCharm / WebStorm向けプラグインも追加。30以上のマーケットプレイス統合（Atlassian・Datadog・GitLab等）。 ([DEV Community](https://dev.to/pockit_tools/cursor-vs-windsurf-vs-claude-code-in-2026-the-honest-comparison-after-using-all-three-3gof))

- **GitHub Copilot 自律PR機能（3月正式ローンチ）**: IssueからブランチPR作成・コード実装・テスト実行まで自律的に完結。Jira統合も正式ローンチ。

- **Windsurf Wave 13（3月）**: Arena Mode（ブラインドモデル比較）、Plan Mode、並列マルチエージェントセッションを追加。料金体系を固定クォータ制（$20/$40/$200/月）へ移行。 ([Digital Applied](https://www.digitalapplied.com/blog/windsurf-pricing-march-2026-credits-quotas-tier-guide))

- **Claude Code**: Agent Teams（マルチエージェント協調）+ MCPサーバー統合 + カスタムフック機能を出荷（2月〜3月）。Claude 4.6 Opusコンテキストウィンドウを1Mトークンに拡張（ベータ）。 ([TechCrunch](https://techcrunch.com/2026/03/24/anthropic-hands-claude-code-more-control-but-keeps-it-on-a-leash/))

- **Google Gemini Code Assist 個人向け完全無料化**: 3月に個人開発者向けを完全無料化。インフラコード生成・Cloud Run・BigQueryクエリ生成に強み。

- **Microsoft Agent Framework（GA近接）**: AutoGen + Semantic Kernelを統合したフレームワーク。1.0 GAをQ1 2026にリリース予定（現在進行中）。 ([Apify Blog](https://use-apify.com/blog/ai-agent-frameworks-2026-langgraph-autogen-crewai))

- **Hacker News「Show HN」注目**: oh-my-claudecode（TypeScript、Teams-first マルチエージェントオーケストレーション、+1,402 stars）、AgentMeet（Google Meet型AIエージェントグループチャットAPI）などが注目を集めた。

---

## 3. AI政策・規制

### 日本

- **AI推進法（人工知能の適正かつ安全な利用の推進に関する法律）**: 2025年9月1日全面施行済み。罰則なし・「名指し公表」方式のソフトロー。AI開発者・提供者・利用者の3区分に責務設定。3月27〜28日時点での新たな立法動向なし。 ([FPF](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/))
- **個人情報保護委員会（2026-01-09）**: APPI改正方針を公表。初の行政制裁金導入を提案。
- **JIPDEC**: 2026年内に「AIガバナンスマーク」制度を開始予定（現在準備中）。
- **NICT・総務省**: 生成AIの信頼性・安全性を評価するAI基盤システムの開発を2026年から正式開始。 ([KPMG Japan](https://kpmg.com/jp/ja/insights/2026/02/2025secondhalf-world-ai-regulation.html))

### 海外

- **【EU】デジタルオムニバスによるAI Act改正 — 欧州議会が承認（2026-03-26）**: EU理事会が3月13日に交渉マンデートに合意、3月26日に欧州議会が承認。高リスクAIシステムの適用期限が延長される見通し（スタンドアロン型: 2027年12月2日 / 製品組込み型: 2028年8月2日）。 ([EU Council 2026-03-13](https://www.consilium.europa.eu/en/press/press-releases/2026/03/13/council-agrees-position-to-streamline-rules-on-artificial-intelligence/) / [Gaming Tech Law](https://www.gamingtechlaw.com/2026/03/eu-ai-act-update-parliament-approves-digital-omnibus-changes/))
- **【EU】GPAI透明性義務の執行開始（2026年3月）**: 汎用AIモデルプロバイダーへの透明性・技術文書義務の執行が実質開始。ただし27加盟国のうち8か国のみが単一連絡先を指定済みで体制整備は遅れ。 ([EPRS 2026-03-18](https://epthinktank.eu/2026/03/18/enforcement-of-the-ai-act/))
- **【EU】AI Literacy義務（Article 4）ガイダンス草案**: AIシステムを展開するスタッフへのAIリテラシー義務の実施方法ガイダンス草案を公開。2026年5月まで意見募集中。 ([Digital Applied](https://www.digitalapplied.com/blog/ai-compliance-checklist-march-2026-what-changed-month))
- **【米国】ホワイトハウス「国家AI政策フレームワーク」公表（2026-03-20）**: 連邦政府統一的AI立法アプローチを議会に勧告。新たな中央集権的AI規制機関は設置しない方針。既存のセクター規制当局を活用。連邦法による州法プリエンプションを支持しつつ児童保護・消費者保護の州権限は維持。 ([WilmerHale 2026-03-23](https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20260323-white-house-releases-national-policy-framework-for-artificial-intelligence) / [原文PDF](https://www.whitehouse.gov/wp-content/uploads/2026/03/03.20.26-National-Policy-Framework-for-Artificial-Intelligence-Legislative-Recommendations.pdf))
- **【中国】改正サイバーセキュリティ法（2026-01-01施行済み）**: AIガバナンスをスコープに組み込み。制裁金を最大5,000万元または前年度売上5%に引き上げ。 ([IAPP](https://iapp.org/news/a/notes-from-the-asia-pacific-region-strong-start-to-2026-for-china-s-data-ai-governance-landscape))
- **【中国】越境データ処理国家安全基準（2026-03-01施行）**: AIモデルの学習データを含む越境データ処理の安全基準を規定。 ([Rockbird Media](https://www.rockbirdmedia.com/post/china-s-new-data-frontier-how-2026-rules-will-reshape-the-ai-race))
- **【中国】CAC「AI人型インタラクティブサービス管理暫定措置」草案**: AIコンパニオン・チャットボットの感情インタラクションを規制。依存度モニタリング・介入措置の義務化を提案。パブコメ完了、正式施行時期は未定。 ([China Law Translate](https://www.chinalawtranslate.com/en/chatbot-measures-draft/))

---

## 4. 注目の発言・ポジション

### Anthropic（2026-03-27）

> 「我々は現在、Mythosと呼ばれる新しいモデルをテストしている。これは私たちが構築した中で最もパワフルなモデルだ」（Anthropic 内部文書より、リーク）

**文脈**: CMS設定ミスによる内部ドラフト流出。Anthropicは存在を認め「テスト段階」と確認したが、「前例のないサイバーセキュリティリスク」を理由に正式リリースを留保していることを明言。Opusを超える新モデルティアの存在が公式に認知された初のケース。 ([Fortune](https://fortune.com/2026/03/26/anthropic-says-testing-mythos-powerful-new-ai-model-after-data-leak-reveals-its-existence-step-change-in-capabilities/))

---

本日特記すべき個人の発言（Sam Altman / Jensen Huang / Karpathy 等）については確認できた重要発言なし。

---

## 5. GitHub Trending

取得日時: 2026-03-28（daily）
ソース: [https://github.com/trending?since=daily](https://github.com/trending?since=daily)

### AI/ML関連
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | +2,824 | Python | Reddit / X / YouTube / HN / Polymarket / Webを横断してトピックをリサーチするAIエージェントスキル |
| 2 | [hacksider/Deep-Live-Cam](https://github.com/hacksider/Deep-Live-Cam) | +1,546 | Python | 単一画像だけでリアルタイム顔スワップ・ワンクリック動画ディープフェイク |
| 3 | [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) | +1,402 | TypeScript | Teams-firstのマルチエージェントオーケストレーション（Claude Code向け） |
| 4 | [Vaibhavs10/insanely-fast-whisper](https://github.com/Vaibhavs10/insanely-fast-whisper) | +1,075 | Jupyter Notebook | 高速音声→テキスト変換ツール（Whisperベース） |
| 5 | [datalab-to/chandra](https://github.com/datalab-to/chandra) | +913 | Python | 複雑な表・フォーム・手書きを含むドキュメント向けOCRモデル（レイアウト完全対応） |
| 6 | [onyx-dot-app/onyx](https://github.com/onyx-dot-app/onyx) | +512 | Python | オープンソースAIプラットフォーム。全LLM対応の高機能AIチャット |
| 7 | [microsoft/VibeVoice](https://github.com/microsoft/VibeVoice) | +320 | Python | Microsoft製オープンソース フロンティア音声AI |
| 8 | [SakanaAI/AI-Scientist-v2](https://github.com/SakanaAI/AI-Scientist-v2) | +125 | Python | エージェント型ツリーサーチによるワークショップレベルの自動科学的発見システム |

### その他注目
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | [obra/superpowers](https://github.com/obra/superpowers) | +2,797 | Shell | エージェント型スキルフレームワーク & ソフトウェア開発方法論 |
| 2 | [virattt/dexter](https://github.com/virattt/dexter) | +673 | TypeScript | 深い金融リサーチのための自律エージェント |
| 3 | [twentyhq/twenty](https://github.com/twentyhq/twenty) | +661 | TypeScript | コミュニティ主導のSalesforce代替CRM（モダン設計） |
| 4 | [FreeCAD/FreeCAD](https://github.com/FreeCAD/FreeCAD) | +173 | C++ | 無償・オープンソースのマルチプラットフォーム3Dパラメトリックモデラー |

---
*このレポートはClaude Codeにより自動生成されています。*
*ソースの正確性は可能な限り検証していますが、速報性を優先しているため誤りを含む可能性があります。*
