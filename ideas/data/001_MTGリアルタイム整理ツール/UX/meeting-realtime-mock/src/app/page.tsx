"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [MeetingApp, setMeetingApp] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import("@/components/MeetingApp")
      .then((mod) => {
        setMeetingApp(() => mod.default);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message + "\n" + err.stack);
        console.error("Failed to load MeetingApp:", err);
      });
  }, []);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white p-8">
        <pre className="text-red-600 text-xs whitespace-pre-wrap max-w-2xl border border-red-200 bg-red-50 rounded-lg p-6">{error}</pre>
      </div>
    );
  }

  if (!loaded || !MeetingApp) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400 text-sm">Loading MeetingFlow...</div>
      </div>
    );
  }

  return <MeetingApp />;
}
