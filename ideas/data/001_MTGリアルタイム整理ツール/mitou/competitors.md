# OSS競合調査 — リアルタイム会議構造化・マップ化

generated_at: 2026-03-07

## 調査結論

**会議音声をリアルタイムで「論点構造化」「マップ化」するOSSは、現時点で存在しない。**

既存のOSSは以下の2パターンに集中している。
1. リアルタイム文字起こし + 会議後のAI要約（Meetily、Hyprnote/Char、Pensieve等）
2. 会議後の音声ファイルからの要約生成（Ollama-Transcriber等）

「会議中にリアルタイムで論点を構造化し、マップやツリーとして可視化する」OSSは**空白地帯**であり、本プロダクトの狙いどころと一致する。

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

**本プロダクトとの差異**: コンセプトは最も近い競合。ただし技術基盤が弱い（Web Speech API、クラウドLLM依存）。本プロダクトはローカルSTT + ローカルLLMの完全オンデバイス処理で、プライバシー・レイテンシ・オフライン動作の面で優位。

---

### 4. Pensieve

| 項目 | 内容 |
|------|------|
| GitHub | [lukasbach/pensieve](https://github.com/lukasbach/pensieve) |
| 技術スタック | デスクトップアプリ / Whisper（バンドル） / Ollama or OpenAI |
| リアルタイム性 | 文字起こしはリアルタイム。要約はオプション |
| 構造化・マップ化 | **なし** |
| 特徴 | トレイアイコンからワンクリックで録音開始。シンプルな設計 |
| 弱み | 最小限の機能。構造化や会議中支援なし |

---

### 5. fltman/transcriber

| 項目 | 内容 |
|------|------|
| GitHub | [fltman/transcriber](https://github.com/fltman/transcriber) |
| 技術スタック | FastAPI / Celery / whisper.cpp（Metal GPU） / pyannote.audio / Ollama（Qwen3 8B対応） |
| リアルタイム性 | WebSocketによるライブ文字起こし |
| 構造化・マップ化 | **なし** — 7形式のエクスポート、カスタムLLMアクション |
| 特徴 | 話者分離（pyannote.audio + SpeechBrain）が強い。会議暗号化対応 |
| 弱み | 論点構造化・マップ化なし。macOS限定（Metal GPU前提） |

---

### 6. MeetingMind

| 項目 | 内容 |
|------|------|
| GitHub | [misbahsy/meetingmind](https://github.com/misbahsy/meetingmind) |
| 技術スタック | Next.js / Langflow / Groq / OpenAI |
| リアルタイム性 | **なし** — 音声ファイルアップロード後に分析 |
| 構造化・マップ化 | ダッシュボード上で会議分析を表示 |
| 弱み | リアルタイムではない。クラウドLLM依存 |

---

### 7. Ollama-Transcriber

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
  会議後の            │  Meetily                      │  MeetingMind
  要約・議事録        │  Pensieve                     │  Ollama-Transcriber
                      │  fltman/transcriber            │
                      │  Hyprnote/Char                 │
                      │                                │
  ─────────────────────────────────────────────────────
                      │                                │
  会議中の            │                                │  AI Meeting Board
  リアルタイム        │  ★ 本プロダクト                │  （プロトタイプ）
  構造化・            │  （空白地帯）                    │
  マップ化            │                                │
                      │                                │
```

---

## 総括

| 観点 | 状況 |
|------|------|
| リアルタイム文字起こしOSS | **成熟期** — Meetily（9,900+ Stars）が代表格。技術的には確立済み |
| 会議後AI要約OSS | **レッドオーシャン** — 多数のプロジェクトが乱立 |
| リアルタイム論点構造化OSS | **空白地帯** — AI Meeting Boardがプロトタイプとして唯一存在するが、商用品質ではない |
| ローカル処理 × リアルタイム構造化 | **完全に空白** — 本プロダクトが狙うべきポジション |

最も注視すべき競合は**Meetily**である。9,900+ Starsの勢いで開発が進んでおり、今後「リアルタイム構造化」機能を追加する可能性がある。ただし現状はMITライセンスの議事録ツールに留まっており、コンセプトが根本的に異なる。
