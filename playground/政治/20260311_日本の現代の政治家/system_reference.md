# 日本の現代の政治家クイズアプリ 仕様書（Next.js App Router / TypeScript）

## 目的
- `playground/011_日本の現代の政治家/` 配下の議員プロファイルを学習対象とし、名前から区・政党・年齢・経歴を想起できる状態を作る。
- 「覚えた」を定量化（正解回数 10 回で記憶済み判定）し、全議員の記憶完了をゴールとする。

## 対象データ
- 参照元: `playground/011_日本の現代の政治家/衆議院/*/*/summary.md` と `.../sources.md`
- 想定構造（例）
  - `衆議院/自由民主党/岸田文雄/summary.md`
  - `参議院/立憲民主党/◯◯/summary.md`

## データ取り込み方針
- 起動時/ビルド時にローカルファイルを読み込み、DBに同期する。
- 既存の `summary.md` を正としてDBへ正規化する。
- 初期実装は単一ユーザー（ローカル）を想定。

### summary.md 解析ルール
- 見出し構造に依存しすぎず、表と箇条書きから以下を抽出する。
- 抽出対象（必須）
  - 氏名（漢字）
  - 院（衆議院/参議院）
  - 選挙区
  - 政党
  - 生年月日 / 年齢
- 抽出対象（任意）
  - 当選回数
  - 派閥・グループ
  - 経歴（時系列）
  - 歴任ポスト
  - 政策スタンス
  - 功績・実績
  - 第三者評価
  - 30字概要
- 抽出失敗時は `raw_summary_md` に全文を保存し、UI上は「情報なし」と表示。

### ファイル同期
- `summary.md` と `sources.md` の `mtime` を保持し、差分があれば再同期。
- ファイル削除時は `politicians` レコードを `is_active=false` にする（削除しない）。

## アプリ構成（Next.js App Router）
- Next.js 14+ / TypeScript
- App Router
- DB: SQLite（ローカル開発重視）
- ORM: Prisma
- UI: Tailwind CSS

### 主要ページ
- `/` : ダッシュボード
- `/quiz` : クイズ（フラッシュカード）
- `/quiz/[mode]` : モード別クイズ
- `/politicians` : 一覧・フィルタ
- `/politicians/[id]` : 詳細
- `/party-map` : 政党マップ
- `/roadmap` : 学習ロードマップ
- `/settings` : 設定

## 機能要件

### 1. クイズ（フラッシュカード）
- 名前のみ表示（初期）
- 「答えを見る」ボタンで
  - 選挙区
  - 政党
  - 年齢
  - 経歴（要約または最初の3項目）
  をカードに表示
- ユーザーは自己申告で「正解 / 不正解」を選択
- 10回正解で「記憶済み」扱い

### 2. 学習状態管理
- `correct_count >= 10` で `memorized=true`
- `incorrect_count` も記録
- 最終回答日時を保持

### 3. 出題ロジック
- 未記憶優先: `memorized=false` を優先
- 直近間違い優先: `last_answered_at` が近く、`incorrect_count` 高い順
- 範囲指定: 院/政党/選挙区でフィルタ

### 4. ダッシュボード
- 総議員数 / 記憶済み数 / 未記憶数
- 院別・政党別の進捗
- 正答率推移
- 今日の学習件数

### 5. 政党マップ
- 政党別に「記憶済み率」を可視化
- 政党をクリックすると対象政党の学習に遷移

### 6. ロードマップ
- 目標: 全議員記憶
- フェーズ分割
  - フェーズ1: 現職閣僚・党首
  - フェーズ2: 当選3回以上
  - フェーズ3: それ以外
- 各フェーズ進捗を表示

### 7. 徹底詰め込みモード
- 連続50問 / 100問の強制学習
- タイムアタック（任意）
- 不正解のみ再出題

## 非機能要件
- オフライン動作（ローカルDB）
- 低遅延（1問あたり 200ms以内）
- 端末サイズに最適化（PC/モバイル両対応）

## DB設計（Prisma）

### politicians
- `id` (PK)
- `name`
- `house` (shugiin/sangiin)
- `party`
- `district`
- `age`
- `birth_date`
- `summary_excerpt`
- `career` (JSON)
- `positions` (JSON)
- `policy` (JSON)
- `achievements` (JSON)
- `evaluations` (JSON)
- `raw_summary_md`
- `sources_md`
- `source_path`
- `is_active`
- `updated_at`

### quiz_attempts
- `id` (PK)
- `politician_id` (FK)
- `answered_at`
- `is_correct`

### memory_stats
- `politician_id` (PK/FK)
- `correct_count`
- `incorrect_count`
- `last_answered_at`
- `memorized`

### settings
- `id` (PK)
- `memorized_threshold` (default 10)

## UI要件

### クイズカード
- 表面: 名前のみ
- 裏面: 区/政党/年齢/経歴（抜粋）
- 正解/不正解ボタンを下部に配置

### 一覧ページ
- フィルタ: 院 / 政党 / 記憶済み状態 / 選挙区
- 検索: 名前

### 詳細ページ
- summary.md の全文
- sources.md の一覧

## データ同期バッチ
- 起動時に `playground/011_日本の現代の政治家` を走査
- 差分がある場合のみ更新
- 失敗ログは `logs/ingest.log` に出力

## 開発ロードマップ

### Phase 0: 仕様と基盤
- Next.js App Router 構築
- Prisma + SQLite
- データ取り込みバッチ

### Phase 1: クイズ体験
- フラッシュカードUI
- 正誤記録
- 未記憶優先の出題

### Phase 2: ダッシュボード
- 進捗率集計
- 政党別進捗
- ロードマップ可視化

### Phase 3: 強化機能
- タイムアタック
- 不正解再出題
- 詳細学習モード

## 受け入れ基準
- 名前だけ見て回答できる形式になっている
- 正誤がDBに記録される
- 10回正解で記憶済み判定される
- ダッシュボードで進捗が確認できる
- 政党マップで政党別進捗が可視化される

