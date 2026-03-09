// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt } = req.body;
    const GROQ_KEY = process.env.GROQ_API_KEY;
    const PEXELS_KEY = process.env.PEXELS_API_KEY;

    try {
        // 1. Image Logic (Pexels)
        if (prompt.toLowerCase().includes("show") || prompt.toLowerCase().includes("image")) {
            const pexRes = await fetch(`https://api.pexels.com/v1/search?query=${prompt}&per_page=1`, {
                headers: { Authorization: PEXELS_KEY }
            });
            const pexData = await pexRes.json();
            if (pexData.photos?.length > 0) {
                return res.status(200).json({ image: pexData.photos[0].src.large });
            }
        }

        // 2. Fast Chat Logic (Groq API)
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: "You are Smile AI, a financial consultant for Smile Financial Solution. Founder: Mohmmad Aarif. 8 years exp. No symbols like * or #. Professional English only." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0].message.content) {
            const cleanText = data.choices[0].message.content.replace(/[*_#~]/g, '');
            return res.status(200).json({ text: cleanText });
        } else {
            throw new Error("Groq API Response Invalid");
        }

    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
