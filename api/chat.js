// api/chat.js
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

    try {
        // Step 1: Check for Image Request
        if (prompt.toLowerCase().includes("show") || prompt.toLowerCase().includes("image")) {
            const pexRes = await fetch(`https://api.pexels.com/v1/search?query=${prompt}&per_page=1`, {
                headers: { Authorization: PEXELS_API_KEY }
            });
            const pexData = await pexRes.json();
            if (pexData.photos && pexData.photos.length > 0) {
                return res.status(200).json({ image: pexData.photos[0].src.large });
            }
        }

        // Step 2: Gemini AI Chat
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are Smile AI, a professional financial consultant for Smile Financial Solution. Founder: Mohmmad Aarif. Experience: 8 years. Task: Answer in professional English/Hindi. Do NOT use symbols like * or # or _. User: ${prompt}` }] }]
            })
        });

        const data = await response.json();
        
        // Safety check for Gemini response structure
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const cleanText = data.candidates[0].content.parts[0].text.replace(/[*_#~]/g, '');
            return res.status(200).json({ text: cleanText });
        } else {
            throw new Error("Invalid response from Gemini API");
        }

    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: "Server Error: " + error.message });
    }
}
