あなたは熟練のリポジトリ作業エージェントです。以下を厳密に実行してください。
目的は、/workspace/knowledge-hub の既存変更「darioamodei.com 日本語翻訳追加」を完全再現し、GitHubへ push することです。

# 0. 前提
- 作業ディレクトリ: /workspace/knowledge-hub
- 既存ルール:
  - git add -A
  - git commit -m "<ラベル>: <日本語メッセージ>"
  - git push origin main
- コミットメッセージは日本語ラベル付き（例: ドキュメント: ...）
- 変更対象は books/darioamodei.com 配下のみ（README含む）

# 1. 収集対象URL（サイトマップ準拠）
https://darioamodei.com/sitemap.xml を取得し、含まれるURLを全件処理すること。
現時点の期待URLは以下7件:
1) https://darioamodei.com
2) https://darioamodei.com/subscribe
3) https://darioamodei.com/privacy-policy
4) https://darioamodei.com/open-graph-image-generator
5) https://darioamodei.com/post/on-deepseek-and-export-controls
6) https://darioamodei.com/essay/machines-of-loving-grace
7) https://darioamodei.com/essay/the-adolescence-of-technology

# 2. 出力ディレクトリ・ファイル名ルール
- 出力先: books/darioamodei.com/
- URLパス→ファイル名変換:
  - "/" は "__" に置換
  - ルート "/" は index.md
- 期待ファイル:
  - books/darioamodei.com/index.md
  - books/darioamodei.com/subscribe.md
  - books/darioamodei.com/privacy-policy.md
  - books/darioamodei.com/open-graph-image-generator.md
  - books/darioamodei.com/post__on-deepseek-and-export-controls.md
  - books/darioamodei.com/essay__machines-of-loving-grace.md
  - books/darioamodei.com/essay__the-adolescence-of-technology.md
  - books/darioamodei.com/README.md

# 3. 各Markdownのフォーマット仕様（厳守）
各ページ .md 先頭を以下構造にする:
- 1行目: # <日本語タイトル>
- 空行
- - 原文URL: <対象URL>
- - 原題: <英語タイトル>
- 空行
- > 注: 自動翻訳をベースに、読みやすいよう最小限の整形を行っています。
- 空行
- 本文（見出し・段落・箇条書きを保持して日本語化）

本文抽出ルール:
- article 優先、なければ main、なければ body
- 対象タグ: h1/h2/h3/p/li
- script/style/noscript は除外
- 隣接重複テキストは1つに正規化

# 4. README.md の仕様
books/darioamodei.com/README.md を以下内容で作成・更新:
- タイトル: darioamodei.com 日本語翻訳アーカイブ
- 「サイトマップに含まれる全ページをページごとに保存」と明記
- 収録ページ一覧として7ファイルへリンクを貼る
- 注記: 各Markdownに原文URLと原題を冒頭記載

# 5. 品質チェック（必須）
以下を必ず実行し、ログを残す:
1) サイトマップURL件数 = 7 を確認
2) books/darioamodei.com/*.md（README除く）件数 = 7 を確認
3) 各ファイル先頭10〜15行を確認し、原文URL・原題・注記の3要素があることを検証
4) git diff --name-only で対象外ファイルが混ざっていないことを確認

# 6. GitHub push を必ず成功させる手順（重要）
A. remote確認
- git remote -v
- origin が無ければ追加:
  git remote add origin https://github.com/MizukiNishiyama/knowledge-hub.git

B. mainブランチ確認
- git show-ref --verify --quiet refs/heads/main || git branch main

C. コミット
- git add -A
- git commit -m "ドキュメント: darioamodei.com の全ページを books/darioamodei.com に日本語翻訳して追加"
  （差分が無い場合は commit をスキップ）

D. push
- まず: git push origin main
- 失敗時（ローカルが work など別ブランチの場合）:
  git push origin HEAD:main

E. 認証エラー時のフォールバック（必須で試す）
- gh が使えるなら:
  gh auth status || gh auth login --web
  git push origin HEAD:main
- PAT方式:
  export GITHUB_TOKEN="<PAT>"
  git remote set-url origin https://$GITHUB_TOKEN@github.com/MizukiNishiyama/knowledge-hub.git
  git push origin HEAD:main
  （ログにはトークンを表示しないこと）

# 7. 最終報告フォーマット
- 実行したコマンド一覧
- 生成/更新されたファイル一覧
- 最終コミットハッシュ
- push結果（成功したリモートURLとブランチ）
- 失敗が残る場合は、どの段階で何を試したかを具体的に記載