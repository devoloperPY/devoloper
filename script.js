document.addEventListener('DOMContentLoaded', function() {
    
    // --- PENGATURAN DASAR ---
    const mainHubPage = document.getElementById('main-hub-page');
    const allContentPages = document.querySelectorAll('body > div:not(#main-hub-page)'); 
    const backButtons = document.querySelectorAll('.back-button');
    const API_BASE_URL = 'https://flowfalcon.dpdns.org';

    // --- FUNGSI NAVIGASI HALAMAN ---
    function showPage(pageToShow, callback = null) {
        allContentPages.forEach(page => {
            if (page) page.classList.add('hidden');
        });
        if (mainHubPage) mainHubPage.classList.add('hidden');
        if (pageToShow) {
            pageToShow.classList.remove('hidden');
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    }

    function showHub() {
        allContentPages.forEach(page => {
            if (page) page.classList.add('hidden');
        });
        if (mainHubPage) mainHubPage.classList.remove('hidden');
    }

    backButtons.forEach(button => { button.addEventListener('click', showHub); });

    // --- NAVIGASI MENU UTAMA (SATU BLOK) ---
    document.getElementById('show-filetourl-page').addEventListener('click', (e) => { e.preventDefault(); showPage(document.getElementById('filetourl-page')); });
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

    // --- SELEKTOR ELEMEN (SATU BLOK) ---
    const fileInput = document.getElementById('file-input'), filetourlResultArea = document.getElementById('filetourl-result-area');
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

    // --- FUNGSI PEMBANTU ---
    async function forceDownload(url, filename, buttonElement) {
        const originalText = buttonElement.innerHTML;
        buttonElement.disabled = true;
        buttonElement.innerHTML = `<span>Menyiapkan...</span>`;
        try {
            const proxiedUrl = 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url);
            const response = await fetch(proxiedUrl);
            if (!response.ok) throw new Error(`Gagal memulai unduhan: Status ${response.status}`);
            const totalSize = Number(response.headers.get('Content-Length'));
            const reader = response.body.getReader();
            const chunks = [];
            let receivedSize = 0;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                receivedSize += value.length;
                if (totalSize) {
                    const percentage = Math.round((receivedSize / totalSize) * 100);
                    const receivedMB = (receivedSize / (1024 * 1024)).toFixed(1);
                    const totalMB = (totalSize / (1024 * 1024)).toFixed(1);
                    buttonElement.textContent = `Mengunduh ${percentage}% (${receivedMB}MB / ${totalMB}MB)`;
                } else {
                    const receivedMB = (receivedSize / (1024 * 1024)).toFixed(1);
                    buttonElement.textContent = `Mengunduh ${receivedMB} MB`;
                }
            }
            buttonElement.textContent = `Menyusun file...`;
            const blob = new Blob(chunks);
            const objectUrl = URL.createObjectURL(blob);
            const tempLink = document.createElement('a');
            tempLink.href = objectUrl;
            tempLink.download = filename;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error("Force Download Error:", error);
            alert(`Gagal mengunduh file. Coba lagi nanti.\nError: ${error.message}`);
        } finally {
            buttonElement.disabled = false;
            if (buttonElement.classList.contains('spotify-search-dl-btn') || buttonElement.classList.contains('dl-gimage-button')) {
                buttonElement.innerHTML = '<i class="fas fa-download"></i>';
            } else {
                 buttonElement.innerHTML = originalText;
            }
        }
    }

    function displayLoading(area, button) {
        if(button) {
            button.disabled = true;
            button.innerHTML = `<div class="flex justify-center items-center"><div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div></div>`;
        }
        area.innerHTML = `<div class="flex justify-center items-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>`;
    }

    function displayError(area, error) {
        area.innerHTML = `<p class="text-red-500 text-center">Error: ${error.message}</p>`;
    }
    
async function handleFileUpload() {
    const file = fileInput.files[0];
    if (!file) return;

    filetourlResultArea.innerHTML = `
        <div class="bg-[#1f2c34] p-4 rounded-lg">
            <p class="text-white truncate mb-2">${file.name}</p>
            <div class="progress-bar-container">
                <div id="upload-progress-bar" class="progress-bar-fill"></div>
            </div>
            <p id="upload-status" class="text-center text-sm text-gray-400 mt-2">Mengupload... 0%</p>
        </div>
    `;

    const progressBar = document.getElementById('upload-progress-bar');
    const uploadStatus = document.getElementById('upload-status');

    const formData = new FormData();
    formData.append('fileToUpload', file);

    try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://URL-PUBLIK-SERVER-ANDA/upload', true);

        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                progressBar.style.width = percentComplete + '%';
                uploadStatus.textContent = `Mengupload... ${percentComplete}%`;
            }
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    uploadStatus.textContent = 'Upload Berhasil!';
                    filetourlResultArea.innerHTML = `
                        <div class="bg-green-800/50 border border-green-600 p-4 rounded-lg">
                            <p class="text-white font-semibold mb-2">Upload Berhasil!</p>
                            <p class="text-sm text-gray-300 truncate mb-4" title="${response.url}">${response.url}</p>
                            <button data-url="${response.url}" class="copy-link-btn w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600">
                                <i class="fas fa-copy mr-2"></i>Salin Link
                            </button>
                        </div>
                    `;
                } else {
                    throw new Error(response.message);
                }
            } else {
                throw new Error(`Server Error: ${xhr.statusText}`);
            }
        };

        xhr.onerror = function() {
            throw new Error('Tidak bisa terhubung ke server lokal. Pastikan server.js sudah berjalan.');
        };

        xhr.send(formData);

    } catch (error) {
        filetourlResultArea.innerHTML = `<p class="text-red-500 text-center">Error: ${error.message}</p>`;
    }
}



// Pasang event listener ke input file
fileInput.addEventListener('change', handleFileUpload);
// === AKHIR KODE BARU ===

    // Fitur TTS
    async function fetchTTS() {
        const text = ttsTextInput.value.trim();
        if (!text) { ttsResultArea.innerHTML = `<p class="text-red-500 text-center">Teks tidak boleh kosong.</p>`; return; }
        displayLoading(ttsResultArea, fetchTtsButton);
        try {
            const response = await fetch(`${API_BASE_URL}/tools/text-to-speech?text=${encodeURIComponent(text)}`);
            const data = await response.json();
            if (data.status !== true || !Array.isArray(data.result) || data.result.length === 0) { throw new Error('Gagal mendapatkan data suara dari API.'); }
            let resultHTML = data.result.map(voice => {
                const voiceName = voice.voice_name;
                let audioUrl = Object.values(voice).find(val => typeof val === 'string' && val.endsWith('.wav'));
                if (voiceName && audioUrl) {
                    const filename = `${voiceName.replace(/ /g, '_')}_TTS.wav`;
                    return `<div class="bg-[#1f2c34] rounded-lg p-3"><p class="text-white font-semibold mb-2">${voiceName}</p><audio controls class="w-full mb-3" src="${audioUrl}">Browser Anda tidak support.</audio><a href="${audioUrl}" download="${filename}" class="w-full block text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 text-sm"><i class="fas fa-download mr-2"></i>Download</a></div>`;
                }
                return '';
            }).join('');
            ttsResultArea.innerHTML = resultHTML;
        } catch (error) { displayError(ttsResultArea, error);
        } finally {
            fetchTtsButton.disabled = false;
            fetchTtsButton.textContent = 'Ubah ke Suara';
        }
    }

    // Fitur TikTok V2
    async function fetchTikTokInfoV2() {
        const url = tiktokV2UrlInput.value.trim();
        if (!url) return;
        displayLoading(tiktokV2ResultArea, fetchTiktokV2Button);
        try {
            const response = await fetch(`${API_BASE_URL}/download/tiktok?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || json.result.code !== 0) throw new Error(json.result.msg || 'Gagal mengambil data TikTok.');
            const data = json.result.data;
            const baseFilename = (data.title || `tiktok_v2_${data.id}`).replace(/[<>:"/\\|?*]/g, '_').substring(0, 50);
            let buttonsHTML = '';
            if(data.play) buttonsHTML += `<button data-url="${data.play}" data-filename="${baseFilename}_NoWM.mp4" class="new-dl-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"><i class="fas fa-video mr-2"></i>Video (No WM)</button>`;
            if(data.hdplay) buttonsHTML += `<button data-url="${data.hdplay}" data-filename="${baseFilename}_HD.mp4" class="new-dl-button flex-1 text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700"><i class="fas fa-high-definition mr-2"></i>Video (HD)</button>`;
            if(data.wmplay) buttonsHTML += `<button data-url="${data.wmplay}" data-filename="${baseFilename}_WM.mp4" class="new-dl-button flex-1 text-center bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700"><i class="fas fa-tint mr-2"></i>Video (WM)</button>`;
            if(data.music) buttonsHTML += `<button data-url="${data.music}" data-filename="${baseFilename}_Music.mp3" class="new-dl-button flex-1 text-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"><i class="fas fa-music mr-2"></i>Audio (MP3)</button>`;
            tiktokV2ResultArea.innerHTML = `<div class="bg-[#1f2c34] rounded-lg p-4"><p class="text-white font-semibold mb-1 truncate" title="${data.title}">${data.title || 'Video TikTok'}</p><p class="text-sm text-gray-400 mb-4">by: ${data.author.nickname}</p><video class="w-full rounded-lg mb-4" controls poster="${data.cover}" src="${data.play}"></video><div class="grid grid-cols-2 gap-2">${buttonsHTML}</div></div>`;
        } catch (error) { displayError(tiktokV2ResultArea, error);
        } finally {
            fetchTiktokV2Button.disabled = false;
            fetchTiktokV2Button.textContent = 'Download';
        }
    }
    
    // Fitur Instagram V2
    async function fetchInstagramMediaV2() {
        const url = instagramV2UrlInput.value.trim();
        if (!url) return;
        displayLoading(instagramV2ResultArea, fetchInstagramV2Button);
        try {
            const response = await fetch(`${API_BASE_URL}/download/instagram?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.result.downloadUrls) throw new Error(json.message || 'Gagal mengambil data Instagram.');
            const data = json.result;
            let resultHTML = `<h3 class="text-white font-semibold mb-2 truncate">${data.title || 'Postingan Instagram'}</h3>`;
            data.downloadUrls.forEach((dlUrl, index) => {
                const filename = `${(data.title || `instagram_v2_${Date.now()}`).replace(/[<>:"/\\|?*]/g, '_').substring(0, 40)}_${index + 1}.mp4`;
                resultHTML += `<div class="bg-[#1f2c34] rounded-lg p-4 mb-3"><p class="text-gray-400 mb-2">Media ${index + 1}</p><video class="w-full rounded-lg mb-4" controls src="${dlUrl}"></video><button data-url="${dlUrl}" data-filename="${filename}" class="new-dl-button w-full text-center bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700"><i class="fas fa-download mr-2"></i>Download Media ${index + 1}</button></div>`;
            });
            instagramV2ResultArea.innerHTML = resultHTML;
        } catch (error) { displayError(instagramV2ResultArea, error);
        } finally {
            fetchInstagramV2Button.disabled = false;
            fetchInstagramV2Button.textContent = 'Download';
        }
    }

    // Fitur Pinterest V2
    async function fetchPinterestMediaV2() {
        const url = pinterestV2UrlInput.value.trim();
        if (!url) return;
        displayLoading(pinterestV2ResultArea, fetchPinterestV2Button);
        try {
            const response = await fetch(`${API_BASE_URL}/download/pinterest?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.results) throw new Error(json.message || 'Gagal mengambil data Pinterest.');
            let resultHTML = json.results.map((item, index) => {
                const filename = `pinterest_v2_${Date.now()}_${index + 1}.${item.tag === 'video' ? 'mp4' : 'jpg'}`;
                const mediaHTML = item.tag === 'video' ? `<video class="w-full h-48 object-cover rounded-lg mb-2" controls src="${item.direct}"></video>` : `<img src="${item.direct}" alt="Pinterest media" class="w-full h-48 object-cover rounded-lg mb-2">`;
                return `<div class="bg-[#1f2c34] rounded-lg p-2 flex flex-col">${mediaHTML}<p class="text-white text-xs mb-2 flex-1 capitalize">${item.tag} ${index + 1}</p><button data-url="${item.direct}" data-filename="${filename}" class="new-dl-button w-full mt-auto text-center bg-red-600 text-white font-semibold py-1 px-2 rounded-lg hover:bg-red-700 text-sm"><i class="fas fa-download mr-1"></i>Download</button></div>`;
            }).join('');
            pinterestV2ResultArea.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 gap-4">${resultHTML}</div>`;
        } catch (error) { displayError(pinterestV2ResultArea, error);
        } finally {
            fetchPinterestV2Button.disabled = false;
            fetchPinterestV2Button.textContent = 'Download';
        }
    }
    
    // Fitur Snack Video
    async function fetchSnackVideo() {
        const url = snackvideoUrlInput.value.trim();
        if (!url) return;
        displayLoading(snackvideoResultArea, fetchSnackvideoButton);
        try {
            const response = await fetch(`${API_BASE_URL}/download/snackvideo?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.result.downloadUrl) throw new Error(json.message || 'Gagal mengambil data Snack Video.');
            const data = json.result;
            const filename = `snackvideo_${Date.now()}.mp4`;
            snackvideoResultArea.innerHTML = `<div class="bg-[#1f2c34] rounded-lg p-4"><video class="w-full rounded-lg mb-4" controls poster="${data.thumbnail}" src="${data.downloadUrl}"></video><button data-url="${data.downloadUrl}" data-filename="${filename}" class="new-dl-button w-full text-center font-bold py-2 px-4 rounded-lg" style="background-color: #FFC400; color: black;"><i class="fas fa-download mr-2"></i>Download Video</button></div>`;
        } catch (error) { displayError(snackvideoResultArea, error);
        } finally {
            fetchSnackvideoButton.disabled = false;
            fetchSnackvideoButton.textContent = 'Download';
        }
    }

    // Fitur Facebook (Updated)
    async function fetchFacebookMedia() {
        const url = facebookUrlInput.value.trim();
        if (!url) return;
        displayLoading(facebookResultArea, fetchFacebookButton);
        try {
            const response = await fetch(`${API_BASE_URL}/download/facebook?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.result || !json.result.media) throw new Error(json.message || 'Gagal mengambil data Facebook. Pastikan URL valid.');
            const data = json.result;
            const info = data.info;
            const media = data.media;
            const baseFilename = (info.title || `facebook_${Date.now()}`).replace(/[<>:"/\\|?* \n]/g, '_').substring(0, 50);
            let buttonsHTML = '';
            if (media.video_sd) buttonsHTML += `<button data-url="${media.video_sd}" data-filename="${baseFilename}_SD.mp4" class="new-dl-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"><i class="fas fa-video mr-2"></i>Download (SD)</button>`;
            if (media.video_hd) buttonsHTML += `<button data-url="${media.video_hd}" data-filename="${baseFilename}_HD.mp4" class="new-dl-button flex-1 text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700"><i class="fas fa-high-definition mr-2"></i>Download (HD)</button>`;
            if (!buttonsHTML) throw new Error('Tidak ada link unduhan video yang ditemukan.');
            facebookResultArea.innerHTML = `<div class="bg-[#1f2c34] rounded-lg p-4"><p class="text-white font-semibold mb-3 whitespace-pre-wrap">${info.title || 'Video Facebook'}</p><video class="w-full rounded-lg mb-4" controls poster="${media.thumbnail}" src="${media.video_sd || media.video_hd}"></video><div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${buttonsHTML}</div></div>`;
        } catch (error) { displayError(facebookResultArea, error);
        } finally {
            fetchFacebookButton.disabled = false;
            fetchFacebookButton.textContent = 'Download';
        }
    }

    // Fitur Spotify Downloader
    async function fetchSpotifySong() {
        const url = spotifyUrlInput.value.trim();
        if (!url) return;
        displayLoading(spotifyResultArea, fetchSpotifyButton);
        try {
            const response = await fetch(`${API_BASE_URL}/download/spotify?url=${encodeURIComponent(url)}`);
            const json = await response.json();
            if (!json.status || !json.result || !json.result.download_url) throw new Error(json.message || "Gagal mendapatkan info lagu.");
            const track = json.result;
            const filename = `${track.artist} - ${track.title}.mp3`.replace(/[<>:"/\\|?*]/g, '_');
            spotifyResultArea.innerHTML = `<div class="bg-[#1f2c34] rounded-lg p-4 text-center"><img src="${track.cover}" alt="Album Cover" class="w-40 h-40 mx-auto rounded-lg mb-4 shadow-lg"><h3 class="text-white font-bold text-lg truncate">${track.title}</h3><p class="text-gray-400 mb-1">${track.artist}</p><p class="text-gray-400 text-sm mb-4">Album: ${track.album}</p><button data-url="${track.download_url}" data-filename="${filename}" class="new-dl-button w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"><i class="fas fa-download mr-2"></i>Download MP3</button></div>`;
        } catch (error) { displayError(spotifyResultArea, error);
        } finally {
            fetchSpotifyButton.disabled = false;
            fetchSpotifyButton.innerHTML = 'Download';
        }
    }
    
    // Fitur Spotify Search
    async function searchSpotify() {
        const query = spotifySearchQuery.value.trim();
        if (!query) return;
        displayLoading(spotifySearchResultArea, searchSpotifyButton);
        try {
            const response = await fetch(`${API_BASE_URL}/search/spotify?query=${encodeURIComponent(query)}`);
            const json = await response.json();
            if (!json.status || !json.result) throw new Error(json.message || "Pencarian tidak berhasil.");
            if (json.result.length === 0) {
                spotifySearchResultArea.innerHTML = `<p class="text-center text-gray-400">Tidak ada lagu yang ditemukan untuk "${query}".</p>`;
                return;
            }
            let resultsHTML = json.result.map(track => {
                const filename = `${track.artist} - ${track.title}.mp3`.replace(/[<>:"/\\|?*]/g, '_');
                const fullTitle = `${track.artist} - ${track.title}`;
                return `<div class="bg-[#1f2c34] rounded-lg p-3 flex items-center space-x-3">
                            <img src="${track.image}" alt="Cover" class="w-16 h-16 rounded">
                            <div class="flex-1 min-w-0">
                                <p class="text-white font-semibold truncate">${track.title}</p>
                                <p class="text-gray-400 text-sm truncate">${track.artist}</p>
                            </div>
                            <div class="flex space-x-2">
                               <button data-link="${track.link}" data-title="${fullTitle}" class="spotify-search-play-btn bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-700"><i class="fas fa-play"></i></button>
                               <button data-link="${track.link}" data-filename="${filename}" class="spotify-search-dl-btn bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-700"><i class="fas fa-download"></i></button>
                            </div>
                        </div>`;
            }).join('');
            spotifySearchResultArea.innerHTML = `<div class="space-y-3">${resultsHTML}</div>`;
        } catch (error) {
            displayError(spotifySearchResultArea, error);
        } finally {
            searchSpotifyButton.disabled = false;
            searchSpotifyButton.innerHTML = 'Cari';
        }
    }
    
    // Fungsi Download dari Spotify Search (PERBAIKAN FINAL)
    async function downloadFromSpotifySearch(link, filename, button) {
        const originalIcon = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>`;
        try {
            // PENDEKATAN BARU: Langsung panggil forceDownload, karena fungsi itu sudah punya proxy.
            // Kita tidak lagi mencoba mengambil JSON, tapi langsung memperlakukan link sebagai file.
            await forceDownload(link, filename, button);
        } catch (error) {
            alert(`Error saat mencoba download: ${error.message}`);
            button.disabled = false;
            button.innerHTML = originalIcon;
        }
    }


    // Fungsi Play dari Spotify Search (Tidak bisa diperbaiki karena API error, tapi tetap ada)
    async function playFromSpotifySearch(link, title, button) {
        const playerContainer = document.getElementById('spotify-player-container');
        const audioPlayer = document.getElementById('spotify-audio-player');
        const playerTitle = document.getElementById('spotify-player-title');
        const originalIcon = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>`;
        try {
            // Kode ini akan tetap error karena API `flowfalcon` mengembalikan HTML, bukan JSON.
            // Dibiarkan untuk menunjukkan bahwa masalahnya ada di API.
            const proxiedApiUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(link);
            const response = await fetch(proxiedApiUrl);
            const json = await response.json();
            if (!json.status || !json.result.download_url) {
                throw new Error(json.message || "Gagal mengambil link audio.");
            }
            playerTitle.textContent = `Now Playing: ${title}`;
            audioPlayer.src = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(json.result.download_url);
            playerContainer.classList.remove('hidden');
            audioPlayer.play();
            playerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            alert(`Error saat memutar lagu: ${error.message}`);
        } finally {
            button.disabled = false;
            button.innerHTML = originalIcon;
        }
    }

    // Fitur Google Image Search
    async function searchGoogleImages() {
        const query = gimageSearchQuery.value.trim();
        if (!query) return;
        displayLoading(gimageSearchResultArea, searchGimageButton);
        try {
            const response = await fetch(`${API_BASE_URL}/search/gimage?q=${encodeURIComponent(query)}`);
            const json = await response.json();
            if (!json.status) throw new Error(json.message || "Pencarian gambar gagal.");
            if (json.result.length === 0) {
                gimageSearchResultArea.innerHTML = `<p class="text-center text-gray-400">Tidak ada gambar yang ditemukan untuk "${query}".</p>`;
                return;
            }
            let resultsHTML = json.result.map((imageObject, index) => {
                if (typeof imageObject === 'object' && imageObject.url) {
                    const filename = `google_image_${Date.now()}_${index}.jpg`;
                    return `<div class="bg-[#1f2c34] rounded-lg p-2 flex flex-col">
                                <img src="${imageObject.url}" alt="Gambar ${query}" class="w-full h-40 object-cover rounded-lg mb-2">
                                <div class="flex items-center space-x-2 mt-auto">
                                  <a href="${imageObject.url}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center bg-blue-600 text-white font-semibold py-1 px-2 rounded-lg hover:bg-blue-700 text-sm"><i class="fas fa-external-link-alt mr-1"></i>Buka</a>
                                  <button data-url="${imageObject.url}" data-filename="${filename}" class="dl-gimage-button bg-green-600 text-white w-10 h-full flex items-center justify-center rounded-lg hover:bg-green-700"><i class="fas fa-download"></i></button>
                                </div>
                            </div>`;
                }
                return '';
            }).join('');
            gimageSearchResultArea.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 gap-3">${resultsHTML}</div>`;
        } catch (error) {
            displayError(gimageSearchResultArea, error);
        } finally {
            searchGimageButton.disabled = false;
            searchGimageButton.innerHTML = 'Cari Gambar';
        }
    }

    // Fitur Play Store Search
    async function searchPlayStore() {
        const query = playstoreSearchQuery.value.trim();
        if (!query) return;
        displayLoading(playstoreSearchResultArea, searchPlaystoreButton);
        try {
            const response = await fetch(`${API_BASE_URL}/search/playstore?q=${encodeURIComponent(query)}`);
            const json = await response.json();
            if (!json.status || !json.result) throw new Error(json.message || "Pencarian aplikasi gagal.");
            if (json.result.length === 0) {
                playstoreSearchResultArea.innerHTML = `<p class="text-center text-gray-400">Tidak ada aplikasi yang ditemukan untuk "${query}".</p>`;
                return;
            }
            let resultsHTML = json.result.map(app => {
                return `<div class="bg-[#1f2c34] rounded-lg p-3 flex items-center space-x-4"><img src="${app.img}" alt="App Icon" class="w-16 h-16 rounded-xl"><div class="flex-1 min-w-0"><p class="text-white font-semibold truncate">${app.nama}</p><p class="text-gray-400 text-sm truncate">${app.developer}</p><p class="text-yellow-400 text-sm font-bold"><i class="fas fa-star mr-1"></i> ${app.rate2}</p></div><a href="${app.link}" target="_blank" class="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600"><i class="fas fa-external-link-alt"></i></a></div>`;
            }).join('');
            playstoreSearchResultArea.innerHTML = `<div class="space-y-3">${resultsHTML}</div>`;
        } catch(error) { displayError(playstoreSearchResultArea, error);
        } finally {
            searchPlaystoreButton.disabled = false;
            searchPlaystoreButton.innerHTML = 'Cari Aplikasi';
        }
    }

    // Fitur F-Droid Search
    async function searchFDroid() {
        const query = fdroidSearchQuery.value.trim();
        if (!query) return;
        displayLoading(fdroidSearchResultArea, searchFdroidButton);
        try {
            const response = await fetch(`${API_BASE_URL}/search/fdroid?q=${encodeURIComponent(query)}`);
            const json = await response.json();
            if (!json.status) throw new Error(json.message || "Pencarian F-Droid gagal.");
            if (!json.result || json.result.length === 0) {
                fdroidSearchResultArea.innerHTML = `<p class="text-center text-gray-400">Tidak ada aplikasi yang ditemukan untuk "${query}".</p>`;
                return;
            }
            let resultsHTML = json.result.map(app => {
                return `<div class="bg-[#1f2c34] rounded-lg p-3 flex items-center space-x-4"><div class="w-16 h-16 rounded-xl bg-gray-600 flex items-center justify-center"><i class="fas fa-box-open text-3xl text-gray-400"></i></div><div class="flex-1 min-w-0"><p class="text-white font-semibold truncate">${app.name || 'Nama Aplikasi'}</p><p class="text-gray-400 text-sm truncate">${app.summary || 'Deskripsi singkat...'}</p></div><a href="${app.link}" target="_blank" class="bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800"><i class="fas fa-external-link-alt"></i></a></div>`;
            }).join('');
            fdroidSearchResultArea.innerHTML = `<div class="space-y-3">${resultsHTML}</div>`;
        } catch(error) { displayError(fdroidSearchResultArea, error);
        } finally {
            searchFdroidButton.disabled = false;
            searchFdroidButton.innerHTML = 'Cari Aplikasi';
        }
    }

    // Fitur By Vintex (legacy)
    async function fetchTikTokInfo() {
        const videoUrl = tiktokUrlInput.value.trim();
        if (!videoUrl) { tiktokResultArea.innerHTML = `<p class="text-red-500 text-center">URL tidak boleh kosong.</p>`; return; }
        displayLoading(tiktokResultArea, fetchTiktokVideoButton);
        try {
            const apiUrl = `https://api.ownblox.my.id/api/ttdl?url=${encodeURIComponent(videoUrl)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === true && data.result) {
                const result = data.result;
                const customNamePart = tiktokCustomFilenameInput.value.trim();
                let finalBaseFilename = customNamePart ? `ByVintex - ${customNamePart}` : (result.title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50) || 'tiktok_video_download');
                tiktokResultArea.innerHTML = `<div class="bg-[#1f2c34] rounded-lg p-4"><p class="text-white font-semibold mb-2 truncate" title="${result.title}">${result.title}</p><p class="text-sm text-gray-400 mb-4">by: ${result.author}</p><video class="w-full rounded-lg mb-4" controls src="${result.video}"></video><div class="flex space-x-2"><button data-url="${result.video}" data-filename="${finalBaseFilename}.mp4" class="download-button flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"><i class="fas fa-video mr-2"></i>Download Video</button><button data-url="${result.audio}" data-filename="${finalBaseFilename}.mp3" class="download-button flex-1 text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700"><i class="fas fa-music mr-2"></i>Download Audio</button></div></div>`;
            } else { throw new Error(data.message || 'Gagal mengambil data video.'); }
        } catch (error) { displayError(tiktokResultArea, error);
        } finally {
            fetchTiktokVideoButton.disabled = false;
            fetchTiktokVideoButton.textContent = 'Download';
        }
    }
    async function fetchYouTubeMedia(type, buttonElement) {
        const videoUrl = youtubeUrlInput.value.trim();
        if (!videoUrl) { youtubeResultArea.innerHTML = `<p class="text-red-500 text-center">URL tidak boleh kosong.</p>`; return; }
        displayLoading(youtubeResultArea, buttonElement);
        document.querySelectorAll('.get-media-button').forEach(btn => btn.disabled = true);
        try {
            const apiUrl = `https://api.ownblox.my.id/api/ytdl?url=${encodeURIComponent(videoUrl)}&type=${type}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === true && data.result) {
                const result = data.result;
                const downloadUrl = (type === 'mp4') ? result.video_download : result.audio_download;
                if (!downloadUrl) throw new Error(`Link download untuk tipe '${type}' tidak ditemukan.`);
                const customNamePart = youtubeCustomFilenameInput.value.trim();
                let finalBaseFilename = customNamePart ? `ByVintex - ${customNamePart}` : (result.title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50) || `youtube_media_${type}`);
                youtubeResultArea.innerHTML = `<div class="bg-[#1f2c34] rounded-lg p-4"><p class="text-white font-semibold mb-2 truncate" title="${result.title}">${result.title}</p><img src="${result.thumbnail}" alt="Thumbnail" class="w-full rounded-lg mb-4"><p class="text-sm text-gray-400 mb-1">Kualitas: ${result.quality || 'Audio'}</p><button data-url="${downloadUrl}" data-filename="${finalBaseFilename}.${type}" class="download-button-yt w-full mt-2 text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700"><i class="fas fa-download mr-2"></i>Download File (.${type})</button></div>`;
            } else { throw new Error(data.message || `Gagal mengambil data YouTube untuk tipe ${type}.`); }
        } catch (error) { displayError(youtubeResultArea, error);
        } finally {
            document.querySelectorAll('.get-media-button').forEach(btn => {
                btn.disabled = false;
                if(btn.dataset.type === 'mp4') btn.innerHTML = 'Get Video (MP4)'; else btn.innerHTML = 'Get Audio (MP3)';
            });
        }
    }
    async function fetchInstagramMedia() {
        const postUrl = instagramUrlInput.value.trim();
        if (!postUrl) { instagramResultArea.innerHTML = `<p class="text-red-500 text-center">URL tidak boleh kosong.</p>`; return; }
        displayLoading(instagramResultArea, fetchInstagramMediaButton);
        try {
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
                    return `<div class="bg-[#1f2c34] rounded-lg p-4 mb-4"><p class="text-sm text-gray-400 mb-2">by: ${item.username || 'Unknown'}</p>${mediaTag}<p class="text-white text-sm mb-4">${item.caption || ''}</p><button data-url="${downloadUrl}" data-filename="${finalFilename}" class="download-button-ig w-full mt-2 text-center bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700"><i class="fas fa-download mr-2"></i>Download (.${fileType})</button></div>`;
                }).join('');
                instagramResultArea.innerHTML = resultHTML;
            } else { throw new Error(data.message || 'Gagal mengambil data dari Instagram.'); }
        } catch (error) { displayError(instagramResultArea, error);
        } finally {
            fetchInstagramMediaButton.disabled = false;
            fetchInstagramMediaButton.textContent = 'Download';
        }
    }
    async function fetchPinterestMedia() {
        const query = pinterestUrlInput.value.trim();
        if (!query) { pinterestResultArea.innerHTML = `<p class="text-red-500 text-center">URL atau kata kunci tidak boleh kosong.</p>`; return; }
        displayLoading(pinterestResultArea, fetchPinterestMediaButton);
        try {
            const apiUrl = `https://api.ownblox.my.id/api/pinterest?q=${encodeURIComponent(query)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status !== 200 || !Array.isArray(data.results) || data.results.length === 0) { throw new Error('Tidak ada hasil yang ditemukan atau terjadi kesalahan pada API.'); }
            let resultHTML = data.results.map((item, index) => {
                const downloadUrl = item.image;
                if (!downloadUrl) return '';
                const description = item.caption || `Pinterest Image ${index + 1}`;
                const customNamePart = pinterestCustomFilenameInput.value.trim();
                let finalBaseFilename = customNamePart ? `${customNamePart}_${index + 1}` : (description.replace(/[<>:"/\\|?*]/g, '_').substring(0, 40) || `pinterest_media_${Date.now()}_${index + 1}`);
                const finalFilename = `ByVintex - ${finalBaseFilename}.jpg`;
                return `<div class="bg-[#1f2c34] rounded-lg p-2 flex flex-col"><img src="${downloadUrl}" alt="${description}" class="w-full h-48 object-cover rounded-lg mb-2"><p class="text-white text-xs mb-2 flex-1 truncate" title="${description}">${description}</p><button data-url="${downloadUrl}" data-filename="${finalFilename}" class="download-button-pin w-full mt-auto text-center bg-red-600 text-white font-semibold py-1 px-2 rounded-lg hover:bg-red-700 text-sm"><i class="fas fa-download mr-1"></i>Download</button></div>`;
            }).join('');
            pinterestResultArea.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 gap-4">${resultHTML}</div>`;
        } catch (error) { displayError(pinterestResultArea, error);
        } finally {
            fetchPinterestMediaButton.disabled = false;
            fetchPinterestMediaButton.textContent = 'Download';
        }
    }

    // Fitur Youtube V2
    function displayYouTubeV2Options() {
        const videoUrl = youtubeV2UrlInput.value.trim();
        if (!videoUrl) { youtubeV2OptionsArea.innerHTML = `<p class="text-red-500 text-center">URL tidak boleh kosong.</p>`; youtubeV2ResultArea.innerHTML = ''; return; }
        youtubeV2ResultArea.innerHTML = '';
        const formats = [ { label: 'Audio (MP3)', value: 'mp3', icon: 'fa-music', color: 'bg-green-600 hover:bg-green-700' }, { label: '144p', value: '144', icon: 'fa-video', color: 'bg-gray-600 hover:bg-gray-700' }, { label: '360p', value: '360', icon: 'fa-video', color: 'bg-blue-600 hover:bg-blue-700' }, { label: '480p', value: '480', icon: 'fa-video', color: 'bg-blue-600 hover:bg-blue-700' }, { label: '720p HD', value: '720', icon: 'fa-video', color: 'bg-red-600 hover:bg-red-700' }, { label: '1080p FHD', value: '1080', icon: 'fa-video', color: 'bg-red-600 hover:bg-red-700' }, { label: '1440p 2K', value: '1440', icon: 'fa-video', color: 'bg-purple-600 hover:bg-purple-700' }, { label: '2160p 4K', value: '4k', icon: 'fa-video', color: 'bg-purple-600 hover:bg-purple-700' }, ];
        let optionsHTML = formats.map(format => `<button data-format="${format.value}" class="format-button-yt-v2 w-full text-white font-bold py-2 px-4 rounded-lg focus:outline-none ${format.color}"><i class="fas ${format.icon} mr-2"></i>${format.label}</button>`).join('');
        youtubeV2OptionsArea.innerHTML = `<p class="text-white text-center mb-3">Silakan pilih format yang diinginkan:</p><div class="grid grid-cols-2 md:grid-cols-4 gap-3">${optionsHTML}</div>`;
    }
    async function fetchYouTubeMediaV2(format, buttonElement) {
        const videoUrl = youtubeV2UrlInput.value.trim();
        if (!videoUrl) { youtubeV2ResultArea.innerHTML = `<p class="text-red-500 text-center">URL tidak boleh kosong.</p>`; return; }
        document.querySelectorAll('.format-button-yt-v2').forEach(btn => btn.disabled = true);
        const originalButtonText = buttonElement.innerHTML;
        displayLoading(youtubeV2ResultArea, buttonElement);
        try {
            const response = await fetch(`${API_BASE_URL}/download/savetube?link=${encodeURIComponent(videoUrl)}&format=${format}`);
            const data = await response.json();
            if (data.status === true && data.result && data.result.download) {
                const result = data.result;
                const customNamePart = youtubeV2CustomFilenameInput.value.trim();
                const fileExtension = format === 'mp3' ? 'mp3' : 'mp4';
                let finalBaseFilename = customNamePart ? `ByVintex - ${customNamePart}` : (result.title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50) || `youtube_media_${format}`);
                youtubeV2ResultArea.innerHTML = `<div class="bg-[#1f2c34] rounded-lg p-4"><p class="text-white font-semibold mb-2 truncate" title="${result.title}">${result.title}</p><img src="${result.thumbnail}" alt="Thumbnail" class="w-full rounded-lg mb-4"><p class="text-sm text-gray-400 mb-1">Kualitas Terpilih: ${result.quality || format}</p><button data-url="${result.download}" data-filename="${finalBaseFilename}.${fileExtension}" class="download-button-yt-v2 w-full mt-2 text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700"><i class="fas fa-download mr-2"></i>Download File (.${fileExtension})</button></div>`;
            } else { throw new Error(data.message || `Gagal mengambil data untuk format ${format}. Mungkin format ini tidak tersedia.`); }
        } catch (error) { displayError(youtubeV2ResultArea, error);
        } finally {
            document.querySelectorAll('.format-button-yt-v2').forEach(btn => {
                btn.disabled = false;
                if(btn === buttonElement) btn.innerHTML = originalButtonText;
            });
        }
    }

    // Fitur SSWeb
    async function fetchSsweb() {
        const url = sswebUrlInput.value.trim();
        if (!url) { sswebResultArea.innerHTML = `<p class="text-red-500 text-center">URL website tidak boleh kosong.</p>`; return; }
        displayLoading(sswebResultArea, fetchSswebButton);
        try {
            const response = await fetch(`${API_BASE_URL}/tools/ssweb?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            if (data.status === true && data.result) {
                const { pc: pcImgUrl, mobile: mobileImgUrl } = data.result;
                const baseFilename = (new URL(url).hostname).replace(/[<>:"/\\|?*]/g, '_').substring(0, 40);
                sswebResultArea.innerHTML = `<div class="bg-[#1f2c34] rounded-lg p-4 mb-4"><h3 class="text-white font-semibold mb-2">Screenshot PC</h3><img src="${pcImgUrl}" alt="PC Screenshot" class="w-full rounded-lg mb-4 border border-gray-700"><button data-url="${pcImgUrl}" data-filename="${baseFilename}_PC.jpg" class="dl-image-button w-full text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"><i class="fas fa-download mr-2"></i>Download PC Screenshot</button></div><div class="bg-[#1f2c34] rounded-lg p-4"><h3 class="text-white font-semibold mb-2">Screenshot Mobile</h3><img src="${mobileImgUrl}" alt="Mobile Screenshot" class="w-full rounded-lg mb-4 border border-gray-700"><button data-url="${mobileImgUrl}" data-filename="${baseFilename}_Mobile.jpg" class="dl-image-button w-full text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"><i class="fas fa-download mr-2"></i>Download Mobile Screenshot</button></div>`;
            } else { throw new Error(data.message || 'Gagal mengambil screenshot website.'); }
        } catch (error) { displayError(sswebResultArea, error);
        } finally {
            fetchSswebButton.disabled = false;
            fetchSswebButton.textContent = 'Ambil Screenshot';
        }
    }

    // Fitur Host Info
    async function fetchHostInfo() {
        const host = hostinfoUrlInput.value.trim();
        if (!host) { hostinfoResultArea.innerHTML = `<p class="text-red-500 text-center">URL atau domain tidak boleh kosong.</p>`; hostinfoResultArea.classList.remove('hidden'); return; }
        displayLoading(hostinfoResultArea, fetchHostinfoButton);
        hostinfoResultArea.classList.remove('hidden');
        try {
            const response = await fetch(`${API_BASE_URL}/tools/hostinfo?host=${encodeURIComponent(host)}`);
            const data = await response.json();
            if (data.status === true && data.result) {
                const result = data.result;
                let resultHTML = `<p class="text-white mb-2"><strong class="text-gray-400">IP:</strong> ${result.ip||'-'}</p><p class="text-white mb-2"><strong class="text-gray-400">Nama Host:</strong> ${result.name||'-'}</p><p class="text-white mb-2"><strong class="text-gray-400">ISP:</strong> ${result.isp||'-'}</p><p class="text-white mb-2"><strong class="text-gray-400">Organisasi:</strong> ${result.organisation||'-'}</p><p class="text-white mb-2"><strong class="text-gray-400">Wilayah:</strong> ${result.region||'-'}</p><p class="text-white mb-2"><strong class="text-gray-400">Kota:</strong> ${result.city||'-'}</p><p class="text-white mb-2"><strong class="text-gray-400">Zona Waktu:</strong> ${result.timezone||'-'}</p><p class="text-white mb-2"><strong class="text-gray-400">Kode Pos:</strong> ${result.postalcode||'-'}</p>`;
                if (result.range && result.range.trim().length > 0) resultHTML += `<p class="text-white mb-2"><strong class="text-gray-400">Rentang IP:</strong> <pre class="whitespace-pre-wrap">${result.range.trim()}</pre></p>`;
                hostinfoResultArea.innerHTML = resultHTML;
            } else { throw new Error(data.message || 'Gagal mendapatkan info host.'); }
        } catch (error) { displayError(hostinfoResultArea, error);
        } finally {
            fetchHostinfoButton.disabled = false;
            fetchHostinfoButton.textContent = 'Dapatkan Info Host';
        }
    }

    // Fitur AI Image
    async function fetchToGhibli() {
        const imageUrl = toghibliUrlInput.value.trim();
        if (!imageUrl) { toghibliResultArea.innerHTML = `<p class="text-red-500 text-center">URL gambar tidak boleh kosong.</p>`; return; }
        displayLoading(toghibliResultArea, fetchToghibliButton);
        try {
            const prompt = toghibliPromptInput.value.trim();
            let apiUrl = `${API_BASE_URL}/tools/toghibli?url=${encodeURIComponent(imageUrl)}`;
            if (prompt) apiUrl += `&prompt=${encodeURIComponent(prompt)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === true && data.result && data.result.data && data.result.data.length > 0) {
                const ghibliImgUrl = data.result.data[0].url;
                toghibliResultArea.innerHTML = `<div class="bg-[#1f2c34] rounded-lg p-4"><img src="${ghibliImgUrl}" alt="Ghibli Style Image" class="w-full rounded-lg mb-4 border border-gray-700"><button data-url="${ghibliImgUrl}" data-filename="ghibli_style_${Date.now()}.png" class="dl-image-button w-full text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700"><i class="fas fa-download mr-2"></i>Download Gambar Ghibli</button></div>`;
            } else { throw new Error(data.message || 'Gagal mengubah gambar.'); }
        } catch (error) { displayError(toghibliResultArea, error);
        } finally {
            fetchToghibliButton.disabled = false;
            fetchToghibliButton.textContent = 'Ubah ke Ghibli';
        }
    }
    async function fetchRemini() {
        const imageUrl = reminiUrlInput.value.trim();
        if (!imageUrl) { reminiResultArea.innerHTML = `<p class="text-red-500 text-center">URL gambar tidak boleh kosong.</p>`; return; }
        displayLoading(reminiResultArea, fetchReminiButton);
        try {
            const response = await fetch(`${API_BASE_URL}/imagecreator/remini?url=${encodeURIComponent(imageUrl)}`);
            const data = await response.json();
            if (data.status === true && data.result) {
                reminiResultArea.innerHTML = `<div class="bg-[#1f2c34] rounded-lg p-4"><img src="${data.result}" alt="Enhanced Image" class="w-full rounded-lg mb-4 border border-gray-700"><button data-url="${data.result}" data-filename="remini_enhanced_${Date.now()}.png" class="dl-image-button w-full text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700"><i class="fas fa-download mr-2"></i>Download Gambar Enhanced</button></div>`;
            } else { throw new Error(data.message || 'Gagal enhance gambar.'); }
        } catch (error) { displayError(reminiResultArea, error);
        } finally {
            fetchReminiButton.disabled = false;
            fetchReminiButton.textContent = 'Enhance Gambar';
        }
    }
    async function fetchUpscale() {
        const imageUrl = upscaleUrlInput.value.trim();
        if (!imageUrl) { upscaleResultArea.innerHTML = `<p class="text-red-500 text-center">URL gambar tidak boleh kosong.</p>`; return; }
        displayLoading(upscaleResultArea, fetchUpscaleButton);
        try {
            const response = await fetch(`${API_BASE_URL}/imagecreator/upscale?url=${encodeURIComponent(imageUrl)}`);
            const data = await response.json();
            if (data.status === true && data.result) {
                upscaleResultArea.innerHTML = `<div class="bg-[#1f2c34] rounded-lg p-4"><img src="${data.result}" alt="Upscaled Image" class="w-full rounded-lg mb-4 border border-gray-700"><button data-url="${data.result}" data-filename="upscaled_image_${Date.now()}.png" class="dl-image-button w-full text-center bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700"><i class="fas fa-download mr-2"></i>Download Gambar Upscale</button></div>`;
            } else { throw new Error(data.message || 'Gagal upscale gambar.'); }
        } catch (error) { displayError(upscaleResultArea, error);
        } finally {
            fetchUpscaleButton.disabled = false;
            fetchUpscaleButton.textContent = 'Upscale Gambar';
        }
    }
    
    // Fitur Random Image
    async function fetchRandomImage(apiEndpoint, resultArea, buttonElement) {
        const originalButtonText = buttonElement.innerHTML; 
        displayLoading(resultArea, buttonElement);
        try {
            const response = await fetch(`${API_BASE_URL}/random/${apiEndpoint}`);
            if (!response.ok) throw new Error(`Gagal memuat gambar. Status: ${response.status}`);
            const imageUrl = response.url; 
            resultArea.innerHTML = `<div class="bg-[#1f2c34] rounded-lg p-4"><img src="${imageUrl}" alt="Random Image" class="w-full rounded-lg mb-4 border border-gray-700 object-contain max-h-96"><button data-url="${imageUrl}" data-filename="${apiEndpoint}_${Date.now()}.jpg" class="dl-image-button w-full text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"><i class="fas fa-download mr-2"></i>Download Gambar</button></div>`;
        } catch (error) { displayError(resultArea, error);
        } finally {
            buttonElement.disabled = false;
            buttonElement.innerHTML = originalButtonText;
        }
    }
    const fetchRandomWaifu = () => fetchRandomImage('waifu', randomWaifuResultArea, fetchRandomWaifuButton);
    const fetchRandomNsfw = () => fetchRandomImage('nsfw', randomNsfwResultArea, fetchRandomNsfwButton);
    const fetchRandomPapayang = () => fetchRandomImage('papayang', randomPapayangResultArea, fetchRandomPapayangButton);

    // --- EVENT LISTENERS (SATU BLOK) ---
    fetchTtsButton.addEventListener('click', fetchTTS);
    fetchTiktokV2Button.addEventListener('click', fetchTikTokInfoV2);
    instagramV2ResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.new-dl-button'); if(btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    fetchInstagramV2Button.addEventListener('click', fetchInstagramMediaV2);
    pinterestV2ResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.new-dl-button'); if(btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    fetchPinterestV2Button.addEventListener('click', fetchPinterestMediaV2);
    snackvideoResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.new-dl-button'); if(btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    fetchSnackvideoButton.addEventListener('click', fetchSnackVideo);
    fetchFacebookButton.addEventListener('click', fetchFacebookMedia);
    facebookResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.new-dl-button'); if(btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    fetchSpotifyButton.addEventListener('click', fetchSpotifySong);
    spotifyResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.new-dl-button'); if(btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    searchSpotifyButton.addEventListener('click', searchSpotify);
    spotifySearchResultArea.addEventListener('click', (e) => {
        const dlBtn = e.target.closest('.spotify-search-dl-btn');
        const playBtn = e.target.closest('.spotify-search-play-btn');

        if (dlBtn) {
            downloadFromSpotifySearch(dlBtn.dataset.link, dlBtn.dataset.filename, dlBtn);
        }
        if (playBtn) {
            playFromSpotifySearch(playBtn.dataset.link, playBtn.dataset.title, playBtn);
        }
    });
    searchGimageButton.addEventListener('click', searchGoogleImages);
    gimageSearchResultArea.addEventListener('click', (e) => {
        const btn = e.target.closest('.dl-gimage-button');
        if (btn) {
            e.preventDefault();
            forceDownload(btn.dataset.url, btn.dataset.filename, btn);
        }
    });
    searchPlaystoreButton.addEventListener('click', searchPlayStore);
    searchFdroidButton.addEventListener('click', searchFDroid);
    fetchTiktokVideoButton.addEventListener('click', fetchTikTokInfo);
    tiktokResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.download-button'); if (btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    fetchYoutubeMp4Button.addEventListener('click', function() { fetchYouTubeMedia('mp4', this); });
    fetchYoutubeMp3Button.addEventListener('click', function() { fetchYouTubeMedia('mp3', this); });
    youtubeResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.download-button-yt'); if (btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    fetchInstagramMediaButton.addEventListener('click', fetchInstagramMedia);
    instagramResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.download-button-ig'); if (btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    fetchPinterestMediaButton.addEventListener('click', fetchPinterestMedia);
    pinterestResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.download-button-pin'); if (btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    fetchYoutubeV2OptionsButton.addEventListener('click', displayYouTubeV2Options);
    youtubeV2OptionsArea.addEventListener('click', (e) => { const btn = e.target.closest('.format-button-yt-v2'); if (btn) fetchYouTubeMediaV2(btn.dataset.format, btn); });
    youtubeV2ResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.download-button-yt-v2'); if (btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    fetchSswebButton.addEventListener('click', fetchSsweb);
    toghibliResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.dl-image-button'); if (btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    sswebResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.dl-image-button'); if (btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    fetchHostinfoButton.addEventListener('click', fetchHostInfo);
    fetchToghibliButton.addEventListener('click', fetchToGhibli);
    fetchReminiButton.addEventListener('click', fetchRemini);
    reminiResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.dl-image-button'); if (btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    fetchUpscaleButton.addEventListener('click', fetchUpscale);
    upscaleResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.dl-image-button'); if (btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    fetchRandomWaifuButton.addEventListener('click', fetchRandomWaifu);
    fetchRandomNsfwButton.addEventListener('click', fetchRandomNsfw);
    fetchRandomPapayangButton.addEventListener('click', fetchRandomPapayang);
    randomWaifuResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.dl-image-button'); if (btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    randomNsfwResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.dl-image-button'); if (btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });
    randomPapayangResultArea.addEventListener('click', (e) => { const btn = e.target.closest('.dl-image-button'); if (btn) forceDownload(btn.dataset.url, btn.dataset.filename, btn); });

    // --- LOGIKA UNTUK WIDGET MODAL BARU ---
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalButton = document.getElementById('close-modal-button');
    const modalWidget = document.getElementById('modal-widget');

    if (modalOverlay && closeModalButton && modalWidget) {
        // Fungsi untuk menutup modal
        const closeModal = () => {
            modalOverlay.classList.add('opacity-0');
            modalWidget.classList.add('scale-95');
            setTimeout(() => {
                modalOverlay.style.display = 'none';
            }, 300); // Sesuaikan dengan durasi transisi
        };

        // Event listener untuk tombol 'X'
        closeModalButton.addEventListener('click', closeModal);

        // Event listener untuk menutup saat klik di luar area modal (di overlay)
        modalOverlay.addEventListener('click', function(event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        // Efek animasi saat pertama kali muncul
        setTimeout(() => {
            modalOverlay.classList.remove('opacity-0');
            modalWidget.classList.remove('scale-95');
        }, 100);
    }

});