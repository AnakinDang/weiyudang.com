import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
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

function LocaleBootstrapScript() {
  const script = `(function(){try{var key="weiyu-site-locale";var stored=localStorage.getItem(key);var cookie=(document.cookie.split(";").map(function(part){return part.trim();}).find(function(part){return part.indexOf(key+"=")===0;})||"").split("=")[1];var nav=(navigator.languages||[]).some(function(lang){return String(lang).toLowerCase().indexOf("zh")===0;});var locale=stored==="zh"||stored==="en"?stored:(cookie==="zh"||cookie==="en"?cookie:(nav?"zh":"en"));var root=document.documentElement;root.lang=locale==="zh"?"zh-Hans":"en";root.dataset.locale=locale;if(locale==="zh"){root.dataset.i18nPending="zh";window.setTimeout(function(){if(root.dataset.i18nPending){delete root.dataset.i18nPending;}},1500);}}catch(e){}})();`;

  return <script data-i18n-skip dangerouslySetInnerHTML={{ __html: script }} />;
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-locale="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body data-i18n-root>
        <LocaleBootstrapScript />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
