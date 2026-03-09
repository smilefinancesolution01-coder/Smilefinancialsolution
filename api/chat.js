export default async function handler(req, res) {
    // 1. Sirf POST request allow karein
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const GROQ_KEY = process.env.GROQ_API_KEY;
    const PEXELS_KEY = process.env.PEXELS_API_KEY;

    // Safety Check: Agar keys missing hain
    if (!GROQ_KEY || !PEXELS_KEY) {
        return res.status(500).json({ error: "Vercel Environment Keys are missing!" });
    }

    try {
        // --- LOGIC A: IMAGE SEARCH (Pexels) ---
        // Agar prompt mein "show", "image", "photo" ya "picture" ho
        const imageKeywords = ["show", "image", "photo", "picture", "dikhao", "image generator"];
        const needsImage = imageKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

        if (needsImage) {
            const pexRes = await fetch(`https://api.pexels.com/v1/search?query=${prompt}&per_page=1`, {
                headers: { Authorization: PEXELS_KEY }
            });
            const pexData = await pexRes.json();
            
            if (pexData.photos && pexData.photos.length > 0) {
                return res.status(200).json({ 
                    image: pexData.photos[0].src.large,
                    text: "Here is the visual information you requested." 
                });
            }
        }

        // --- LOGIC B: PROFESSIONAL CHAT (Groq) ---
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { 
                        role: "system", 
                        content: "You are Smile AI. Founder: Mohmmad Aarif. Professional financial consultant with 8 years experience in Patel Nagar, New Delhi. Handle PMEGP, MSME Loans, and Business Funding. Answer in clean professional English or Hindi. STRIKINGLY IMPORTANT: Never use symbols like *, #, or _. Use plain text only." 
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0].message) {
            const cleanReply = data.choices[0].message.content.replace(/[*_#~]/g, '').trim();
            return res.status(200).json({ text: cleanReply });
        } else {
            throw new Error("Invalid response from Groq");
        }

    } catch (error) {
        console.error("Critical Error:", error.message);
        return res.status(500).json({ error: "Server busy. Contact 8586051944." });
    }
}
