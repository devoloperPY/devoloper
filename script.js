document.addEventListener('DOMContentLoaded', function() {
//-------------------------------------------------------------

    const mainHubPage = document.getElementById('main-hub-page');
    const allContentPages = document.querySelectorAll('.page');
    const backButtons = document.querySelectorAll('.back-button');
    const API_BASE_URL = 'https://flowfalcon.dpdns.org';

    const themeToggleButton = document.getElementById('theme-toggle-button');
    const themeIcon = document.getElementById('theme-icon');
    const showHistoryButton = document.getElementById('show-history-button');
    const showSettingsButton = document.getElementById('show-settings-button');
    const showQueueButton = document.getElementById('show-queue-button');

    const settingsPage = document.getElementById('settings-page');
    const themeToggleSwitch = document.getElementById('theme-toggle-switch');
    const resultsPerPageInput = document.getElementById('results-per-page-input');
    const clearApiCacheButton = document.getElementById('clear-api-cache-button');
    const clearHistorySettingsButton = document.getElementById('clear-history-settings-button');

    const historyPage = document.getElementById('history-page');
    const historyListArea = document.getElementById('history-list-area');
    const clearHistoryButton = document.getElementById('clear-history-button');

    // TAMBAHKAN INI BERSAMA const LAINNYA
    const openAiPromptInput = document.getElementById('openai-prompt-input'), fetchOpenAiButton = document.getElementById('fetch-openai-button'), openAiResultArea = document.getElementById('openai-result-area');
    const multiModelPromptInput = document.getElementById('multimodel-prompt-input'), multiModelSelect = document.getElementById('multimodel-select'), fetchMultiModelButton = document.getElementById('fetch-multimodel-button'), multiModelResultArea = document.getElementById('multimodel-result-area');

    const queuePage = document.getElementById('queue-page');
    const queueListArea = document.getElementById('queue-list-area');
    const startQueueButton = document.getElementById('start-queue-button');
    const clearCompletedButton = document.getElementById('clear-completed-button');
    const adminSearchQuery = document.getElementById('admin-search-query');
    const searchAdminButton = document.getElementById('search-admin-button');
    const adminSearchResultArea = document.getElementById('admin-search-result-area');
    const adminDownloadUrlInput = document.getElementById('admin-download-url');
    const fetchAdminDownloadButton = document.getElementById('fetch-admin-download-button');
    const adminDownloadResultArea = document.getElementById('admin-download-result-area');

    const copyHostinfoButton = document.getElementById('copy-hostinfo-button');
    
    backButtons.forEach(button => button.addEventListener('click', showHub));
    themeToggleButton.addEventListener('click', () => setTema(!document.documentElement.classList.contains('dark')));
    themeToggleSwitch.addEventListener('change', (e) => setTema(e.target.checked));
    resultsPerPageInput.addEventListener('change', (e) => {
        let newValue = parseInt(e.target.value);
        if (isNaN(newValue) || newValue < 3) newValue = 3;
        if (newValue > 50) newValue = 50;
        e.target.value = newValue;
        RESULTS_PER_PAGE = newValue;
        localStorage.setItem('resultsPerPage', newValue);
        alert(`Jumlah hasil per halaman diubah menjadi ${newValue}.`);
    });
    clearApiCacheButton.addEventListener('click', clearApiCache);
    clearHistorySettingsButton.addEventListener('click', () => { if (confirm('Yakin ingin hapus riwayat?')) { localStorage.removeItem('downloadHistory'); alert('Riwayat unduhan telah dibersihkan.'); } });
    showSettingsButton.addEventListener('click', (e) => { e.preventDefault(); showPage(settingsPage, loadSettings); });
    showQueueButton.addEventListener('click', (e) => { e.preventDefault(); showPage(queuePage, renderQueue); });
    showHistoryButton.addEventListener('click', (e) => { e.preventDefault(); showPage(historyPage, loadHistory); });
    clearHistoryButton.addEventListener('click', () => { if (confirm('Yakin ingin hapus riwayat?')) { localStorage.removeItem('downloadHistory'); loadHistory(); } });
    copyHostinfoButton.addEventListener('click', async () => {
        const resultText = hostinfoResultArea.innerText;
        if (!resultText || hostinfoResultArea.querySelector('.error-box')) return alert("Tidak ada info untuk disalin.");
        try {
            await navigator.clipboard.writeText(resultText);
            copyHostinfoButton.textContent = 'Tersalin!';
            copyHostinfoButton.disabled = true;
            setTimeout(() => { copyHostinfoButton.textContent = 'Salin'; copyHostinfoButton.disabled = false; }, 2000);
        } catch (err) {
            alert('Gagal menyalin info.');
        }
    });


searchAdminButton.addEventListener('click', searchAdminContent);
document.getElementById('admin-load-more-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('load-more-button')) {
        adminCurrentPage++;
        displayAdminResults();
    }
});
    

    
    const ttsTextInput = document.getElementById('tts-text-input'), fetchTtsButton = document.getElementById('fetch-tts-button'), ttsResultArea = document.getElementById('tts-result-area');
    const tiktokV2UrlInput = document.getElementById('tiktok-v2-url-input'), fetchTiktokV2Button = document.getElementById('fetch-tiktok-v2-button'), tiktokV2ResultArea = document.getElementById('tiktok-v2-result-area');
    const instagramV2UrlInput = document.getElementById('instagram-v2-url-input'), fetchInstagramV2Button = document.getElementById('fetch-instagram-v2-button'), instagramV2ResultArea = document.getElementById('instagram-v2-result-area');
    const pinterestV2UrlInput = document.getElementById('pinterest-v2-url-input'), fetchPinterestV2Button = document.getElementById('fetch-pinterest-v2-button'), pinterestV2ResultArea = document.getElementById('pinterest-v2-result-area');
    const snackvideoUrlInput = document.getElementById('snackvideo-url-input'), fetchSnackvideoButton = document.getElementById('fetch-snackvideo-button'), snackvideoResultArea = document.getElementById('snackvideo-result-area');
    const facebookUrlInput = document.getElementById('facebook-url-input'), fetchFacebookButton = document.getElementById('fetch-facebook-button'), facebookResultArea = document.getElementById('facebook-result-area');
    const spotifyUrlInput = document.getElementById('spotify-url-input'), fetchSpotifyButton = document.getElementById('fetch-spotify-button'), spotifyResultArea = document.getElementById('spotify-result-area');
    const spotifySearchQuery = document.getElementById('spotify-search-query'), searchSpotifyButton = document.getElementById('search-spotify-button'), spotifySearchResultArea = document.getElementById('spotify-search-result-area');
    const gimageSearchQuery = document.getElementById('gimage-search-query'), searchGimageButton = document.getElementById('search-gimage-button'), gimageSearchResultArea = document.getElementById('gimage-search-result-area');
    const playstoreSearchQuery = document.getElementById('playstore-search-query'), searchPlaystoreButton = document.getElementById('search-playstore-button'), playstoreSearchResultArea = document.getElementById('playstore-search-result-area');
    const fdroidSearchQuery = document.getElementById('fdroid-search-query'), searchFdroidButton = document.getElementById('search-fdroid-button'), fdroidSearchResultArea = document.getElementById('fdroid-search-result-area');
    const youtubeV2UrlInput = document.getElementById('youtube-v2-url-input'), youtubeV2CustomFilenameInput = document.getElementById('youtube-v2-custom-filename'), fetchYoutubeV2OptionsButton = document.getElementById('fetch-youtube-v2-options-button'), youtubeV2OptionsArea = document.getElementById('youtube-v2-options-area'), youtubeV2ResultArea = document.getElementById('youtube-v2-result-area');
    const tiktokUrlInput = document.getElementById('tiktok-url-input'), tiktokCustomFilenameInput = document.getElementById('tiktok-custom-filename'), fetchTiktokVideoButton = document.getElementById('fetch-tiktok-video-button'), tiktokResultArea = document.getElementById('tiktok-result-area');
    const youtubeUrlInput = document.getElementById('youtube-url-input'), youtubeCustomFilenameInput = document.getElementById('youtube-custom-filename'), fetchYoutubeMp4Button = document.getElementById('fetch-youtube-mp4-button'), fetchYoutubeMp3Button = document.getElementById('fetch-youtube-mp3-button'), youtubeResultArea = document.getElementById('youtube-result-area');
    const instagramUrlInput = document.getElementById('instagram-url-input'), instagramCustomFilenameInput = document.getElementById('instagram-custom-filename'), fetchInstagramMediaButton = document.getElementById('fetch-instagram-media-button'), instagramResultArea = document.getElementById('instagram-result-area');
    const pinterestUrlInput = document.getElementById('pinterest-url-input'), pinterestCustomFilenameInput = document.getElementById('pinterest-custom-filename'), fetchPinterestMediaButton = document.getElementById('fetch-pinterest-media-button'), pinterestResultArea = document.getElementById('pinterest-result-area');
    const sswebUrlInput = document.getElementById('ssweb-url-input'), fetchSswebButton = document.getElementById('fetch-ssweb-button'), sswebResultArea = document.getElementById('ssweb-result-area');
    const hostinfoUrlInput = document.getElementById('hostinfo-url-input'), fetchHostinfoButton = document.getElementById('fetch-hostinfo-button'), hostinfoResultArea = document.getElementById('hostinfo-result-area');
    const toghibliUrlInput = document.getElementById('toghibli-url-input'), toghibliPromptInput = document.getElementById('toghibli-prompt-input'), fetchToghibliButton = document.getElementById('fetch-toghibli-button'), toghibliResultArea = document.getElementById('toghibli-result-area');
    const reminiUrlInput = document.getElementById('remini-url-input'), fetchReminiButton = document.getElementById('fetch-remini-button'), reminiResultArea = document.getElementById('remini-result-area');
    const upscaleUrlInput = document.getElementById('upscale-url-input'), fetchUpscaleButton = document.getElementById('fetch-upscale-button'), upscaleResultArea = document.getElementById('upscale-result-area');
    const randomWaifuResultArea = document.getElementById('random-waifu-result-area'), fetchRandomWaifuButton = document.getElementById('fetch-random-waifu-button');
    const randomNsfwResultArea = document.getElementById('random-nsfw-result-area'), fetchRandomNsfwButton = document.getElementById('fetch-random-nsfw-button');
    const randomPapayangResultArea = document.getElementById('random-papayang-result-area'), fetchRandomPapayangButton = document.getElementById('fetch-random-papayang-button');

    let RESULTS_PER_PAGE = parseInt(localStorage.getItem('resultsPerPage')) || 9;
    let spotifyResults = [];
    let spotifyCurrentPage = 0;
    let gimageResults = [];
    let adminResults = [];
    let adminCurrentPage = 0;
    let gimageCurrentPage = 0;
    let pinterestResults = [];
    let pinterestCurrentPage = 0;
    let downloadQueue = JSON.parse(localStorage.getItem('downloadQueue')) || [];
    let isQueueProcessing = false;

    function setTema(isDark) {
        if(themeToggleSwitch) themeToggleSwitch.checked = isDark;
        if (isDark) {
            document.documentElement.classList.add('dark');
            if(themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            if(themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            localStorage.setItem('theme', 'light');
        }
    }

    function loadSettings() {
        if(themeToggleSwitch) themeToggleSwitch.checked = document.documentElement.classList.contains('dark');
        if(resultsPerPageInput) resultsPerPageInput.value = RESULTS_PER_PAGE;
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('downloadHistory')) || [];
        if (!historyListArea) return;
        if (history.length === 0) {
            historyListArea.innerHTML = `<p class="text-center">Belum ada riwayat unduhan.</p>`;
            return;
        }
        historyListArea.innerHTML = history.map(item => {
            let mediaPreviewHTML = '';
            if (item.type === 'video') {
                mediaPreviewHTML = `<video controls muted class="w-full rounded-md mt-2 max-h-60" src="${item.url}"></video>`;
            } else if (item.type === 'image') {
                mediaPreviewHTML = `<img class="w-full rounded-md mt-2 max-h-60 object-cover" src="${item.url}" alt="${item.filename}">`;
            } else if (item.type === 'audio') {
                 mediaPreviewHTML = `<audio controls class="w-full mt-2" src="${item.url}"></audio>`;
            }
            return `
                <div class="history-item">
                    <p class="filename">${item.filename}</p>
                    <p class="timestamp">${new Date(item.date).toLocaleString('id-ID')}</p>
                    ${mediaPreviewHTML ? `<div class="mt-2">${mediaPreviewHTML}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    function saveToHistory(filename, url, type) {
        let history = JSON.parse(localStorage.getItem('downloadHistory')) || [];
        history.unshift({ filename: filename, url: url, type: type, date: new Date().toISOString() });
        if (history.length > 50) history.pop();
        localStorage.setItem('downloadHistory', JSON.stringify(history));
    }
    
    function saveQueue() {
        localStorage.setItem('downloadQueue', JSON.stringify(downloadQueue));
    }

    function renderQueue() {
        if (!queueListArea) return;
        if (downloadQueue.length === 0) {
            queueListArea.innerHTML = `<p class="text-center">Antrean kosong.</p>`;
            return;
        }
        queueListArea.innerHTML = downloadQueue.map((item, index) => `
            <div class="queue-item">
                <i class="fas fa-file-alt fa-2x w-12 text-center"></i>
                <div class="queue-item-info">
                    <p class="queue-item-filename">${item.filename}</p>
                    <div class="queue-item-status">
                        <span class="status-badge ${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function addToQueue(item) {
        downloadQueue.push({ ...item, status: 'pending', id: Date.now() });
        saveQueue();
        alert(`"${item.filename}" telah ditambahkan ke antrean.`);
        processQueue();
    }
    
    function clearApiCache() {
        alert('Cache API akan dibersihkan di sini nanti.');
    }
    
    const apiEndpoints = {
        'tts': { url: `${API_BASE_URL}/tools/text-to-speech?text=test` },
        'tiktok-v2': { url: `${API_BASE_URL}/download/tiktok?url=https://www.tiktok.com/@mr.kunn/video/7370899450377030913` },
        'instagram-v2': { url: `${API_BASE_URL}/download/instagram?url=https://www.instagram.com/p/C8U0Y80y9xc/` },
        'pinterest-v2': { url: `${API_BASE_URL}/download/pinterest?url=https://id.pinterest.com/pin/11075286399619556/` },
        'snackvideo': { url: `${API_BASE_URL}/download/snackvideo?url=https://snackvideo.com/@MR.KUN/video/5229243730248039750` },
        'facebook': { url: `${API_BASE_URL}/download/facebook?url=https://www.facebook.com/reel/1183861299622933` },
        'spotify-dl': { url: `${API_BASE_URL}/download/spotify?url=https://open.spotify.com/track/4py7b9I212y2A1AwSCS16M` },
        'spotify-search': { url: `${API_BASE_URL}/search/spotify?query=test` },
        'gimage': { url: `${API_BASE_URL}/search/gimage?q=test` },
        'playstore': { url: `${API_BASE_URL}/search/playstore?q=test` },
        'fdroid': { url: `${API_BASE_URL}/search/fdroid?q=test` },
        'youtube-v2': { url: `${API_BASE_URL}/download/savetube?link=https://www.youtube.com/watch?v=dQw4w9WgXcQ` },
        'ssweb': { url: `${API_BASE_URL}/tools/ssweb?url=https://google.com` },
        'hostinfo': { url: `${API_BASE_URL}/tools/hostinfo?host=google.com` },
        'toghibli': { url: `${API_BASE_URL}/tools/toghibli?url=https://i.ibb.co/6y4nwtB/photo-1511367461989-f85a21fda167.jpg` },
        'remini': { url: `${API_BASE_URL}/imagecreator/remini?url=https://i.ibb.co/6y4nwtB/photo-1511367461989-f85a21fda167.jpg` },
        'upscale': { url: `${API_BASE_URL}/imagecreator/upscale?url=https://i.ibb.co/6y4nwtB/photo-1511367461989-f85a21fda167.jpg` },
        'random-waifu': { url: `${API_BASE_URL}/random/waifu` },
        'random-nsfw': { url: `${API_BASE_URL}/random/nsfw` },
        'random-papayang': { url: `${API_BASE_URL}/random/papayang` },
        'tiktok-vintex': { url: `https://api.ownblox.my.id/api/ttdl?url=https://www.tiktok.com/@mr.kunn/video/7370899450377030913` },
        'youtube-vintex': { url: `https://api.ownblox.my.id/api/ytdl?url=https://api.ownblox.my.id/api/ytdl?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&type=mp3` },
        'instagram-vintex': { url: `https://api.ownblox.my.id/api/igdl?url=https://www.instagram.com/p/C8U0Y80y9xc/` },
        'pinterest-vintex': { url: `https://api.ownblox.my.id/api/pinterest?q=test` },
    };

    async function checkApiStatus() {
        if (!showSettingsButton) return;
        const refreshButtonIcon = showSettingsButton.querySelector('i');
        refreshButtonIcon.classList.add('spin');
        const statusDots = document.querySelectorAll('.api-status');
        statusDots.forEach(dot => {
            dot.classList.remove('online', 'offline');
        });
        for (const id in apiEndpoints) {
            const statusDot = document.querySelector(`.api-status[data-api-id="${id}"]`);
            if (!statusDot) continue;
            try {
                const response = await fetch(apiEndpoints[id].url, { mode: 'cors' });
                if (response.ok || (response.type === 'opaque' && response.status === 0)) {
                    statusDot.classList.add('online');
                } else {
                    statusDot.classList.add('offline');
                }
            } catch (error) {
                statusDot.classList.add('offline');
            }
        }
        setTimeout(() => {
            refreshButtonIcon.classList.remove('spin');
        }, 1000);
    }
    
    function validateInput(inputElement, type = 'text') {
        const value = inputElement.value.trim();
        if (!value) {
            throw new Error("Input tidak boleh kosong.");
        }
        const patterns = {
            url: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
            tiktok: /tiktok\.com/,
            youtube: /youtube\.com|youtu\.be/,
            instagram: /instagram\.com/,
            pinterest: /pinterest\.com|pin\.it/,
            facebook: /facebook\.com|fb\.watch/,
            spotify: /spotify\.com/,
        };
        if (type !== 'text' && !patterns[type].test(value)) {
            throw new Error(`URL ${type.charAt(0).toUpperCase() + type.slice(1)} sepertinya tidak valid.`);
        }
        return value;
    }

    function displayLoading(area, button, type = 'card') {
        if(button) {
            button.disabled = true;
            button.innerHTML = `<div class="flex justify-center items-center"><div class="animate-spin rounded-full h-5 w-5 border-b-2"></div></div>`;
        }
        let skeletonHTML = '';
        switch (type) {
            case 'list':
                skeletonHTML = Array(5).fill('').map(() => `
                    <div class="flex items-center space-x-4 p-2">
                        <div class="skeleton avatar"></div>
                        <div class="flex-1 space-y-2">
                            <div class="skeleton text w-3/4"></div>
                            <div class="skeleton text w-1/2"></div>
                        </div>
                    </div>
                `).join('');
                break;
            case 'grid':
                skeletonHTML = `<div class="grid grid-cols-2 md:grid-cols-3 gap-4">` +
                Array(6).fill('').map(() => `<div class="skeleton thumbnail"></div>`).join('') + `</div>`;
                break;
            case 'card':
            default:
                skeletonHTML = `
                    <div class="p-2">
                        <div class="skeleton thumbnail mb-4"></div>
                        <div class="skeleton title"></div>
                        <div class="skeleton text w-full"></div>
                        <div class="skeleton text w-3/4"></div>
                    </div>
                `;
                break;
        }
        area.innerHTML = skeletonHTML;
    }

    function displayError(area, error) {
        console.error(error);
        let title = "Terjadi Kesalahan";
        let message = "Server mungkin sedang sibuk atau URL yang Anda masukkan tidak valid. Silakan coba lagi beberapa saat.";

        if (error.message.includes("Failed to fetch")) {
            title = "Koneksi Gagal";
            message = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
        } else if (error.message.toLowerCase().includes("not found") || error.message.toLowerCase().includes("tidak ditemukan")) {
            title = "Tidak Ditemukan";
            message = "Konten yang Anda cari tidak ditemukan. Pastikan URL atau kata kunci sudah benar.";
        } else if (error.message.toLowerCase().includes("valid")) {
            title = "Input Tidak Valid";
            message = error.message;
        } else {
            message = error.message;
        }

        area.innerHTML = `
            <div class="error-box">
                <p class="error-title">${title}</p>
                <p class="error-message">${message}</p>
            </div>
        `;
    }

    async function showNotification(title, options = {}) {
        if (!('Notification' in window)) {
            console.log('Browser ini tidak mendukung notifikasi.');
            return;
        }
        let permission = Notification.permission;
        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }
        if (permission === 'granted') {
            const defaultOptions = {
                body: '',
                icon: 'icon.png',
                badge: 'icon.png',
                vibrate: [200, 100, 200],
            };
            const notification = new Notification(title, { ...defaultOptions, ...options });
            if (options.onClick) {
                notification.onclick = options.onClick;
            }
            return notification;
        }
    }
    
    async function updateQueueNotification() {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;
        const completedCount = downloadQueue.filter(item => item.status === 'completed').length;
        const failedCount = downloadQueue.filter(item => item.status === 'failed').length;
        const totalCount = downloadQueue.length;
        if (totalCount === 0) return;
        let title = `Antrean Unduhan (${completedCount}/${totalCount} Selesai)`;
        if (failedCount > 0) {
            title += ` - ${failedCount} Gagal`;
        }
        const bodyItems = downloadQueue.slice(0, 4).map(item => {
            let icon = '⏳';
            if (item.status === 'completed') icon = '✅';
            if (item.status === 'failed') icon = '❌';
            if (item.status === 'pending') icon = '...';
            return `${icon} ${item.filename}`;
        }).join('\n');
        const isDone = (completedCount + failedCount) === totalCount;
        showNotification(title, {
            body: bodyItems,
            tag: 'download-queue-summary',
            renotify: false,
            silent: true,
            requireInteraction: !isDone,
        });
    }

    function createShareButtonHTML(options) {
        if (navigator.share) {
            const url = options.url || '';
            const title = options.title || '';
            const text = options.text || '';
            return `<button class="share-button" data-url="${url}" data-title="${title}" data-text="${text}"><i class="fas fa-share-alt"></i></button>`;
        }
        return '';
    }
    
    
    function showPage(pageToShow, callback = null) {
        const activePage = document.querySelector('.page:not(.hidden)');
        if (activePage) {
            activePage.style.opacity = '0';
            setTimeout(() => {
                activePage.classList.add('hidden');
                if (pageToShow) {
                    pageToShow.classList.remove('hidden');
                    setTimeout(() => { pageToShow.style.opacity = '1'; }, 20);
                    if (callback) callback();
                }
            }, 300);
        } else if (pageToShow) {
            if(mainHubPage && pageToShow !== mainHubPage) mainHubPage.classList.add('hidden');
            pageToShow.classList.remove('hidden');
            setTimeout(() => { pageToShow.style.opacity = '1'; }, 20);
            if (callback) callback();
        }
    }

    function showHub() {
        const activePage = document.querySelector('.page:not(#main-hub-page):not(.hidden)');
        if (activePage) {
            activePage.style.opacity = '0';
            setTimeout(() => {
                activePage.classList.add('hidden');
                if (mainHubPage) {
                    mainHubPage.classList.remove('hidden');
                    setTimeout(() => { mainHubPage.style.opacity = '1'; }, 20);
                }
            }, 300);
        }
    }

    async function executeDownload(url, filename) {
        try {
            const fileExtension = filename.split('.').pop().toLowerCase();
            let mediaType = 'file';
            if(['mp4', 'webm'].includes(fileExtension)) mediaType = 'video';
            else if(['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) mediaType = 'image';
            else if(['mp3', 'wav', 'ogg'].includes(fileExtension)) mediaType = 'audio';

            const proxiedUrl = 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url);
            const response = await fetch(proxiedUrl);
            if (!response.ok) throw new Error(`Proxy error: Status ${response.status}`);
            
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const tempLink = document.createElement('a');
            tempLink.href = objectUrl;
            tempLink.download = filename;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            
            saveToHistory(filename, url, mediaType);
        } catch (error) {
            console.error("Execute Download Error:", error);
            throw error;
        }
    }

    async function forceDownload(url, filename, buttonElement) {
        const originalText = buttonElement.innerHTML;
        buttonElement.disabled = true;
        buttonElement.innerHTML = `<span>Memulai...</span>`;
        try {
            await executeDownload(url, filename);
            showNotification('Unduhan Dimulai!', {
                body: `File "${filename}" sedang diunduh oleh browser Anda.`
            });
            if (!localStorage.getItem('promoNotifShown')) {
                setTimeout(() => {
                    showNotification('Suka dengan aplikasi ini?', {
                        body: 'Gabung grup WA kami untuk update & fitur terbaru!',
                        onClick: () => { window.open('https://chat.whatsapp.com/Fs51xgGlQQGFc169ppOTVd', '_blank'); }
                    });
                    localStorage.setItem('promoNotifShown', 'true');
                }, 10000);
            }
        } catch(error) {
            alert(`Gagal mengunduh file: ${error.message}`);
        } finally {
            buttonElement.disabled = false;
            buttonElement.innerHTML = originalText;
        }
    }

    async function processQueue() {
        if (isQueueProcessing) return;
        const pendingItem = downloadQueue.find(item => item.status === 'pending');
        if (!pendingItem) {
            console.log('Antrean selesai diproses.');
            if (downloadQueue.length > 0) updateQueueNotification();
            return;
        }
        isQueueProcessing = true;
        pendingItem.status = 'downloading';
        saveQueue();
        if(typeof renderQueue === "function") renderQueue();
        if(typeof updateQueueNotification === "function") updateQueueNotification();
        try {
            await executeDownload(pendingItem.url, pendingItem.filename);
            pendingItem.status = 'completed';
        } catch (error) {
            pendingItem.status = 'failed';
        } finally {
            isQueueProcessing = false;
            saveQueue();
            if(typeof renderQueue === "function") renderQueue();
            if(typeof updateQueueNotification === "function") updateQueueNotification();
            setTimeout(processQueue, 1000);
        }
    }
    
function displaySpotifyResults() {
    const start = spotifyCurrentPage * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    const paginatedItems = spotifyResults.slice(start, end);

    const resultsHTML = paginatedItems.map(track => {
        const filename = `${track.artist} - ${track.title}.mp3`.replace(/[<>:"/\\|?*]/g, '_');
        const fullTitle = `${track.artist} - ${track.title}`;
        const trackUrl = track.url || track.link; 

        return `<div class="bg-gradient-to-br p-3 flex items-center space-x-3">
                    <img src="${track.image}" alt="Cover" class="w-16 h-16 rounded">
                    <div class="flex-1 min-w-0">
                        <p class="font-semibold truncate">${track.title}</p>
                        <p class="text-sm truncate">${track.artist}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${createShareButtonHTML({ url: trackUrl, title: fullTitle, text: `Dengarkan lagu ${fullTitle}` })}
                        <button data-link="${track.link}" data-title="${fullTitle}" class="spotify-search-play-btn bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full"><i class="fas fa-play"></i></button>
                        <button data-url="${track.link}" data-filename="${filename}" class="add-to-queue-button"><i class="fas fa-plus"></i></button>
                        <button data-link="${track.link}" data-filename="${filename}" class="spotify-search-dl-btn bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-full"><i class="fas fa-download"></i></button>
                    </div>
                </div>`;
    }).join('');
    
    if (spotifyCurrentPage === 0) {
        spotifySearchResultArea.innerHTML = `<div class="space-y-3"></div>`;
        if(window.autoAnimate) autoAnimate(spotifySearchResultArea.querySelector('.space-y-3'));
    }
    spotifySearchResultArea.querySelector('.space-y-3').insertAdjacentHTML('beforeend', resultsHTML);

    const loadMoreContainer = document.getElementById('spotify-load-more-container');
    if (end < spotifyResults.length) {
        loadMoreContainer.innerHTML = `<button class="load-more-button">Muat Lebih Banyak (${end}/${spotifyResults.length})</button>`;
    } else {
        loadMoreContainer.innerHTML = '';
    }
}

    function displayGimageResults() {
        const start = gimageCurrentPage * RESULTS_PER_PAGE;
        const end = start + RESULTS_PER_PAGE;
        const paginatedItems = gimageResults.slice(start, end);
        const gridContainer = gimageSearchResultArea.querySelector('.grid');
        const resultsHTML = paginatedItems.map((imageObject, index) => {
            if (typeof imageObject === 'object' && imageObject.url) {
                const filename = `google_image_${Date.now()}_${start + index}.jpg`;
                return `<div class="bg-gradient-to-br p-2 flex flex-col">
                            <img src="${imageObject.url}" alt="Gambar" class="w-full h-40 object-cover rounded-lg mb-2">
                            <div class="flex items-center space-x-2 mt-auto">
                                ${createShareButtonHTML({ url: imageObject.url, title: 'Gambar dari Google' })}
                                <button data-url="${imageObject.url}" data-filename="${filename}" class="add-to-queue-button"><i class="fas fa-plus"></i></button>
                                <button data-url="${imageObject.url}" data-filename="${filename}" class="dl-gimage-button bg-green-600 text-white flex-1 flex items-center justify-center rounded-lg"><i class="fas fa-download"></i></button>
                            </div>
                        </div>`;
            }
            return '';
        }).join('');
        gridContainer.insertAdjacentHTML('beforeend', resultsHTML);
        const loadMoreContainer = document.getElementById('gimage-load-more-container');
        if (end < gimageResults.length) {
            loadMoreContainer.innerHTML = `<button class="load-more-button">Muat Lebih Banyak</button>`;
        } else {
            loadMoreContainer.innerHTML = '';
        }
    }

async function fetchAdminDownload() {
    displayLoading(adminDownloadResultArea, fetchAdminDownloadButton, 'card');
    try {
        const url = validateInput(adminDownloadUrlInput, 'url');
        const response = await fetch(`${API_BASE_URL}/download/xnxx?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (!data.status || !data.result || !data.result.files) {
            throw new Error(data.message || 'Gagal mengambil data dari URL khusus.');
        }

        const result = data.result;
        const title = result.title || 'Video Khusus';
        const filename = title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 60);

        // Perubahan di sini: Mengganti <img> dengan <video>
        adminDownloadResultArea.innerHTML = `
            <div class="bg-gradient-to-br p-4 rounded-lg">
                <p class="font-bold text-lg mb-2 truncate">${title}</p>
                <video src="${result.files.high || result.files.low}" poster="${result.image}" controls class="w-full rounded-lg mb-4 border"></video>
                <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                        <button data-url="${result.files.high}" data-filename="${filename}_high.mp4" class="new-dl-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download (High)</button>
                        <button class="add-to-queue-button" data-url="${result.files.high}" data-filename="${filename}_high.mp4"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button data-url="${result.files.low}" data-filename="${filename}_low.mp4" class="new-dl-button flex-1 text-center bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download (Low)</button>
                        <button class="add-to-queue-button" data-url="${result.files.low}" data-filename="${filename}_low.mp4"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <div class="mt-4 flex justify-center">
                    ${createShareButtonHTML({ url: result.URL, title: title, text: "Lihat video ini." })}
                </div>
            </div>
        `;
    } catch (error) {
        displayError(adminDownloadResultArea, error);
    } finally {
        fetchAdminDownloadButton.disabled = false;
        fetchAdminDownloadButton.textContent = 'Proses Link';
    }
}

function displayAdminResults() {
    const start = adminCurrentPage * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    const paginatedItems = adminResults.slice(start, end);
    const gridContainer = adminSearchResultArea.querySelector('.grid');

    if (!gridContainer) {
        console.error("Grid container for admin results not found!");
        return;
    }

    const resultsHTML = paginatedItems.map(item => {
        const title = item.title || "Tanpa Judul";
        const info = item.info || "";
        const link = item.link || "#";
        // Di sini kita ubah tombol "Download" menjadi tombol "Proses" yang akan memanggil downloader
        const downloaderButtonHTML = `<button data-url="${link}" class="admin-process-link-btn flex-1 text-center bg-red-600 text-white font-semibold py-1 px-2 rounded-lg text-sm"><i class="fas fa-arrow-down mr-1"></i> Proses & Unduh</button>`;

        return `<div class="admin-result-item flex flex-col justify-between">
                    <div>
                        <p class="admin-result-title">${title}</p>
                        <p class="admin-result-info">${info}</p>
                    </div>
                    <div class="flex items-center space-x-2 mt-3">
                        ${createShareButtonHTML({ url: link, title: title })}
                        ${downloaderButtonHTML}
                    </div>
                </div>`;
    }).join('');

    gridContainer.insertAdjacentHTML('beforeend', resultsHTML);

    const loadMoreContainer = document.getElementById('admin-load-more-container');
    if (end < adminResults.length) {
        loadMoreContainer.innerHTML = `<button class="load-more-button">Muat Lebih Banyak (${end}/${adminResults.length})</button>`;
    } else {
        loadMoreContainer.innerHTML = '';
    }
}

function showToast(text, type = 'info') {
    const colors = {
        info: "linear-gradient(to right, #00b09b, #96c93d)",
        success: "linear-gradient(to right, #00b09b, #96c93d)",
        warning: "linear-gradient(to right, #f2994a, #f2c94c)",
        error: "linear-gradient(to right, #ff5f6d, #ffc371)",
    };

    Toastify({
        text: text,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: colors[type] || colors['info'],
        }
    }).showToast();
}

function setupInputPersistence(inputElement, storageKey) {
    if (!inputElement) return;

    const savedValue = localStorage.getItem(storageKey);
    if (savedValue) {
        inputElement.value = savedValue;
    }

    let debounceTimer;
    inputElement.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            localStorage.setItem(storageKey, e.target.value);
        }, 500); // Simpan setelah 500ms tidak ada ketikan
    });
}

async function searchAdminContent() {
    displayLoading(adminSearchResultArea, searchAdminButton, 'grid');
    try {
        const query = validateInput(adminSearchQuery);
        adminResults = [];
        adminCurrentPage = 0;
        adminSearchResultArea.innerHTML = '<div class="grid grid-cols-2 gap-4"></div>';
        if (window.autoAnimate) autoAnimate(adminSearchResultArea.querySelector('.grid'));
        document.getElementById('admin-load-more-container').innerHTML = '';

        const response = await fetch(`${API_BASE_URL}/search/xnxx?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (!data.status || !data.result || data.result.length === 0) {
            throw new Error("Pencarian khusus gagal atau tidak ada hasil.");
        }
        adminResults = data.result;
        displayAdminResults();
    } catch (error) {
        displayError(adminSearchResultArea, error);
    } finally {
        searchAdminButton.disabled = false;
        searchAdminButton.innerHTML = 'Cari';
    }
}


    function displayPinterestResults() {
        const start = pinterestCurrentPage * RESULTS_PER_PAGE;
        const end = start + RESULTS_PER_PAGE;
        const paginatedItems = pinterestResults.slice(start, end);
        const gridContainer = pinterestResultArea.querySelector('.grid');
        const resultsHTML = paginatedItems.map((item, index) => {
            const downloadUrl = item.image;
            if (!downloadUrl) return '';
            const description = item.caption || `Pinterest Image ${start + index + 1}`;
            const customNamePart = pinterestCustomFilenameInput.value.trim();
            let finalBaseFilename = customNamePart ? `${customNamePart}_${start + index + 1}` : (description.replace(/[<>:"/\\|?*]/g, '_').substring(0, 40) || `pinterest_media_${Date.now()}_${start + index + 1}`);
            const finalFilename = `ByVintex - ${finalBaseFilename}.jpg`;
            return `<div class="bg-gradient-to-br p-2 flex flex-col">
                        <img src="${downloadUrl}" alt="${description}" class="w-full h-48 object-cover rounded-lg mb-2">
                        <div class="flex-1 min-w-0">
                           <p class="text-xs mb-2 truncate" title="${description}">${description}</p>
                        </div>
                        <div class="flex items-center space-x-2 mt-auto">
                           ${createShareButtonHTML({ url: downloadUrl, title: description})}
                           <button data-url="${downloadUrl}" data-filename="${finalFilename}" class="add-to-queue-button"><i class="fas fa-plus"></i></button>
                           <button data-url="${downloadUrl}" data-filename="${finalFilename}" class="download-button-pin flex-1 text-center bg-red-600 text-white font-semibold py-1 px-2 rounded-lg text-sm"><i class="fas fa-download mr-1"></i>Download</button>
                        </div>
                    </div>`;
        }).join('');
        gridContainer.insertAdjacentHTML('beforeend', resultsHTML);
        const loadMoreContainer = document.getElementById('pinterest-load-more-container');
        if (end < pinterestResults.length) {
            loadMoreContainer.innerHTML = `<button class="load-more-button">Muat Lebih Banyak (${end}/${pinterestResults.length})</button>`;
        } else {
            loadMoreContainer.innerHTML = '';
        }
    }
    
    async function searchSpotify() {
        displayLoading(spotifySearchResultArea, searchSpotifyButton, 'list');
        try {
            const query = validateInput(spotifySearchQuery);
            spotifyResults = [];
            spotifyCurrentPage = 0;
            spotifySearchResultArea.innerHTML = '';
            document.getElementById('spotify-load-more-container').innerHTML = '';
            const response = await fetch(`${API_BASE_URL}/search/spotify?query=${encodeURIComponent(query)}`);
            const json = await response.json();
            if (!json.status || !json.result || json.result.length === 0) {
                throw new Error("Pencarian tidak berhasil atau tidak ada hasil.");
            }
            spotifyResults = json.result;
            displaySpotifyResults();
        } catch (error) {
            displayError(spotifySearchResultArea, error);
        } finally {
            searchSpotifyButton.disabled = false;
            searchSpotifyButton.innerHTML = 'Cari';
        }
    }


async function fetchOpenAiChat() {
    displayLoading(openAiResultArea, fetchOpenAiButton);
    try {
        const text = validateInput(openAiPromptInput);
        const response = await fetch(`${API_BASE_URL}/ai/openai?text=${encodeURIComponent(text)}`);
        
        const textResponse = await response.text();
        let data;
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            throw new Error("API merespons dengan format yang tidak valid (kemungkinan halaman error).");
        }

        if (!data.status || !data.result) {
            throw new Error(data.message || "Gagal mendapatkan jawaban dari OpenAI.");
        }
        
        openAiResultArea.textContent = data.result;
    } catch (error) {
        displayError(openAiResultArea, error);
    } finally {
        fetchOpenAiButton.disabled = false;
        fetchOpenAiButton.textContent = 'Kirim';
    }
}

async function fetchMultiModelChat() {
    displayLoading(multiModelResultArea, fetchMultiModelButton);
    try {
        const prompt = validateInput(multiModelPromptInput);
        const model = multiModelSelect.value;
        const response = await fetch(`${API_BASE_URL}/ai/chatbot?prompt=${encodeURIComponent(prompt)}&model=${model}`);
        
        const textResponse = await response.text();
        let data;
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            throw new Error("API merespons dengan format yang tidak valid (kemungkinan halaman error).");
        }
        
        if (!data.status || !data.response) {
            throw new Error(data.message || "Gagal mendapatkan jawaban dari Chatbot.");
        }
        
        multiModelResultArea.textContent = data.response;
    } catch (error) {
        displayError(multiModelResultArea, error);
    } finally {
        fetchMultiModelButton.disabled = false;
        fetchMultiModelButton.textContent = 'Kirim';
    }
}

    async function searchGoogleImages() {
        displayLoading(gimageSearchResultArea, searchGimageButton, 'grid');
        try {
            const query = validateInput(gimageSearchQuery);
            gimageResults = [];
            gimageCurrentPage = 0;
            gimageSearchResultArea.innerHTML = '<div class="grid grid-cols-2 md:grid-cols-3 gap-3"></div>';
            if(window.autoAnimate) autoAnimate(gimageSearchResultArea.querySelector('.grid'));
            document.getElementById('gimage-load-more-container').innerHTML = '';
            const response = await fetch(`${API_BASE_URL}/search/gimage?q=${encodeURIComponent(query)}`);
            const json = await response.json();
            if (!json.status || !json.result || json.result.length === 0) {
                throw new Error("Pencarian gambar gagal atau tidak ada hasil.");
            }
            gimageResults = json.result;
            displayGimageResults();
        } catch (error) {
            displayError(gimageSearchResultArea, error);
        } finally {
            searchGimageButton.disabled = false;
            searchGimageButton.innerHTML = 'Cari Gambar';
        }
    }
    
    async function fetchPinterestMedia() {
        displayLoading(pinterestResultArea, fetchPinterestMediaButton, 'grid');
        try {
            const query = validateInput(pinterestUrlInput);
            pinterestResults = [];
            pinterestCurrentPage = 0;
            pinterestResultArea.innerHTML = '<div class="grid grid-cols-2 md:grid-cols-3 gap-4"></div>';
            if(window.autoAnimate) autoAnimate(pinterestResultArea.querySelector('.grid'));
            document.getElementById('pinterest-load-more-container').innerHTML = '';
            const apiUrl = `https://api.ownblox.my.id/api/pinterest?q=${encodeURIComponent(query)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status !== 200 || !Array.isArray(data.results) || data.results.length === 0) {
                throw new Error('Tidak ada hasil yang ditemukan atau terjadi kesalahan pada API.');
            }
            pinterestResults = data.results;
            displayPinterestResults();
        } catch (error) {
            displayError(pinterestResultArea, error);
        } finally {
            fetchPinterestMediaButton.disabled = false;
            fetchPinterestMediaButton.textContent = 'Download';
        }
    }

    async function fetchTTS() {
        displayLoading(ttsResultArea, fetchTtsButton, 'card');
        try {
            const text = validateInput(ttsTextInput);
            const response = await fetch(`${API_BASE_URL}/tools/text-to-speech?text=${encodeURIComponent(text)}`);
            const data = await response.json();
            if (data.status !== true || !Array.isArray(data.result) || data.result.length === 0) throw new Error('Gagal mendapatkan data suara dari API.');
            let resultHTML = data.result.map(voice => {
                const voiceName = voice.voice_name;
                let audioUrl = Object.values(voice).find(val => typeof val === 'string' && val.endsWith('.wav'));
                if (voiceName && audioUrl) {
                    const filename = `${voiceName.replace(/ /g, '_')}_TTS.wav`;
                    return `<div class="bg-gradient-to-br p-3 flex items-center space-x-2">
                                <div class="flex-1">
                                    <p class="font-semibold mb-2">${voiceName}</p>
                                    <audio controls class="w-full mb-3" src="${audioUrl}"></audio>
                                    <div class="flex items-center space-x-2">
                                        <button data-url="${audioUrl}" data-filename="${filename}" class="new-dl-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"><i class="fas fa-download mr-2"></i>Download</button>
                                        <button class="add-to-queue-button" data-url="${audioUrl}" data-filename="${filename}"><i class="fas fa-plus"></i></button>
                                    </div>
                                </div>
                                ${createShareButtonHTML({ url: audioUrl, title: `Suara ${voiceName}`, text: `Dengarkan suara ini` })}
                            </div>`;
                }
                return '';
            }).join('');
            ttsResultArea.innerHTML = `<div class="space-y-3">${resultHTML}</div>`;
        } catch (error) {
            displayError(ttsResultArea, error);
        } finally {
            fetchTtsButton.disabled = false;
            fetchTtsButton.textContent = 'Ubah ke Suara';
        }
    }

    async function fetchTikTokInfoV2() {
        displayLoading(tiktokV2ResultArea, fetchTiktokV2Button, 'card');
        try {
            const url = validateInput(tiktokV2UrlInput, 'tiktok');
            const response = await fetch(`${API_BASE_URL}/download/tiktok?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || json.result.code !== 0) throw new Error(json.result.msg || 'Gagal mengambil data TikTok.');
            const data = json.result.data;
            const baseFilename = (data.title || `tiktok_v2_${data.id}`).replace(/[<>:"/\\|?*]/g, '_').substring(0, 50);
            let buttonsHTML = '';
            if (data.play) buttonsHTML += `<button data-url="${data.play}" data-filename="${baseFilename}_NoWM.mp4" class="new-dl-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-video mr-2"></i>Video (No WM)</button>`;
            if (data.hdplay) buttonsHTML += `<button data-url="${data.hdplay}" data-filename="${baseFilename}_HD.mp4" class="new-dl-button flex-1 text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-high-definition mr-2"></i>Video (HD)</button>`;
            if (data.wmplay) buttonsHTML += `<button data-url="${data.wmplay}" data-filename="${baseFilename}_WM.mp4" class="new-dl-button flex-1 text-center bg-gray-600 font-semibold py-2 px-4 rounded-lg"><i class="fas fa-tint mr-2"></i>Video (WM)</button>`;
            if (data.music) buttonsHTML += `<button data-url="${data.music}" data-filename="${baseFilename}_Music.mp3" class="new-dl-button flex-1 text-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-music mr-2"></i>Audio (MP3)</button>`;
            tiktokV2ResultArea.innerHTML = `<div class="bg-gradient-to-br p-4">
                <p class="font-semibold mb-1 truncate" title="${data.title}">${data.title || 'Video TikTok'}</p>
                <p class="text-sm mb-4">by: ${data.author.nickname}</p>
                <video class="w-full rounded-lg mb-4" controls poster="${data.cover}" src="${data.play}"></video>
                <div class="flex items-center space-x-2">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">${buttonsHTML}</div>
                    <div class="flex flex-col space-y-2">
                        ${createShareButtonHTML({ url: data.play, title: data.title, text: "Lihat video TikTok ini!" })}
                        <button class="add-to-queue-button" data-url="${data.play}" data-filename="${baseFilename}_NoWM.mp4"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
            </div>`;
        } catch (error) {
            displayError(tiktokV2ResultArea, error);
        } finally {
            fetchTiktokV2Button.disabled = false;
            fetchTiktokV2Button.textContent = 'Download';
        }
    }
    
    async function fetchInstagramMediaV2() {
        displayLoading(instagramV2ResultArea, fetchInstagramV2Button, 'card');
        try {
            const url = validateInput(instagramV2UrlInput, 'instagram');
            const response = await fetch(`${API_BASE_URL}/download/instagram?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.result.downloadUrls) throw new Error(json.message || 'Gagal mengambil data Instagram.');
            const data = json.result;
            let resultHTML = `<h3 class="font-semibold mb-2 truncate">${data.title || 'Postingan Instagram'}</h3>`;
            data.downloadUrls.forEach((dlUrl, index) => {
                const filename = `${(data.title || `instagram_v2_${Date.now()}`).replace(/[<>:"/\\|?*]/g, '_').substring(0, 40)}_${index + 1}.mp4`;
                resultHTML += `<div class="bg-gradient-to-br p-4 mb-3">
                    <p class="mb-2">Media ${index + 1}</p>
                    <video class="w-full rounded-lg mb-4" controls src="${dlUrl}"></video>
                    <div class="flex items-center space-x-2">
                        <button data-url="${dlUrl}" data-filename="${filename}" class="new-dl-button flex-1 text-center bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download Media ${index + 1}</button>
                        <button class="add-to-queue-button" data-url="${dlUrl}" data-filename="${filename}"><i class="fas fa-plus"></i></button>
                        ${createShareButtonHTML({ url: dlUrl, title: `Postingan Instagram ${index + 1}`})}
                    </div>
                </div>`;
            });
            instagramV2ResultArea.innerHTML = resultHTML;
        } catch (error) {
            displayError(instagramV2ResultArea, error);
        } finally {
            fetchInstagramV2Button.disabled = false;
            fetchInstagramV2Button.textContent = 'Download';
        }
    }

    async function fetchPinterestMediaV2() {
        displayLoading(pinterestV2ResultArea, fetchPinterestV2Button, 'grid');
        try {
            const url = validateInput(pinterestV2UrlInput, 'pinterest');
            const response = await fetch(`${API_BASE_URL}/download/pinterest?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.results) throw new Error(json.message || 'Gagal mengambil data Pinterest.');
            let resultHTML = json.results.map((item, index) => {
                const filename = `pinterest_v2_${Date.now()}_${index + 1}.${item.tag === 'video' ? 'mp4' : 'jpg'}`;
                const mediaHTML = item.tag === 'video' ? `<video class="w-full h-48 object-cover rounded-lg mb-2" controls src="${item.direct}"></video>` : `<img src="${item.direct}" alt="Pinterest media" class="w-full h-48 object-cover rounded-lg mb-2">`;
                return `<div class="bg-gradient-to-br p-2 flex flex-col">${mediaHTML}
                    <div class="flex items-center space-x-2 mt-auto">
                        <button class="add-to-queue-button" data-url="${item.direct}" data-filename="${filename}"><i class="fas fa-plus"></i></button>
                        <button data-url="${item.direct}" data-filename="${filename}" class="new-dl-button flex-1 text-center bg-red-600 text-white font-semibold py-1 px-2 rounded-lg text-sm"><i class="fas fa-download mr-1"></i>Download</button>
                        ${createShareButtonHTML({ url: item.direct, title: 'Gambar dari Pinterest'})}
                    </div>
                </div>`;
            }).join('');
            pinterestV2ResultArea.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 gap-4">${resultHTML}</div>`;
        } catch (error) {
            displayError(pinterestV2ResultArea, error);
        } finally {
            fetchPinterestV2Button.disabled = false;
            fetchPinterestV2Button.textContent = 'Download';
        }
    }
    
    async function fetchSnackVideo() {
        displayLoading(snackvideoResultArea, fetchSnackvideoButton, 'card');
        try {
            const url = validateInput(snackvideoUrlInput, 'url');
            const response = await fetch(`${API_BASE_URL}/download/snackvideo?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.result.downloadUrl) throw new Error(json.message || 'Gagal mengambil data Snack Video.');
            const data = json.result;
            const filename = `snackvideo_${Date.now()}.mp4`;
            snackvideoResultArea.innerHTML = `<div class="bg-gradient-to-br p-4">
                <video class="w-full rounded-lg mb-4" controls poster="${data.thumbnail}" src="${data.downloadUrl}"></video>
                <div class="flex items-center space-x-2">
                    <button data-url="${data.downloadUrl}" data-filename="${filename}" class="new-dl-button flex-1 text-center font-bold py-2 px-4 rounded-lg" style="background-color: #FFC400; color: black;"><i class="fas fa-download mr-2"></i>Download Video</button>
                    <button class="add-to-queue-button" data-url="${data.downloadUrl}" data-filename="${filename}"><i class="fas fa-plus"></i></button>
                    ${createShareButtonHTML({ url: data.downloadUrl, title: 'Video dari SnackVideo'})}
                </div>
            </div>`;
        } catch (error) {
            displayError(snackvideoResultArea, error);
        } finally {
            fetchSnackvideoButton.disabled = false;
            fetchSnackvideoButton.textContent = 'Download';
        }
    }

    async function fetchFacebookMedia() {
        displayLoading(facebookResultArea, fetchFacebookButton, 'card');
        try {
            const url = validateInput(facebookUrlInput, 'facebook');
            const response = await fetch(`${API_BASE_URL}/download/facebook?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.result || !json.result.media) throw new Error(json.message || 'Gagal mengambil data Facebook. Pastikan URL valid.');
            const data = json.result;
            const info = data.info;
            const media = data.media;
            const baseFilename = (info.title || `facebook_${Date.now()}`).replace(/[<>:"/\\|?* \n]/g, '_').substring(0, 50);
            let buttonsHTML = '';
            const downloadUrl = media.video_hd || media.video_sd;
            if (media.video_sd) buttonsHTML += `<button data-url="${media.video_sd}" data-filename="${baseFilename}_SD.mp4" class="new-dl-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-video mr-2"></i>Download (SD)</button>`;
            if (media.video_hd) buttonsHTML += `<button data-url="${media.video_hd}" data-filename="${baseFilename}_HD.mp4" class="new-dl-button flex-1 text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-high-definition mr-2"></i>Download (HD)</button>`;
            if (!buttonsHTML) throw new Error('Tidak ada link unduhan video yang ditemukan.');
            facebookResultArea.innerHTML = `<div class="bg-gradient-to-br p-4">
                <p class="font-semibold mb-3 whitespace-pre-wrap">${info.title || 'Video Facebook'}</p>
                <video class="w-full rounded-lg mb-4" controls poster="${media.thumbnail}" src="${downloadUrl}"></video>
                <div class="flex items-center space-x-2">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">${buttonsHTML}</div>
                    <button class="add-to-queue-button" data-url="${downloadUrl}" data-filename="${baseFilename}.mp4"><i class="fas fa-plus"></i></button>
                    ${createShareButtonHTML({ url: downloadUrl, title: info.title || 'Video dari Facebook'})}
                </div>
            </div>`;
        } catch (error) {
            displayError(facebookResultArea, error);
        } finally {
            fetchFacebookButton.disabled = false;
            fetchFacebookButton.textContent = 'Download';
        }
    }


async function fetchSpotifySong() {
    displayLoading(spotifyResultArea, fetchSpotifyButton, 'card');
    try {
        const url = validateInput(spotifyUrlInput, 'spotify');
        // Kita ganti API di sini
        const response = await fetch(`https://api.vyturex.com/spotify?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status !== true || !data.data) {
            throw new Error(data.mess || 'Gagal mengambil info lagu dari API baru.');
        }

        const track = data.data;
        const artistName = Array.isArray(track.artists) ? track.artists.join(', ') : track.artists;
        const filename = `${artistName} - ${track.title}.mp3`.replace(/[<>:"/\\|?*]/g, '_');
        const downloadUrl = track.url; // Link download langsung dari API baru

        if (!downloadUrl) {
            throw new Error("Link download MP3 tidak ditemukan di respons API.");
        }
        
        spotifyResultArea.innerHTML = `
            <div class="bg-gradient-to-br p-4 text-center">
                <img src="${track.thumbnail}" alt="Album Cover" class="w-40 h-40 mx-auto rounded-lg mb-4 shadow-lg">
                <h3 class="font-bold text-lg truncate">${track.title}</h3>
                <p class="mb-1">${artistName}</p>
                <p class="text-sm mb-4">Durasi: ${Math.floor(track.duration / 60000)}:${((track.duration % 60000) / 1000).toFixed(0).padStart(2, '0')}</p>
                <div class="flex items-center space-x-2">
                    <button data-url="${downloadUrl}" data-filename="${filename}" class="new-dl-button flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download MP3</button>
                    <button class="add-to-queue-button" data-url="${downloadUrl}" data-filename="${filename}"><i class="fas fa-plus"></i></button>
                    ${createShareButtonHTML({ url: url, title: `${track.title} by ${artistName}`, text: `Dengarkan di Spotify!`})}
                </div>
            </div>`;

    } catch (error) {
        displayError(spotifyResultArea, error);
    } finally {
        fetchSpotifyButton.disabled = false;
        fetchSpotifyButton.innerHTML = 'Download';
    }
}

async function downloadFromSpotifySearch(link, filename, button) {
    const originalIcon = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<div class="animate-spin rounded-full h-5 w-5 border-b-2"></div>`;
    
    try {
        const proxiedApiUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(link);
        const response = await fetch(proxiedApiUrl);
        if (!response.ok) throw new Error(`Proxy allorigins.win gagal.`);
        
        const textResponse = await response.text();
        let json;
        try {
            json = JSON.parse(textResponse);
        } catch (e) {
            throw new Error("API merespons dengan format yang tidak valid (bukan JSON).");
        }
        
        if (!json.status || !json.result || !json.result.download_url) {
            throw new Error(json.message || "Gagal mendapatkan link unduhan MP3 dari API.");
        }
        
        const downloadUrl = json.result.download_url;
        await forceDownload(downloadUrl, filename, button);

    } catch (error) {
        alert(`Gagal memulai unduhan: ${error.message}`);
    } finally {
        button.disabled = false;
        button.innerHTML = originalIcon;
    }
}

async function playFromSpotifySearch(link, title, button) {
    const playerContainer = document.getElementById('spotify-player-container');
    const audioPlayer = document.getElementById('spotify-audio-player');
    const playerTitle = document.getElementById('spotify-player-title');
    const originalIcon = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<div class="animate-spin rounded-full h-5 w-5 border-b-2"></div>`;

    try {
        const proxiedApiUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(link);
        const response = await fetch(proxiedApiUrl);
        if (!response.ok) throw new Error(`Proxy allorigins.win gagal.`);

        const textResponse = await response.text();
        let json;
        try {
            json = JSON.parse(textResponse);
        } catch (e) {
            throw new Error("API merespons dengan format yang tidak valid (bukan JSON).");
        }

        if (!json.status || !json.result || !json.result.download_url) {
            throw new Error(json.message || "Gagal mengambil link audio dari API.");
        }
        
        playerTitle.textContent = `Now Playing: ${title}`;
        const audioUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(json.result.download_url);
        audioPlayer.src = audioUrl;
        playerContainer.classList.remove('hidden');
        if(window.autoAnimate) autoAnimate(playerContainer);
        audioPlayer.play();
        playerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
        alert(`Error saat memutar lagu: ${error.message}`);
    } finally {
        button.disabled = false;
        button.innerHTML = originalIcon;
    }
}

    async function searchPlayStore() {
        displayLoading(playstoreSearchResultArea, searchPlaystoreButton, 'list');
        try {
            const query = validateInput(playstoreSearchQuery);
            const response = await fetch(`${API_BASE_URL}/search/playstore?q=${encodeURIComponent(query)}`);
            const json = await response.json();
            if (!json.status || !json.result) throw new Error(json.message || "Pencarian aplikasi gagal.");
            if (json.result.length === 0) {
                playstoreSearchResultArea.innerHTML = `<p class="text-center">Tidak ada aplikasi yang ditemukan untuk "${query}".</p>`;
                return;
            }
            let resultsHTML = json.result.map(app => {
                return `<div class="bg-gradient-to-br p-3 flex items-center space-x-4"><img src="${app.img}" alt="App Icon" class="w-16 h-16 rounded-xl"><div class="flex-1 min-w-0"><p class="font-semibold truncate">${app.nama}</p><p class="text-sm truncate">${app.developer}</p><p class="text-yellow-400 text-sm font-bold"><i class="fas fa-star mr-1"></i> ${app.rate2}</p></div><a href="${app.link}" target="_blank" class="bg-teal-500 text-white p-2 rounded-full"><i class="fas fa-external-link-alt"></i></a></div>`;
            }).join('');
            playstoreSearchResultArea.innerHTML = `<div class="space-y-3">${resultsHTML}</div>`;
        } catch(error) {
            displayError(playstoreSearchResultArea, error);
        } finally {
            searchPlaystoreButton.disabled = false;
            searchPlaystoreButton.innerHTML = 'Cari Aplikasi';
        }
    }

    async function searchFDroid() {
        displayLoading(fdroidSearchResultArea, searchFdroidButton, 'list');
        try {
            const query = validateInput(fdroidSearchQuery);
            const response = await fetch(`${API_BASE_URL}/search/fdroid?q=${encodeURIComponent(query)}`);
            const json = await response.json();
            if (!json.status) throw new Error(json.message || "Pencarian F-Droid gagal.");
            if (!json.result || json.result.length === 0) {
                fdroidSearchResultArea.innerHTML = `<p class="text-center">Tidak ada aplikasi yang ditemukan untuk "${query}".</p>`;
                return;
            }
            let resultsHTML = json.result.map(app => {
                return `<div class="bg-gradient-to-br p-3 flex items-center space-x-4"><div class="w-16 h-16 rounded-xl bg-gray-600 flex items-center justify-center"><i class="fas fa-box-open text-3xl"></i></div><div class="flex-1 min-w-0"><p class="font-semibold truncate">${app.name || 'Nama Aplikasi'}</p><p class="text-sm truncate">${app.summary || 'Deskripsi singkat...'}</p></div><a href="${app.link}" target="_blank" class="bg-blue-700 text-white p-2 rounded-full"><i class="fas fa-external-link-alt"></i></a></div>`;
            }).join('');
            fdroidSearchResultArea.innerHTML = `<div class="space-y-3">${resultsHTML}</div>`;
        } catch(error) {
            displayError(fdroidSearchResultArea, error);
        } finally {
            searchFdroidButton.disabled = false;
            searchFdroidButton.innerHTML = 'Cari Aplikasi';
        }
    }
    
    async function fetchTikTokInfo() {
        displayLoading(tiktokResultArea, fetchTiktokVideoButton, 'card');
        try {
            const videoUrl = validateInput(tiktokUrlInput, 'tiktok');
            const apiUrl = `https://api.ownblox.my.id/api/ttdl?url=${encodeURIComponent(videoUrl)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === true && data.result) {
                const result = data.result;
                const customNamePart = tiktokCustomFilenameInput.value.trim();
                let finalBaseFilename = customNamePart ? `ByVintex - ${customNamePart}` : (result.title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50) || 'tiktok_video_download');
                tiktokResultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><p class="font-semibold mb-2 truncate" title="${result.title}">${result.title}</p><p class="text-sm mb-4">by: ${result.author}</p><video class="w-full rounded-lg mb-4" controls src="${result.video}"></video><div class="flex items-center space-x-2"><div class="flex space-x-2 flex-1"><button data-url="${result.video}" data-filename="${finalBaseFilename}.mp4" class="download-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-video mr-2"></i>Video</button><button data-url="${result.audio}" data-filename="${finalBaseFilename}.mp3" class="download-button flex-1 text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-music mr-2"></i>Audio</button></div><button class="add-to-queue-button" data-url="${result.video}" data-filename="${finalBaseFilename}.mp4"><i class="fas fa-plus"></i></button>${createShareButtonHTML({url: videoUrl, title: result.title})}</div></div>`;
            } else {
                throw new Error(data.message || 'Gagal mengambil data video.');
            }
        } catch (error) {
            displayError(tiktokResultArea, error);
        } finally {
            fetchTiktokVideoButton.disabled = false;
            fetchTiktokVideoButton.textContent = 'Download';
        }
    }

    async function fetchYouTubeMedia(type, buttonElement) {
        displayLoading(youtubeResultArea, buttonElement, 'card');
        try {
            const videoUrl = validateInput(youtubeUrlInput, 'youtube');
            document.querySelectorAll('.get-media-button').forEach(btn => btn.disabled = true);
            const apiUrl = `https://api.ownblox.my.id/api/ytdl?url=${encodeURIComponent(videoUrl)}&type=${type}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === true && data.result) {
                const result = data.result;
                const downloadUrl = (type === 'mp4') ? result.video_download : result.audio_download;
                if (!downloadUrl) throw new Error(`Link download untuk tipe '${type}' tidak ditemukan.`);
                const customNamePart = youtubeCustomFilenameInput.value.trim();
                let finalBaseFilename = customNamePart ? `ByVintex - ${customNamePart}` : (result.title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50) || `youtube_media_${type}`);
                youtubeResultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><p class="font-semibold mb-2 truncate" title="${result.title}">${result.title}</p><img src="${result.thumbnail}" alt="Thumbnail" class="w-full rounded-lg mb-4"><p class="text-sm mb-1">Kualitas: ${result.quality || 'Audio'}</p><div class="flex items-center space-x-2"><button data-url="${downloadUrl}" data-filename="${finalBaseFilename}.${type}" class="download-button-yt flex-1 mt-2 text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download File (.${type})</button><button class="add-to-queue-button" data-url="${downloadUrl}" data-filename="${finalBaseFilename}.${type}"><i class="fas fa-plus"></i></button>${createShareButtonHTML({url: downloadUrl, title: result.title})}</div></div>`;
            } else {
                throw new Error(data.message || `Gagal mengambil data YouTube untuk tipe ${type}.`);
            }
        } catch (error) {
            displayError(youtubeResultArea, error);
        } finally {
            document.querySelectorAll('.get-media-button').forEach(btn => {
                btn.disabled = false;
                if(btn.dataset.type === 'mp4') btn.innerHTML = 'Get Video (MP4)'; else btn.innerHTML = 'Get Audio (MP3)';
            });
        }
    }
    
    async function fetchInstagramMedia() {
        displayLoading(instagramResultArea, fetchInstagramMediaButton, 'card');
        try {
            const postUrl = validateInput(instagramUrlInput, 'instagram');
            const apiUrl = `https://api.ownblox.my.id/api/igdl?url=${encodeURIComponent(postUrl)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === true && data.result) {
                const downloadItems = Array.isArray(data.result) ? data.result : [data.result];
                let resultHTML = downloadItems.map((item, index) => {
                    const downloadUrl = item.download_url || item.url;
                    if (!downloadUrl) return '';
                    const fileType = item.type === 'mp4' ? 'mp4' : 'jpg';
                    const customNamePart = instagramCustomFilenameInput.value.trim();
                    let finalBaseFilename = customNamePart ? `ByVintex - ${customNamePart}` : ((item.caption || `instagram_${Date.now()}`).replace(/[<>:"/\\|?*]/g, '_').substring(0, 50));
                    if (downloadItems.length > 1) { finalBaseFilename += `_${index + 1}`; }
                    const finalFilename = `${finalBaseFilename}.${fileType}`;
                    const mediaTag = fileType === 'mp4' ? `<video class="w-full rounded-lg mb-4" controls src="${downloadUrl}"></video>` : `<img src="${item.thumbnail || downloadUrl}" alt="Instagram media" class="w-full rounded-lg mb-4">`;
                    return `<div class="bg-gradient-to-br p-4 mb-4"><p class="text-sm mb-2">by: ${item.username || 'Unknown'}</p>${mediaTag}<p class="text-sm mb-4">${item.caption || ''}</p><div class="flex items-center space-x-2"><button data-url="${downloadUrl}" data-filename="${finalFilename}" class="download-button-ig flex-1 mt-2 text-center bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download (.${fileType})</button><button class="add-to-queue-button" data-url="${downloadUrl}" data-filename="${finalFilename}"><i class="fas fa-plus"></i></button>${createShareButtonHTML({url: downloadUrl, title: item.caption || 'Postingan Instagram'})}</div></div>`;
                }).join('');
                instagramResultArea.innerHTML = resultHTML;
            } else {
                throw new Error(data.message || 'Gagal mengambil data dari Instagram.');
            }
        } catch (error) {
            displayError(instagramResultArea, error);
        } finally {
            fetchInstagramMediaButton.disabled = false;
            fetchInstagramMediaButton.textContent = 'Download';
        }
    }

    function displayYouTubeV2Options() {
        try {
            validateInput(youtubeV2UrlInput, 'youtube');
            youtubeV2ResultArea.innerHTML = '';
            const formats = [{ label: 'Audio (MP3)', value: 'mp3', icon: 'fa-music', color: 'bg-green-600' }, { label: '144p', value: '144', icon: 'fa-video', color: 'bg-gray-600' }, { label: '360p', value: '360', icon: 'fa-video', color: 'bg-blue-600' }, { label: '480p', value: '480', icon: 'fa-video', color: 'bg-blue-600' }, { label: '720p HD', value: '720', icon: 'fa-video', color: 'bg-red-600' }, { label: '1080p FHD', value: '1080', icon: 'fa-video', color: 'bg-red-600' }, { label: '1440p 2K', value: '1440', icon: 'fa-video', color: 'bg-purple-600' }, { label: '2160p 4K', value: '4k', icon: 'fa-video', color: 'bg-purple-600' }, ];
            let optionsHTML = formats.map(format => `<button data-format="${format.value}" class="format-button-yt-v2 w-full text-white font-bold py-2 px-4 rounded-lg ${format.color}"><i class="fas ${format.icon} mr-2"></i>${format.label}</button>`).join('');
            youtubeV2OptionsArea.innerHTML = `<p class="text-center mb-3">Silakan pilih format yang diinginkan:</p><div class="grid grid-cols-2 md:grid-cols-4 gap-3">${optionsHTML}</div>`;
        } catch (error) {
            displayError(youtubeV2OptionsArea, error);
        }
    }

    async function fetchYouTubeMediaV2(format, buttonElement) {
        displayLoading(youtubeV2ResultArea, buttonElement, 'card');
        try {
            const videoUrl = validateInput(youtubeV2UrlInput, 'youtube');
            document.querySelectorAll('.format-button-yt-v2').forEach(btn => btn.disabled = true);
            const originalButtonText = buttonElement.innerHTML;
            const response = await fetch(`${API_BASE_URL}/download/savetube?link=${encodeURIComponent(videoUrl)}&format=${format}`);
            const data = await response.json();
            if (data.status === true && data.result && data.result.download) {
                const result = data.result;
                const customNamePart = youtubeV2CustomFilenameInput.value.trim();
                const fileExtension = format === 'mp3' ? 'mp3' : 'mp4';
                let finalBaseFilename = customNamePart ? `ByVintex - ${customNamePart}` : (result.title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50) || `youtube_media_${format}`);
                youtubeV2ResultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><p class="font-semibold mb-2 truncate" title="${result.title}">${result.title}</p><img src="${result.thumbnail}" alt="Thumbnail" class="w-full rounded-lg mb-4"><p class="text-sm mb-1">Kualitas Terpilih: ${result.quality || format}</p><div class="flex items-center space-x-2"><button data-url="${result.download}" data-filename="${finalBaseFilename}.${fileExtension}" class="download-button-yt-v2 flex-1 mt-2 text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download File (.${fileExtension})</button><button class="add-to-queue-button" data-url="${result.download}" data-filename="${finalBaseFilename}.${fileExtension}"><i class="fas fa-plus"></i></button>${createShareButtonHTML({url: result.download, title: result.title})}</div></div>`;
            } else {
                throw new Error(data.message || `Gagal mengambil data untuk format ${format}. Mungkin format ini tidak tersedia.`);
            }
        } catch (error) {
            displayError(youtubeV2ResultArea, error);
        } finally {
            document.querySelectorAll('.format-button-yt-v2').forEach(btn => {
                btn.disabled = false;
                if(btn === buttonElement) btn.innerHTML = originalButtonText;
            });
        }
    }

    async function fetchSsweb() {
        displayLoading(sswebResultArea, fetchSswebButton, 'card');
        try {
            const url = validateInput(sswebUrlInput, 'url');
            const response = await fetch(`${API_BASE_URL}/tools/ssweb?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            if (data.status === true && data.result) {
                const { pc: pcImgUrl, mobile: mobileImgUrl } = data.result;
                const baseFilename = (new URL(url).hostname).replace(/[<>:"/\\|?*]/g, '_').substring(0, 40);
                sswebResultArea.innerHTML = `<div class="bg-gradient-to-br p-4 mb-4"><h3 class="font-semibold mb-2">Screenshot PC</h3><img src="${pcImgUrl}" alt="PC Screenshot" class="w-full rounded-lg mb-4 border"><div class="flex items-center space-x-2"><button data-url="${pcImgUrl}" data-filename="${baseFilename}_PC.jpg" class="dl-image-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download PC</button>${createShareButtonHTML({url: pcImgUrl, title: `Screenshot PC dari ${url}`})}</div></div><div class="bg-gradient-to-br p-4"><h3 class="font-semibold mb-2">Screenshot Mobile</h3><img src="${mobileImgUrl}" alt="Mobile Screenshot" class="w-full rounded-lg mb-4 border"><div class="flex items-center space-x-2"><button data-url="${mobileImgUrl}" data-filename="${baseFilename}_Mobile.jpg" class="dl-image-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download Mobile</button>${createShareButtonHTML({url: mobileImgUrl, title: `Screenshot Mobile dari ${url}`})}</div></div>`;
            } else {
                throw new Error(data.message || 'Gagal mengambil screenshot website.');
            }
        } catch (error) {
            displayError(sswebResultArea, error);
        } finally {
            fetchSswebButton.disabled = false;
            fetchSswebButton.textContent = 'Ambil Screenshot';
        }
    }

    async function fetchHostInfo() {
        displayLoading(hostinfoResultArea, fetchHostinfoButton, 'card');
        try {
            const host = validateInput(hostinfoUrlInput);
            hostinfoResultArea.classList.remove('hidden');
            const response = await fetch(`${API_BASE_URL}/tools/hostinfo?host=${encodeURIComponent(host)}`);
            const data = await response.json();
            if (data.status === true && data.result) {
                const result = data.result;
                let resultHTML = `<p class="mb-2"><strong>IP:</strong> ${result.ip||'-'}</p><p class="mb-2"><strong>Nama Host:</strong> ${result.name||'-'}</p><p class="mb-2"><strong>ISP:</strong> ${result.isp||'-'}</p><p class="mb-2"><strong>Organisasi:</strong> ${result.organisation||'-'}</p><p class="mb-2"><strong>Wilayah:</strong> ${result.region||'-'}</p><p class="mb-2"><strong>Kota:</strong> ${result.city||'-'}</p><p class="mb-2"><strong>Zona Waktu:</strong> ${result.timezone||'-'}</p><p class="mb-2"><strong>Kode Pos:</strong> ${result.postalcode||'-'}</p>`;
                if (result.range && result.range.trim().length > 0) resultHTML += `<p class="mb-2"><strong>Rentang IP:</strong> <pre class="whitespace-pre-wrap">${result.range.trim()}</pre></p>`;
                hostinfoResultArea.innerHTML = resultHTML;
            } else {
                throw new Error(data.message || 'Gagal mendapatkan info host.');
            }
        } catch (error) {
            displayError(hostinfoResultArea, error);
        } finally {
            fetchHostinfoButton.disabled = false;
            fetchHostinfoButton.textContent = 'Dapatkan Info Host';
        }
    }

    async function fetchToGhibli() {
        displayLoading(toghibliResultArea, fetchToghibliButton, 'card');
        try {
            const imageUrl = validateInput(toghibliUrlInput, 'url');
            const prompt = toghibliPromptInput.value.trim();
            let apiUrl = `${API_BASE_URL}/tools/toghibli?url=${encodeURIComponent(imageUrl)}`;
            if (prompt) apiUrl += `&prompt=${encodeURIComponent(prompt)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === true && data.result && data.result.data && data.result.data.length > 0) {
                const ghibliImgUrl = data.result.data[0].url;
                toghibliResultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><img src="${ghibliImgUrl}" alt="Ghibli Style Image" class="w-full rounded-lg mb-4 border"><div class="flex items-center space-x-2"><button data-url="${ghibliImgUrl}" data-filename="ghibli_style_${Date.now()}.png" class="dl-image-button flex-1 text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download</button>${createShareButtonHTML({url: ghibliImgUrl, title: 'Gambar Gaya Ghibli'})}</div></div>`;
            } else {
                throw new Error(data.message || 'Gagal mengubah gambar.');
            }
        } catch (error) {
            displayError(toghibliResultArea, error);
        } finally {
            fetchToghibliButton.disabled = false;
            fetchToghibliButton.textContent = 'Ubah ke Ghibli';
        }
    }
    async function fetchRemini() {
        displayLoading(reminiResultArea, fetchReminiButton, 'card');
        try {
            const imageUrl = validateInput(reminiUrlInput, 'url');
            const response = await fetch(`${API_BASE_URL}/imagecreator/remini?url=${encodeURIComponent(imageUrl)}`);
            const data = await response.json();
            if (data.status === true && data.result) {
                reminiResultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><img src="${data.result}" alt="Enhanced Image" class="w-full rounded-lg mb-4 border"><div class="flex items-center space-x-2"><button data-url="${data.result}" data-filename="remini_enhanced_${Date.now()}.png" class="dl-image-button flex-1 text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download</button>${createShareButtonHTML({url: data.result, title: 'Gambar Enhanced'})}</div></div>`;
            } else {
                throw new Error(data.message || 'Gagal enhance gambar.');
            }
        } catch (error) {
            displayError(reminiResultArea, error);
        } finally {
            fetchReminiButton.disabled = false;
            fetchReminiButton.textContent = 'Enhance Gambar';
        }
    }
    async function fetchUpscale() {
        displayLoading(upscaleResultArea, fetchUpscaleButton, 'card');
        try {
            const imageUrl = validateInput(upscaleUrlInput, 'url');
            const response = await fetch(`${API_BASE_URL}/imagecreator/upscale?url=${encodeURIComponent(imageUrl)}`);
            const data = await response.json();
            if (data.status === true && data.result) {
                upscaleResultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><img src="${data.result}" alt="Upscaled Image" class="w-full rounded-lg mb-4 border"><div class="flex items-center space-x-2"><button data-url="${data.result}" data-filename="upscaled_image_${Date.now()}.png" class="dl-image-button flex-1 text-center bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download</button>${createShareButtonHTML({url: data.result, title: 'Gambar Upscaled'})}</div></div>`;
            } else {
                throw new Error(data.message || 'Gagal upscale gambar.');
            }
        } catch (error) {
            displayError(upscaleResultArea, error);
        } finally {
            fetchUpscaleButton.disabled = false;
            fetchUpscaleButton.textContent = 'Upscale Gambar';
        }
    }

    async function fetchRandomImage(apiEndpoint, resultArea, buttonElement) {
        const originalButtonText = buttonElement.textContent;
        displayLoading(resultArea, buttonElement, 'card');
        try {
            const response = await fetch(`${API_BASE_URL}/random/${apiEndpoint}`);
            if (!response.ok) throw new Error(`Gagal memuat gambar. Status: ${response.status}`);
            const imageUrl = response.url;
            resultArea.innerHTML = `<div class="bg-gradient-to-br p-4"><img src="${imageUrl}" alt="Random Image" class="w-full rounded-lg mb-4 border object-contain max-h-96"><div class="flex items-center space-x-2"><button data-url="${imageUrl}" data-filename="${apiEndpoint}_${Date.now()}.jpg" class="dl-image-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"><i class="fas fa-download mr-2"></i>Download Gambar</button>${createShareButtonHTML({url: imageUrl, title: `Gambar Random ${apiEndpoint}`})}</div></div>`;
        } catch (error) {
            displayError(resultArea, error);
        } finally {
            buttonElement.disabled = false;
            buttonElement.textContent = originalButtonText;
        }
    }
    const fetchRandomWaifu = () => fetchRandomImage('waifu', randomWaifuResultArea, fetchRandomWaifuButton);
    const fetchRandomNsfw = () => fetchRandomImage('nsfw', randomNsfwResultArea, fetchRandomNsfwButton);
    const fetchRandomPapayang = () => fetchRandomImage('papayang', randomPapayangResultArea, fetchRandomPapayangButton);
    
    backButtons.forEach(button => button.addEventListener('click', showHub));
    
    document.getElementById('show-tts-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('tts-page')); });
    document.getElementById('show-tiktok-v2-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('tiktok-v2-downloader-page')); });
    document.getElementById('show-instagram-v2-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('instagram-v2-downloader-page')); });
    document.getElementById('show-pinterest-v2-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('pinterest-v2-downloader-page')); });
    document.getElementById('show-snackvideo-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('snackvideo-downloader-page')); });
    document.getElementById('show-youtube-v2-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('youtube-v2-downloader-page')); });
    document.getElementById('show-tiktok-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('tiktok-downloader-page')); });
    document.getElementById('show-youtube-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('youtube-downloader-page')); });
    document.getElementById('show-instagram-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('instagram-downloader-page')); });
    document.getElementById('show-pinterest-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('pinterest-downloader-page')); });
    document.getElementById('show-ssweb-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('ssweb-page')); });
    document.getElementById('show-hostinfo-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('hostinfo-page')); });
    document.getElementById('show-toghibli-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('toghibli-page')); });
    document.getElementById('show-remini-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('remini-page')); });
    document.getElementById('show-upscale-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('upscale-page')); });
    document.getElementById('show-random-waifu-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('random-waifu-page'), fetchRandomWaifu); });
    document.getElementById('show-random-nsfw-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('random-nsfw-page'), fetchRandomNsfw); });
    document.getElementById('show-random-papayang-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('random-papayang-page'), fetchRandomPapayang); });
    document.getElementById('show-facebook-downloader').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('facebook-downloader-page')); });
    document.getElementById('show-spotify-downloader-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('spotify-downloader-page')); });
    document.getElementById('show-spotify-search-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('spotify-search-page')); });
    document.getElementById('show-gimage-search-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('gimage-search-page')); });
    document.getElementById('show-playstore-search-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('playstore-search-page')); });
    document.getElementById('show-fdroid-search-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('fdroid-search-page')); });
    
    themeToggleButton.addEventListener('click', () => setTema(!document.documentElement.classList.contains('dark')));
    themeToggleSwitch.addEventListener('change', (e) => setTema(e.target.checked));
    resultsPerPageInput.addEventListener('change', (e) => {
        let newValue = parseInt(e.target.value);
        if (isNaN(newValue) || newValue < 3) newValue = 3;
        if (newValue > 50) newValue = 50;
        e.target.value = newValue;
        RESULTS_PER_PAGE = newValue;
        localStorage.setItem('resultsPerPage', newValue);
        alert(`Jumlah hasil per halaman diubah menjadi ${newValue}.`);
    });
    clearApiCacheButton.addEventListener('click', clearApiCache);
    clearHistorySettingsButton.addEventListener('click', () => { if (confirm('Yakin ingin hapus riwayat?')) { localStorage.removeItem('downloadHistory'); alert('Riwayat unduhan telah dibersihkan.'); } });
    showSettingsButton.addEventListener('click', (e) => { e.preventDefault(); showPage(settingsPage, loadSettings); });
    showQueueButton.addEventListener('click', (e) => { e.preventDefault(); showPage(queuePage, renderQueue); });
    showHistoryButton.addEventListener('click', (e) => { e.preventDefault(); showPage(historyPage, loadHistory); });
    clearHistoryButton.addEventListener('click', () => { if (confirm('Yakin ingin hapus riwayat?')) { localStorage.removeItem('downloadHistory'); loadHistory(); } });
    copyHostinfoButton.addEventListener('click', async () => {
        const resultText = hostinfoResultArea.innerText;
        if (!resultText || hostinfoResultArea.querySelector('.error-box')) return alert("Tidak ada info untuk disalin.");
        try {
            await navigator.clipboard.writeText(resultText);
            copyHostinfoButton.textContent = 'Tersalin!';
            copyHostinfoButton.disabled = true;
            setTimeout(() => { copyHostinfoButton.textContent = 'Salin'; copyHostinfoButton.disabled = false; }, 2000);
        } catch (err) {
            alert('Gagal menyalin info.');
        }
    });

document.getElementById('show-admin-download').addEventListener('click', (e) => {
    e.preventDefault();
    const password = prompt("Fitur Khusus Admin. Masukkan Password:");
    if (password === "114477") {
        showPage(document.getElementById('admin-downloader-page'));
    } else if (password !== null) {
        alert("Password salah!");
    }
});
fetchAdminDownloadButton.addEventListener('click', fetchAdminDownload);
startQueueButton.addEventListener('click', processQueue);
clearCompletedButton.addEventListener('click', () => {
    downloadQueue = downloadQueue.filter(item => item.status === 'pending' || item.status === 'downloading');
    saveQueue();
    renderQueue();
    alert('Item yang sudah selesai/gagal telah dibersihkan dari antrean.');
});
document.getElementById('show-admin-feature').addEventListener('click', (e) => {
    e.preventDefault();
    const password = prompt("Fitur Khusus Admin. Masukkan Password:");
    if (password === "114477") {
        showPage(document.getElementById('admin-search-page'));
    } else if (password !== null) {
        alert("Password salah!");
    }
});
searchAdminButton.addEventListener('click', searchAdminContent);
document.getElementById('admin-load-more-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('load-more-button')) {
        adminCurrentPage++;
        displayAdminResults();
    }
});

document.getElementById('show-openai-chat-page').addEventListener('click', (e) => {
    e.preventDefault();
    showPage(document.getElementById('openai-chat-page'));
});
document.getElementById('show-multimodel-chat-page').addEventListener('click', (e) => {
    e.preventDefault();
    showPage(document.getElementById('multimodel-chat-page'));
});

fetchOpenAiButton.addEventListener('click', fetchOpenAiChat);
fetchMultiModelButton.addEventListener('click', fetchMultiModelChat);

    document.getElementById('spotify-load-more-container').addEventListener('click', (e) => { if (e.target.classList.contains('load-more-button')) { spotifyCurrentPage++; displaySpotifyResults(); }});
    document.getElementById('gimage-load-more-container').addEventListener('click', (e) => { if (e.target.classList.contains('load-more-button')) { gimageCurrentPage++; displayGimageResults(); }});
    document.getElementById('pinterest-load-more-container').addEventListener('click', (e) => { if (e.target.classList.contains('load-more-button')) { pinterestCurrentPage++; displayPinterestResults(); }});
    
    document.body.addEventListener('click', (e) => {
        const target = e.target;
        const button = target.closest('button');
        if (!button) return;

        const buttonId = button.id;
        const actions = {
            'fetch-tts-button': fetchTTS,
            'fetch-tiktok-v2-button': fetchTikTokInfoV2,
            'fetch-instagram-v2-button': fetchInstagramMediaV2,
            'fetch-pinterest-v2-button': fetchPinterestMediaV2,
            'fetch-snackvideo-button': fetchSnackVideo,
            'fetch-facebook-button': fetchFacebookMedia,
            'fetch-spotify-button': fetchSpotifySong,
            'search-spotify-button': searchSpotify,
            'search-gimage-button': searchGoogleImages,
            'search-playstore-button': searchPlayStore,
            'search-fdroid-button': searchFDroid,
            'fetch-tiktok-video-button': fetchTikTokInfo,
            'fetch-youtube-mp4-button': () => fetchYouTubeMedia('mp4', fetchYoutubeMp4Button),
            'fetch-youtube-mp3-button': () => fetchYouTubeMedia('mp3', fetchYoutubeMp3Button),
            'fetch-instagram-media-button': fetchInstagramMedia,
            'fetch-pinterest-media-button': fetchPinterestMedia,
            'fetch-youtube-v2-options-button': displayYouTubeV2Options,
            'fetch-ssweb-button': fetchSsweb,
            'fetch-hostinfo-button': fetchHostInfo,
            'fetch-toghibli-button': fetchToGhibli,
            'fetch-remini-button': fetchRemini,
            'fetch-upscale-button': fetchUpscale,
            'fetch-random-waifu-button': fetchRandomWaifu,
            'fetch-random-nsfw-button': fetchRandomNsfw,
            'fetch-random-papayang-button': fetchRandomPapayang
        };

        if (buttonId && actions[buttonId]) {
            actions[buttonId]();
        }

        if (target.closest('.add-to-queue-button')) {
            const btn = target.closest('.add-to-queue-button');
            addToQueue({ url: btn.dataset.url, filename: btn.dataset.filename });
            return;
        }
        
        const adminProcessBtn = target.closest('.admin-process-link-btn');
if (adminProcessBtn) {
    const urlToProcess = adminProcessBtn.dataset.url;
    // Buka halaman admin downloader dan langsung isi URL-nya
    showPage(document.getElementById('admin-downloader-page'));
    adminDownloadUrlInput.value = urlToProcess;
    // Langsung klik tombol proses untuk memulai
    fetchAdminDownloadButton.click(); 
}

        const dlBtn = target.closest('.new-dl-button, .dl-image-button, .download-button, .download-button-yt, .download-button-ig, .download-button-pin, .download-button-yt-v2');
        if (dlBtn) {
            forceDownload(dlBtn.dataset.url, dlBtn.dataset.filename, dlBtn);
        }
        const spotifyDlBtn = target.closest('.spotify-search-dl-btn');
        if (spotifyDlBtn) {
            downloadFromSpotifySearch(spotifyDlBtn.dataset.link, spotifyDlBtn.dataset.filename, spotifyDlBtn);
        }
        const spotifyPlayBtn = target.closest('.spotify-search-play-btn');
        if (spotifyPlayBtn) {
            playFromSpotifySearch(spotifyPlayBtn.dataset.link, spotifyPlayBtn.dataset.title, spotifyPlayBtn);
        }
        const ytV2FormatBtn = target.closest('.format-button-yt-v2');
        if (ytV2FormatBtn) {
            fetchYouTubeMediaV2(ytV2FormatBtn.dataset.format, ytV2FormatBtn);
        }
        const shareBtn = target.closest('.share-button');
        if (shareBtn) {
            const { url, title, text } = shareBtn.dataset;
            if (navigator.share) {
                navigator.share({
                    title: title || document.title,
                    text: text || '',
                    url: url || window.location.href,
                }).catch((error) => console.log('Gagal berbagi:', error));
            }
        }
    });

setupInputPersistence(ttsTextInput, 'saved_tts_input');
setupInputPersistence(tiktokV2UrlInput, 'saved_tiktok_v2_url');
setupInputPersistence(instagramV2UrlInput, 'saved_ig_v2_url');
setupInputPersistence(pinterestV2UrlInput, 'saved_pinterest_v2_url');
setupInputPersistence(snackvideoUrlInput, 'saved_snack_url');
setupInputPersistence(facebookUrlInput, 'saved_facebook_url');
setupInputPersistence(spotifyUrlInput, 'saved_spotify_dl_url');
setupInputPersistence(spotifySearchQuery, 'saved_spotify_search_query');
setupInputPersistence(gimageSearchQuery, 'saved_gimage_search_query');
setupInputPersistence(playstoreSearchQuery, 'saved_playstore_search_query');
setupInputPersistence(fdroidSearchQuery, 'saved_fdroid_search_query');
setupInputPersistence(adminSearchQuery, 'saved_admin_search_query');
setupInputPersistence(adminDownloadUrlInput, 'saved_admin_download_url');

    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalButton = document.getElementById('close-modal-button');
    const modalWidget = document.getElementById('modal-widget');
    
    if (modalOverlay && closeModalButton && modalWidget) {
        const closeModal = () => {
            modalOverlay.style.opacity = '0';
            modalWidget.style.transform = 'scale(0.95)';
            setTimeout(() => modalOverlay.classList.add('hidden'), 300);
        };
        closeModalButton.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
        
        // Logika baru: Langsung cek dan tampilkan modal tanpa jeda
        const alreadyShown = localStorage.getItem('modalShown');
        if (!alreadyShown) {
            modalOverlay.classList.remove('hidden');
            // Sedikit jeda agar transisi CSS berjalan mulus
            setTimeout(() => {
                modalOverlay.style.opacity = '1';
                modalWidget.style.transform = 'scale(1)';
            }, 50);
            localStorage.setItem('modalShown', 'true');
        }
    }
    
    setTema(localStorage.getItem('theme') === 'dark');
    checkApiStatus();
});