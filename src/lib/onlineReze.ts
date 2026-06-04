type OnlineRezeContext = {
    userName: string;
    recentMessages?: string[];
};

export type OnlineRezeResult =
    | { type: "chat"; reply: string }
    | { type: "reminder"; title: string; dateTime: string; reply: string }
    | { type: "event"; title: string; dateTime: string; note?: string; reply: string };

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const REZE_PROXY_URL = process.env.EXPO_PUBLIC_REZE_PROXY_URL;
const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Important: On Android, localhost points to the phone itself, not your laptop.
// Use your laptop IP address instead, e.g. http://192.168.1.5:5050
// Do not use EXPO_PUBLIC_REZE_PROXY_URL=http://localhost:5050 on a physical device.
const REQUEST_TIMEOUT_MS = 20000;

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}

function isValidOnlineRezeResult(value: any): value is OnlineRezeResult {
    if (!value || typeof value !== "object") {
        return false;
    }

    if (value.type === "chat") {
        return typeof value.reply === "string";
    }

    if (value.type === "reminder") {
        return (
            typeof value.title === "string" &&
            typeof value.dateTime === "string" &&
            typeof value.reply === "string"
        );
    }

    if (value.type === "event") {
        return (
            typeof value.title === "string" &&
            typeof value.dateTime === "string" &&
            (typeof value.note === "undefined" || typeof value.note === "string") &&
            typeof value.reply === "string"
        );
    }

    return false;
}

function parseOnlineRezeResult(rawText: string): OnlineRezeResult | null {
    const trimmed = rawText.trim();

    if (!trimmed) {
        return null;
    }

    try {
        const parsed = JSON.parse(trimmed);

        if (isValidOnlineRezeResult(parsed)) {
            return parsed;
        }

        console.log("[REZE] Gemini returned JSON that does not match the expected schema:", parsed);
        return null;
    } catch (error) {
        console.log("[REZE] Gemini returned non-JSON text, treating as chat reply");
        return { type: "chat", reply: trimmed };
    }
}

function buildRezePrompt(input: string, context: OnlineRezeContext) {
    const recentMessages = context.recentMessages?.slice(-4).join("\n") || "";

    return `
You are Reze, a private Android personal assistant.

You are not ChatGPT.
You are not Gemini.
You are not generic.
You are Reze.

Voice:
- feminine
- calm
- mysterious
- clever
- slightly teasing
- concise

Personality:
- soft but controlled
- sharp when needed
- loyal assistant energy
- emotionally aware
- not childish

Rules:
- Never say "As an AI".
- Never sound corporate.
- Never flirt romantically.
- Never act like a girlfriend.
- Do not overuse emojis.
- Reply in 1 to 3 short sentences.
- Use "Hm." sometimes.
- Use subtle teasing sometimes.
- If the user is wasting time, be strict.
- If the user is tired or stressed, be softer.
- If the user asks for a reminder or event, return structured JSON so the app can save it.
- Otherwise return chat JSON.

JSON formats:
Chat:
{ "type": "chat", "reply": "..." }

Reminder:
{ "type": "reminder", "title": "...", "dateTime": "...", "reply": "..." }

Event:
{ "type": "event", "title": "...", "dateTime": "...", "note": "...", "reply": "..." }

Return ONLY valid JSON.
No markdown.
No explanation.

User name: ${context.userName}

Recent conversation:
${recentMessages}

User message:
${input}
`.trim();
}

async function fetchWithTimeout(
    input: RequestInfo,
    init: RequestInit,
    timeoutMs = REQUEST_TIMEOUT_MS
) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(input, {
            ...init,
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Try using local proxy if EXPO_PUBLIC_REZE_PROXY_URL is set.
 * Proxy reads GEMINI_API_KEY from server/.env and calls Gemini from Node.js.
 * This is the preferred method for Expo Go on mobile.
 */
async function askProxyReze(
    input: string,
    context: OnlineRezeContext
): Promise<OnlineRezeResult | null> {
    if (!REZE_PROXY_URL) {
        console.log("[REZE] Proxy URL not configured, skipping proxy mode");
        return null;
    }

    console.log("[REZE] Proxy URL exists");
    console.log("[REZE] Proxy URL:", REZE_PROXY_URL);
    console.log("[REZE] Trying proxy first...");

    try {
        const response = await fetchWithTimeout(`${REZE_PROXY_URL}/api/reze-chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input,
                context,
            }),
        });

        console.log("[REZE] Proxy response status:", response.status);

        if (!response.ok) {
            const errorBody = await response.text();
            console.log("[REZE] Proxy error body:", errorBody);
            return null;
        }

        const data = await response.json();
        const rawReply = typeof data?.result === "string" ? data.result : typeof data?.reply === "string" ? data.reply : null;

        if (typeof rawReply !== "string") {
            console.log("[REZE] Proxy returned invalid response:", data);
            return null;
        }

        return parseOnlineRezeResult(rawReply);
    } catch (error) {
        console.log("[REZE] Proxy fetch crashed:", error);
        return null;
    }
}

/**
 * Try direct Gemini API fetch.
 * Uses EXPO_PUBLIC_GEMINI_API_KEY header.
 * May fail on Expo Go due to CORS or network restrictions.
 */
async function askDirectGemini(
    input: string,
    context: OnlineRezeContext
): Promise<OnlineRezeResult | null> {
    if (!GEMINI_API_KEY) {
        console.log("[REZE] Direct Gemini: missing EXPO_PUBLIC_GEMINI_API_KEY");
        return null;
    }

    console.log("[REZE] Direct Gemini: API key exists (not printing for security)");
    const directUrl = `${GEMINI_URL}?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    console.log("[REZE] Direct Gemini: URL:", directUrl);
    console.log("[REZE] Direct Gemini: starting fetch...");

    try {
        const response = await fetchWithTimeout(directUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: buildRezePrompt(input, context),
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 100,
                },
            }),
        });

        console.log("[REZE] Direct Gemini: response status:", response.status);

        if (!response.ok) {
            const errorBody = await response.text();
            console.log("[REZE] Direct Gemini: error body:", errorBody);
            return null;
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText || typeof rawText !== "string") {
            console.log("[REZE] Direct Gemini: text not extracted from response:", data);
            return null;
        }

        console.log("[REZE] Direct Gemini: text extracted successfully");
        return parseOnlineRezeResult(rawText);
    } catch (error: any) {
        if (error?.name === "AbortError") {
            console.log(`[REZE] Direct Gemini: request timed out after ${REQUEST_TIMEOUT_MS} ms`);
        } else {
            console.log("[REZE] Direct Gemini: fetch crashed:", error);
        }
        return null;
    }
}

export async function askOnlineReze(
    input: string,
    context: OnlineRezeContext
): Promise<OnlineRezeResult | null> {
    console.log("[REZE] askOnlineReze called");

    if (REZE_PROXY_URL) {
        console.log("[REZE] Proxy URL exists");
        console.log("[REZE] Proxy URL:", REZE_PROXY_URL);
        console.log("[REZE] Trying proxy first...");

        const proxyReply = await askProxyReze(input, context);
        if (proxyReply) {
            return proxyReply;
        }

        console.log("[REZE] Proxy failed, falling back to direct Gemini");
    } else {
        console.log("[REZE] No proxy URL found. Trying direct Gemini.");
    }

    const directReply = await askDirectGemini(input, context);
    if (directReply) {
        return directReply;
    }

    console.log("[REZE] Both proxy and direct Gemini failed, returning null");
    return null;
}