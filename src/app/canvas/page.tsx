'use client';

import dynamic from 'next/dynamic';

const SimpleCanvas = dynamic(() => import("@/components/canvas").then(mod => ({ default: mod.SimpleCanvas })), {
  ssr: false,
});

export default function CanvasPage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <SimpleCanvas />
    </main>
  );
}