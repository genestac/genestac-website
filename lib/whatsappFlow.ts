import { WHATSAPP_ELIGIBILITY_URL } from "@/lib/whatsapp";
import { supabase } from "@/lib/supabase";

export type WhatsAppSessionStage =
  | "INIT"
  | "ELIGIBILITY_PROMPTED"
  | "INFO_COLLECTED"
  | "FORM_SHARED"
  | "CONSULTATION_OFFERED"
  | "SUBSCRIPTION_OFFERED";

export interface WhatsAppSession {
  stage: WhatsAppSessionStage;
  history: string[];
  collected?: {
    age?: string;
    height?: string;
    weight?: string;
    conditions?: string;
    medicines?: string;
  };
  lastUpdated: number;
}

const sessionStore = new Map<string, WhatsAppSession>();
const SESSION_TTL = 1000 * 60 * 60 * 24; // 24 hours

const BASE_INTRO =
  "Welcome to Genestac. We provide a doctor-guided medical weight-loss program, where prescription-based therapies such as GLP-1 may be considered only after doctor evaluation.";

const ELIGIBILITY_CTA = `Please complete the eligibility form so our medical team can review your case safely: ${WHATSAPP_ELIGIBILITY_URL}`;

function cleanupSessions() {
  const now = Date.now();
  for (const [key, session] of sessionStore.entries()) {
    if (now - session.lastUpdated > SESSION_TTL) {
      sessionStore.delete(key);
    }
  }
}

function initSession(phone: string): WhatsAppSession {
  const session: WhatsAppSession = {
    stage: "INIT",
    history: [],
    lastUpdated: Date.now(),
  };
  sessionStore.set(phone, session);
  return session;
}

async function getSessionFromDb(phone: string) {
  try {
    const { data, error } = await supabase
      .from("whatsapp_sessions")
      .select("stage, history, collected, last_updated")
      .eq("phone", phone)
      .single();

    if (error) {
      console.error("WhatsApp session DB load error:", error);
      return null;
    }

    return {
      stage: data.stage as WhatsAppSessionStage,
      history: data.history ?? [],
      collected: data.collected ?? undefined,
      lastUpdated: data.last_updated ? new Date(data.last_updated).getTime() : Date.now(),
    };
  } catch (err) {
    console.error("WhatsApp session DB exception:", err);
    return null;
  }
}

async function saveSessionToDb(phone: string, session: WhatsAppSession) {
  try {
    await supabase.from("whatsapp_sessions").upsert(
      [
        {
          phone,
          stage: session.stage,
          history: session.history,
          collected: session.collected,
          last_updated: new Date().toISOString(),
        },
      ],
      { onConflict: "phone" }
    );
  } catch (err) {
    console.error("WhatsApp session DB save error:", err);
  }
}

async function getSession(phone: string) {
  cleanupSessions();

  const existing = sessionStore.get(phone);
  if (existing) {
    return existing;
  }

  const dbSession = await getSessionFromDb(phone);
  if (dbSession) {
    sessionStore.set(phone, dbSession);
    return dbSession;
  }

  return initSession(phone);
}

function resetSession(phone: string) {
  sessionStore.delete(phone);
  return initSession(phone);
}

async function persistSession(phone: string, session: WhatsAppSession) {
  session.lastUpdated = Date.now();
  sessionStore.set(phone, session);
  await saveSessionToDb(phone, session);
}

export async function initializeWhatsAppSession(
  phone: string,
  stage: WhatsAppSessionStage = "ELIGIBILITY_PROMPTED"
) {
  const cleanPhone = phone.replace(/\D/g, "");
  const session: WhatsAppSession = {
    stage,
    history: [],
    lastUpdated: Date.now(),
  };
  sessionStore.set(cleanPhone, session);
  await saveSessionToDb(cleanPhone, session);
  return session;
}

function extractAge(text: string) {
  const ageMatch = text.match(/(\d{2})\s*(?:years|yrs|y)?/i);
  return ageMatch ? ageMatch[1] : undefined;
}

function extractHeight(text: string) {
  const ftInMatch = text.match(/(\d)\s*(?:feet|ft|'|f)\s*(\d{1,2})?\s*(?:inches|in|"|inch)?/i);
  if (ftInMatch) {
    const feet = Number(ftInMatch[1]);
    const inches = Number(ftInMatch[2] || 0);
    return Math.round((feet * 12 + inches) * 2.54);
  }

  const cmMatch = text.match(/(\d{2,3}(?:\.\d+)?)\s*(?:cm|centimeters|centimetres)/i);
  if (cmMatch) {
    return Math.round(Number(cmMatch[1]));
  }

  return undefined;
}

function extractWeight(text: string) {
  const kgMatch = text.match(/(\d{2,3}(?:\.\d+)?)\s*(?:kg|kgs|kilograms)/i);
  if (kgMatch) {
    return Number(kgMatch[1]);
  }

  const lbMatch = text.match(/(\d{2,3}(?:\.\d+)?)\s*(?:lb|lbs|pounds)/i);
  if (lbMatch) {
    return Number(lbMatch[1]) * 0.453592;
  }

  return undefined;
}

function computeBMI(weightKg: number, heightCm: number) {
  return weightKg / ((heightCm / 100) ** 2);
}

function buildEligibilityPrompt() {
  return `${BASE_INTRO}\n\nTo check whether you are eligible, I need a few basic details: age, height, weight, medical history, current medicines, and whether you have diabetes, thyroid disease, pancreatitis, kidney disease, or any major health condition.`;
}

function buildCollectedInfoReply(session: WhatsAppSession) {
  const age = session.collected?.age ? `${session.collected.age} years` : "unknown age";
  const height = session.collected?.height ? `${session.collected.height} cm` : "unknown height";
  const weight = session.collected?.weight ? `${session.collected.weight} kg` : "unknown weight";
  const conditions = session.collected?.conditions ? ` ${session.collected.conditions}` : "";

  let bmiSentence = "";
  if (session.collected?.weight && session.collected?.height) {
    const bmi = computeBMI(Number(session.collected.weight), Number(session.collected.height));
    bmiSentence = `Your BMI appears to be ${bmi.toFixed(1)}, which is in the obesity range.`;
  }

  return `${BASE_INTRO}\n\nThank you. I have noted: ${age}, ${height}, ${weight}.${conditions} ${bmiSentence} Fatty liver and metabolic risk factors are important and need medical review. You may be suitable for a doctor-guided program, but final approval must come from the doctor.\n\nThe next steps are:\n1. Complete eligibility form\n2. Upload or book baseline blood tests\n3. Consult with a doctor\n4. Receive a personalized plan\n5. Start subscription only if medically approved\n\n${ELIGIBILITY_CTA}`;
}

function getDirectResponse() {
  return `Genestac does not directly sell prescription fat-loss medicines without medical review. Our program is a doctor-monitored weight-loss and metabolic-health program. If a doctor finds you eligible, prescription-based therapy may be included in your plan. ${ELIGIBILITY_CTA}`;
}

export async function getWhatsAppAgentReply(userMessage: string, phone: string) {
  const cleanPhone = phone.replace(/\D/g, "");
  const session = await getSession(cleanPhone);
  session.history.push(userMessage);
  session.lastUpdated = Date.now();

  const restartMatch = /\b(reset|restart|start over|new conversation|new case|hello|hi|hey)\b/i;
  if (restartMatch.test(userMessage)) {
    await persistSession(cleanPhone, resetSession(cleanPhone));
    return `${BASE_INTRO}\n\n${buildEligibilityPrompt()}`;
  }

  const directOrderMatch = /\b(buy|order|directly).*injection|\bbuy.*injection|\border.*injection|\bdirect.*buy|\bbuy.*glp\b/i;
  if (directOrderMatch.test(userMessage)) {
    await persistSession(cleanPhone, session);
    return getDirectResponse();
  }

  if (session.stage === "INIT") {
    session.stage = "ELIGIBILITY_PROMPTED";
    await persistSession(cleanPhone, session);
    return buildEligibilityPrompt();
  }

  if (session.stage === "ELIGIBILITY_PROMPTED") {
    const age = extractAge(userMessage);
    const height = extractHeight(userMessage);
    const weight = extractWeight(userMessage);
    const conditions = /diabetes|prediabetes|thyroid|pancreatitis|kidney|liver|fatty liver|pcos|hypertension/i.test(userMessage)
      ? userMessage
      : undefined;

    if (age || height || weight || conditions) {
      session.collected = {
        age: age ?? session.collected?.age,
        height: height ? String(height) : session.collected?.height,
        weight: weight ? String(Number(weight.toFixed(1))) : session.collected?.weight,
        conditions: conditions || session.collected?.conditions,
        medicines: session.collected?.medicines,
      };
      session.stage = "INFO_COLLECTED";
      await persistSession(cleanPhone, session);
      return buildCollectedInfoReply(session);
    }

    return `I still need a few details to check eligibility. Please share your age, height, weight, current medicines, and any major health conditions such as diabetes, thyroid disease, pancreatitis, kidney disease, or fatty liver.`;
  }

  if (session.stage === "INFO_COLLECTED") {
    session.stage = "FORM_SHARED";
    await persistSession(cleanPhone, session);
    return `Thanks. The safest next step is to complete the eligibility form so our medical team can review your case and schedule the doctor consultation. ${ELIGIBILITY_CTA}`;
  }

  if (session.stage === "FORM_SHARED") {
    const doneMatch = /\b(done|submitted|completed|filled|uploaded|yes)\b/i;
    if (doneMatch.test(userMessage)) {
      session.stage = "CONSULTATION_OFFERED";
      await persistSession(cleanPhone, session);
      return `Great. Once your eligibility form is submitted, our medical team will review your profile and share the consultation link. After doctor approval, your personalized program and subscription plan can begin.`;
    }
    await persistSession(cleanPhone, session);
    return `Have you completed the eligibility form? Once it is submitted, our team will review the details and help you book the doctor consultation.`;
  }

  if (session.stage === "CONSULTATION_OFFERED") {
    const payMatch = /\b(pay|payment|link|checkout|consultation fee|book.*consult)\b/i;
    if (payMatch.test(userMessage)) {
      session.stage = "SUBSCRIPTION_OFFERED";
      await persistSession(cleanPhone, session);
      return `You can pay for the consultation after your eligibility form is reviewed. We will send the consultation payment link on the same form page once your details are confirmed.`;
    }
    await persistSession(cleanPhone, session);
    return `Your consultation payment link will be shared once the medical team reviews your eligibility form. This ensures the plan is safe and medically appropriate before you subscribe.`;
  }

  return `${BASE_INTRO}\n\nThe safest next step is doctor review and eligibility screening. Please complete the eligibility form so our medical team can review your case safely: ${WHATSAPP_ELIGIBILITY_URL}`;
}
