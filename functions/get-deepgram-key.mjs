export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      key: process.env.DEEPGRAM_API_KEY
    })
  };
}
