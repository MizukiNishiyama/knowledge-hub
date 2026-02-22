create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  book_code text not null unique,
  title text not null,
  asin text unique,
  source_url text,
  storage_bucket text not null default 'books',
  storage_path text not null unique,
  storage_public_url text generated always as (
    'https://ayspbkywjnkouxbhuchj.supabase.co/storage/v1/object/public/' || storage_bucket || '/' || storage_path
  ) stored,
  metadata_file_path text not null unique,
  pdf_file_name text not null,
  language_code text not null default 'ja',
  status text not null default 'ready',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint books_book_code_format_chk check (book_code ~ '^[0-9]{3}$'),
  constraint books_status_chk check (status in ('ready', 'processing', 'archived')),
  constraint books_storage_path_pdf_chk check (right(lower(storage_path), 4) = '.pdf')
);

create index if not exists books_title_idx on public.books (title);
create index if not exists books_asin_idx on public.books (asin);

drop trigger if exists trg_books_set_updated_at on public.books;
create trigger trg_books_set_updated_at
before update on public.books
for each row
execute function public.set_updated_at();

alter table public.books enable row level security;

drop policy if exists "books_read_all" on public.books;
create policy "books_read_all"
on public.books
for select
to anon, authenticated
using (true);

drop policy if exists "books_write_authenticated" on public.books;
create policy "books_write_authenticated"
on public.books
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('books', 'books', true)
on conflict (id) do update set
  public = excluded.public,
  name = excluded.name;

drop policy if exists "books_bucket_public_read" on storage.objects;
create policy "books_bucket_public_read"
on storage.objects
for select
to public
using (bucket_id = 'books');

drop policy if exists "books_bucket_auth_insert" on storage.objects;
create policy "books_bucket_auth_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'books');

drop policy if exists "books_bucket_auth_update" on storage.objects;
create policy "books_bucket_auth_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'books')
with check (bucket_id = 'books');

drop policy if exists "books_bucket_auth_delete" on storage.objects;
create policy "books_bucket_auth_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'books');

insert into public.books (
  book_code,
  title,
  asin,
  source_url,
  storage_bucket,
  storage_path,
  metadata_file_path,
  pdf_file_name,
  language_code,
  status
)
values
  (
    '001',
    '参政党の研究',
    'B0G22BR12G',
    'https://read.amazon.co.jp/?asin=B0G22BR12G',
    'books',
    '001/001_参政党の研究.pdf',
    'books/data/001_参政党の研究/metadata.md',
    '001_参政党の研究.pdf',
    'ja',
    'ready'
  ),
  (
    '002',
    'アートオブスペンディングマネー',
    'B0FSHCJ6RM',
    'https://read.amazon.co.jp/?asin=B0FSHCJ6RM',
    'books',
    '002/002_アートオブスペンディングマネー.pdf',
    'books/data/002_アートオブスペンディングマネー/metadata.md',
    '002_アートオブスペンディングマネー.pdf',
    'ja',
    'ready'
  )
on conflict (book_code) do update
set
  title = excluded.title,
  asin = excluded.asin,
  source_url = excluded.source_url,
  storage_bucket = excluded.storage_bucket,
  storage_path = excluded.storage_path,
  metadata_file_path = excluded.metadata_file_path,
  pdf_file_name = excluded.pdf_file_name,
  language_code = excluded.language_code,
  status = excluded.status,
  updated_at = now();
