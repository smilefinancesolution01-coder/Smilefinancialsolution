// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { prompt } = req.body;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const PEXELS_KEY = process.env.PEXELS_API_KEY;

    try {
        // Check for Image Request
        if (prompt.toLowerCase().includes("show") || prompt.toLowerCase().includes("image")) {
            const pexRes = await fetch(`https://api.pexels.com/v1/search?query=${prompt}&per_page=1`, {
                headers: { Authorization: PEXELS_KEY }
            });
            const pexData = await pexRes.json();
            return res.status(200).json({ image: pexData.photos[0]?.src?.large });
        }

        // Default: Gemini Chat
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are Smile AI. Expert in PMEGP and Business Loans. Founder: Mohmmad Aarif. Reply professionally in English without symbols like * or #. User: ${prompt}` }] }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
