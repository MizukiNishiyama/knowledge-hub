以下の手順で playground に新しいカテゴリを追加せよ。

## 入力

カテゴリ名: $ARGUMENTS

## 実行手順

### Step 1: 重複チェック

`playground/reference.md` を読み、カテゴリ表に `$ARGUMENTS` が既に存在しないか確認する。
存在する場合は「カテゴリ '$ARGUMENTS' は既に存在します」と伝えて終了する。

### Step 2: ディレクトリ作成

`playground/$ARGUMENTS/` ディレクトリを作成する。

### Step 3: reference.md を更新

`playground/reference.md` のカテゴリ表（`| カテゴリ | 対象トピック | 判断基準の例 |` のテーブル）に1行追加する。

- `その他` 行の**直前**に挿入する（`その他` は常に最後尾に置く）
- カテゴリ名・対象トピック・判断基準の例を適切に推定して記載する

### Step 4: git commit & push

```
git add -A
git commit -m "設定: playground に{カテゴリ名}カテゴリを追加"
git push origin main
```

### Step 5: 完了報告

追加したカテゴリ名と、reference.md に記載した内容を1行で報告する。
