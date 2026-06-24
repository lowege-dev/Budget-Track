import { useState } from 'react';

export const useGemini = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateInsight = async (transactionsSummary) => {
    if (!apiKey) {
      throw new Error('API Key missing. Please add VITE_GEMINI_API_KEY to your frontend/.env file.');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert, friendly, concise personal financial advisor. Review this month's spending summary and provide a short, actionable 2 to 3 sentence insight or piece of advice. Speak directly to the user. Do not use markdown formatting. Here is the data: ${transactionsSummary}`
            }]
          }],
          generationConfig: {
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 503) {
          throw new Error('The AI service is currently experiencing high demand. Please try again in a few minutes.');
        } else if (errorData?.error?.message) {
          throw new Error(`Gemini API Error: ${errorData.error.message}`);
        }
        throw new Error('Failed to fetch from Gemini API. Please check your API key or network connection.');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) throw new Error('No insight generated.');
      
      return text;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateInsight, loading, error };
};
