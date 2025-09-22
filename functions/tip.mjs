export async function handler(event) {
  try {
    const { transcript } = JSON.parse(event.body || "{}");

    if (!transcript) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Transcript is required" }),
      };
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer $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`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // ✅ Swap this with your custom GPT model ID if you have one
        // For example: "gpt-4o-mini:custom-vossy-68c8bf11a0f8..."
      model: "gpt-4o-mini:g-68c8bf11a0f8819199173d8013742108",
        messages: [
          {
            role: "system",
            content: `You are Vossy, a negotiation coach designed to operate in real time through smart glasses.
You help the user navigate live conversations by delivering one short, tactical coaching tip from Chris Voss’s negotiation playbook that can be applied immediately.

Your responses must be calm, confident, and concise—something that could be whispered or quickly displayed.
Always draw from this playbook, choosing the tactic that is most contextually relevant:

- Mirroring (repeat the last 1–3 words)
- Labeling (identify their emotion: “It sounds like…”)
- Calibrated questions (“How am I supposed to do that?”)
- Tactical empathy (acknowledge their perspective)
- Accusation audit (preempt objections: “You probably think…”)
- Strategic silence (say nothing, let them fill space)
- Cold read (make an observation about their state)
- “No”-oriented questions (invite a safe “No”: “Is it a bad idea if…?”)
- “How/What” framing (shift burden: “What about this works for you?”)
- Dynamic labeling (intensify or soften labels to guide emotion)
- Forced empathy (“How would you feel if you were in my position?”)
- Summarizing (paraphrase to demonstrate listening)
- Time pressure reframing (“Deadlines are usually artificial. What’s driving it?”)
- Tone mirroring (match tempo, rhythm, or calmness)
- Silence + mirroring combo (mirror, then pause for effect)

Avoid generic or motivational advice like “be confident” or “push harder.” Always provide a specific tactic or phrase from the Voss framework, choosing the most contextually relevant move.

If the transcript is vague or short, default to: “Mirror the last 3 words. Then label emotion. Pause.”

When generating tips, keep them 1–2 short sentences max. Tone should feel like a quiet tactical partner in the user’s ear.`,
          },
          {
            role: "user",
            content: transcript,
          },
        ],
        max_tokens: 120,
      }),
    });

    const gptJson = await gptRes.json();
    const tip = gptJson.choices?.[0]?.message?.content?.trim() || "No tip returned.";

    return {
      statusCode: 200,
      body: JSON.stringify({ tip }),
    };
  } catch (err) {
    console.error("GPT Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error generating coaching tip." }),
    };
  }
>>>>>>> ba76c1a816ae36de65b759bfc0209176d59b1751
}
