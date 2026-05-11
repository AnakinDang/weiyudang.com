import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Weiyu Dang | AI One-Person Company",
    template: "%s | Weiyu Dang"
  },
  description:
    "Weiyu Dang is building an AI-augmented one-person company powered by Doraemon Agent System and MiniDora agents.",
  metadataBase: new URL("https://weiyudang.com"),
  openGraph: {
    title: "Weiyu Dang",
    description: "Building an AI-augmented one-person company.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
