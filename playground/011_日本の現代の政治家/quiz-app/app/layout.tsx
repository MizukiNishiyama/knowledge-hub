import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "政治家クイズアプリ",
  description: "日本の国会議員を学ぶフラッシュカードアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="font-bold text-lg text-blue-700 hover:text-blue-900">
                🏛 政治家クイズ
              </Link>
              <div className="flex gap-1 sm:gap-2 text-sm">
                <Link href="/" className="px-2 sm:px-3 py-2 rounded hover:bg-gray-100 text-gray-700 font-medium">
                  ダッシュボード
                </Link>
                <Link href="/quiz" className="px-2 sm:px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium">
                  クイズ
                </Link>
                <Link href="/politicians" className="px-2 sm:px-3 py-2 rounded hover:bg-gray-100 text-gray-700 font-medium">
                  一覧
                </Link>
                <Link href="/party-map" className="px-2 sm:px-3 py-2 rounded hover:bg-gray-100 text-gray-700 font-medium">
                  政党
                </Link>
                <Link href="/roadmap" className="px-2 sm:px-3 py-2 rounded hover:bg-gray-100 text-gray-700 font-medium">
                  ロードマップ
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
