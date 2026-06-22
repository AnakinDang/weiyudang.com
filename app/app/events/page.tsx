import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type EventsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function searchSuffix(params: Record<string, string | string[] | undefined> = {}) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else if (typeof value === "string") {
      query.set(key, value);
    }
  }

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  redirect(`/app/review${searchSuffix(await searchParams)}`);
}
