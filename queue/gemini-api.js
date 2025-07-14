const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini(userPrompt) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in .env");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ]
    };

    const headers = {
      'Content-Type': 'application/json'
    };

    const response = await axios.post(url, body, { headers });
    console.log("resss", response)
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || ' Gemini returned an empty response.';
  } catch (err) {
    console.error('Gemini API Error:', err.response?.data || err.message);
    return 'Error calling Gemini API.';
  }
}

module.exports = callGemini;
