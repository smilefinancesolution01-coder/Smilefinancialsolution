async function handleAIResponse() {
    const prompt = aiInput.value.trim();
    if (!prompt) return;

    appendMsg('user', prompt);
    aiInput.value = '';
    sendBtn.disabled = true;

    try {
        const response = await fetch('/api/chat', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await response.json();

        // 1. Agar Image aayi hai
        if (data.image) {
            appendMsg('bot', `<img src="${data.image}" class="rounded-2xl mt-2 w-full shadow-lg border">`, true);
        } 
        
        // 2. Agar Text aaya hai
        if (data.text) {
            appendMsg('bot', data.text);
        }

    } catch (err) {
        appendMsg('bot', "Technical update at Patel Nagar. Call 8586051944.");
    } finally {
        sendBtn.disabled = false;
    }
}
