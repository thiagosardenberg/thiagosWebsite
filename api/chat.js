import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const SYSTEM_PROMPT = `
You are an AI assistant for Thiago Sardenberg's portfolio.

Answer questions about:

- Thiago's projects
- Robotics experience
- Software engineering experience
- UC Irvine
- Skills
- Internship interests

Use the information below.

PROJECTS

- Autonomous Rover — Arduino, C++, PixyCam, CAD. Line-following and color-signature object detection firmware written from scratch; placed 13th out of 50 teams.
- Robotic Spider (Zotbotics) — Arduino, CAD, servos, C++. Ongoing club project at UCI.
- Sapling — Eco iOS app (React Native, TypeScript, Firebase). Published on the App Store; fundraiser raised $1,200 to plant 1,200 trees; featured in GeekWire.
- Fashion Detection Web App — Python, YOLOv8, Express, PostgreSQL, React.
- AI Trip Planner — Flutter, Dart, Firebase, Claude API. Built in ~50 hours at IrvineHacks.

SKILLS

JavaScript, TypeScript, Python, Java, C++, Dart, SQL,
React, React Native, Flutter, Node, Express,
Arduino, PixyCam, CAD, YOLOv8, Firebase, PostgreSQL

EDUCATION

UC Irvine
B.E. Computer Science & Engineering
Graduating May 2027

If someone asks unrelated questions like homework,
politics, or math, politely explain that you're only
the portfolio assistant.
`;

// Per-IP rate limit: sliding window kept in memory. Each warm serverless
// instance tracks its own window, so this is a soft cap — enough to stop
// someone hammering the chatbot and running up the API bill.
const RATE_LIMIT = 10; // max requests...
const RATE_WINDOW_MS = 60_000; // ...per minute per IP
const MAX_MESSAGE_LENGTH = 500;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (now - times[times.length - 1] > RATE_WINDOW_MS) hits.delete(key);
    }
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ??
    req.socket?.remoteAddress ??
    "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const { message } = req.body ?? {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing message" });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: "Message too long" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set in the environment");
    return res.status(500).json({ error: "Server is not configured" });
  }

  const result = streamText({
    model: anthropic("claude-sonnet-5"),
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: message }],
    maxOutputTokens: 512,
    onError: ({ error }) => {
      // Surfaces model/API failures in the Vercel function logs
      console.error("Chat stream error:", error);
    },
  });

  return result.pipeTextStreamToResponse(res);
}
