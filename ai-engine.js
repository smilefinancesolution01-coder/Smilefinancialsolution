// ai-engine.js - SECURE CLIENT SIDE
const msgContainer = document.getElementById('ai-messages');
const aiInput = document.getElementById('ai-input');

async function handleAIResponse() {
    const prompt = aiInput.value.trim();
    if (!prompt) return;

    appendMsg('user', prompt);
    aiInput.value = '';

    try {
        // Ab hum direct Gemini ko nahi, apne Vercel API ko call kar rahe hain
        const response = await fetch('/api/chat', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await response.json();
        const replyText = data.candidates[0].content.parts[0].text.replace(/[*_#~]/g, '').trim();
        appendMsg('bot', replyText);
    } catch (err) {
        appendMsg('bot', "System update in progress. Please contact HQ at 8586051944.");
    }
}

function appendMsg(role, content) {
    const div = document.createElement('div');
    div.className = role === 'user' 
        ? 'bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none ml-auto max-w-[85%] mb-4 shadow-lg text-sm' 
        : 'bg-white text-slate-800 p-4 rounded-2xl rounded-tl-none mr-auto max-w-[85%] border border-slate-100 shadow-md mb-4 relative text-sm';
    div.innerText = content;
    msgContainer.appendChild(div);
    msgContainer.scrollTo({ top: msgContainer.scrollHeight, behavior: 'smooth' });
}

document.getElementById('send-ai').onclick = handleAIResponse;
