'use client';

import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import("@/components/ThreeScene").then(mod => ({ default: mod.ThreeScene })), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <ThreeScene />
    </main>
  );
}