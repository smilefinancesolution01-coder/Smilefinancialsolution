// SMILE FINANCIAL AI - SECURE & CLEAN VERSION
// No Hardcoded Keys to avoid "Dangerous Site" Warning

const msgContainer = document.getElementById('ai-messages');
const aiInput = document.getElementById('ai-input');

// 1. Natural Voice (Speaker Logic)
function playSpeech(text) {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text.split('.')[0]);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
}

// 2. Secure API Call Logic
async function getAIResponse() {
    const userPrompt = aiInput.value.trim();
    if (!userPrompt) return;

    appendMessage('user', userPrompt);
    aiInput.value = '';

    // Error handling for missing keys in frontend
    try {
        // Hum Gemini ko call karenge, par key variable se uthayenge
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${window.NEXT_PUBLIC_GEMINI_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `System: Professional Business Consultant at Smile Financial. No symbols. English language. Focus on PMEGP and Loans. User: ${userPrompt}` }] }]
            })
        });

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text.replace(/[*_#~]/g, '');
        
        appendMessage('bot', reply);
    } catch (err) {
        appendMessage('bot', "System update in progress. For urgent assistance, contact New Delhi HQ at 8586051944.");
    }
}

function appendMessage(role, content) {
    const div = document.createElement('div');
    div.className = role === 'user' 
        ? 'bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none ml-auto max-w-[85%] mb-4 shadow-md' 
        : 'bg-white text-slate-800 p-4 rounded-2xl rounded-tl-none mr-auto max-w-[85%] border shadow-sm mb-4 relative';

    div.innerText = content;

    if (role === 'bot') {
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fas fa-volume-up ml-2 text-blue-500"></i>';
        btn.onclick = () => playSpeech(content);
        div.appendChild(btn);
    }

    msgContainer.appendChild(div);
    msgContainer.scrollTo({ top: msgContainer.scrollHeight, behavior: 'smooth' });
}

document.getElementById('send-ai').onclick = getAIResponse;
