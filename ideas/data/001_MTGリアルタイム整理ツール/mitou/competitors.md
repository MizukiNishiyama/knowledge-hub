# OSS競合調査 — リアルタイム会議構造化・マップ化

generated_at: 2026-03-07

## 調査結論

**会議音声をリアルタイムで「論点構造化」「マップ化」するOSSは、プロトタイプ・研究段階のものが2件存在するが、プロダクション品質のものは存在しない。**

既存のOSSは以下の3パターンに分類される。
1. **リアルタイム文字起こし + 会議後のAI要約**（Meetily、Hyprnote/Char、Pensieve等） — 最も成熟
2. **会議後の音声ファイルからの要約生成**（Ollama-Transcriber等） — レッドオーシャン
3. **会議中のリアルタイム構造化**（AI Meeting Board、MeetMap） — プロトタイプ/研究段階のみ

「会議中にリアルタイムで論点を構造化し、マップやツリーとして可視化する」**プロダクション品質のOSS**は空白地帯であり、本プロダクトの狙いどころと一致する。

---

## 主要OSS一覧

### 1. Meetily（最も成熟したOSS会議ツール）

| 項目 | 内容 |
|------|------|
| GitHub | [Zackriya-Solutions/meeting-minutes](https://github.com/Zackriya-Solutions/meeting-minutes) |
| Stars | 約9,900+ |
| ダウンロード | 88,000+ |
| ライセンス | MIT |
| 技術スタック | Tauri + Next.js / FastAPI / whisper.cpp / Ollama / SQLite + VectorDB |
| 対応OS | macOS、Windows |
| リアルタイム性 | **文字起こしはリアルタイム**。要約は会議後にローカルLLMで生成 |
| 構造化・マップ化 | **なし** — テキストベースの議事録要約のみ |
| 特徴 | 100%ローカル処理、話者分離対応、Zoom/Meet/Teams横断対応 |
| 弱み | 論点の構造化・可視化機能なし。会議中のリアルタイム支援（未回収論点の検知、軌道修正等）なし |

**本プロダクトとの差異**: Meetilyは「高品質な議事録の自動生成」が目的。本プロダクトは「会議中にリアルタイムで論点を構造化し、会議の質を向上させる」ことが目的であり、レイヤーが異なる。

---

### 2. Hyprnote / Char（YC S25採択）

| 項目 | 内容 |
|------|------|
| GitHub | [fastrepl/char](https://github.com/fastrepl/char) |
| ライセンス | GPL-3.0 |
| 技術スタック | Tauri（Rust + React） / ローカルSTT / Ollama or クラウドLLM |
| 対応OS | macOS（Windows予定） |
| リアルタイム性 | **文字起こしはリアルタイム（オンデバイス）**。要約は会議後 |
| 構造化・マップ化 | **なし** — Markdownベースのノート生成 |
| 特徴 | Y Combinator S25採択。Meeting Botなし（システム音声取得）。VSCode風の拡張システム。ノートをMarkdownファイルとして保存 |
| 弱み | 論点構造化なし。会議中のリアルタイム支援なし。macOSのみ |
| 価格 | 無料（ローカル利用） / $8/月（クラウド） |

**本プロダクトとの差異**: Hyprnoteは「AIノートパッド」のコンセプトで、ユーザーがメモを取る体験をAIが補助する設計。本プロダクトは会議の議論構造そのものをAIが自動で可視化する。

---

### 3. AI Meeting Board（個人プロジェクト / プロトタイプ）

| 項目 | 内容 |
|------|------|
| 記事 | [Zenn - @marcosan](https://zenn.dev/marcosan/articles/80c0b704e88191) |
| GitHub | リポジトリ公開（クローンして利用可能） |
| 技術スタック | Web Speech API / Gemini 2.5 / React |
| リアルタイム性 | **リアルタイム**。発言をリアルタイムで構造化UIに変換 |
| 構造化・マップ化 | **あり（最も近い）** — タスクリスト、参加者リスト、会話履歴、ノート（決定事項・課題・アイデア）をリアルタイム生成 |
| 特徴 | ハッカソンで開発されたプロトタイプ。AIが発言からタスク・担当者・期限を自動抽出 |
| 弱み | 個人プロジェクト。Web Speech API依存（Chrome限定）。クラウドLLM依存。商用品質には至っていない。話者分離なし |
| ステータス | プロトタイプ段階 |

**本プロダクトとの差異**: コンセプトは最も近いOSS競合。ただし技術基盤が弱い（Web Speech API、クラウドLLM依存）。本プロダクトはローカルSTT + ローカルLLMの完全オンデバイス処理で、プライバシー・レイテンシ・オフライン動作の面で優位。

---

### 4. MeetMap（ミシガン大学 研究プロジェクト / CSCW 2025）

| 項目 | 内容 |
|------|------|
| 論文 | [MeetMap: Supporting Sensemaking of Group Meeting Discussions with Interactive Dialogue Maps](https://arxiv.org/abs/2502.01564) |
| GitHub | **コード非公開** |
| 技術スタック | Azure Speech-to-Text / LLM / Zoom連携 / 協調型Web UI |
| リアルタイム性 | **リアルタイム**。50語チェックポイントごとにLLMが対話マップを更新 |
| 構造化・マップ化 | **あり（学術的に最も高度）** — 発言をノードとしてリンクし、非線形の対話マップ（Dialogue Map）をリアルタイム生成 |
| 特徴 | 2つのモード: Human-Map（AIがノードを提案、人間が配置）とAI-Map（AIが自動でマップ生成、人間が編集）。CSCW 2025で発表された学術研究 |
| 弱み | コードが公開されていない。研究プロジェクトのため商用利用不可。Azure依存（クラウド処理） |
| ステータス | 研究段階（論文発表済み、コード非公開） |

**本プロダクトとの差異**: MeetMapは本プロダクトと**最もコンセプトが近い学術研究**であり、「対話マップ」という形式でリアルタイムの議論構造化に取り組んでいる。ただしコード非公開・クラウド依存・研究目的であり、OSSプロダクトとしての実用化はされていない。逆に言えば、**この研究がコンセプトの有効性を学術的に裏付けている**点は、本プロダクトの提案にとって強力な根拠となる。

---

### 5. Natively（リアルタイムAI会議コパイロット）

| 項目 | 内容 |
|------|------|
| GitHub | [evinjohnn/natively-cluely-ai-assistant](https://github.com/evinjohnn/natively-cluely-ai-assistant) |
| ライセンス | AGPL-3.0 |
| 技術スタック | Soniox / Google / Groq / Deepgram STT / ローカルVectorDB（RAG） |
| リアルタイム性 | **リアルタイム文字起こし + RAGによる会議中Q&A** |
| 構造化・マップ化 | **なし** — コンテキストに基づくリアルタイム質問応答が主軸 |
| 特徴 | 過去の会話をRAGで検索し、会議中に文脈に応じた回答を提供。スクリーンシェアに映らない設計 |
| 弱み | 論点構造化・マップ化なし。STTはクラウド依存 |

**本プロダクトとの差異**: Nativelyは「会議中のAIアシスタント」であり、ユーザーの質問に答える受動的な支援。本プロダクトは議論の構造そのものを能動的に可視化する。

---

### 6. AI MOM（マルチLLM会議分析）

| 項目 | 内容 |
|------|------|
| GitHub | [Baisampayan1324/AI-MOM](https://github.com/Baisampayan1324/AI-MOM) |
| 技術スタック | FastAPI / Whisper（GPU） / Groq / OpenRouter / Docker |
| リアルタイム性 | リアルタイム文字起こし + 話者認識。ブラウザ拡張でライブ文字起こしオーバーレイ |
| 構造化・マップ化 | 5つのLLMによる並列サマリー生成（会議後） |
| 特徴 | GPT-4o Mini / Claude Haiku / Gemini Flash / Groq Llama等の5モデル同時処理 |
| 弱み | 構造化はリアルタイムではなく会議後。クラウドLLM依存 |

---

### 7. Pensieve

| 項目 | 内容 |
|------|------|
| GitHub | [lukasbach/pensieve](https://github.com/lukasbach/pensieve) |
| 技術スタック | デスクトップアプリ / Whisper（バンドル） / Ollama or OpenAI |
| リアルタイム性 | 文字起こしはリアルタイム。要約はオプション |
| 構造化・マップ化 | **なし** |
| 特徴 | トレイアイコンからワンクリックで録音開始。シンプルな設計 |
| 弱み | 最小限の機能。構造化や会議中支援なし |

---

### 8. fltman/transcriber

| 項目 | 内容 |
|------|------|
| GitHub | [fltman/transcriber](https://github.com/fltman/transcriber) |
| 技術スタック | FastAPI / Celery / whisper.cpp（Metal GPU） / pyannote.audio / Ollama（Qwen3 8B対応） |
| リアルタイム性 | WebSocketによるライブ文字起こし |
| 構造化・マップ化 | **なし** — 7形式のエクスポート、カスタムLLMアクション |
| 特徴 | 話者分離（pyannote.audio + SpeechBrain）が強い。会議暗号化対応 |
| 弱み | 論点構造化・マップ化なし。macOS限定（Metal GPU前提） |

---

### 9. MeetingMind

| 項目 | 内容 |
|------|------|
| GitHub | [misbahsy/meetingmind](https://github.com/misbahsy/meetingmind) |
| 技術スタック | Next.js / Langflow / Groq / OpenAI |
| リアルタイム性 | **なし** — 音声ファイルアップロード後に分析 |
| 構造化・マップ化 | ダッシュボード上で会議分析を表示 |
| 弱み | リアルタイムではない。クラウドLLM依存 |

---

### 10. Ollama-Transcriber

| 項目 | 内容 |
|------|------|
| GitHub | [chumphrey-cmd/Ollama-Transcriber](https://github.com/chumphrey-cmd/Ollama-Transcriber) |
| 技術スタック | Whisper / Ollama（Mistral） |
| リアルタイム性 | **なし** — 音声ファイルのバッチ処理 |
| 構造化・マップ化 | アクションアイテム・キーポイントの構造化出力 |
| 弱み | リアルタイムではない |

---

## ポジショニングマップ

```
                  ローカル処理 ←─────────────────→ クラウド依存
                       │                              │
  会議中の            │  Natively（RAG Q&A）           │  AI Meeting Board（プロト）
  リアルタイム        │                                │  MeetMap（研究・コード非公開）
  支援                │  ★ 本プロダクト                │  AI MOM（文字起こしのみRT）
                      │  （構造化は空白）                │
                      │                                │
  ─────────────────────────────────────────────────────
                      │                                │
  会議後の            │  Meetily                       │  MeetingMind
  要約・議事録        │  Hyprnote/Char                 │  Ollama-Transcriber
                      │  Pensieve                      │
                      │  fltman/transcriber             │
                      │                                │
```

---

## 総括

| 観点 | 状況 |
|------|------|
| リアルタイム文字起こしOSS | **成熟期** — Meetily（9,900+ Stars）、Hyprnote/Char（7,800+ Stars、YC S25）が代表格。技術的には確立済み |
| 会議後AI要約OSS | **レッドオーシャン** — 多数のプロジェクトが乱立（MeetingMind、Ollama-Transcriber等） |
| 会議中リアルタイム支援OSS | **黎明期** — Natively（RAGベースQ&A）が登場。ただし論点構造化ではない |
| リアルタイム論点構造化 | **プロト/研究のみ** — AI Meeting Board（ハッカソンプロト）、MeetMap（ミシガン大学論文、コード非公開） |
| ローカル処理 × リアルタイム構造化 | **完全に空白** — 本プロダクトが狙うべきポジション |

### 注視すべき競合

1. **Meetily** — 9,900+ Starsの勢いで開発が進んでおり、今後「リアルタイム構造化」機能を追加する可能性がある。ただし現状は議事録ツールであり、コンセプトが根本的に異なる
2. **Hyprnote/Char** — YC S25採択。拡張システムを持つため、コミュニティが構造化プラグインを開発する可能性がある
3. **MeetMap（ミシガン大学）** — 学術的にはリアルタイム対話マップの有効性を実証済み。コード公開やスピンアウトの動向を注視すべき

### 本プロダクトの学術的裏付け

MeetMapの研究（CSCW 2025）は、「リアルタイムで議論を対話マップとして構造化する」アプローチの有効性をユーザースタディで実証している。これは本プロダクトのコンセプトに対する**学術的な裏付け**であり、未踏提案においても引用可能な根拠となる。
