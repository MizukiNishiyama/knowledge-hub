# Uncensored Qwen Local Chat — Demo

`jaahas/qwen3.5-uncensored:2b` を Ollama 経由でローカル実行する、スタンドアロン Web チャット UI。

## クイックスタート

```bash
cd demo/
chmod +x run.sh
./run.sh
```

ブラウザが自動で `http://localhost:8080` を開きます。

## 構成

```
demo/
├── index.html   # チャット UI（依存ライブラリなし・単一ファイル）
├── run.sh       # 起動スクリプト（Ollama確認 → Pull → サーバー起動）
└── README.md
```

## 機能

| 機能 | 説明 |
|------|------|
| モデル自動検出 | Ollama の `/api/tags` から利用可能モデルを一覧表示 |
| ワンクリック Pull | 未取得モデルをUIからダウンロード（進捗バー付き） |
| ストリーミング応答 | トークンをリアルタイム表示 |
| トークン速度表示 | tok/s をヘッダーにリアルタイム表示 |
| システムプロンプト編集 | ⚙ ボタンで随時変更可能 |
| 検閲状態バッジ | 🔓 Uncensored / 🔒 Censored をモデル名から自動判定 |
| Markdown レンダリング | コードブロック・太字・リスト対応 |
| 会話停止 | 生成中に送信ボタンをクリックで即停止 |

## 前提条件

- [Ollama](https://ollama.com) がインストール済みであること
- Python 3（`python3 -m http.server` を使用）

## 手動起動

```bash
# Ollama をバックグラウンドで起動（未起動の場合）
ollama serve &

# モデルを取得（未取得の場合）
ollama pull jaahas/qwen3.5-uncensored:2b

# HTTP サーバー起動
python3 -m http.server 8080 --bind 127.0.0.1

# ブラウザで開く
open http://localhost:8080
```

## モデル変更

UI のドロップダウンから、Ollama にインストール済みの任意のモデルへ切り替え可能。
`jaahas/qwen3.5-uncensored:2b` が未インストールの場合は「⬇ モデルをPull」ボタンが表示されます。

## 注意事項

- 本デモは研究・学習目的で作成されています
- 生成されたコンテンツの使用は利用者の責任において行ってください
- データはすべてローカルで処理され、外部に送信されません
