export const WHATSAPP_API_BASE_URL = process.env.WHATSAPP_API_BASE_URL || "";
export const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || "v17.0";
export const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
export const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "";
export const WHATSAPP_ELIGIBILITY_URL = process.env.WHATSAPP_ELIGIBILITY_URL || "https://genestac.com/weightloss";

function requireWhatsAppConfig() {
  if (!WHATSAPP_API_BASE_URL || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
    throw new Error("WhatsApp environment variables are not configured.");
  }
}

export function normalizePhoneNumber(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function sendWhatsAppMessage(toPhone: string, message: string) {
  requireWhatsAppConfig();

  const cleanBaseUrl = WHATSAPP_API_BASE_URL.replace(/\/+$/g, "");
  const cleanVersion = WHATSAPP_API_VERSION.replace(/^\/+|\/+$/g, "");
  const cleanPhoneNumberId = WHATSAPP_PHONE_NUMBER_ID.replace(/^\/+|\/+$/g, "");
  const endpoint = /\/v\d+(?:\.\d+)?$/.test(cleanBaseUrl)
    ? `${cleanBaseUrl}/${cleanPhoneNumberId}/messages`
    : `${cleanBaseUrl}/${cleanVersion}/${cleanPhoneNumberId}/messages`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: normalizePhoneNumber(toPhone),
      type: "text",
      text: {
        body: message,
      },
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(`WhatsApp API error: ${JSON.stringify(result)}`);
  }

  return result;
}
