import type { Metadata } from "next";
import { LoginPanel } from "@/app/login/LoginPanel";

export const metadata: Metadata = {
  title: "Private Owner Area",
  description: "Owner-only access for Weiyu Dang."
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
    config?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next?.startsWith("/app") ? params.next : "/app";
  const error = params.error === "1";
  const missingConfig = params.config === "missing";
  const showDevTokenHint = process.env.NODE_ENV === "development";

  return (
    <LoginPanel
      next={next}
      error={error}
      missingConfig={missingConfig}
      showDevTokenHint={showDevTokenHint}
    />
  );
}
