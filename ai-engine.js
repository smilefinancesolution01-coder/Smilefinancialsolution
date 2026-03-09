// ai-engine.js
const msgContainer = document.getElementById('ai-messages');
const aiInput = document.getElementById('ai-input');
const sendBtn = document.getElementById('send-ai');

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
        
        if (data.image) {
            appendMsg('bot', `<img src="${data.image}" class="rounded-2xl mt-2 w-full shadow-lg border">`, true);
        } else if (data.text) {
            appendMsg('bot', data.text);
        } else {
            throw new Error("Invalid Data");
        }
    } catch (err) {
        appendMsg('bot', "Our AI is currently optimizing files for Patel Nagar HQ. Please call 8586051944 for immediate loan status.");
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
    }
}

function appendMsg(role, content, isHTML = false) {
    const div = document.createElement('div');
    div.className = role === 'user' 
        ? 'bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none ml-auto max-w-[85%] mb-4 shadow-lg text-sm' 
        : 'bg-white text-slate-800 p-4 rounded-2xl rounded-tl-none mr-auto max-w-[85%] border border-slate-100 shadow-md mb-4 relative text-sm';
    
    if (isHTML) div.innerHTML = content;
    else div.innerText = content;

    msgContainer.appendChild(div);
    msgContainer.scrollTo({ top: msgContainer.scrollHeight, behavior: 'smooth' });
}

sendBtn.onclick = handleAIResponse;
aiInput.onkeypress = (e) => { if (e.key === 'Enter') handleAIResponse(); };
