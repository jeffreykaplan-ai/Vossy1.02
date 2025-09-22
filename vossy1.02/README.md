# 🎙️ Vossy Coach

Real-time voice-to-coach app powered by Deepgram + GPT.

## Features
- Live transcription (Deepgram)
- AI coaching tips (OpenAI)
- Chat bubbles with glassmorphism design
- Typing indicator
- Clean session history
- Save session to text file

## Setup
1. Clone repo.
2. Put your Deepgram key in `main.js`.
3. Set your OpenAI key in Netlify environment variables (`OPENAI_API_KEY`).
4. Run locally with `netlify dev` or deploy to Netlify.

## Structure
- /public → frontend
- /assets → styles + scripts
- /functions → serverless functions
- netlify.toml → Netlify config
