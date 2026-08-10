import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

type CalAttendee = {
  name?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
};

type CalPayload = {
  uid?: string;
  bookingUid?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  meetingUrl?: string;
  videoCallUrl?: string;
  rescheduleUrl?: string;
  cancellationUrl?: string;
  cancelUrl?: string;
  additionalNotes?: string;
  attendees?: CalAttendee[];
};

type CalWebhook = {
  triggerEvent?: string;
  payload?: CalPayload;
} & CalPayload;

function validSignature(body: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const received = signature.replace(/^sha256=/, "");
  if (received.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

function bookingStatus(trigger: string) {
  if (trigger.includes("CANCELLED") || trigger.includes("REJECTED")) return "cancelled";
  if (trigger.includes("COMPLETED") || trigger === "MEETING_ENDED") return "completed";
  return "confirmed";
}

export async function POST(request: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook non configure" }, { status: 503 });
  }

  const rawBody = await request.text();
  if (!validSignature(rawBody, request.headers.get("x-cal-signature-256"), secret)) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  let event: CalWebhook;
  try {
    event = JSON.parse(rawBody) as CalWebhook;
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const payload = event.payload ?? event;
  const trigger = event.triggerEvent ?? "BOOKING_CREATED";
  const externalUid = payload.uid ?? payload.bookingUid;
  const attendee = payload.attendees?.[0];
  if (!externalUid || !payload.startTime) {
    return NextResponse.json({ error: "Rendez-vous incomplet" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  let candidateId: string | null = null;
  if (attendee?.email) {
    const { data: candidate } = await supabase
      .from("candidates")
      .select("id")
      .ilike("email", attendee.email)
      .maybeSingle();
    candidateId = candidate?.id ?? null;
  }

  const { error } = await supabase.from("calendly_bookings").upsert(
    {
      external_uid: externalUid,
      candidate_id: candidateId,
      title: payload.title ?? null,
      attendee_name: attendee?.name ?? null,
      attendee_email: attendee?.email ?? null,
      attendee_phone: attendee?.phoneNumber ?? attendee?.phone ?? null,
      scheduled_at: payload.startTime,
      end_at: payload.endTime ?? null,
      meeting_link: payload.meetingUrl ?? payload.videoCallUrl ?? null,
      reschedule_link: payload.rescheduleUrl ?? null,
      cancellation_link: payload.cancellationUrl ?? payload.cancelUrl ?? null,
      notes: payload.additionalNotes ?? null,
      status: bookingStatus(trigger),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "external_uid" }
  );

  if (error) {
    console.error("Cal.com webhook persistence failed", error.message);
    return NextResponse.json({ error: "Enregistrement impossible" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

