// == JavaScript Code Start ==

// === Konfigurasi AI (SUDAH DIMODIFIKASI) ===
// URL Backend Proxy Anda (sudah diisi sesuai URL Cloudflare terakhir)
const YOUR_BACKEND_PROXY_URL = "https://version-supplements-van-wendy.trycloudflare.com/api/chat";

const availableAIs = [
    // API Key sudah dihapus dari sini semua, hanya properti yg dibutuhkan frontend
    { name: "Copilot (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/copilot", method: "GET", queryParam: "text" },
    { name: "Groq (Alvian)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/groq", method: "GET", queryParam: "text" },
    { name: "ChatSandbox (Mistral Large)", apiUrl: YOUR_BACKEND_PROXY_URL, originalApiUrl: "https://api.alvianuxio.eu.org/api/chatsandbox", method: "GET", queryParam: "text", extraParams: { model: 'mistral-large' } },
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
];


// === Variabel State ===
let currentAI = null;
const HISTORY_KEY = 'aiChatHistory';
const MAX_HISTORY_ITEMS = 200; // <<< Batas Histori Sudah Diubah Jadi 200
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

// === Fungsi Riwayat (Logika Sudah Diperbaiki) ===
function getHistory() { try { const historyJson = localStorage.getItem(HISTORY_KEY); return historyJson ? JSON.parse(historyJson) : []; } catch (e) { console.error("Gagal membaca riwayat:", e); return []; } }
function saveHistory(historyData) {
    try {
        // Potong array jika melebihi batas, simpan item TERBARU (yang ada di awal array)
        if (historyData.length > MAX_HISTORY_ITEMS) {
            historyData = historyData.slice(0, MAX_HISTORY_ITEMS); // Ambil MAX_HISTORY_ITEMS pertama
        }
        localStorage.setItem(HISTORY_KEY, JSON.stringify(historyData));
        console.log(`History saved. Total sessions: ${historyData.length}`); // Log tambahan
    } catch (e) {
        console.error("Gagal menyimpan riwayat:", e);
        // Optional: coba simpan lebih sedikit jika quota error
        if (e.name === 'QuotaExceededError' && historyData.length > 1) {
            console.warn("Quota exceeded, trying to save fewer history items...");
            try {
                // Coba simpan setengahnya saja
                localStorage.setItem(HISTORY_KEY, JSON.stringify(historyData.slice(0, Math.floor(historyData.length / 2))));
            } catch (e2) {
                console.error("Gagal menyimpan sebagian riwayat:", e2);
            }
        }
    }
}
function updateHistory(aiName) {
    // Hanya simpan jika ada pesan & AI terpilih
    if (!aiName || currentChatMessages.length === 0) {
        return;
    }
    const history = getHistory();
    const now = Date.now();
    // ID unik untuk penyimpanan ini
    const historyId = `${aiName}-${now}-${Math.random().toString(16).slice(2)}`;
    const messagesSnapshot = [...currentChatMessages]; // Ambil snapshot pesan saat ini

    // Buat entri history baru
    const newEntry = {
        id: historyId,
        aiName: aiName,
        timestamp: now, // Waktu penyimpanan
        messages: messagesSnapshot
    };

    // --- LOGIKA DIPERBAIKI ---
    // Tambahkan entri baru ini ke AWAL array history (tanpa filter)
    history.unshift(newEntry);
    // ----------------------

    // Biarkan saveHistory yang memotong jika melebihi MAX_HISTORY_ITEMS
    saveHistory(history);
}
function displayHistoryList() { const history = getHistory(); historyList.innerHTML = ''; if (history.length === 0) { historyList.innerHTML = '<li>Belum ada riwayat chat.</li>'; return; } history.sort((a,b)=> b.timestamp - a.timestamp); // Pastikan urut terbaru di atas
 history.forEach(item => { const li = document.createElement('li'); li.dataset.historyId = item.id; const date = new Date(item.timestamp); const formattedDate = date.toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }); const lastMsg = item.messages && item.messages.length > 0 ? item.messages[item.messages.length - 1] : null; const secondLastMsg = item.messages && item.messages.length > 1 ? item.messages[item.messages.length - 2] : null; const previewUser = secondLastMsg?.sender === 'user' ? secondLastMsg.text : (lastMsg?.sender === 'user' ? lastMsg.text : '...'); const previewAi = lastMsg?.sender === 'ai' ? String(lastMsg.text).split('\n')[0].replace(/<[^>]*>/g, '').substring(0, 80) : '...'; // Ambil baris pertama & potong
 li.innerHTML = `<span class="history-ai-name">${item.aiName}</span> <span class="history-timestamp">${formattedDate}</span> <span class="history-preview"><strong>Anda:</strong> ${previewUser.substring(0, 80)}...</span> <span class="history-preview"><strong>${item.aiName}:</strong> ${previewAi}...</span>`; // Potong preview user juga
 li.addEventListener('click', () => { loadHistoryEntry(item.id); historyModal.style.display = 'none'; }); historyList.appendChild(li); }); }
function loadHistoryEntry(historyId) { const history = getHistory(); const entry = history.find(item => item.id === historyId); if (!entry || !Array.isArray(entry.messages) || entry.messages.length === 0) { console.error("Entri riwayat/pesan tidak valid:", historyId, entry); alert("Gagal memuat riwayat lengkap."); return; } const aiData = availableAIs.find(ai => ai.name === entry.aiName); if (!aiData) { console.error("Data AI tidak ditemukan untuk:", entry.aiName); alert(`Konfigurasi untuk AI "${entry.aiName}" tidak ditemukan.`); return; } console.log("Memuat riwayat lengkap untuk:", entry.aiName); showChatScreen(aiData, false); chatBox.innerHTML = ''; currentChatMessages = []; entry.messages.forEach(msg => { displayMessage(msg.text, msg.sender, msg.showAiName); }); requestAnimationFrame(() => { chatBox.scrollTop = chatBox.scrollHeight; }); }

// === Fungsi sendMessageToAPI (MEMANGGIL BACKEND PROXY) ===
async function sendMessageToAPI() {
    if (isSendingMessage || !currentAI) { return; } isSendingMessage = true; const userText = userInput.value.trim(); if (userText === '') { isSendingMessage = false; return; } const originalUserText = userText; sendButton.disabled = true; userInput.disabled = true;
    displayMessage(userText, 'user'); userInput.value = ''; userInput.style.height = 'auto'; userInput.style.height = `${userInput.scrollHeight}px`; if (userInput.scrollHeight <= 150) userInput.style.overflowY = 'hidden';
    // --- Bagian Custom Response "Siapa pembuatnya" ---
    const lowerUserText = userText.toLowerCase(); const creatorKeywords = ['buat', 'cipta', 'pembuat', 'developer', 'programmer', 'bikin', 'program']; const whoKeywords = ['siapa', 'siapakah']; const youKeywords = ['kamu', 'anda', 'bot ini', 'web ini', 'aplikasi ini']; const askedWho = whoKeywords.some(k => lowerUserText.includes(k)); const askedCreator = creatorKeywords.some(k => lowerUserText.includes(k)); const askedAboutIt = youKeywords.some(k => lowerUserText.includes(k));
    if (askedWho && askedCreator && askedAboutIt) { const responses = [ "Saya diintegrasikan ke dalam antarmuka web ini oleh Virtux.", "Platform web tempat saya berjalan ini dikembangkan oleh Virtux. Keren kan?", "Virtux adalah developer yang membuat aplikasi web ini sehingga saya bisa berinteraksi dengan Anda.", "Web ini adalah karya Virtux. Saya hanya 'tamu' di sini. 😊" ]; const customResponse = responses[Math.floor(Math.random() * responses.length)]; setTimeout(() => { displayMessage(customResponse, 'ai'); if (currentAI) { updateHistory(currentAI.name); } isSendingMessage = false; sendButton.disabled = false; userInput.disabled = false; checkAndTriggerAd(); }, 500); return; }
    // --- Akhir Bagian Custom Response ---
    if (typingIndicatorName) typingIndicatorName.textContent = currentAI ? currentAI.name : 'AI'; if (typingIndicator) typingIndicator.style.display = 'block'; chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    // --- Persiapan Request ke Backend Proxy ---
    const backendUrl = currentAI.apiUrl; const requestBody = { userText: originalUserText, targetApiUrl: currentAI.originalApiUrl, targetApiMethod: currentAI.method, targetQueryParam: currentAI.queryParam, targetExtraParams: currentAI.extraParams || {} };
    console.log('Mengirim request ke Backend Proxy:', backendUrl, requestBody); let aiResponseText = null;
    try {
        // --- Fetch ke Backend Proxy (Selalu POST) ---
        const response = await fetch(backendUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(requestBody) });
        // --- Akhir Fetch ---
        // --- Penanganan Respons dari Backend Proxy ---
        if (!response.ok) { let errorData; try { errorData = await response.json(); } catch (e) { errorData = { error: `Gagal memproses respons error (${response.status})`, details: await response.text() }; } console.error(`HTTP error dari Backend Proxy! status: ${response.status}`, errorData); throw new Error(errorData.error || `Gagal menghubungi backend proxy (Status: ${response.status})`); }
        const data = await response.json(); console.log('Respons dari Backend Proxy:', data);
        let extractedResponse = null;

        // --- Logika Ekstraksi Baru (Sudah Diperbaiki) ---
        if (data?.data?.response?.text && typeof data.data.response.text === 'string') {
            extractedResponse = data.data.response.text;
        } else if (data?.text && typeof data.text === 'string') {
            extractedResponse = data.text;
        } else if (data?.message && typeof data.message === 'string') {
            extractedResponse = data.message;
        } else if (data?.response && typeof data.response === 'string') {
            extractedResponse = data.response;
        } else if (data?.result && typeof data.result === 'string') {
            extractedResponse = data.result;
        } else if (data?.data && typeof data.data === 'string') {
            extractedResponse = data.data;
        } else if (typeof data === 'string') {
             extractedResponse = data;
        }
        // --- Akhir Logika Ekstraksi Baru ---

        // Fallback jika belum dapat string
        if (typeof extractedResponse === 'string') {
            aiResponseText = extractedResponse;
        } else if (data !== null && data !== undefined) {
             console.warn("Tidak bisa ekstrak teks dari respons, menampilkan objek mentah:", data);
             try { aiResponseText = "[Respons Objek]: " + JSON.stringify(data); } catch (e) { aiResponseText = "[Format respons tidak dikenal atau objek kompleks]"; }
        } else {
            aiResponseText = "[Respons AI kosong atau tidak dikenal]";
        }
        // --- Akhir Penanganan Respons ---

        if (typingIndicator) typingIndicator.style.display = 'none'; displayMessage(aiResponseText, 'ai'); checkAndTriggerAd();
    } catch (error) { console.error('Error saat fetch ke Backend Proxy:', error); aiResponseText = `Error: ${error.message}`; if (typingIndicator) typingIndicator.style.display = 'none'; displayMessage(aiResponseText, 'ai');
    } finally { if (typingIndicator && typingIndicator.style.display !== 'none') { typingIndicator.style.display = 'none'; } sendButton.disabled = false; userInput.disabled = false; isSendingMessage = false; if (currentAI && typeof aiResponseText === 'string' && !aiResponseText.startsWith('Error:') && !aiResponseText.startsWith('[Respons')) { updateHistory(currentAI.name); } }
}

// === Fungsi checkAndTriggerAd ===
function checkAndTriggerAd() { messageCountSinceLastAd++; console.log(`Pesan ke-${messageCountSinceLastAd} sejak iklan terakhir.`); if (messageCountSinceLastAd >= AD_TRIGGER_COUNT) { console.log(`Mencapai batas ${AD_TRIGGER_COUNT} pesan, mencoba memicu iklan...`); try { if (typeof adsbygoogle !== 'undefined') { (adsbygoogle = window.adsbygoogle || []).push({}); console.log('Panggilan adsbygoogle.push({}) dieksekusi.'); } else { console.warn('adsbygoogle belum terdefinisi. Script AdSense mungkin belum dimuat atau diblokir.'); } } catch (e) { console.error('Gagal menjalankan adsbygoogle.push({}):', e); } messageCountSinceLastAd = 0; } }

// === showChatScreen ===
function showChatScreen(aiData, showWelcome = true) { if (!aiData) return; currentAI = aiData; chatTitle.textContent = `Chat dengan ${currentAI.name}`; userInput.placeholder = "Ketik pesan Anda..."; console.log("Memulai/memuat chat untuk:", currentAI.name); chatBox.innerHTML = ''; currentChatMessages = []; if (showWelcome) { const welcomeMsg = `Halo! Anda sekarang terhubung dengan ${currentAI.name}.`; displayMessage(welcomeMsg, 'ai'); } selectionScreen.style.display = 'none'; chatContainer.style.display = 'flex'; requestAnimationFrame(()=> { chatContainer.classList.add('active'); }); if (chatVideo) { chatVideo.muted = false; chatVideo.currentTime = 0; chatVideo.style.display = 'block'; requestAnimationFrame(() => chatVideo.classList.add('active')); chatVideo.play().catch(e => { console.warn("Autoplay dg suara gagal, coba mute:", e); chatVideo.muted = true; chatVideo.play().catch(e2 => console.error("Autoplay mute juga gagal:", e2)); }); } }
// === showSelectionScreen ===
function showSelectionScreen() { currentAI = null; currentChatMessages = []; if (chatVideo) { chatVideo.pause(); chatVideo.classList.remove('active'); setTimeout(() => { chatVideo.style.display = 'none'; }, 500); } chatContainer.classList.remove('active'); setTimeout(() => { chatContainer.style.display = 'none'; }, 400); selectionScreen.style.display = 'flex'; }
// --- populateAiOptions ---
function populateAiOptions() { aiOptionsContainer.innerHTML = ''; availableAIs.forEach((ai, index) => { const button = document.createElement('button'); button.textContent = ai.name; button.classList.add('ai-option-button'); button.style.animationDelay = `${0.5 + index * 0.06}s`; button.addEventListener('click', () => { showChatScreen(ai); }); aiOptionsContainer.appendChild(button); }); }

// === Inisialisasi dan Event Listeners ===
sendButton.addEventListener('click', sendMessageToAPI);
userInput.addEventListener('keypress', function(event) { if (event.key === 'Enter' && !userInput.disabled && !event.shiftKey ) { sendMessageToAPI(); event.preventDefault(); }});
backButton.addEventListener('click', showSelectionScreen);
historyButton.addEventListener('click', () => { displayHistoryList(); historyModal.style.display = 'block'; });
closeHistoryModalButton.addEventListener('click', () => { historyModal.style.display = 'none'; });
if (closePreviewModalButton) { closePreviewModalButton.addEventListener('click', () => { if(codePreviewModal) codePreviewModal.style.display = 'none'; if (codePreviewIframe && codePreviewIframe.src !== 'about:blank') { URL.revokeObjectURL(codePreviewIframe.src); codePreviewIframe.src = 'about:blank'; } }); }
window.addEventListener('click', (event) => { if (event.target == historyModal || (codePreviewModal && event.target == codePreviewModal)) { historyModal.style.display = 'none'; if(codePreviewModal) codePreviewModal.style.display = 'none'; if (codePreviewIframe && codePreviewIframe.src !== 'about:blank') { URL.revokeObjectURL(codePreviewIframe.src); codePreviewIframe.src = 'about:blank'; } } });
chatBox.addEventListener('click', function(event) { const target = event.target.closest('button'); if (!target) return; if (target.classList.contains('copy-code-button')) { const button = target; const codeToCopy = button.dataset.code; if (codeToCopy && navigator.clipboard) { navigator.clipboard.writeText(codeToCopy).then(() => { button.innerHTML = '<i class="fas fa-check"></i>'; button.classList.add('copied'); setTimeout(() => { button.innerHTML = '<i class="fas fa-copy"></i>'; button.classList.remove('copied'); }, 1500); }).catch(err => { console.error('Gagal menyalin:', err); button.innerHTML = '<i class="fas fa-times"></i>'; setTimeout(() => { button.innerHTML = '<i class="fas fa-copy"></i>'; }, 1500); }); } else if (!navigator.clipboard) { console.warn('Clipboard API tidak tersedia.'); } } else if (target.classList.contains('run-code-button')) { const button = target; const codeToRun = button.dataset.code; if (codeToRun && codePreviewModal && codePreviewIframe) { console.log("Menjalankan kode preview..."); try { const blob = new Blob([codeToRun], { type: 'text/html' }); if (codePreviewIframe.src && codePreviewIframe.src !== 'about:blank') { URL.revokeObjectURL(codePreviewIframe.src); } const blobUrl = URL.createObjectURL(blob); codePreviewIframe.src = blobUrl; codePreviewModal.style.display = 'block'; } catch (e) { console.error("Gagal membuat preview:", e); alert("Gagal menampilkan preview kode."); } } else { console.error("Tombol Run diklik tapi kode atau elemen modal/iframe tidak ditemukan."); } } });
if (refreshButton) { refreshButton.addEventListener('click', () => { console.log("Tombol refresh diklik. Memuat ulang halaman..."); location.reload(); }); } else { console.warn("Tombol refresh tidak ditemukan!"); }
userInput.addEventListener('input', () => { userInput.style.height = 'auto'; let scrollHeight = userInput.scrollHeight; let maxHeight = 150; userInput.style.height = `${scrollHeight}px`; userInput.style.overflowY = (scrollHeight > maxHeight) ? 'auto' : 'hidden'; if (scrollHeight > maxHeight) { userInput.style.height = `${maxHeight}px`; } });
document.addEventListener('DOMContentLoaded', () => { console.log(">>> DOMContentLoaded: Memanggil populateAiOptions."); populateAiOptions(); });

// == JavaScript Code End ==