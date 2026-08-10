"use server";

import { revalidatePath } from "next/cache";
import { createAuthedServerClient } from "@/lib/supabase/server";

export async function updateBookingStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["confirmed", "cancelled", "completed"].includes(status)) return;

  const supabase = await createAuthedServerClient();
  await supabase
    .from("calendly_bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/rendez-vous");
}

