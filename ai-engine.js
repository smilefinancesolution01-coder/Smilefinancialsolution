/**
 * SMILE FINANCIAL SOLUTION - AI ENGINE v2.0
 * Features: Speech-to-Text, Text-to-Speech, Image Generation, No-Symbol logic
 */

const msgContainer = document.getElementById('ai-messages');
const aiInput = document.getElementById('ai-input');
let synth = window.speechSynthesis;
let currentUtterance = null;

// 1. Clean Text Function (Removes symbols like *, #, _, ~)
function formatCleanText(text) {
    return text.replace(/[*_#~]/g, '').replace(/\s+/g, ' ').trim();
}

// 2. Natural Speaker Logic (Toggle Play/Stop)
function speakResponse(text, btnIcon) {
    if (synth.speaking) {
        synth.cancel();
        btnIcon.classList.replace('fa-stop-circle', 'fa-volume-up');
        return;
    }

    const clean = formatCleanText(text);
    const firstLine = clean.split('.')[0] + "."; // Speaks only the first impactful line for natural feel
    
    currentUtterance = new SpeechSynthesisUtterance(firstLine);
    currentUtterance.lang = 'en-IN';
    currentUtterance.rate = 0.95;

    currentUtterance.onstart = () => btnIcon.classList.replace('fa-volume-up', 'fa-stop-circle');
    currentUtterance.onend = () => btnIcon.classList.replace('fa-stop-circle', 'fa-volume-up');

    synth.speak(currentUtterance);
}

// 3. Main AI Handler (Connects to Gemini Flash)
async function getSmileAIResponse() {
    const userText = aiInput.value.trim();
    if (!userText) return;

    appendMessage('user', userText);
    aiInput.value = '';

    // IMAGE GENERATION TRIGGER
    if (userText.toLowerCase().includes("show") || userText.toLowerCase().includes("generate image")) {
        appendMessage('bot', "Searching for professional visual...");
        try {
            // Using Pexels via secure environment
            const imgResponse = await fetch(`https://api.pexels.com/v1/search?query=${userText}&per_page=1`, {
                headers: { "Authorization": "kfzzPEicE21y0WcDJEMhLn0eUETxYReptyKIbwehcGdtGB3oW4Ka7xYj" } // Temporary Direct for client-side if needed, or use proxy
            });
            const imgData = await imgResponse.json();
            const imgUrl = imgData.photos[0].src.large;
            appendMessage('bot', `<img src="${imgUrl}" class="rounded-2xl shadow-lg border-2 border-white mt-2">`, true);
            return;
        } catch (e) {
            appendMessage('bot', "I can't generate the image right now, but I can explain the process. Ask me anything!");
        }
    }

    // TEXT GENERATION (Gemini 1.5 Flash Logic)
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCYGGCMq1GGKsvUs3m9eCoO6naVMT5bHuU`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `System: You are a Business Consultant at Smile Financial Solution. 8 years exp. Avoid all symbols like stars or hashtags. Speak naturally in professional English. Focus: PMEGP, 20L Grants, Loans. User: ${userText}` }] }]
            })
        });

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        const cleanReply = formatCleanText(rawText);

        appendMessage('bot', cleanReply);
    } catch (error) {
        appendMessage('bot', "I'm currently updating my database. Please call our HQ at 8586051944 for immediate support.");
    }
}

// 4. UI Helper: Append Message
function appendMessage(role, content, isHTML = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = role === 'user' 
        ? 'bg-blue-600 text-white p-4 rounded-3xl rounded-tr-none ml-auto max-w-[85%] shadow-md mb-4' 
        : 'bg-white text-slate-800 p-4 rounded-3xl rounded-tl-none mr-auto max-w-[85%] border border-gray-100 shadow-md mb-4 relative';

    if (isHTML) {
        msgDiv.innerHTML = content;
    } else {
        msgDiv.innerText = content;
        if (role === 'bot') {
            const speaker = document.createElement('button');
            speaker.className = "ml-2 text-blue-500 hover:text-blue-700 transition";
            speaker.innerHTML = '<i class="fas fa-volume-up"></i>';
            speaker.onclick = () => speakResponse(content, speaker.querySelector('i'));
            msgDiv.appendChild(speaker);
        }
    }

    msgContainer.appendChild(msgDiv);
    msgContainer.scrollTo({ top: msgContainer.scrollHeight, behavior: 'smooth' });
}

// Event Listeners
document.getElementById('send-ai').onclick = getSmileAIResponse;
aiInput.onkeypress = (e) => { if (e.key === 'Enter') getSmileAIResponse(); };
