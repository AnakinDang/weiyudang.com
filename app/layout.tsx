import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Weiyu Dang | Physics, AI, and Research Tools",
    template: "%s | Weiyu Dang"
  },
  description:
    "Personal website for Weiyu Dang: physics and quantum computing student building AI systems, creative workflows, and trading research tools.",
  metadataBase: new URL("https://weiyudang.com"),
  openGraph: {
    title: "Weiyu Dang",
    description: "Physics, quantum computing, AI systems, creative workflows, and research tools.",
    url: "https://weiyudang.com",
    siteName: "Weiyu Dang",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
