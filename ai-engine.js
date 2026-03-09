// KEYS
const GROQ_KEY = "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";
const PEXELS_KEY = "kfzzPEicE21y0WcDJEMhLn0eUETxYReptyKIbwehcGdtGB3oW4Ka7xYj";
const GEMINI_KEY = "AIzaSyCYGGCMq1GGKsvUs3m9eCoO6naVMT5bHuU";

const msgContainer = document.getElementById('ai-messages');
const aiInput = document.getElementById('ai-input');
let isSpeaking = false;

// 1. Image Generation (Pexels)
async function fetchPexelsImage(query) {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
        headers: { Authorization: PEXELS_KEY }
    });
    const data = await res.json();
    return data.photos[0]?.src.medium || '';
}

// 2. Natural Voice Logic
function speakText(text) {
    if (isSpeaking) { window.speechSynthesis.cancel(); isSpeaking = false; return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.onstart = () => isSpeaking = true;
    utterance.onend = () => isSpeaking = false;
    window.speechSynthesis.speak(utterance);
}

// 3. AI Logic (Groq + Gemini for PDF)
async function handleAI() {
    const prompt = aiInput.value;
    if (!prompt) return;

    appendMsg('user', prompt);
    aiInput.value = '';

    // Image Request Check
    if (prompt.toLowerCase().includes("generate image")) {
        const img = await fetchPexelsImage(prompt.replace("generate image", ""));
        appendMsg('bot', `<img src="${img}" class="rounded-lg mt-2">`, true);
        return;
    }

    // Call Groq / Gemini Flash
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `System: You are Smile Financial Assistant. Be professional. No symbols. No hashtags. Talk about PMEGP, 20L Grant, Loans, and 8 years experience. User: ${prompt}` }] }]
            })
        });

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text.replace(/[*_#]/g, ''); // Clear symbols
        
        appendMsg('bot', reply);
    } catch (e) {
        appendMsg('bot', "Technical error. Please call 8586051944.");
    }
}

function appendMsg(role, content, isHTML = false) {
    const div = document.createElement('div');
    div.className = role === 'user' ? 'bg-blue-600 text-white p-3 rounded-2xl ml-auto max-w-[85%]' : 'bg-white border p-3 rounded-2xl mr-auto max-w-[85%] shadow-sm';
    
    if (isHTML) div.innerHTML = content;
    else div.innerText = content;

    // Add Speaker Icon to Bot Message
    if (role === 'bot' && !isHTML) {
        const speakBtn = document.createElement('button');
        speakBtn.innerHTML = '<i class="fas fa-volume-up ml-2 text-blue-500"></i>';
        speakBtn.onclick = () => speakText(content);
        div.appendChild(speakBtn);
    }

    msgContainer.appendChild(div);
    msgContainer.scrollTo({ top: msgContainer.scrollHeight, behavior: 'smooth' });
}

document.getElementById('send-ai').onclick = handleAI;
