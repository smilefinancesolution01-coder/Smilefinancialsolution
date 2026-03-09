const msgContainer = document.getElementById('ai-messages');
const aiInput = document.getElementById('ai-input');
const sendBtn = document.getElementById('send-ai');
const micBtn = document.getElementById('mic-btn');

// --- 1. VOICE RECOGNITION (Mic Logic) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    micBtn.onclick = () => {
        recognition.start();
        micBtn.classList.add('text-red-600', 'animate-pulse');
    };
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        aiInput.value = transcript;
        micBtn.classList.remove('text-red-600', 'animate-pulse');
        handleAIResponse();
    };
}

// --- 2. MAIN AI RESPONSE LOGIC ---
async function handleAIResponse() {
    const prompt = aiInput.value.trim();
    if (!prompt) return;

    appendMsg('user', prompt);
    aiInput.value = '';
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const response = await fetch('/api/chat', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await response.json();

        // Check for Image
        if (data.image) {
            appendMsg('bot', `<img src="${data.image}" class="rounded-2xl mt-2 w-full shadow-lg">`, true);
        }
        
        // Check for Text
        if (data.text) {
            appendMsg('bot', data.text);
        }

    } catch (err) {
        appendMsg('bot', "System busy. Please call Mohmmad Aarif at 8586051944.");
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
    }
}

// --- 3. HELPER FUNCTIONS ---
function appendMsg(role, content, isHTML = false) {
    const div = document.createElement('div');
    div.className = role === 'user' 
        ? 'bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none ml-auto max-w-[85%] mb-4 shadow-md text-sm' 
        : 'bg-white text-slate-800 p-4 rounded-2xl rounded-tl-none mr-auto max-w-[85%] border border-slate-100 shadow-sm mb-4 text-sm';
    
    if (isHTML) div.innerHTML = content;
    else div.innerText = content;

    msgContainer.appendChild(div);
    msgContainer.scrollTo({ top: msgContainer.scrollHeight, behavior: 'smooth' });
}

function toggleChat() {
    const chat = document.getElementById('ai-chat-window');
    chat.classList.toggle('hidden');
}

// --- 4. CLICK EVENTS ---
sendBtn.onclick = handleAIResponse;
aiInput.onkeypress = (e) => { if (e.key === 'Enter') handleAIResponse(); };

// PDF Upload Logic Placeholder
document.getElementById('pdf-upload').onchange = () => {
    appendMsg('bot', "PDF detected. Our Gemini module is analyzing the document for loan eligibility. Please wait...");
};
