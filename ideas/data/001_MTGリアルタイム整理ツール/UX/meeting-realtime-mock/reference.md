# MeetingFlow Live - システム要件書

## 概要

リアルタイム会議構造化ツール。マイク音声をローカルSTT（whisper.cpp）で文字起こしし、ローカルLLM（Ollama + Qwen3.5）で議論を構造化マップに変換する。すべてローカル処理、データ外部送信なし。

---

## アーキテクチャ

```
Browser (Mic)                    Next.js Server (localhost:3456)
  │                                   │
  │ ① MediaRecorder API               │
  │    3秒ごとにWebM音声チャンクを送信    │
  │──── POST /api/transcribe ────────>│
  │                                   │ ② whisper.cpp server (localhost:8178)
  │                                   │──── POST /inference ─────>│ Whisper
  │                                   │<──── JSON (text) ─────────│
  │<──── JSON (transcribed text) ─────│
  │                                   │
  │ ③ 2セグメントごと or 長文で発火       │
  │──── POST /api/structure ─────────>│
  │                                   │ ④ Ollama (localhost:11434)
  │                                   │──── POST /api/chat ──────>│ Qwen3.5
  │                                   │<──── JSON (nodes/edges) ──│
  │<──── JSON (StructureUpdate) ──────│
  │                                   │
  │ ⑤ React Flow で構造マップ描画       │
  │    Framer Motion アニメーション      │
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

#### 代替: mlx-whisper (Python / Apple Silicon最適化)

```bash
pip install mlx-whisper
# Pythonスクリプトでサーバーを立てる (whisper.cppより~2x高速)
```

#### API仕様

```
POST http://localhost:8178/inference
Content-Type: multipart/form-data

file: <audio_blob> (WAV/WebM)
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
| `/` | Live版 (リアルタイム音声入力) |
| `/demo` | Demo版 (事前定義データのシミュレーション) |
| `/api/transcribe` | 音声→テキスト変換API |
| `/api/structure` | テキスト→構造化API |
| `/api/health` | サービスヘルスチェック |

### ディレクトリ構造

```
src/
├── app/
│   ├── page.tsx                 # Live版エントリ
│   ├── demo/
│   │   └── page.tsx             # Demo版エントリ (既存)
│   ├── api/
│   │   ├── transcribe/route.ts  # Whisper STT エンドポイント
│   │   ├── structure/route.ts   # Ollama LLM エンドポイント
│   │   └── health/route.ts      # ヘルスチェック
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── live/
│   │   ├── LiveMeetingApp.tsx   # Live版メインコンポーネント
│   │   ├── LiveTranscriptPanel.tsx  # リアルタイム文字起こし表示
│   │   └── LiveMindMapPanel.tsx     # 構造マップ (既存MindMapPanelのラッパー)
│   ├── MeetingApp.tsx           # Demo版メインコンポーネント (既存)
│   ├── MindMapPanel.tsx         # 構造マップ描画 (共有)
│   ├── MindMapNode.tsx          # カスタムノード (共有)
│   ├── RichNodes.tsx            # リッチノード (共有)
│   ├── TranscriptPanel.tsx      # Demo版トランスクリプト (既存)
│   └── MeetingSummary.tsx       # 議事録サマリー (共有)
├── lib/
│   ├── types.ts                 # Live版共有型定義
│   ├── whisper.ts               # whisper.cpp サーバークライアント
│   ├── ollama.ts                # Ollama API クライアント
│   └── useAudioCapture.ts       # マイク音声キャプチャhook
└── data/
    └── transcript.ts            # Demo版固定データ
```

---

## 処理パイプライン詳細

### Step 1: 音声キャプチャ (Browser)

- **API**: `MediaRecorder` + `getUserMedia`
- **設定**: sampleRate=16000, channelCount=1, echoCancellation=true, noiseSuppression=true
- **出力形式**: `audio/webm;codecs=opus`
- **チャンク間隔**: 3秒 (設定可能)
- **制約**: ブラウザのマイク許可が必要 (HTTPS or localhost)

### Step 2: 音声→テキスト変換 (Server → Whisper)

- ブラウザからWebMチャンクを受信
- whisper.cppサーバーに転送
- 日本語モードで文字起こし
- 結果テキストをクライアントに返却
- **レイテンシー目標**: 3秒チャンクに対し < 1秒の処理時間

### Step 3: テキスト→構造化 (Server → Ollama)

- 2セグメントごと、または50文字超の発言で発火
- コンテキスト（過去の発言履歴 + 既存ノードID）をプロンプトに含める
- Qwen3.5が JSON形式で nodes/edges/suggestions を出力
- **レイテンシー目標**: < 3秒 (4Bモデル)

### Step 4: 構造マップ描画 (Browser)

- React Flow + dagre による自動レイアウト
- Framer Motion アニメーション
- 新ノードにフォーカスするカメラ追従
- リッチノード (比較表・ガントチャート・KPIカード) 対応

### Step 5: 会議終了 → 議事録生成

- 「会議を終了」ボタンで録音停止
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
```

---

## クイックスタート

```bash
# 1. whisper.cpp サーバー起動 (ターミナル1)
cd whisper.cpp
./build/bin/server -m models/ggml-large-v3-turbo.bin -l ja --port 8178

# 2. Ollama 起動 (ターミナル2)
ollama serve
# 別ターミナルでモデル取得 (初回のみ)
ollama pull qwen3.5:4b

# 3. アプリ起動 (ターミナル3)
cd meeting-realtime-mock
npm install
npm run dev -- -p 3456

# 4. ブラウザで http://localhost:3456 を開く
# 5. ヘルスインジケーター (Whisper / Qwen3.5) が緑になっていることを確認
# 6.「会議を開始」をクリック → マイク許可 → リアルタイム処理開始
```

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
