import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "政治家クイズ",
  description: "日本の国会議員を学ぶフラッシュカードアプリ",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "政治家クイズ" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

const NAV_ITEMS = [
  { href: "/",            icon: "📊", label: "ホーム" },
  { href: "/quiz",        icon: "🎴", label: "クイズ" },
  { href: "/politicians", icon: "👥", label: "一覧" },
  { href: "/party-map",   icon: "🗾", label: "政党" },
  { href: "/roadmap",     icon: "🗺", label: "ロードマップ" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        {/* Desktop top nav */}
        <nav className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="font-bold text-lg text-blue-700">
                🏛 政治家クイズ
              </Link>
              <div className="flex gap-1 text-sm">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile top bar */}
        <header className="md:hidden bg-white border-b border-gray-100 sticky top-0 z-50 px-4 h-12 flex items-center">
          <span className="font-bold text-blue-700 text-base">🏛 政治家クイズ</span>
        </header>

        {/* Main content — bottom padding for mobile nav */}
        <main className="max-w-5xl mx-auto px-3 sm:px-6 py-4 pb-24 md:pb-8">
          {children}
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
          <div className="grid grid-cols-5 h-16">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-blue-600 active:text-blue-700 transition-colors"
              >
                <span className="text-xl leading-none">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </body>
    </html>
  );
}
