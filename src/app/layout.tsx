import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "R3F Scene - Interactive 3D Experience",
  description: "An interactive 3D scene built with React Three Fiber and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}