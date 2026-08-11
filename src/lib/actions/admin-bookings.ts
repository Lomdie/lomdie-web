"use server";

import { revalidatePath } from "next/cache";
import { createAuthedServerClient, createServiceRoleClient } from "@/lib/supabase/server";

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

export async function deleteBooking(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const prospectId = String(formData.get("prospectId") ?? "");
  if (!id) return;

  const authedSupabase = await createAuthedServerClient();
  const { data: { user } } = await authedSupabase.auth.getUser();
  if (!user) return;

  const supabase = createServiceRoleClient();
  await supabase.from("calendly_bookings").delete().eq("id", id);

  if (prospectId) {
    await supabase
      .from("candidates")
      .delete()
      .eq("id", prospectId)
      .eq("status", "nouvelle_candidature");
  }

  revalidatePath("/admin/rendez-vous");
  revalidatePath("/admin");
}

export async function deleteProspect(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const authedSupabase = await createAuthedServerClient();
  const { data: { user } } = await authedSupabase.auth.getUser();
  if (!user) return;

  const supabase = createServiceRoleClient();
  await supabase
    .from("candidates")
    .delete()
    .eq("id", id)
    .eq("status", "nouvelle_candidature");
  revalidatePath("/admin/rendez-vous");
  revalidatePath("/admin");
}

export async function deleteAllProspects() {
  const authedSupabase = await createAuthedServerClient();
  const { data: { user } } = await authedSupabase.auth.getUser();
  if (!user) return { ok: false, message: "Accès non autorisé." };

  const supabase = createServiceRoleClient();
  const { error: bookingsError } = await supabase
    .from("calendly_bookings")
    .delete()
    .not("id", "is", null);
  if (bookingsError) {
    console.error("deleteAllProspects: booking cleanup failed", bookingsError);
    return { ok: false, message: "La suppression des rendez-vous a échoué." };
  }

  const { error: prospectsError } = await supabase
    .from("candidates")
    .delete()
    .eq("status", "nouvelle_candidature");
  if (prospectsError) {
    console.error("deleteAllProspects: prospect cleanup failed", prospectsError);
    return { ok: false, message: "La suppression des prospects a échoué." };
  }

  revalidatePath("/admin/rendez-vous");
  revalidatePath("/admin");
  return { ok: true, message: "Tous les prospects ont été supprimés." };
}
