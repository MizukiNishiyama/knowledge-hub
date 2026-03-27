# フロンティアモデル検索結果 — 2026-03-27〜28

generated_at: 2026-03-28 JST
search_period: 2026-03-27〜28

---

## 1. OpenAI

### GPT-5.4 シリーズ
- **リリース日**: 2026-03-05
- **バリアント**: GPT-5.4 / GPT-5.4 Thinking / GPT-5.4 Pro / GPT-5.4 mini
- **コンテキストウィンドウ**: 最大1Mトークン
- **主要ベンチマーク**:
  - BigLaw Bench（法律文書分析）: 91%
  - 専門職作業ベンチマーク（GDPval系）: 83%
  - 単一クレーム誤り: GPT-5.2比 33%減
  - ツールヘビーワークフローのトークンコスト: ツール検索機構により47%削減
- **API価格（GPT-5.4）**:
  - 入力: $2.50 / 1Mトークン
  - 出力: $20.00 / 1Mトークン
- **その他**: GPT-5.3-Codex（コーディング特化エージェントモデル）も同時期リリース。GPT-5.4比で約25%高速
- **2026-03-27〜28特記事項**: 新リリースアナウンスなし
- **ソース**: [TechCrunch](https://techcrunch.com/2026/03/05/openai-launches-gpt-5-4-with-pro-and-thinking-versions/) / [OpenAI Academy](https://academy.openai.com/public/resources/latest-model) / [OpenAI Pricing](https://openai.com/api/pricing/) / [TLDL](https://www.tldl.io/resources/openai-api-pricing)

---

## 2. Anthropic (Claude)

### Claude Sonnet 4.6
- **リリース日**: 2026年3月（具体日は前日Briefing参照）
- **主要ベンチマーク**:
  - SWE-bench Verified: 79.6%（Sonnet 4.5比改善）
  - Terminal-Bench 2.0: 59.1%
  - OSWorld-Verified: 72.5%
- **コンテキストウィンドウ**: 1Mトークン（ベータ）
- **API価格**:
  - 入力: $3.00 / 1Mトークン
  - 出力: $15.00 / 1Mトークン
  - プロンプトキャッシュ + バッチAPIで最大95%コスト削減可能

### Claude Haiku 4.5
- **リリース日**: 2026年3月
- **特徴**: 最速・最小コスト。リアルタイム用途向け
- **API価格**:
  - 入力: $1.00 / 1Mトークン
  - 出力: $5.00 / 1Mトークン
  - Sonnet 4.6比 67%安

### 【速報】Claude Mythos（コードネーム: Capybara）リーク
- **発覚日**: 2026-03-27（Anthropic側のCMS設定ミスで公開状態に）
- **内容**:
  - 内部名称候補: "Mythos"（v1ドラフト）または "Capybara"（v2ドラフト）
  - 「これまでで最もパワフルなAIモデル」と内部文書が記述
  - Claude Opus 4.6比で「劇的に高いスコア」（コーディング・学術推論・サイバーセキュリティ）
  - Opusを超える新たなモデルティアとして位置づけ（さらに高価格）
  - **懸念**: サイバーセキュリティリスクが「前例なく高い」と内部で警告。脆弱性の発見・悪用を急速に加速させる可能性
  - Anthropic公式コメント:「公開を検討していた初期ドラフトコンテンツ」
- **発見者**: Roy Paz（LayerX Security）、Alexandre Pauwels（University of Cambridge）
- **ソース**: [Fortune](https://fortune.com/2026/03/26/anthropic-says-testing-mythos-powerful-new-ai-model-after-data-leak-reveals-its-existence-step-change-in-capabilities/) / [The Decoder](https://the-decoder.com/anthropic-leak-reveals-new-model-claude-mythos-with-dramatically-higher-scores-on-tests-than-any-previous-model/) / [Futurism](https://futurism.com/artificial-intelligence/anthropic-step-change-new-model-claude-mythos)

### Claude Code
- **2026-03-24**: Claude Codeへの権限拡大（TechCrunchが報道）。Auto Modeのリサーチプレビュー継続中
- **ソース**: [TechCrunch](https://techcrunch.com/2026/03/24/anthropic-hands-claude-code-more-control-but-keeps-it-on-a-leash/)

---

## 3. Google DeepMind (Gemini)

### Gemini 3 シリーズ
- **Gemini 3 Pro**:
  - リリース: 2026年3月（プレビュー）
  - Gemini 2.5 Pro比 解決ベンチマークタスク数で50%以上改善
  - MMLU-Pro: 89.8%
  - ARC-AGI-2: 77.1%（Gemini 3.1 Pro）
  - API価格: $2 / $12 per 1Mトークン（入力/出力）

- **Gemini 3 Flash**:
  - 特徴: 低レイテンシ・低コスト版フロンティア
  - MMLU-Pro: 89.0%
  - API価格: $0.50 / $3.00 per 1Mトークン（入力/出力）

- **Gemini 3.1 Flash Live**:
  - リリース: 2026-03-26（プレビュー）
  - リアルタイム音声・視覚エージェント向けLive API
  - 関数呼び出し・多言語・長時間セッション対応

- **Gemini 3.1 Flash Lite**:
  - リリース: 2026-03-03
  - 価格: $0.25 / $1.50 per 1Mトークン（入力/出力）

- **ソース**: [Google Blog (Gemini 3)](https://blog.google/products-and-platforms/products/gemini/gemini-3/) / [Google Blog (Flash Live)](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-3-1-flash-live/) / [OpenRouter](https://openrouter.ai/google/gemini-3-flash-preview) / [Artificial Analysis](https://artificialanalysis.ai/models/gemini-3-flash-reasoning)

---

## 4. オープンソース・中国系モデル

### Llama 4（Meta）
- **リリース日**: 2025年4月（モデル自体のリリース。2026年3月時点での最新評価データ）
- **モデル**: Llama 4 Scout / Llama 4 Maverick
- **アーキテクチャ**: ネイティブマルチモーダル（テキスト・画像・短動画）、MoE構造
- **コンテキストウィンドウ**: Llama 4 Scout は最大1,000万トークン
- **ベンチマーク（2026年3月評価時点）**:
  - Scout: MMLU-Pro 74.3% / GPQA Diamond 57.2%
  - Maverick: MMLU-Pro 80.5% / GPQA Diamond 69.8%
  - MaverickはGPT-5.3比1〜2ポイント差（推論系）、コード生成は同等以上
- **2026-03-27〜28特記事項**: Meta自体の新モデルリリースアナウンスなし
- **ソース**: [Meta AI Blog](https://ai.meta.com/blog/llama-4-multimodal-intelligence/) / [Hugging Face](https://huggingface.co/blog/llama4-release) / [llm-stats](https://llm-stats.com/models/compare/llama-4-maverick-vs-llama-4-scout)

### Qwen 3.5（Alibaba）
- **リリース日**: 2026年3月初旬（全パラメータサイズ展開完了）
- **パラメータサイズ**: 0.8B〜397B（MoE含む）
- **ベンチマーク**:
  - Qwen 3.5 7B: MMLU 76.8%（4分の1のパラメータ数で競合比3倍速）
  - Qwen 3.5-9B: HumanEval 7-9Bクラス首位
  - フラッグシップ: MMLU-Pro 86.1% / GPQA Diamond 85.5%
- **API価格（Qwen3.5 Plus）**:
  - 入力: $0.26 / 1Mトークン
  - 出力: $1.56 / 1Mトークン
- **ソース**: [AI Magicx](https://www.aimagicx.com/blog/qwen-3-5-vs-llama-vs-mistral-china-open-source-ai-2026) / [OpenRouter](https://openrouter.ai/qwen/qwen3.5-plus-02-15)

### DeepSeek V3.2
- **リリース日**: 2025-12-01（V3.2本体）
- **ベンチマーク**: Artificial Analysis Intelligence Index スコア 32（平均22を大幅上回る、GPT-5/Gemini 3.0 Pro相当）
- **API価格（DeepSeek V3.2）**:
  - 入力: $0.28 / 1Mトークン
  - 出力: $0.42 / 1Mトークン
  - キャッシュヒット時: $0.028 / 1Mトークン（90%割引）
- **2026-03-27〜28特記事項**: なし

### DeepSeek V4（未リリース）
- **現状**: 2026年3月時点で公式リリース未確認。複数の遅延を経て一部「V4 Lite」がウェブサイトに登場（2026-03-09）
- **リーク情報（未検証）**:
  - HumanEval 90%、SWE-bench Verified 83.7%（内部テスト値）
  - 1Mトークンコンテキスト、ネイティブマルチモーダル、MoE構造（アクティブ約32Bパラメータ）
  - Huawei Ascendチップ向け最適化
- **ソース**: [NxCode](https://www.nxcode.io/resources/news/deepseek-v4-release-specs-benchmarks-2026) / [Evolink AI](https://evolink.ai/blog/deepseek-v4-release-window-prep)

---

## 5. 主要ベンチマーク比較（2026年3月時点）

| モデル | SWE-bench | MMLU-Pro | ARC-AGI-2 | 入力価格/1M |
|---|---|---|---|---|
| GPT-5.4 | 77.2% | — | — | $2.50 |
| Claude Sonnet 4.6 | 79.6% | — | — | $3.00 |
| Claude Haiku 4.5 | — | — | — | $1.00 |
| Gemini 3.1 Pro | — | — | 77.1% | $2.00 |
| Gemini 3 Flash | — | 89.0% | — | $0.50 |
| Llama 4 Maverick | — | 80.5% | — | オープンソース |
| Qwen 3.5 (flagship) | — | 86.1% | — | $0.26 |
| DeepSeek V3.2 | — | — | — | $0.28 |

---

## 6. 新規公開ベンチマーク（arxiv / 2026年3月）

- **ARC-AGI-3**: エージェント知能向けインタラクティブベンチマーク。抽象的なターン制環境でエージェント能力を評価
- **FinMCP-Bench**: 実世界の金融問題解決能力を評価。613サンプル、10シナリオ・33サブシナリオ
- **GAMEPLAYQA**: マルチモーダルLLMの知覚・推論能力を3D仮想環境で評価

**ソース**: [arxiv cs.AI](https://arxiv.org/list/cs.AI/current) / [LM Council](https://lmcouncil.ai/benchmarks)

---

## 7. 2026-03-27〜28 最重要トピック

1. **Claude Mythos リーク（最重要）**: AnthropicのCMS設定ミスにより次世代最上位モデルの存在が流出。「Opusを超える新ティア」「サイバーセキュリティリスク前例なし」が市場に衝撃
2. **Gemini 3.1 Flash Live プレビュー開放**: リアルタイム音声エージェント開発が本格化
3. **DeepSeek V4 遅延継続**: 公式リリースなし。内部ベンチマーク数値は流出しているが第三者未検証
