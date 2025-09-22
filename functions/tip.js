import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const { transcript } = body;
    if (!transcript) {
      return { statusCode: 400, body: JSON.stringify({ error: "Transcript is required" }) };
    }
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Vossy, a concise speaking coach. Provide short, actionable tips about communication, clarity, and delivery." },
        { role: "user", content: transcript }
      ],
      max_tokens: 100
    });
    const tip = completion.choices[0].message?.content?.trim() || "No tip generated.";
    return { statusCode: 200, body: JSON.stringify({ tip }) };
  } catch (err) {
    console.error("Error in /functions/tip.js:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
}