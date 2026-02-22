# books

## Supabase DB

`public.books` を本メタデータの正本テーブルとして利用する。

| column | type | note |
| --- | --- | --- |
| id | uuid | 主キー |
| book_code | text | 3桁書籍コード (`001` など) |
| title | text | 書籍名 |
| asin | text | Kindle ASIN |
| source_url | text | 参照元URL |
| storage_bucket | text | Supabase Storage バケット名 |
| storage_path | text | バケット内のPDFパス |
| storage_public_url | text (generated) | 公開URL（`storage_bucket + storage_path` から自動生成） |
| metadata_file_path | text | このリポジトリ内の `metadata.md` パス |
| pdf_file_name | text | PDFファイル名 |
| language_code | text | 言語コード |
| status | text | `ready` / `processing` / `archived` |
| created_at | timestamptz | 作成日時 |
| updated_at | timestamptz | 更新日時 |

`storage.buckets` には `books` バケットを作成済み（public）。
