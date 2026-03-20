# リサーチ結果

generated_at: 2026-03-18
source: memo.md

---

## 競合サービス

### Dify (LangGenius)
- URL: https://dify.ai
- 概要: オープンソースのLLMアプリ・エージェントワークフロービルダー。RAG・プラグイン・視覚的ワークフロー編集を統合
- ターゲット: 非エンジニアからプロ開発者まで。中小〜大企業向け商用版あり
- 価格帯: OSS無料（セルフホスト）/ SaaS月$59〜 / Enterprise要問い合わせ
- 強み:
  - GitHub 131,000スター（2026年3月時点）。GitHub全体で51位
  - 1.4M台以上のマシンにデプロイ実績
  - 280社以上のエンタープライズ商用顧客（Maersk・ETS・Novartis・Panasonic・RICOHなど）
  - 2026年3月に$30M Series Pre-A調達（バリュエーション$180M）。HSG/GL Ventures/Mizuho Leaguer Investment参加
  - v1.0以降のプラグインエコシステムで拡張性が大幅向上
  - MCP（Model Context Protocol）対応でAPI/DB外部接続が標準化
  - マルチモーダルKBで画像+テキストの統合RAGに対応（2025夏）
  - Human-in-the-Loop対応（v1.13.0）
  - 日本市場にも積極展開：IF Con Tokyo 2025開催・AWS Summit Japan 2025スポンサー・日本Dify協会設立
- 弱み:
  - 中国拠点のR&D：米国・EU企業のデータセキュリティ懸念（セルフホストで軽減可）
  - 高トラフィック時のスケーラビリティボトルネック報告
  - ファインチューニング機能なし（プロンプトエンジニアリング・RAG特化）
  - 専門ドメイン文書のRAG検索精度が低いという報告
  - エンタープライズ向けドキュメント・サポート体制がまだ発展途上
- 参考になる点:
  - OSS→Enterprise tier への段階的マネタイズモデル
  - 日本市場での協会・コミュニティ形成戦略
  - LangChainをcodebaseから削除し独自エンジン化した判断（スピード重視）

---

### n8n
- URL: https://n8n.io
- 概要: フェアコードOSSのワークフロー自動化プラットフォーム。AI Agentノードを追加しLLMワークフローにも対応
- ターゲット: IT部門・エンジニア・エンタープライズのオートメーション担当
- 価格帯: OSS無料 / Cloud月$20〜 / Enterprise要問い合わせ（平均$13,300/社/年）
- 強み:
  - $40M ARR達成（2025年）。YoY 10倍成長
  - $180M Series C調達（2025年10月）。バリュエーション$2.5B。Accel / Nvidia NVentures参加
  - 3,000社超のエンタープライズ顧客（Vodafone・Microsoft・KPMG・Volkswagen・Decathlon）
  - 400以上のネイティブ統合。SSO/SAML・Kubernetes対応のEnterprise版あり
  - Difyが「脳（LLM推論）」なら、n8nは「神経系（接続・スケジューリング）」として補完的利用が増加
- 弱み:
  - AIネイティブではなくオートメーションツールが起点
  - LLMアプリ構築においてDifyより学習コストが高い
- 参考になる点:
  - エンタープライズにおけるDify+n8n の組み合わせ利用が標準パターンになりつつある

---

### Langflow (DataStax傘下)
- URL: https://www.langflow.org
- 概要: LangChainベースのビジュアルフローエディタ。DataStaxに買収され財務基盤が強化された
- ターゲット: データエンジニア・機械学習エンジニア
- 価格帯: OSS無料 / DataStax管理クラウド版あり
- 強み:
  - GitHub 42,000スター（2025年初頭）
  - DataStax買収によりAstra DB（ベクターDB）との統合が深い
  - 3社の中で財務的安定性が最も高いとの評価
- 弱み:
  - 非エンジニアには使いにくい
  - Difyと比べてエンタープライズ顧客実績が少ない
- 参考になる点:
  - ベクターDB企業によるLLMフローツール買収という垂直統合モデル

---

### Microsoft Copilot Studio
- URL: https://www.microsoft.com/ja-jp/microsoft-copilot/microsoft-copilot-studio
- 概要: Microsoft 365/Power Platform統合のローコードAIエージェントビルダー
- ターゲット: Microsoft 365利用企業のIT部門・業務部門
- 価格帯: $200/テナント/月〜（メッセージ従量制）
- 強み:
  - Teams・SharePoint・Dynamics・Power Automateとのネイティブ統合
  - Azure OpenAI Serviceとのシームレス連携
  - エンタープライズセキュリティ・コンプライアンス（ISO/SOC2/GDPR対応済）
  - Build 2025でマルチエージェントオーケストレーション・UIオートメーション追加
- 弱み:
  - Microsoft365環境外での活用が限定的
  - ベンダーロックインが強い
  - OSSと比較してコストが高い
- 参考になる点:
  - 「既存クラウドスタックへの統合」が導入決定の最大要因という事実

---

### Vertex AI Agent Builder (Google Cloud)
- URL: https://cloud.google.com/products/agent-builder
- 概要: Google CloudのマネージドAIエージェント構築プラットフォーム
- ターゲット: GCPを利用する中大企業のAI開発チーム
- 価格帯: 従量課金（GCP利用料に加算）
- 強み:
  - GeminiモデルとのネイティブAPI統合
  - Google検索・BigQuery・Workspaceとの接続性
  - GCPのセキュリティ・コンプライアンス基盤をそのまま利用可能
- 弱み:
  - GCPロックイン
  - ローコードUIは競合比で機能が限定的
- 参考になる点:
  - クラウドハイパースケーラーが同領域に参入しているリスクを示す事例

---

### Stack AI
- URL: https://www.stackai.com
- 概要: エンタープライズ向けビジュアルAIワークフロービルダー。ガバナンス・セキュリティ機能に注力
- ターゲット: 医療・金融・法律など規制業界のエンタープライズ
- 価格帯: 無料Tier〜 / Enterprise要問い合わせ
- 強み:
  - SOC2・HIPAA対応など高度なセキュリティ認定
  - 内部データソース（Box・Sharepoint・Salesforce等）との統合
  - 「ガバナンス重視エンタープライズ」向けポジショニングが明確
- 弱み:
  - 知名度がDify/n8nと比べて低い
  - OSSコミュニティがない
- 参考になる点:
  - セキュリティ・コンプライアンスを差別化軸にしたエンタープライズ特化戦略

---

### Flowise
- URL: https://flowiseai.com
- 概要: OSSのLLMフロービルダー。ドラッグ&ドロップでベクターDB・LLM・ツールを結線
- ターゲット: 開発者・小〜中規模チーム
- 価格帯: OSS無料 / Cloudあり
- 強み:
  - GitHub 30,000スター
  - プロトタイピングが非常に速い
  - If/Elseの基本ロジックは対応
- 弱み:
  - ロジックコントロール機能が最も限定的（3社比較）
  - エンタープライズ向けの管理・監視機能が不足
- 参考になる点:
  - 「開発者の素早いプロトタイピング」需要は根強い

---

## 市場規模・トレンド

### TAM / SAM / SOM 推定

#### TAM（Total Addressable Market）

| セグメント | 規模（2025）| CAGR | 到達規模（2030前後） | ソース |
|---|---|---|---|---|
| ノーコードAIプラットフォーム | $6.56B（2025） | 31.1% | $75.1B（2034） | Fortune Business Insights |
| ノーコード開発プラットフォーム全体 | 〜$30B（2024） | 24.9% | $86.6B（2029） | Business Research Co. |
| ローコード開発プラットフォーム | $37.4B（2025） | 29.1% | $376.9B（2034） | GM Insights |
| ワークフロー自動化市場 | $23.8B（2025） | 9.4% | $40.8B（2031） | Mordor Intelligence |
| AIエージェント市場 | $7.6B（2025） | — | $50B超（2030） | 複数ソース |

**日本市場（SAM指標）**
- ローコード/ノーコードプラットフォーム日本市場: 2023年度3,144億円 → 2025年度4,085億円見込み（デロイト トーマツ ミック経済研究所）
- 別調査: 2024年1,010億円 → 2026年1,330億円予測（年率15%以上）

#### SAM（Serviceable Addressable Market）
- 日本のエンタープライズ向けAIワークフロー基盤市場: 2026年時点で推定300〜500億円
- 対象: 従業員1,000名以上の日本企業（約4,000社）×AIワークフロー導入率10〜15%×年間300〜500万円のライセンス

#### SOM（Serviceable Obtainable Market）
- 3年以内に現実的に獲得可能な市場: 10〜30億円
- 前提: 大手SIerとのパートナー経由で50〜100社への展開

### 主要トレンド

1. **「PoC→本番」移行が最重要テーマ（2025〜2026）**
   - Difyが日本でIF Con Tokyo開催した目的も「PoC to Scale」の加速
   - エンタープライズはPoC乱立から本番化への選別フェーズへ移行

2. **Dify + n8n の組み合わせが業界標準パターン化**
   - Dify（LLM推論・エージェント）+ n8n（接続・スケジューリング・外部連携）の二層構造

3. **「ビジュアルプログラミング vs Vibe Coding」論争**
   - Kenneth Auchenberg（元Microsoft・Stripe）が2025年4月に「No Code is Dead. Long live Vibe Coding.」を発表
   - 主張: ノーコードは10年間メインストリームになれず。Bolt/Lovable/v0のようなプロンプト→コード生成ツールが代替する
   - 反論: 企業の80%がローコードを利用。技術者でない業務担当者には依然としてGUIが必要
   - 業界コンセンサス: 「死」ではなく「進化」。ビジュアルビルダーはLLMネイティブ機能を取り込み変容する

4. **エンタープライズの選定基準シフト**
   - 2024まで: 「LLMモデルの性能」「操作の簡単さ」
   - 2025〜: 「セキュリティ・コンプライアンス」「既存クラウドスタックへの統合」「本番安定性・SLA」

5. **AIエージェント市場の急拡大がワークフロービルダー需要を牽引**
   - AI対応ワークフローは2025年末までに企業プロセスの3%→25%へ8倍成長との予測（Salesforce/Gartner）

---

## 技術的な実現手段

### オープンソース活用
- **Dify** (Apache 2.0) - フォーク可能。エンタープライズ版独自機能の上乗せ戦略が現実的
- **n8n** (Fair-code/Sustainable Use License) - 商用利用には注意が必要
- **Langflow** (MIT) - DataStax管理だがOSS継続
- **LangChain / LlamaIndex** - コードベースのLLMオーケストレーション

### エンタープライズ差別化技術
- **RAG精度向上**: BM25 + ベクター検索ハイブリッド、リランキングモデル（Cohere Rerank等）
- **ガバナンス/監査**: LLM呼び出しログ、PII自動マスキング、RBAC
- **MCP（Model Context Protocol）**: Anthropic提唱。外部API・DB接続の標準化プロトコル（2025〜普及）
- **Human-in-the-Loop**: 承認フロー組み込み（Dify v1.13.0で対応済）
- **オンプレ/プライベートクラウド対応**: 日本金融・官公庁向けに必須

### 日本特有の技術要件
- Azure OpenAI / Amazon Bedrock ネイティブ統合（日本エンタープライズの主流クラウド）
- 日本語RAGの精度最適化（チャンキング・トークナイザー設定）
- 閉域網・VPC内完結アーキテクチャ

---

## 参考リンク

- [Dify Raises $30M Series Pre-A - VentureBeat](https://venturebeat.com/business/dify-raises-30-million-series-pre-a-to-power-enterprise-grade-agentic-workflows) - 2026年3月資金調達発表
- [2025 Dify Summer Highlights - Dify Blog](https://dify.ai/blog/2025-dify-summer-highlights) - v1.7〜1.8の新機能詳細
- [n8n raises $180M Series C - n8n Blog](https://blog.n8n.io/series-c/) - n8nのバリュエーション$2.5B達成
- [No code is dead. Long live vibe coding. - Kenneth Auchenberg](https://kenneth.io/post/no-code-is-dead-long-live-vibe-coding) - ノーコード死亡宣言（2025年4月）
- [RIP Low-Code 2014-2025 - Hacker News](https://news.ycombinator.com/item?id=46767440) - HN上の業界議論（2026年）
- [No-Code AI Platform Market - Fortune Business Insights](https://www.fortunebusinessinsights.com/no-code-ai-platform-market-110382) - 市場規模データ（CAGR 31%）
- [日本ローコード/ノーコード市場動向2025 - デロイト トーマツ ミック経済研究所](https://mic-r.co.jp/mr/03480/) - 日本市場データ
- [Dify vs n8n comparison - Medium](https://medium.com/generative-ai-revolution-ai-native-transformation/dify-vs-n8n-which-platform-should-power-your-ai-automation-stack-in-2025-e6d971f313a5) - 詳細比較
- [Top 7 Open-Source AI Low/No-Code Tools 2025](https://htdocs.dev/posts/top-7-open-source-ai-lowno-code-tools-in-2025-a-comprehensive-analysis-of-leading-platforms/) - OSSツール総合比較
- [The Ultimate Guide: Code vs No-Code Agentic AI - Medium](https://medium.com/@pranavnairop090/the-ultimate-guide-to-agentic-ai-frameworks-in-2025-code-vs-no-code-showdown-542a8570eb8e) - コード vs ノーコードの詳細分析
