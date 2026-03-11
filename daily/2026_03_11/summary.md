# Daily AI Briefing — 2026-03-11

generated_at: 2026-03-11 08:00 JST

---

## 1. フロンティアモデル更新

### OpenAI
- オープンソースモデル **gpt-oss-120b**（120B）および軽量版 **20b** を公開。120b は o3/o4-mini に迫る性能でシングル GPU で動作。20b はハイエンドコンシューマー向けラップトップでローカル実行可能。（ソース: [llm-stats.com](https://llm-stats.com/ai-news)）

### Anthropic
- **Claude 5** は2026年初頭（2〜3月）リリース予定（未確認）。持続的推論の効率化・複数システムのオーケストレーション・週単位のプロジェクト管理を想定。正式リリース未発表。（ソース: [MIT Technology Review](https://www.technologyreview.com/2026/01/05/1130662/whats-next-for-ai-in-2026/)）

### Google DeepMind
- **Gemini 3 Flash** をGoogle検索でグローバルロールアウト中。フロンティア級モデルのスピード最適化版。
- **Genie 3**（基盤世界モデル）を発表。テキスト入力からインタラクティブな3D環境をリアルタイム生成、720p/24fpsで数分間の出力が可能。（ソース: [llm-stats.com](https://llm-stats.com/llm-updates)）

### Meta AI
- 特記事項なし（Llama は中国勢にオープンソース市場シェアで逆転されたとの報道あり）

### 中国AI勢
- **DeepSeek V4**: 1Mトークン対応マルチモーダル推論、$0.14/Mインプットトークン（GPT-5の約1/20コスト）。HuaweiのAscend・Cambricon チップ向けに最適化。Nvidia/AMD への早期アクセスは提供しない方針。（ソース: [particula.tech](https://particula.tech/blog/deepseek-v4-qwen-open-source-ai-disruption)）
- **Alibaba Qwen 3.5**: 397B MoEモデルをApache 2.0で公開。256Kネイティブコンテキスト、201言語対応、ビジョン機能搭載。数学ビジョンベンチマークでGPT-5.2を上回ると主張。DeepSeek・Qwen 両社の合算グローバル市場シェアは約15%（1年前は1%）。（ソース: [Bloomberg](https://www.bloomberg.com/news/articles/2026-02-16/alibaba-unveils-major-ai-model-upgrade-ahead-of-deepseek-release), [SCMP](https://www.scmp.com/tech/big-tech/article/3296737/alibaba-launches-new-ai-model-targeting-rival-deepseek-chinas-hottest-start)）

### その他
- 特記事項なし

---

## 2. AIエージェント・開発ツール動向

- **Datadog MCP Server GA**（2026-03-09）: ライブオブザーバビリティデータへのアクセスを提供するMCPサーバーが正式GA。AIコーディングエージェントからリアルタイムテレメトリを参照しデバッグ可能。セキュリティ・ガバナンス制御下で動作。（ソース: [HPCwire/BigDATAwire](https://www.hpcwire.com/bigdatawire/this-just-in/datadog-releases-mcp-server-to-connect-ai-agents-with-live-observability-data/)）
- **Google MCP Servers**（2026-03-06〜09）: フルマネージドリモートGoogle MCPサーバー群のリソースとCodelab「Getting Started with Google MCP Servers」を公開。AIエージェントがGoogleツールへ直接接続できる統一インタフェースを整備。（ソース: [TechCrunch](https://techcrunch.com/2025/12/10/google-is-going-all-in-on-mcp-servers-agent-ready-by-design/), [InfoQ](https://www.infoq.com/news/2026/02/google-documentation-ai-agents/)）
- GitHub Trendingにエージェント系リポジトリが多数ランクイン（Section 5参照）。`openclaw/openclaw`（+9,080★）、`msitarzewski/agency-agents`（+6,223★）、`bytedance/deer-flow`（+1,413★）が上位。

---

## 3. AI政策・規制

### 日本
- **AI振興法**（2025年5月28日成立、同年6月4日施行）: イノベーション優先の軽規制モデル。AI戦略本部の初会合は2025年9月13日。企業に政府安全策への協力を促し、人権侵害に用いた企業名を公表できる仕組みを整備。EUのような横断規制は採用せず。（ソース: [FPF Blog](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/)）
- **政府AI「源内（ゲンナイ）」**: 2026年5月から政府全組織の10万人以上の官僚に展開予定（2026年1月に限定試験開始済み）。（ソース: [Unified AI Hub](https://www.unifiedaihub.com/blog/current-state-of-ai-regulation-in-2026)）

### 海外
- **EU AI Act**: 高リスクAI（医療・雇用・教育・司法等）への厳格規制が2026年8月に全面施行。違反の罰金は€3,500万または全世界年間売上高の7%のいずれか高い方。欧州委員会はDigital Omnibusでコンプライアンス当局の指定遅延・基準未整備を認め、高リスクAI規定の施行延期を提案。（ソース: [GDPR Local](https://gdprlocal.com/ai-regulations-around-the-world/)）
- **米国**: 「America's AI Action Plan」でAI覇権確立を国家安全保障の最重要課題と位置付け、規制緩和を推進。日米ともにリスクベースのセクター別規制アプローチで方向性一致。（ソース: [Hogan Lovells](https://www.hoganlovells.com/en/publications/post-election-japan-ai-policy-regulatoryoperational-updates)）

---

## 4. 注目の発言・ポジション

### Dario Amodei（2026-03-04〜06）
> 「OpenAIのメッセージングは『まっかな嘘（straight up lies）』だ。これが彼らの本当の姿だ」（ソース: [TechCrunch](https://techcrunch.com/2026/03/04/anthropic-ceo-dario-amodei-calls-openais-messaging-around-military-deal-straight-up-lies-report-says/)）

**文脈**: PentagonへのAI供給契約をめぐりOpenAIが合意、AnthropicはサプライチェーンリスクとしてPentagonから排除された。Anthropicは「完全自律型兵器への利用禁止」と「大規模国内監視への利用禁止」を契約条件として主張していた。Amodeiは後に社内メモの「トーン」について謝罪したが、主張の内容は撤回していない。（ソース: [Fortune](https://fortune.com/2026/03/05/anthropic-openai-feud-pentagon-dispute-ai-safety-dilemma-personalities/), [Fortune](https://fortune.com/2026/03/06/anthropic-openai-ceo-apologizes-leaked-memo-supply-chain-risk-designation/)）

---

### Sam Altman（2026-03-04）
> AnthropicのSuperBowlキャンペーンを「明らかに不誠実」「ダブルスピーク」と批判。

**文脈**: Pentagon契約をめぐるAnthropicとの泥試合の一環。AI安全性のブランディングと実際の軍事利用方針の矛盾が両社間の対立軸となっており、業界全体の「AIセーフティ」定義争いを象徴する発言。（ソース: [Fortune](https://fortune.com/2026/03/04/sam-altman-jensen-huang-only-themselves-to-blame-ai-scare/)）

---

### Jensen Huang（2026-03-04）
> 「NvidiaのOpenAIおよびAnthropicへの投資は、今後は行わない可能性が高い。両社が今年中に上場すれば投資機会が閉じる」（Morgan Stanley TMTカンファレンスにて）

**文脈**: Nvidiaは戦略的出資者から「チップ納入業者」へとポジションを明確化。OpenAI・Anthropicの株式公開が迫る中でのリポジショニングと見られるが、説明が不十分とTechCrunchは批判。（ソース: [TechCrunch](https://techcrunch.com/2026/03/04/jensen-huang-says-nvidia-is-pulling-back-from-openai-and-anthropic-but-his-explanation-raises-more-questions-than-it-answers/)）

---

## 5. GitHub Trending

### AI/ML関連
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | openclaw/openclaw | +9,080 | TypeScript | マルチプラットフォーム対応の個人向けAIアシスタント |
| 2 | msitarzewski/agency-agents | +6,223 | Shell | 専門エージェント群からなるAIエージェンシーフレームワーク |
| 3 | 666ghj/MiroFish | +4,504 | Python | 予測モデリング向けユニバーサル群知能エンジン |
| 4 | bytedance/deer-flow | +1,413 | Python | ByteDance製エージェントフレームワーク（調査・コーディング・コンテンツ生成） |
| 5 | obra/superpowers | +1,387 | Shell | エージェント型スキルフレームワーク＆ソフトウェア開発方法論 |
| 6 | alibaba/page-agent | +891 | TypeScript | 自然言語でWebインタフェースを操作するエージェント（Alibaba製） |
| 7 | NousResearch/hermes-agent | +781 | Python | ユーザーニーズに応じて自己進化する適応型エージェントフレームワーク |
| 8 | karpathy/nanochat | +705 | Python | Andrej Karpathy製のコスト効率型ChatGPT実装 |
| 9 | promptfoo/promptfoo | +661 | TypeScript | プロンプト・エージェント・RAGシステムのテスト・評価プラットフォーム |
| 10 | GoogleCloudPlatform/generative-ai | +530 | Jupyter | Google Cloud上でGeminiを使う公式サンプル集 |
| 11 | virattt/ai-hedge-fund | +300 | Python | 金融分析・戦略立案のための協調型AIチーム |

### その他注目
| # | リポジトリ | ★増分 | 言語 | 概要 |
|---|-----------|-------|------|------|
| 1 | pbakaus/impeccable | +939 | JavaScript | AIツールインタフェース向けデザイン言語フレームワーク |
| 2 | sepinf-inc/IPED | +273 | Java | 押収証拠のデジタルフォレンジック処理・分析ツール |

**補足**: `openclaw/openclaw`は本日+9,080★で断トツ首位。AIエージェント系リポジトリが上位11件中9件を占め、エージェント・フレームワーク競争の過熱ぶりが如実に表れている。`karpathy/nanochat`はAndrej Karpathy本人の新作リポジトリとして注目度が高い。

---

*このレポートはClaude Codeにより自動生成されています。*
*ソースの正確性は可能な限り検証していますが、速報性を優先しているため誤りを含む可能性があります。*
