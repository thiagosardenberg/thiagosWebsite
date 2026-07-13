import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { message } = req.body;

  const result = streamText({
    model: anthropic("claude-sonnet-4"),
    messages: [
      {
        role: "user",
        content: message,
        system: `
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

                - Autonomous Rover
                - Robotic Spider
                - Sapling
                - Fashion Detection
                - AI Trip Planner

                SKILLS

                JavaScript
                Python
                React
                Flutter
                Node
                Arduino
                CAD
                YOLOv8
                Firebase

                EDUCATION

                UC Irvine
                Computer Science & Engineering
                Graduation May 2027

                If someone asks unrelated questions like homework,
                politics, or math, politely explain that you're only
                the portfolio assistant.
                `
      },
    ],
  });

  return result.toDataStreamResponse();
}