import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteChrome({
  children,
  headerVariant = "default",
  headerActiveHref
}: {
  children: React.ReactNode;
  headerVariant?: "default" | "doraemon";
  headerActiveHref?: string;
}) {
  return (
    <div className={`page-shell${headerVariant === "doraemon" ? " page-shell-doraemon" : ""}`}>
      <SiteHeader variant={headerVariant} activeHref={headerActiveHref} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
