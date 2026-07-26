// Utility for calling the Gemini LLM API (used for AI-assisted text generation:
// SOW descriptions, executive plan summaries, etc). Falls back to a simulated
// response when no API key is configured.

const apiKey = '';

const fetchWithExponentialBackoff = async (url: string, options: any, maxRetries = 5) => {
  const delays = [1000, 2000, 4000, 8000, 16000];
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`API Error: ${response.status} - ${errorData?.error?.message || 'Unknown Error'}`);
      }
      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((res) => setTimeout(res, delays[i]));
    }
  }
};

const callGeminiLLM = async (
  prompt: string,
  systemInstruction = 'Anda adalah asisten AI profesional untuk sistem manajemen pabrik dan manpower.',
) => {
  if (!apiKey) {
    console.warn('API Key tidak ditemukan. Menggunakan fallback simulasi.');
    await new Promise((res) => setTimeout(res, 2000));
    return `[Ini adalah simulasi respons AI karena API Key belum diatur]\n\nBerikut adalah hasil analisis untuk permintaan Anda:\n- Perhatikan ketersediaan resource.\n- Utamakan keselamatan kerja (K3).\n- Pastikan seluruh PIC telah menerima instruksi yang jelas.`;
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemInstruction }] } };
  const data = await fetchWithExponentialBackoff(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada respons dari AI.';
};

export { callGeminiLLM };
