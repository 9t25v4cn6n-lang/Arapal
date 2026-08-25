// Gemini Flash adapter.
//
// One concrete implementation of the provider interface. DECISIONS §3 allows
// "configured Gemini Flash" for initial V1 while forbidding hard-wiring product
// logic to one provider — so the app calls the generic service (../index.js),
// never this file directly, and the key comes from local config, never the
// bundle.
//
// The request asks for JSON only; the response is handed to the caller's
// contract parser. Network/quup/format failures throw so the service can return
// an honest "unavailable" rather than a fabricated grade.

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models'

/**
 * @param {{apiKey:string, model:string}} config
 * @param {string} prompt
 * @returns {Promise<object>} parsed JSON object from the model
 */
export async function generateJson(config, prompt) {
  const url = `${ENDPOINT}/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
    }),
  })
  if (!res.ok) {
    throw new Error(`gemini request failed: ${res.status}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('gemini response contained no text')
  return JSON.parse(text)
}
