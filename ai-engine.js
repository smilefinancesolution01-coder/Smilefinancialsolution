// API Configuration
const GROQ_KEY = "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";
const PEXELS_KEY = "kfzzPEicE21y0WcDJEMhLn0eUETxYReptyKIbwehcGdtGB3oW4Ka7xYj";
const GEMINI_KEY = "AIzaSyCYGGCMq1GGKsvUs3m9eCoO6naVMT5bHuU";

const messageBox = document.getElementById('ai-messages');
const inputField = document.getElementById('ai-input');
const sendBtn = document.getElementById('send-ai');

// 1. Natural Voice Synthesis (One Line & Stop)
function speakNatural(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    
    // Pause on click logic
    window.addEventListener('click', () => {
        window.speechSynthesis.pause();
    }, { once: true });

    window.speechSynthesis.speak(utterance);
}

// 2. Chat Logic with Groq (No Symbols, Professional)
async function chatWithAI(prompt) {
    appendMessage('user', prompt);
    inputField.value = '';

    // Image Trigger Detection
    if(prompt.toLowerCase().includes("generate image") || prompt.toLowerCase().includes("show me")) {
        generateImage(prompt);
        return;
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [{ 
                    role: "system", 
                    content: "You are the AI of Smile Financial Solution. Speak professionally, naturally, and avoid symbols or hashtags. You have 8 years experience in PMEGP and funding." 
                }, { role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;
        
        appendMessage('bot', reply);
        speakNatural(reply.split('.')[0] + '.'); // Only speak first line naturally
        
    } catch (error) {
        console.error("AI Error:", error);
    }
}

// 3. Image Generation using Pexels
async function generateImage(query) {
    appendMessage('bot', "Searching for high-quality professional visual...");
    try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
            headers: { Authorization: PEXELS_KEY }
        });
        const data = await res.json();
        const imgUrl = data.photos[0].src.medium;
        
        const imgHtml = `<div class="bg-white p-2 rounded-xl shadow"><img src="${imgUrl}" class="rounded-lg"></div>`;
        messageBox.innerHTML += imgHtml;
        messageBox.scrollTop = messageBox.scrollHeight;
    } catch (e) {
        appendMessage('bot', "Could not generate visual at this moment.");
    }
}

function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.className = sender === 'user' ? 'bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none ml-auto max-w-[80%]' : 'bg-white p-3 rounded-2xl rounded-tl-none mr-auto max-w-[80%] border shadow-sm';
    div.innerText = text;
    messageBox.appendChild(div);
    messageBox.scrollTop = messageBox.scrollHeight;
}

sendBtn.addEventListener('click', () => chatWithAI(inputField.value));
