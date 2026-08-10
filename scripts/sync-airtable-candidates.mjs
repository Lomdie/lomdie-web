import { createClient } from "@supabase/supabase-js";

const FIELD = {
  fullName: "fldhv0ttK6cGZ1h2c",
  firstName: "fld7OwY0eZ29Kauno",
  age: "fldk9IvcOJasTYmqy",
  createdAt: "fldfQSC4p43O5x18W",
  eligibility: "fldRngvASYHjpT7OR",
  criteria: "fldZhzEaMqpClkrya",
  meetingNotes: "fldMHJjKaaCX7eGLk",
  keyDecisions: "fldBsc7Vw3y75Ivet",
  status: "fldtVTSr2XeC2r6T0",
  email: "fldyCcDw3t2CZfdm8",
};

const input = await new Promise((resolve, reject) => {
  let json = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => (json += chunk));
  process.stdin.on("end", () => {
    try {
      resolve(JSON.parse(json));
    } catch (error) {
      reject(error);
    }
  });
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data: candidates, error: candidatesError } = await supabase
  .from("candidates")
  .select("id, email, photo_urls, admin_notes");
if (candidatesError) throw candidatesError;

const byRecordId = new Map();
const byEmail = new Map();
for (const candidate of candidates) {
  const technicalId = candidate.email?.match(/^(rec[a-zA-Z0-9]{14})@lomdie-sans-email\.invalid$/)?.[1];
  const photoId = candidate.photo_urls?.[0]?.match(/^(rec[a-zA-Z0-9]{14})-/)?.[1];
  if (technicalId) byRecordId.set(technicalId, candidate);
  if (photoId) byRecordId.set(photoId, candidate);
  if (candidate.email && !candidate.email.endsWith("@lomdie-sans-email.invalid")) {
    byEmail.set(candidate.email.trim().toLowerCase(), candidate);
  }
}

const unmatched = [];
let updated = 0;
for (const record of input.records ?? []) {
  const fields = record.cellValuesByFieldId ?? {};
  const email = String(fields[FIELD.email] ?? "").trim().toLowerCase();
  const candidate = byRecordId.get(record.id) || (email ? byEmail.get(email) : null);
  if (!candidate) {
    unmatched.push({
      recordId: record.id,
      name: fields[FIELD.fullName] ?? null,
      email: email || null,
    });
    continue;
  }

  const selectName = (value) =>
    value && typeof value === "object" && "name" in value ? value.name : value;
  const criteria = Array.isArray(fields[FIELD.criteria])
    ? fields[FIELD.criteria].map((item) =>
        typeof item === "string" ? item : item?.id ?? item?.name
      ).filter(Boolean)
    : [];

  const updates = {
    application_date: fields[FIELD.createdAt] ?? record.createdTime,
    airtable_record_id: record.id,
    airtable_age: fields[FIELD.age] ?? null,
    eligibility_score: fields[FIELD.eligibility] ?? null,
    meeting_notes: fields[FIELD.meetingNotes] ?? null,
    key_decisions:
      typeof fields[FIELD.keyDecisions] === "object"
        ? fields[FIELD.keyDecisions]?.value ?? fields[FIELD.keyDecisions]?.text ?? null
        : fields[FIELD.keyDecisions] ?? null,
    airtable_status: selectName(fields[FIELD.status]) ?? null,
    airtable_criteria_ids: criteria,
    airtable_data: fields,
  };

  const { error } = await supabase.from("candidates").update(updates).eq("id", candidate.id);
  if (error) throw error;
  updated += 1;
}

console.log(JSON.stringify({ updated, unmatched }, null, 2));
