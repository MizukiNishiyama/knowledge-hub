import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeetingFlow - リアルタイム会議構造化",
  description: "会議の文字起こしをリアルタイムに構造化・可視化するツール",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
