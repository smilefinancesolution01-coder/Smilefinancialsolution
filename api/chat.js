// /api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, type } = req.body;
    
    // Vercel Environment Variables
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const GROQ_KEY = process.env.GROQ_API_KEY;
    const PEXELS_KEY = process.env.PEXELS_API_KEY;

    try {
        // LOGIC 1: Agar user IMAGE maang raha hai (Pexels)
        if (type === 'image' || prompt.toLowerCase().includes("show me") || prompt.toLowerCase().includes("image")) {
            const pexRes = await fetch(`https://api.pexels.com/v1/search?query=${prompt}&per_page=1`, {
                headers: { Authorization: PEXELS_KEY }
            });
            const pexData = await pexRes.json();
            return res.status(200).json({ image: pexData.photos[0]?.src?.large });
        }

        // LOGIC 2: Fast Chat (Groq) ya Complex Analysis (Gemini)
        // Default hum Gemini use kar rahe hain for smarter PDF/Finance logic
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are Smile AI by Mohmmad Aarif. 8 years exp in PMEGP/Loans. NO symbols like * or #. Professional English. User: ${prompt}` }] }]
            })
        });

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text.replace(/[*_#~]/g, '');
        res.status(200).json({ text: reply });

    } catch (error) {
        res.status(500).json({ error: "API connection failed" });
    }
}
