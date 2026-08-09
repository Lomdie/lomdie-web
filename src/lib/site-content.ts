import { cacheLife, cacheTag } from "next/cache";
import { createServerReadClient } from "@/lib/supabase/server";

export async function getSiteContent(
  keys: string[]
): Promise<Record<string, string>> {
  "use cache";
  cacheTag("site-content");
  cacheLife("hours");

  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("key, value")
    .in("key", keys);

  if (error || !data) {
    return {};
  }

  return Object.fromEntries(data.map((row) => [row.key, row.value]));
}
