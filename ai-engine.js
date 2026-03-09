async function handleAIResponse() {
    const prompt = aiInput.value.trim();
    if (!prompt) return;

    appendMsg('user', prompt);
    aiInput.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await response.json();
        
        if (data.image) {
            appendMsg('bot', `<img src="${data.image}" class="rounded-2xl mt-2 w-full shadow-lg">`, true);
        } else if (data.text) {
            appendMsg('bot', data.text);
        }
    } catch (err) {
        appendMsg('bot', "Technical update in progress. Contact HQ: 8586051944.");
    }
}
