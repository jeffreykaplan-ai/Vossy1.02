import fetch from "node-fetch";
import FormData from "form-data";

export async function handler(event) {
  try {
    const { audioBase64 } = JSON.parse(event.body || "{}");

    if (!audioBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing audioBase64 input" }),
      };
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error("Missing OPENAI_API_KEY in environment variables");
    }

    // Build form data for Whisper API
    const formData = new FormData();
    formData.append("file", Buffer.from(audioBase64, "base64"), {
      filename: "audio.webm",
      contentType: "audio/webm",
    });
    formData.append("model", "whisper-1");

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiApiKey}` },
      body: formData,
    });

    const json = await res.json();

    // Log for debugging
    console.log("Whisper response:", json);

    return {
      statusCode: 200,
      body: JSON.stringify(json),
    };
  } catch (err) {
    console.error("Whisper error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
