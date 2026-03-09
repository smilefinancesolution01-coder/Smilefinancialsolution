// SMILE FINANCIAL AI - SECURE VERSION
// Yahan koi bhi key nahi honi chahiye (No hardcoded keys)

const msgContainer = document.getElementById('ai-messages');
const aiInput = document.getElementById('ai-input');
let synth = window.speechSynthesis;

// 1. Logic to fetch from Vercel Environment
// Hum yahan window object check karenge
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

async function getSmileAIResponse() {
    const userText = aiInput.value.trim();
    if (!userText) return;

    appendMessage('user', userText);
    aiInput.value = '';

    try {
        // IMPORTANT: Yahan hum Vercel ke proxy ka wait karte hain 
        // Agar aapne Vercel me NEXT_PUBLIC_ prefix use kiya hai tabhi frontend dekh payega
        const response = await fetch(`${GEMINI_API_URL}?key=${window.NEXT_PUBLIC_GEMINI_KEY || 'AIza...' }`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Role: Smile Financial Expert. No symbols. Professional English. Focus: PMEGP, 20L Grant, Loans. User: ${userText}` }] }]
            })
        });

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        const cleanReply = rawText.replace(/[*_#~]/g, '').trim();

        appendMessage('bot', cleanReply);
    } catch (error) {
        appendMessage('bot', "Technical update in progress. Please call 8586051944 for immediate support.");
    }
}

function appendMessage(role, content) {
    const msgDiv = document.createElement('div');
    msgDiv.className = role === 'user' 
        ? 'bg-blue-600 text-white p-4 rounded-3xl rounded-tr-none ml-auto max-w-[85%] shadow-md mb-4' 
        : 'bg-white text-slate-800 p-4 rounded-3xl rounded-tl-none mr-auto max-w-[85%] border border-gray-100 shadow-md mb-4 relative';

    msgDiv.innerText = content;
    
    if (role === 'bot') {
        const speaker = document.createElement('button');
        speaker.className = "ml-2 text-blue-500 hover:text-blue-700 transition";
        speaker.innerHTML = '<i class="fas fa-volume-up"></i>';
        speaker.onclick = () => {
            const utter = new SpeechSynthesisUtterance(content.split('.')[0]);
            utter.lang = 'en-IN';
            window.speechSynthesis.speak(utter);
        };
        msgDiv.appendChild(speaker);
    }

    msgContainer.appendChild(msgDiv);
    msgContainer.scrollTo({ top: msgContainer.scrollHeight, behavior: 'smooth' });
}

document.getElementById('send-ai').onclick = getSmileAIResponse;
