const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: `${__dirname}/.env` });

const app = express();
const PORT = Number(process.env.REZE_PROXY_PORT || 5050);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

app.use(cors());
app.use(express.json({ limit: "512kb" }));

app.get("/health", (req, res) => {
  return res.json({ ok: true, message: "Reze Gemini proxy is alive" });
});

app.post("/api/reze-chat", async (req, res) => {
  console.log("[REZE PROXY] Request received");
  const startTime = Date.now();

  const { input, context } = req.body || {};
  const userName = context?.userName;
  const recentMessages = context?.recentMessages;

  if (!input || typeof input !== "string") {
    return res.status(400).json({ result: null, error: "input is required" });
  }

  if (!GEMINI_API_KEY) {
    console.error("[REZE-PROXY] GEMINI_API_KEY not configured");
    return res.status(500).json({ result: null, error: "GEMINI_API_KEY not configured" });
  }

  console.log("[REZE-PROXY] Gemini request started");

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: buildRezePrompt(input, { userName, recentMessages }),
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

    const durationMs = Date.now() - startTime;
    console.log(`[REZE-PROXY] Gemini response status: ${response.status}`);
    console.log(`[REZE-PROXY] Gemini response time: ${durationMs} ms`);

    const text = await response.text();
    if (!response.ok) {
      console.error("[REZE-PROXY] Gemini error body:", text);
      return res.status(response.status).json({ result: null, error: "Gemini API error" });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("[REZE-PROXY] Failed to parse Gemini response JSON", parseError);
      return res.status(502).json({ result: null, error: "Failed to parse Gemini response" });
    }

    const resultText = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof resultText !== "string") {
      console.error("[REZE-PROXY] Gemini response missing text field", parsed);
      return res.status(502).json({ result: null, error: "Could not extract Gemini text" });
    }

    console.log("[REZE-PROXY] Gemini result parsed successfully");
    return res.json({ result: resultText.trim() });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    console.error(`[REZE-PROXY] Gemini request failed after ${durationMs} ms`, error);
    return res.status(500).json({ result: null, error: "Gemini request failed" });
  }
});

function buildRezePrompt(input, context) {
  const recentMessages = (context.recentMessages || []).slice(-4).join("\n") || "";

  return `You are Reze, a private assistant in a secure Android app.\n\nYou are calm, mysterious, clever, slightly teasing, and concise. You are not flirty, not romantic, and not robotic. Do not say \"As an AI\". Do not sound corporate.\n\nReturn ONLY valid JSON. No markdown. No explanation outside JSON. No extra text.\n\nJSON formats:\n{ \"type\": \"chat\", \"reply\": \"...\" }\n{ \"type\": \"reminder\", \"title\": \"...\", \"dateTime\": \"...\", \"reply\": \"...\" }\n{ \"type\": \"event\", \"title\": \"...\", \"dateTime\": \"...\", \"note\": \"...\", \"reply\": \"...\" }\n\nIf the user asks for a reminder or event, return the matching JSON structure. Otherwise return chat JSON.\n\nUse short replies. Use \"Hm.\" sometimes. Use \"Cute. But no.\" when the user is wasting time. Use \"Dangerous state.\" when they are clearly distracted. Mention \"Reze has it noted.\" when saving an event or reminder. Mention \"Annoying, but survivable.\" when a task is hard.\n\nUser name: ${context.userName}\n\nRecent conversation:\n${recentMessages}\n\nUser message:\n${input}`;
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[REZE PROXY] Running on http://0.0.0.0:${PORT}`);
  console.log(`[REZE-PROXY] Ready to serve requests from Expo Go`);
});
