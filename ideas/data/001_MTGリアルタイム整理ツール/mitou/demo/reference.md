# MeetingFlow Live - システム要件書

## 概要

リアルタイム会議構造化ツール。マイク音声をローカルSTT（whisper.cpp）で文字起こしし、ローカルLLM（Ollama + Qwen3.5）で議論を構造化マップに変換する。すべてローカル処理、データ外部送信なし。

---

## アーキテクチャ (v2: WebSocket Streaming STT)

従来の3秒チャンク方式（MediaRecorder → HTTP POST → ffmpeg変換）を廃止し、
AudioWorklet + WebSocket によるストリーミングSTTパイプラインに移行。

### 旧方式の問題点
- Safari の MediaRecorder が fragmented MP4 を出力 → 2チャンク目以降ヘッダ欠損
- ffmpeg 変換が毎回必要 → レイテンシー増加 + 依存性
- 3秒固定チャンク → 発話途中で切断される不自然なセグメント

### 新方式の利点
- **フォーマット非依存**: AudioWorklet が raw PCM を直接出力 → MP4/WebM 問題が根本解消
- **ffmpeg 不要**: サーバー側で WAV ヘッダを付与するだけ
- **低レイテンシー**: WebSocket 常時接続 → HTTP オーバーヘッド排除
- **VAD対応**: サーバー側でエネルギーベースの発話区間検出 → 自然なセグメント分割
- **中間結果**: 発話中もインテリム結果をブラウザに返却可能

```
Browser                           WS-STT Server              whisper.cpp
(AudioWorklet + WebSocket)        (Node.js, port 8179)       (port 8178)
  │                                  │                          │
  │ ① AudioWorklet                   │                          │
  │    getUserMedia (16kHz mono)     │                          │
  │    Float32 → Int16LE 変換        │                          │
  │                                  │                          │
  │ ── ws://localhost:8179 ────────→ │                          │
  │    binary PCM frames             │                          │
  │    (4096 samples = 256ms/frame)  │                          │
  │                                  │ ② PCM バッファに蓄積      │
  │                                  │    エネルギーベース VAD    │
  │                                  │    (無音検出 + 最大長制限) │
  │                                  │                          │
  │                                  │ ③ 発話区間確定時:         │
  │                                  │    WAV ヘッダ構築 + PCM   │
  │                                  │ ── POST /inference ────→ │
  │                                  │ ←── JSON {text} ──────── │
  │                                  │                          │
  │ ←── ws JSON {type, text} ─────── │                          │
  │                                  │                          │
  │ ④ LiveTranscriptPanel 更新       │                          │
  │    interim (発話中) / final       │                          │
  │                                  │                          │
  │ ⑤ final 確定時:                   │                          │
  │ ── POST /api/structure ────────→ │ Next.js (port 3456)      │
  │                                  │ ── Ollama ─────────────→ │ Qwen3.5
  │ ←── JSON {nodes/edges} ───────── │                          │
  │                                  │                          │
  │ ⑥ React Flow + dagre 描画       │                          │
```

---

## ローカル依存サービス

### 1. Speech-to-Text: whisper.cpp server

| 項目 | 値 |
|------|-----|
| モデル | `ggml-large-v3-turbo.bin` |
| パラメータ数 | 809M (Whisperの distilled版) |
| メモリ使用量 | ~1.6 GB |
| 日本語精度 | WER: Large V3とほぼ同等 (±1%) |
| リアルタイム係数 | ~5x (Apple Silicon GPU) |
| ポート | `localhost:8178` |
| 言語 | 日本語 (`-l ja`) 固定 |

#### セットアップ

```bash
# whisper.cpp をクローン・ビルド
git clone https://github.com/ggml-org/whisper.cpp.git
cd whisper.cpp
cmake -B build -DWHISPER_COREML=ON  # Apple Silicon最適化
cmake --build build --config Release

# モデルダウンロード
./models/download-ggml-model.sh large-v3-turbo

# サーバー起動
./build/bin/server \
  -m models/ggml-large-v3-turbo.bin \
  -l ja \
  --port 8178 \
  --threads 4
```

#### API仕様

```
POST http://localhost:8178/inference
Content-Type: multipart/form-data

file: <audio_blob> (WAV)
language: "ja"
response_format: "json"

Response:
{
  "text": "認識されたテキスト",
  "language": "ja",
  "segments": [{ "start": 0.0, "end": 2.5, "text": "..." }]
}
```

---

### 2. WebSocket STT ブリッジサーバー

whisper.cpp HTTP APIとブラウザ間を中継するWebSocketサーバー。

| 項目 | 値 |
|------|-----|
| ランタイム | Node.js (ws パッケージ) |
| ポート | `localhost:8179` |
| 入力 | binary WebSocket frames (Int16LE PCM, 16kHz, mono) |
| 出力 | JSON WebSocket messages (`{type, text, id}`) |
| VAD | エネルギーベース (RMS閾値 + 無音タイムアウト) |
| バッファ戦略 | 発話区間ごとに WAV 構築 → whisper.cpp に送信 |

#### VAD (Voice Activity Detection) パラメータ

| パラメータ | デフォルト値 | 説明 |
|-----------|------------|------|
| `SILENCE_THRESHOLD` | 500 | Int16 RMS がこの値以下で「無音」判定 |
| `SILENCE_DURATION_MS` | 800 | 無音がこの時間続いたら発話終了 |
| `MAX_SPEECH_MS` | 8000 | 発話が長すぎる場合の強制分割 |
| `MIN_SPEECH_MS` | 500 | これ未満の発話は無視（ノイズ除去） |

#### プロトコル

```
Client → Server:
  - Binary frame: Int16LE PCM samples (4096 samples = 256ms per frame)
  - Text frame: JSON control messages
    - {"type": "start", "language": "ja"}
    - {"type": "stop"}

Server → Client:
  - Text frame: JSON transcription results
    - {"type": "interim", "text": "認識中テキスト"}     # 発話中 (将来拡張)
    - {"type": "final", "text": "確定テキスト", "id": "seg_1"}
    - {"type": "ready"}                                # 接続確立
    - {"type": "error", "message": "エラー内容"}
```

#### 処理フロー

```
1. クライアント接続 → "ready" 送信
2. バイナリフレーム受信 → PCM バッファに追加
3. フレームごとに RMS エネルギー計算
4. 発話検出 (RMS > SILENCE_THRESHOLD):
   - isSpeaking = true
   - speechStart 記録
5. 無音検出 (RMS < SILENCE_THRESHOLD が SILENCE_DURATION_MS 継続):
   - isSpeaking = false
   - バッファから WAV 構築 (44バイトヘッダ + PCM データ)
   - whisper.cpp HTTP API に POST
   - 結果を "final" メッセージで返却
   - バッファクリア
6. MAX_SPEECH_MS 超過:
   - 強制分割 → 同様に WAV 構築 & 送信
```

#### セットアップ

```bash
# WS-STT サーバー起動 (ターミナル)
cd ideas/data/001_MTGリアルタイム整理ツール/mitou/demo
npx tsx server/ws-stt-server.ts
```

---

### 2. Local LLM: Ollama + Qwen3.5

| 項目 | 値 |
|------|-----|
| モデル | `qwen3.5:4b` (推奨) / `qwen3.5:9b` (高精度) |
| アーキテクチャ | Hybrid MoE (Gated Delta Networks + Sparse MoE) |
| パラメータ数 | 4B / 9B |
| 量子化 | Q4_K_M (Ollama デフォルト) |
| メモリ使用量 (4B) | ~3 GB |
| メモリ使用量 (9B) | ~6 GB |
| 推論速度 (M3 Pro) | 4B: ~50 tok/s / 9B: ~30 tok/s |
| コンテキスト長 | 262,144 tokens (ネイティブ) |
| ライセンス | Apache 2.0 |
| ポート | `localhost:11434` |

#### モデル選定基準

| MacBook構成 | 推奨モデル | 理由 |
|-------------|-----------|------|
| 8GB RAM | `qwen3.5:4b` | Whisperと合わせて合計~5GBに収まる |
| 16GB RAM | `qwen3.5:4b` | 余裕を持って両モデルが動作 |
| 32GB RAM | `qwen3.5:9b` | 高精度構造化が可能、30tok/sで実用的 |
| 64GB+ RAM | `qwen3.5:27b` | 最高精度、ただしレスポンスが遅くなる可能性 |

#### Qwen3.5を選定した理由

1. **最新のSOTA性能**: 2026年2月リリース。9Bモデルで13x大きいGPT-OSS-120Bを上回るベンチマーク
2. **MoE効率**: 実パラメータよりアクティブパラメータが少なく、メモリ帯域効率が良い
3. **日本語対応**: 201言語対応、日本語のJSON構造化出力に対応
4. **Apache 2.0**: 商用利用可能
5. **Ollama統合**: `ollama pull qwen3.5:4b` で即座に利用可能

#### セットアップ

```bash
# Ollama インストール
brew install ollama

# モデルダウンロード
ollama pull qwen3.5:4b    # 推奨 (8-16GB RAM)
# or
ollama pull qwen3.5:9b    # 高精度 (32GB+ RAM)

# サーバー起動 (デフォルトで自動起動)
ollama serve
```

#### API仕様

```
POST http://localhost:11434/api/chat
Content-Type: application/json

{
  "model": "qwen3.5:4b",
  "messages": [
    { "role": "system", "content": "構造化プロンプト..." },
    { "role": "user", "content": "新しい発言テキスト..." }
  ],
  "stream": false,
  "format": "json",
  "options": {
    "temperature": 0.3,
    "num_predict": 2048
  }
}

Response:
{
  "message": {
    "role": "assistant",
    "content": "{\"nodes\": [...], \"edges\": [...], \"suggestions\": [...]}"
  }
}
```

---

## アプリケーション構成

### ルーティング

| パス | 内容 |
|------|------|
| `/` | Live版 (リアルタイム音声入力 - WebSocket STT) |
| `/demo` | Demo版 (事前定義データのシミュレーション) |
| `/api/structure` | テキスト→構造化API (Ollama) |
| `/api/health` | サービスヘルスチェック |
| `ws://localhost:8179` | WebSocket STT ブリッジサーバー |

### ディレクトリ構造

```
.
├── server/
│   └── ws-stt-server.ts          # WebSocket STT ブリッジサーバー (standalone)
├── public/
│   └── audio-worklet-processor.js # AudioWorklet プロセッサ (ブラウザで実行)
├── src/
│   ├── app/
│   │   ├── page.tsx               # Live版エントリ
│   │   ├── demo/
│   │   │   └── page.tsx           # Demo版エントリ (既存)
│   │   ├── api/
│   │   │   ├── structure/route.ts # Ollama LLM エンドポイント
│   │   │   └── health/route.ts    # ヘルスチェック (whisper + ollama + ws-stt)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── live/
│   │   │   ├── LiveMeetingApp.tsx     # Live版メイン (WebSocket STT統合)
│   │   │   ├── LiveTranscriptPanel.tsx # リアルタイム文字起こし (interim対応)
│   │   │   └── LiveMindMapPanel.tsx    # 構造マップラッパー
│   │   ├── MeetingApp.tsx         # Demo版メイン (既存)
│   │   ├── MindMapPanel.tsx       # 構造マップ描画 (共有)
│   │   ├── MindMapNode.tsx        # カスタムノード (共有)
│   │   ├── RichNodes.tsx          # リッチノード (共有)
│   │   ├── TranscriptPanel.tsx    # Demo版トランスクリプト (既存)
│   │   └── MeetingSummary.tsx     # 議事録サマリー (共有)
│   ├── lib/
│   │   ├── types.ts               # 共有型定義
│   │   ├── useStreamingSTT.ts     # AudioWorklet + WebSocket STT hook
│   │   ├── ollama.ts              # Ollama API クライアント
│   │   ├── useAudioCapture.ts     # [deprecated] 旧方式 (MediaRecorder)
│   │   └── whisper.ts             # [deprecated] 旧方式 (HTTP直接)
│   └── data/
│       └── transcript.ts         # Demo版固定データ
└── package.json
```

---

## 処理パイプライン詳細

### Step 1: 音声キャプチャ (Browser - AudioWorklet)

- **API**: `AudioWorklet` + `getUserMedia`
- **設定**: AudioContext sampleRate = ブラウザデフォルト (48kHz/44.1kHz)
- **ダウンサンプリング**: AudioWorklet 内で 16kHz にリサンプリング
- **出力形式**: Int16LE PCM (raw, ヘッダなし)
- **フレームサイズ**: 4096 samples = 256ms @16kHz
- **送信方法**: WebSocket binary frames → ws://localhost:8179
- **制約**: ブラウザのマイク許可が必要 (HTTPS or localhost)
- **Safari対応**: AudioWorklet は Safari 14.1+ で完全サポート

### Step 2: VAD + バッファリング (WS-STT Server)

- WebSocket でバイナリ PCM フレームを受信
- フレームごとに RMS エネルギー計算
- 発話開始検出: RMS > SILENCE_THRESHOLD
- 発話終了検出: 無音が SILENCE_DURATION_MS (800ms) 継続
- 最大長制限: MAX_SPEECH_MS (8s) で強制分割
- 最小長フィルタ: MIN_SPEECH_MS (500ms) 未満はノイズとして破棄

### Step 3: 音声→テキスト変換 (WS-STT → Whisper)

- 発話区間の PCM バッファに WAV ヘッダ (44バイト) を付与
- whisper.cpp HTTP API (`POST /inference`) に multipart/form-data で送信
- 結果テキストを WebSocket 経由でブラウザに "final" メッセージとして返却
- **レイテンシー目標**: 発話終了から < 1.5秒で結果返却
- **ffmpeg不要**: WAV ヘッダはサーバー側でプログラム的に構築

### Step 4: テキスト→構造化 (Browser → Next.js → Ollama)

- 2セグメントごと、または50文字超の発言で発火
- コンテキスト（過去の発言履歴 + 既存ノードID）をプロンプトに含める
- Qwen3.5が JSON形式で nodes/edges/suggestions を出力
- **レイテンシー目標**: < 3秒 (4Bモデル)

### Step 5: 構造マップ描画 (Browser)

- React Flow + dagre による自動レイアウト
- Framer Motion アニメーション
- 新ノードにフォーカスするカメラ追従
- リッチノード (比較表・ガントチャート・KPIカード) 対応

### Step 6: 会議終了 → 議事録生成

- 「会議を終了」ボタンで録音停止 + WebSocket 切断
- 1秒後に議事録サマリーをオーバーレイ表示
- 決定事項・アクション・懸念・発言者分析・議論フローを可視化

---

## ハードウェア要件

### 最小構成

| 項目 | 要件 |
|------|------|
| Mac | Apple Silicon (M1以降) |
| RAM | 16GB (Unified Memory) |
| ストレージ | 5GB 空き (モデルファイル用) |
| OS | macOS 13+ |
| ブラウザ | Chrome/Safari (MediaRecorder対応) |
| マイク | 内蔵 or 外部マイク |

### 推奨構成

| 項目 | 要件 |
|------|------|
| Mac | M3 Pro 以降 |
| RAM | 32GB (Unified Memory) |
| ストレージ | 10GB 空き |
| モデル | Whisper large-v3-turbo + Qwen3.5:9b |

### メモリ配分 (16GB構成)

| プロセス | 使用量 |
|---------|-------|
| whisper.cpp (large-v3-turbo) | ~1.6 GB |
| Ollama (qwen3.5:4b, Q4_K_M) | ~3.0 GB |
| Next.js dev server | ~0.3 GB |
| Chrome (React Flow) | ~0.5 GB |
| OS + その他 | ~4.0 GB |
| **合計** | **~9.4 GB** (6.6GB余裕) |

### メモリ配分 (32GB構成)

| プロセス | 使用量 |
|---------|-------|
| whisper.cpp (large-v3-turbo) | ~1.6 GB |
| Ollama (qwen3.5:9b, Q4_K_M) | ~6.0 GB |
| Next.js dev server | ~0.3 GB |
| Chrome (React Flow) | ~0.5 GB |
| OS + その他 | ~4.0 GB |
| **合計** | **~12.4 GB** (19.6GB余裕) |

---

## 環境変数

```env
# .env.local
WHISPER_URL=http://localhost:8178/inference
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen3.5:4b
WS_STT_PORT=8179
```

---

## クイックスタート

```bash
# 1. whisper.cpp サーバー起動 (ターミナル1)
cd ~/whisper.cpp
./build/bin/server -m models/ggml-large-v3-turbo.bin -l ja --port 8178

# 2. Ollama 起動 (ターミナル2)
ollama serve
# 別ターミナルでモデル取得 (初回のみ)
ollama pull qwen3.5:4b

# 3. WS-STT ブリッジサーバー起動 (ターミナル3)
cd ideas/data/001_MTGリアルタイム整理ツール/mitou/demo
npx tsx server/ws-stt-server.ts

# 4. Next.js アプリ起動 (ターミナル4)
npm run dev -- -p 3456

# 5. ブラウザで http://localhost:3456 を開く
# 6. ヘルスインジケーター (Whisper / WS-STT / Qwen3.5) が緑になっていることを確認
# 7.「会議を開始」をクリック → マイク許可 → リアルタイム処理開始
```

### 必要なサービス一覧

| サービス | ポート | 起動コマンド |
|---------|-------|-------------|
| whisper.cpp | 8178 | `./build/bin/server -m models/ggml-large-v3-turbo.bin -l ja --port 8178` |
| WS-STT Bridge | 8179 | `npx tsx server/ws-stt-server.ts` |
| Ollama | 11434 | `ollama serve` |
| Next.js App | 3456 | `npm run dev -- -p 3456` |

---

## LLM構造化プロンプト仕様

Qwen3.5に送信するシステムプロンプトは `src/lib/ollama.ts` に定義。

### 入力
- 既存ノードIDリスト（重複防止）
- これまでの会議テキスト（コンテキスト維持）
- 新しい発言テキスト

### 出力JSON形式

```json
{
  "nodes": [{
    "id": "node_1",
    "label": "ノードタイトル (15文字以内)",
    "type": "proposal | fact | concern | decision | action | ...",
    "parentId": "既存ノードID or null",
    "speaker": "発言者名",
    "summary": "要約 (30文字以内)",
    "evidence": "根拠データ (あれば)",
    "priority": "high | medium | low",
    "tags": ["キーワード"]
  }],
  "edges": [{
    "source": "親ノードID",
    "target": "子ノードID",
    "label": "関係説明"
  }],
  "suggestions": [{
    "nodeId": "関連ノードID",
    "text": "議論を深めるための提案",
    "type": "question | concern | next-step"
  }]
}
```

### 発言タグ分類基準

| タグ | 用途 | 例 |
|------|------|-----|
| `agenda` | 議題・進行 | 「では次の議題に移ります」 |
| `fact` | 事実・データ共有 | 「売上は前年比120%です」 |
| `example` | 具体例・事例 | 「例えばA社の場合...」 |
| `proposal` | 提案・アイデア | 「〜を導入してはどうか」 |
| `opinion` | 意見・主張 | 「私は〜だと考えます」 |
| `question` | 質問・確認 | 「〜についてはどうですか？」 |
| `concern` | 懸念・リスク | 「〜のリスクがあります」 |
| `agreement` | 同意・賛成 | 「それに賛成です」 |
| `decision` | 決定・合意 | 「〜に決定しましょう」 |
| `action` | アクション | 「来週までに〜を完了する」 |
