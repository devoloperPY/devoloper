// == JavaScript Code Start ==

// === Konfigurasi AI (SUDAH DIMODIFIKASI) ===
// GANTI "https://YOUR_NGROK_OR_CLOUDFLARE_URL" dengan URL publik dari Ngrok/Tunnel Anda!
const YOUR_BACKEND_PROXY_URL = "https://caribbean-determined-discussion-stage.trycloudflare.com/api/chat"; // <<< GANTI INI

const availableAIs = [
    // Contoh 1: Copilot (Alvian)
    {
        name: "Copilot (Alvian)",
        // apiUrl SEKARANG menunjuk ke backend proxy Anda
        apiUrl: YOUR_BACKEND_PROXY_URL,
        // originalApiUrl menyimpan URL API asli
        originalApiUrl: "https://api.alvianuxio.eu.org/api/copilot",
        // apiKey DIHAPUS!
        method: "GET", // Metode asli API Alvianuxio
        queryParam: "text" // Nama parameter asli
    },
    // Contoh 2: Groq (Alvian)
    {
        name: "Groq (Alvian)",
        apiUrl: YOUR_BACKEND_PROXY_URL,
        originalApiUrl: "https://api.alvianuxio.eu.org/api/groq",
        method: "GET",
        queryParam: "text"
    },
    // Contoh 3: ChatSandbox (Mistral Large) - dengan extraParams
     {
        name: "ChatSandbox (Mistral Large)",
        apiUrl: YOUR_BACKEND_PROXY_URL,
        originalApiUrl: "https://api.alvianuxio.eu.org/api/chatsandbox",
        method: "GET",
        queryParam: "text",
        extraParams: { model: 'mistral-large' } // extraParams tetap ada
     },
     // === LENGKAPI SISA AI DI SINI DENGAN POLA YANG SAMA ===
     // Hapus 'apiKey' dari semua, tambahkan 'originalApiUrl', ganti 'apiUrl' dengan YOUR_BACKEND_PROXY_URL
     // Pastikan 'method', 'queryParam', dan 'extraParams' (jika ada) tetap sesuai API aslinya
     { name: "Gemini (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/gemini", method: "GET", queryParam: "text" },
     { name: "GPT-4o (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/gpt4o", method: "GET", queryParam: "text" },
     { name: "LetMeGPT (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/letmegpt", method: "GET", queryParam: "text" },
     { name: "Simi (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/simi", method: "GET", queryParam: "text" },
     { name: "Blackbox (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/blackbox", method: "GET", queryParam: "text" },
     { name: "SmartContract (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/SmartContract", method: "GET", queryParam: "text" },
     { name: "DegreeGuru (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/DegreeGuru", method: "GET", queryParam: "text" },
     { name: "Llama3 (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/llama3", method: "GET", queryParam: "text" },
     { name: "OpenAI (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/openai", method: "GET", queryParam: "text" },
     { name: "GPT-Turbo (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/gpt-turbo", method: "GET", queryParam: "text" },
     { name: "Luminai (OpenAI Prompt)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/luminai", method: "GET", queryParam: "text", extraParams: { prompt: 'openai' } },
     { name: "Deepseek (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/deepseek", method: "GET", queryParam: "text" },
     { name: "Deepseek Coder (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/deepseek/coder", method: "GET", queryParam: "text" },
     { name: "Deepseek R1 (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/deepseek/r1", method: "GET", queryParam: "text" },
     { name: "Mistral (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/mistral", method: "GET", queryParam: "text" },
     { name: "Mistral Saba (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/mistral/saba", method: "GET", queryParam: "text" },
     { name: "Mistral Moderation (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/mistral/moderation", method: "GET", queryParam: "text" }
     // ======================================================
];


// === Variabel State ===
let currentAI = null;
const HISTORY_KEY = 'aiChatHistory';
const MAX_HISTORY_ITEMS = 100;
let currentChatMessages = [];
let isSendingMessage = false;
let messageCountSinceLastAd = 0; // Counter iklan
const AD_TRIGGER_COUNT = 5;     // Batas trigger iklan

// === Ambil Elemen DOM ===
const selectionScreen = document.getElementById('selection-screen'); const aiOptionsContainer = document.getElementById('ai-options'); const chatContainer = document.getElementById('chat-container'); const chatBox = document.getElementById('chat-box'); const userInput = document.getElementById('user-input'); const sendButton = document.getElementById('send-button'); const backButton = document.getElementById('back-button'); const chatTitle = document.getElementById('chat-title'); const historyButton = document.getElementById('history-button'); const historyModal = document.getElementById('history-modal'); const historyList = document.getElementById('history-list'); const closeHistoryModalButton = document.getElementById('close-history-modal'); const typingIndicator = document.getElementById('typing-indicator'); const typingIndicatorName = document.getElementById('typing-indicator-name'); const refreshButton = document.getElementById('refresh-button'); const codePreviewModal = document.getElementById('code-preview-modal'); const codePreviewIframe = document.getElementById('code-preview-iframe'); const closePreviewModalButton = document.getElementById('close-preview-modal');
const chatVideo = document.getElementById('chat-background-video');

// === Intersection Observer ===
const observerOptions = { root: chatBox, rootMargin: '0px', threshold: 0.1 }; const intersectionCallback = (entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }; const messageObserver = new IntersectionObserver(intersectionCallback, observerOptions);

// === Fungsi displayMessage (Menyimpan ke currentChatMessages) ===
function displayMessage(message, sender, showAiName = true) { const messageData = { sender, text: message, showAiName }; const isWelcome = sender === 'ai' && message.startsWith("Halo! Anda sekarang terhubung"); if (!isWelcome || currentChatMessages.length === 0 || currentChatMessages[0].text !== message) { if(!currentChatMessages.some(m => m.sender === sender && m.text === message)){ currentChatMessages.push(messageData); } } const wrapper = document.createElement('div'); wrapper.classList.add('message-wrapper', sender === 'user' ? 'user-message-wrapper' : 'ai-message-wrapper'); const messageElement = document.createElement('div'); messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message'); if (sender === 'ai' && currentAI && showAiName) { const nameElement = document.createElement('div'); nameElement.classList.add('ai-name'); nameElement.textContent = currentAI.name; messageElement.appendChild(nameElement); } const messageContent = (message === null || message === undefined) ? "[Respons kosong]" : String(message); let elementsToHighlight = []; if (sender === 'user') { const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; const linkedMessage = messageContent.replace(urlRegex, (url) => { const properUrl = url.startsWith('www.') ? 'http://' + url : url; return `<a href="${properUrl}" target="_blank" rel="noopener noreferrer" class="user-link">${url}</a>`; }); const textNode = document.createElement('div'); textNode.innerHTML = linkedMessage.replace(/\n/g, '<br>'); messageElement.appendChild(textNode); } else { const codeBlockRegex = /```([a-zA-Z]*)\n?([\s\S]*?)```/g; let lastIndex = 0; let match; let codeBlocksFound = false; messageElement.style.padding = '8px 0 8px 0'; const processedMessage = messageContent.replace(/\\n/g, '\n'); while ((match = codeBlockRegex.exec(processedMessage)) !== null) { codeBlocksFound = true; const textBefore = processedMessage.substring(lastIndex, match.index).trim(); if (textBefore) { const textDiv = document.createElement('div'); textDiv.classList.add('ai-message-text'); textDiv.innerHTML = textBefore.replace(/\n/g, '<br>'); messageElement.appendChild(textDiv); } const lang = match[1].toLowerCase() || 'markup'; const codeContent = match[2]; const preElement = document.createElement('pre'); preElement.classList.add('code-block'); preElement.classList.add(`language-${lang}`); const copyButton = document.createElement('button'); copyButton.classList.add('copy-code-button'); copyButton.setAttribute('aria-label', 'Salin Kode'); copyButton.innerHTML = '<i class="fas fa-copy"></i>'; copyButton.dataset.code = codeContent; preElement.appendChild(copyButton); if (lang === 'html' || lang === 'markup') { const runButton = document.createElement('button'); runButton.classList.add('run-code-button'); runButton.setAttribute('aria-label', 'Jalankan Kode'); runButton.innerHTML = '<i class="fas fa-play"></i>'; runButton.dataset.code = codeContent; preElement.appendChild(runButton); } const codeElement = document.createElement('code'); codeElement.classList.add(`language-${lang}`); codeElement.textContent = codeContent; preElement.appendChild(codeElement); messageElement.appendChild(preElement); elementsToHighlight.push(codeElement); lastIndex = codeBlockRegex.lastIndex; } const textAfter = processedMessage.substring(lastIndex).trim(); if (textAfter) { const textDiv = document.createElement('div'); textDiv.classList.add('ai-message-text'); textDiv.innerHTML = textAfter.replace(/\n/g, '<br>'); messageElement.appendChild(textDiv); } if (!codeBlocksFound) { messageElement.style.padding = ''; const textDiv = document.createElement('div'); textDiv.classList.add('ai-message-text'); textDiv.innerHTML = processedMessage.replace(/\n/g, '<br>'); messageElement.appendChild(textDiv); } } wrapper.appendChild(messageElement); chatBox.appendChild(wrapper); messageObserver.observe(wrapper); if (elementsToHighlight.length > 0 && typeof Prism !== 'undefined') { requestAnimationFrame(() => { elementsToHighlight.forEach(el => Prism.highlightElement(el)); }); } requestAnimationFrame(() => { const scrollThreshold = 100; const isScrolledToBottom = chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + scrollThreshold; if (isScrolledToBottom) { chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' }); }}); }

// === Fungsi Riwayat (Simpan Semua Pesan) ===
// ... (Fungsi Riwayat tidak berubah) ...
function getHistory() { /* ... */ } function saveHistory(historyData) { /* ... */ } function updateHistory(aiName) { /* ... */ } function displayHistoryList() { /* ... */ } function loadHistoryEntry(historyId) { /* ... */ }

// === Fungsi sendMessageToAPI (MEMANGGIL BACKEND PROXY) ===
async function sendMessageToAPI() {
    if (isSendingMessage || !currentAI) {
        return;
    }
    isSendingMessage = true;
    const userText = userInput.value.trim();
    if (userText === '') {
        isSendingMessage = false;
        return;
    }
    const originalUserText = userText;
    sendButton.disabled = true;
    userInput.disabled = true;

    displayMessage(userText, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';
    userInput.style.height = `${userInput.scrollHeight}px`;
    if (userInput.scrollHeight <= 150) userInput.style.overflowY = 'hidden';

    // --- Bagian Custom Response "Siapa pembuatnya" ---
    const lowerUserText = userText.toLowerCase();
    const creatorKeywords = ['buat', 'cipta', 'pembuat', 'developer', 'programmer', 'bikin', 'program']; const whoKeywords = ['siapa', 'siapakah']; const youKeywords = ['kamu', 'anda', 'bot ini', 'web ini', 'aplikasi ini'];
    const askedWho = whoKeywords.some(k => lowerUserText.includes(k)); const askedCreator = creatorKeywords.some(k => lowerUserText.includes(k)); const askedAboutIt = youKeywords.some(k => lowerUserText.includes(k));
    if (askedWho && askedCreator && askedAboutIt) {
        const responses = [ "Saya diintegrasikan ke dalam antarmuka web ini oleh Virtux.", "Platform web tempat saya berjalan ini dikembangkan oleh Virtux. Keren kan?", "Virtux adalah developer yang membuat aplikasi web ini sehingga saya bisa berinteraksi dengan Anda.", "Web ini adalah karya Virtux. Saya hanya 'tamu' di sini. 😊" ];
        const customResponse = responses[Math.floor(Math.random() * responses.length)];
        setTimeout(() => {
            displayMessage(customResponse, 'ai');
            if (currentAI) { updateHistory(currentAI.name); } // Update history setelah custom response
            isSendingMessage = false; sendButton.disabled = false; userInput.disabled = false;
            checkAndTriggerAd(); // Panggil cek iklan setelah custom response
        }, 500);
        return; // Keluar setelah custom response
    }
    // --- Akhir Bagian Custom Response ---

    if (typingIndicatorName) typingIndicatorName.textContent = currentAI ? currentAI.name : 'AI';
    if (typingIndicator) typingIndicator.style.display = 'block';
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });

    // --- Persiapan Request ke Backend Proxy ---
    const backendUrl = currentAI.apiUrl; // URL Ngrok/Tunnel dari availableAIs
    const requestBody = {
        userText: originalUserText,
        targetApiUrl: currentAI.originalApiUrl, // URL API asli yg dituju
        targetApiMethod: currentAI.method,      // Metode API asli
        targetQueryParam: currentAI.queryParam, // Nama param asli
        targetExtraParams: currentAI.extraParams || {} // extraParams jika ada
    };

    console.log('Mengirim request ke Backend Proxy:', backendUrl, requestBody);

    let aiResponseText = null;
    try {
        // --- Fetch ke Backend Proxy (Selalu POST) ---
        const response = await fetch(backendUrl, {
            method: 'POST', // Selalu POST ke backend proxy kita
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        // --- Akhir Fetch ---

        // --- Penanganan Respons dari Backend Proxy ---
        if (!response.ok) {
            let errorData;
            try { errorData = await response.json(); } catch (e) { errorData = { error: `Gagal memproses respons error (${response.status})`, details: await response.text() }; }
            console.error(`HTTP error dari Backend Proxy! status: ${response.status}`, errorData);
            throw new Error(errorData.error || `Gagal menghubungi backend proxy (Status: ${response.status})`);
        }

        const data = await response.json(); // Data dari backend (yang berisi respons asli AI)
        console.log('Respons dari Backend Proxy:', data);

        // Logika ekstraksi respons (coba sesuaikan dengan kemungkinan format balikan backend)
        let extractedResponse = null;
        if (currentAI.originalApiUrl.includes("api.alvianuxio.eu.org") && data?.data?.response !== undefined) { // Cek struktur Alvianuxio dulu
             if (typeof data.data.response === 'string') { extractedResponse = data.data.response; }
             else if (data.data.response === null) { extractedResponse = "[AI tidak memberikan respons]"; }
        } else if (data?.text) { extractedResponse = data.text; }
          else if (data?.message) { extractedResponse = data.message; }
          else if (data?.response && typeof data.response === 'string') { extractedResponse = data.response; }
          else if (typeof data === 'string') { extractedResponse = data; } // Jika backend hanya return string
          else if (data?.data && typeof data.data === 'string') { extractedResponse = data.data; } // Coba akses data.data jika ada string
          else if (data?.result && typeof data.result === 'string') { extractedResponse = data.result; } // Coba akses data.result jika ada string

        // Fallback jika belum dapat string
        if (typeof extractedResponse === 'string') { aiResponseText = extractedResponse; }
        else if (data !== null && data !== undefined) { // Jika ada data tapi bukan format yg dikenal
            try { aiResponseText = "[Respons Objek]: " + JSON.stringify(data); } catch (e) { aiResponseText = "[Format respons tidak dikenal atau objek kompleks]"; }
        } else { aiResponseText = "Maaf, format respons tidak dikenal."; }
        // --- Akhir Penanganan Respons ---

        if (typingIndicator) typingIndicator.style.display = 'none';
        displayMessage(aiResponseText, 'ai');

        // >>> CEK IKLAN SETELAH DAPAT RESPONS <<<
        checkAndTriggerAd();

    } catch (error) {
        console.error('Error saat fetch ke Backend Proxy:', error);
        aiResponseText = `Error: ${error.message}`;
        if (typingIndicator) typingIndicator.style.display = 'none';
        displayMessage(aiResponseText, 'ai');
        // Tidak memanggil checkAndTriggerAd() saat error fetch

    } finally {
        if (typingIndicator && typingIndicator.style.display !== 'none') { typingIndicator.style.display = 'none'; }
        sendButton.disabled = false; userInput.disabled = false; isSendingMessage = false;
        // Update history hanya jika berhasil dan ada respons teks
        if (currentAI && typeof aiResponseText === 'string' && !aiResponseText.startsWith('Error:') && !aiResponseText.startsWith('[Respons')) {
            updateHistory(currentAI.name);
        }
    }
}


// === Fungsi checkAndTriggerAd ===
function checkAndTriggerAd() {
    messageCountSinceLastAd++;
    console.log(`Pesan ke-${messageCountSinceLastAd} sejak iklan terakhir.`);

    if (messageCountSinceLastAd >= AD_TRIGGER_COUNT) {
        console.log(`Mencapai batas ${AD_TRIGGER_COUNT} pesan, mencoba memicu iklan...`);
        try {
            if (typeof adsbygoogle !== 'undefined') {
                 (adsbygoogle = window.adsbygoogle || []).push({});
                 console.log('Panggilan adsbygoogle.push({}) dieksekusi.');
            } else {
                 console.warn('adsbygoogle belum terdefinisi. Script AdSense mungkin belum dimuat atau diblokir.');
            }
        } catch (e) { console.error('Gagal menjalankan adsbygoogle.push({}):', e); }
        messageCountSinceLastAd = 0; // Reset counter
    }
}

// === showChatScreen (Memutar Video BG) ===
// ... (Fungsi showChatScreen tidak berubah) ...
function showChatScreen(aiData, showWelcome = true) { /* ... */ }
// === showSelectionScreen (Stop Video BG) ===
// ... (Fungsi showSelectionScreen tidak berubah) ...
function showSelectionScreen() { /* ... */ }
// --- populateAiOptions ---
// ... (Fungsi populateAiOptions tidak berubah) ...
function populateAiOptions() { /* ... */ }

// === Inisialisasi dan Event Listeners ===
// ... (Event Listener tidak berubah) ...
sendButton.addEventListener('click', sendMessageToAPI);
userInput.addEventListener('keypress', function(event) { if (event.key === 'Enter' && !userInput.disabled && !event.shiftKey ) { sendMessageToAPI(); event.preventDefault(); }});
backButton.addEventListener('click', showSelectionScreen);
historyButton.addEventListener('click', () => { displayHistoryList(); historyModal.style.display = 'block'; });
closeHistoryModalButton.addEventListener('click', () => { historyModal.style.display = 'none'; });
if (closePreviewModalButton) { closePreviewModalButton.addEventListener('click', () => { if(codePreviewModal) codePreviewModal.style.display = 'none'; if (codePreviewIframe && codePreviewIframe.src !== 'about:blank') { URL.revokeObjectURL(codePreviewIframe.src); codePreviewIframe.src = 'about:blank'; } }); }
window.addEventListener('click', (event) => { if (event.target == historyModal || (codePreviewModal && event.target == codePreviewModal)) { historyModal.style.display = 'none'; if(codePreviewModal) codePreviewModal.style.display = 'none'; if (codePreviewIframe && codePreviewIframe.src !== 'about:blank') { URL.revokeObjectURL(codePreviewIframe.src); codePreviewIframe.src = 'about:blank'; } } });
chatBox.addEventListener('click', function(event) { const target = event.target.closest('button'); if (!target) return; if (target.classList.contains('copy-code-button')) { /* ... */ } else if (target.classList.contains('run-code-button')) { /* ... */ } });
if (refreshButton) { refreshButton.addEventListener('click', () => { console.log("Tombol refresh diklik. Memuat ulang halaman..."); location.reload(); }); } else { console.warn("Tombol refresh tidak ditemukan!"); }
userInput.addEventListener('input', () => { /* ... */ });
document.addEventListener('DOMContentLoaded', () => { console.log(">>> DOMContentLoaded: Memanggil populateAiOptions."); populateAiOptions(); });

// == JavaScript Code End ==