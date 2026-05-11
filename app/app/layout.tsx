import { AppShell } from "@/components/AppShell";

export default function PrivateAppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
