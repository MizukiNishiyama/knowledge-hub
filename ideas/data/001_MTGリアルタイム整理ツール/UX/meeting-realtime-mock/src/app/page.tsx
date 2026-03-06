"use client";

import dynamic from "next/dynamic";

const MeetingApp = dynamic(() => import("@/components/MeetingApp"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-white/30 text-sm">Loading MeetingFlow...</div>
    </div>
  ),
});

export default function Home() {
  return <MeetingApp />;
}
