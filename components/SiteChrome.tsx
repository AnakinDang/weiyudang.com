import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteChrome({
  children,
  headerVariant = "default"
}: {
  children: React.ReactNode;
  headerVariant?: "default" | "doraemon";
}) {
  return (
    <div className={`page-shell${headerVariant === "doraemon" ? " page-shell-doraemon" : ""}`}>
      <SiteHeader variant={headerVariant} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
