let socket;
let sentenceBatch = [];
let isStreaming = false;

const tip = document.getElementById('tip');
const history = document.getElementById('history');
const chatHistory = document.getElementById('chat-history');
const status = document.getElementById('status');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const saveBtn = document.getElementById('save-session');

// ✅ Fetch Deepgram API key securely from Netlify function
async function getDeepgramKey() {
  const res = await fetch("/api/get-deepgram-key");
  const data = await res.json();
  return data.key;
}

async function connectDeepgram() {
  const DEEPGRAM_API_KEY = await getDeepgramKey();

  socket = new WebSocket("wss://api.deepgram.com/v1/listen", [
    "token",
    DEEPGRAM_API_KEY
  ]);

  socket.onopen = () => {
    console.log("Connected to Deepgram");
    status.innerText = "Listening...";
    status.style.background = "rgba(0,255,136,0.25)";
    startStreaming();
  };

  socket.onmessage = async (message) => {
    const data = JSON.parse(message.data);
    const transcript = data.channel?.alternatives[0]?.transcript;

    if (transcript && data.is_final) {
      addBubble(transcript, "user");
      sentenceBatch.push(transcript);

      if (sentenceBatch.length >= 2) {
        const fullText = sentenceBatch.join(". ") + ".";
        sentenceBatch = [];

        const typingIndicator = document.createElement("div");
        typingIndicator.classList.add("typing");
        typingIndicator.innerHTML = `
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        `;
        history.appendChild(typingIndicator);
        history.scrollTop = history.scrollHeight;

        const res = await fetch('/api/tip', {
          method: 'POST',
          body: JSON.stringify({ transcript: fullText })
        });
        const result = await res.json();

        history.removeChild(typingIndicator);

        if (result.tip) {
          tip.innerText = result.tip;
          addBubble(result.tip, "coach");
          addToHistory(fullText, "user");
          addToHistory(result.tip, "coach");
        }
      }
    }
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
    status.innerText = "WebSocket Error";
    status.style.background = "rgba(255,67,67,0.25)";
  };
}

async function startStreaming() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

  mediaRecorder.ondataavailable = (event) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(event.data);
    }
  };

  mediaRecorder.start(500);
  isStreaming = true;

  stopBtn.onclick = () => {
    if (isStreaming) {
      mediaRecorder.stop();
      socket.close();
      isStreaming = false;
      status.innerText = "Stopped.";
      status.style.background = "rgba(255,255,255,0.1)";
    }
  };
}

startBtn.onclick = () => {
  sentenceBatch = [];
  tip.innerText = "...";
  history.innerHTML = "";
  chatHistory.innerHTML = "";
  connectDeepgram();
};

function addBubble(text, type) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", type);
  bubble.innerText = text;
  history.appendChild(bubble);
  history.scrollTop = history.scrollHeight;
}

function addToHistory(text, type) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", type);
  bubble.innerText = text;
  chatHistory.appendChild(bubble);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

saveBtn.onclick = () => {
  let content = "Vossy Coaching Session\n\n";
  document.querySelectorAll("#chat-history .bubble").forEach(bubble => {
    const who = bubble.classList.contains("user") ? "You" : "Coach";
    content += `${who}: ${bubble.innerText}\n\n`;
  });
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "vossy_session.txt"; a.click();
  URL.revokeObjectURL(url);
};
