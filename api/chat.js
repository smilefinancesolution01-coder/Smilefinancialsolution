// /api/chat.js
export default async function handler(req, res) {
    const { prompt } = req.body;
    
    // Yahan API Key server-side se uthayi jayegi (Bilkul Safe)
    const GEMINI_KEY = process.env.GEMINI_API_KEY; 

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Role: Senior Financial Consultant at Smile Financial Solution. 8 years exp. Avoid symbols like * or #. Answer: ${prompt}` }] }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to AI Engine" });
    }
}
