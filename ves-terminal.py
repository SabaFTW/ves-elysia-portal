#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🜂 VES - Ultimate Terminal Command Center
Vizualni terminalski vmesnik za upravljanje projektov, hostinga in dokumentov.
"""

import os
import sys
import time
import subprocess
import threading
import json
from pathlib import Path
import http.server
import socketserver
import webbrowser
import socket

# Barve in stili za terminal
class Barve:
    RESET = '\033[0m'
    BOLD = '\033[1m'
    DIM = '\033[2m'

    # Osnovne barve
    BLACK = '\033[30m'
    RED = '\033[31m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    BLUE = '\033[34m'
    MAGENTA = '\033[35m'
    CYAN = '\033[36m'
    WHITE = '\033[37m'

    # Svetle barve
    BRIGHT_RED = '\033[91m'
    BRIGHT_GREEN = '\033[92m'
    BRIGHT_YELLOW = '\033[93m'
    BRIGHT_BLUE = '\033[94m'
    BRIGHT_MAGENTA = '\033[95m'
    BRIGHT_CYAN = '\033[96m'

    # Ozadja
    BG_BLACK = '\033[40m'
    BG_RED = '\033[41m'
    BG_GREEN = '\033[42m'

class Animacije:
    @staticmethod
    def loading_animation(tekst, cas=2):
        """Animacija nalaganja"""
        chars = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
        for i in range(cas * 10):
            print(f"\r{Barve.CYAN}{chars[i % len(chars)]} {tekst}...{Barve.RESET}", end="", flush=True)
            time.sleep(0.1)
        print(f"\r{Barve.GREEN}✓ {tekst} končano!{Barve.RESET}")

    @staticmethod
    def prikazi_banner():
        """Animiran banner"""
        banner = f"""{Barve.BRIGHT_CYAN}
    ██╗   ██╗███████╗███████╗
    ██║   ██║██╔════╝██╔════╝
    ██║   ██║█████╗  ███████╗
    ╚██╗ ██╔╝██╔══╝  ╚════██║
     ╚████╔╝ ███████╗███████║
      ╚═══╝  ╚══════╝╚══════╝
    {Barve.BRIGHT_YELLOW}
    🜂 Ultimate Terminal Command Center 🜂
    {Barve.CYAN}Verzija 1.0 | Powered by TROP MAPA{Barve.RESET}
    """

        for line in banner.split('\n'):
            print(line)
            time.sleep(0.1)

class VESTerminal:
    def __init__(self):
        self.running = True
        self.trenutna_mapa = os.getcwd()
        self.hosting_proces = None
        self.config = self.nalozi_config()

    def nalozi_config(self):
        """Naloži konfiguracijo iz datoteke"""
        config_path = Path.home() / '.ves_config.json'
        default_config = {
            "projekti_mapa": str(Path.home() / "Projekti"),
            "dokumenti_mapa": str(Path.home() / "Dokumenti"),
            "default_port": 8000,
            "auto_browser": True
        }

        try:
            if config_path.exists():
                with open(config_path, 'r', encoding='utf-8') as f:
                    return {**default_config, **json.load(f)}
        except:
            pass

        return default_config

    def shrani_config(self):
        """Shrani konfiguracijo"""
        config_path = Path.home() / '.ves_config.json'
        try:
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=2, ensure_ascii=False)
        except:
            pass

    def ocisti_terminal(self):
        """Počisti terminal"""
        os.system('cls' if os.name == 'nt' else 'clear')

    def prikazi_menu(self):
        """Prikaži glavni menu"""
        print(f"\n{Barve.BRIGHT_CYAN}╔{'═' * 58}╗{Barve.RESET}")
        print(f"{Barve.BRIGHT_CYAN}║{' ' * 22}GLAVNI MENU{' ' * 24}║{Barve.RESET}")
        print(f"{Barve.BRIGHT_CYAN}╠{'═' * 58}╣{Barve.RESET}")

        menu_items = [
            ("1", "🌐 HOSTING", "Zaženi web strežnik za trenutno mapo"),
            ("2", "📁 PROJEKTI", "Upravljanje projektov"),
            ("3", "📚 DOKUMENTI", "Brskanje po dokumentih"),
            ("4", "🔧 ORODJA", "Sistemska orodja in skripte"),
            ("5", "⚙️  NASTAVITVE", "Konfiguracija VES-a"),
            ("6", "📊 STATUS", "Prikaz sistemskega statusa"),
            ("q", "🚪 IZHOD", "Zapri VES terminal")
        ]

        for cmd, naziv, opis in menu_items:
            print(f"{Barve.BRIGHT_CYAN}║{Barve.RESET} {Barve.BRIGHT_YELLOW}{cmd}{Barve.RESET}) {Barve.BRIGHT_WHITE}{naziv:<15}{Barve.RESET} {Barve.DIM}{opis:<30}{Barve.RESET} {Barve.BRIGHT_CYAN}║{Barve.RESET}")

        print(f"{Barve.BRIGHT_CYAN}╚{'═' * 58}╝{Barve.RESET}")
        print(f"\n{Barve.CYAN}📂 Trenutna mapa: {Barve.BRIGHT_WHITE}{self.trenutna_mapa}{Barve.RESET}")

        if self.hosting_proces:
            print(f"{Barve.BRIGHT_GREEN}🌐 Hosting aktiven na portu {self.config['default_port']}{Barve.RESET}")

    def hosting_menu(self):
        """Menu za hosting"""
        while True:
            self.ocisti_terminal()
            Animacije.prikazi_banner()

            print(f"\n{Barve.BRIGHT_GREEN}🌐 HOSTING CENTER{Barve.RESET}")
            print("═" * 50)

            print(f"\n{Barve.CYAN}1){Barve.RESET} Zaženi strežnik (trenutna mapa)")
            print(f"{Barve.CYAN}2){Barve.RESET} Zaustavi strežnik")
            print(f"{Barve.CYAN}3){Barve.RESET} Spremeni port")
            print(f"{Barve.CYAN}4){Barve.RESET} Odpri v brskalniku")
            print(f"{Barve.CYAN}5){Barve.RESET} Pokaži lokalni IP")
            print(f"{Barve.CYAN}b){Barve.RESET} Nazaj na glavni menu")

            if self.hosting_proces:
                print(f"\n{Barve.BRIGHT_GREEN}Status: Strežnik teče na portu {self.config['default_port']}{Barve.RESET}")
            else:
                print(f"\n{Barve.BRIGHT_RED}Status: Strežnik ni aktiven{Barve.RESET}")

            izbira = input(f"\n{Barve.BRIGHT_YELLOW}Izberi opcijo: {Barve.RESET}").strip().lower()

            if izbira == '1':
                self.zacni_hosting()
            elif izbira == '2':
                self.ustavi_hosting()
            elif izbira == '3':
                self.spremeni_port()
            elif izbira == '4':
                self.odpri_brskalnik()
            elif izbira == '5':
                self.pokazi_ip()
            elif izbira == 'b':
                break

    def zacni_hosting(self):
        """Zaženi web strežnik"""
        if self.hosting_proces:
            print(f"{Barve.YELLOW}Strežnik že teče!{Barve.RESET}")
            input("Pritisni Enter...")
            return

        try:
            Animacije.loading_animation("Zaganjam strežnik", 2)

            # Najdi prosti port
            port = self.najdi_prost_port(self.config['default_port'])
            self.config['default_port'] = port

            # Zaženi strežnik v ločeni niti
            def run_server():
                handler = http.server.SimpleHTTPRequestHandler
                with socketserver.TCPServer(("", port), handler) as httpd:
                    httpd.serve_forever()

            self.hosting_proces = threading.Thread(target=run_server, daemon=True)
            self.hosting_proces.start()

            # Pridobi lokalni IP
            lokalni_ip = self.pridobi_lokalni_ip()

            print(f"\n{Barve.BRIGHT_GREEN}✓ Strežnik uspešno zagnan!{Barve.RESET}")
            print(f"{Barve.CYAN}Lokalni dostop: http://localhost:{port}{Barve.RESET}")
            print(f"{Barve.CYAN}Telefonski dostop: http://{lokalni_ip}:{port}{Barve.RESET}")

            if self.config['auto_browser']:
                webbrowser.open(f"http://localhost:{port}")

        except Exception as e:
            print(f"{Barve.BRIGHT_RED}Napaka pri zagonu: {e}{Barve.RESET}")

        input("\nPritisni Enter...")

    def ustavi_hosting(self):
        """Zaustavi strežnik"""
        if not self.hosting_proces:
            print(f"{Barve.YELLOW}Strežnik ni aktiven!{Barve.RESET}")
        else:
            Animacije.loading_animation("Zaustavljam strežnik", 1)
            self.hosting_proces = None
            print(f"{Barve.BRIGHT_GREEN}Strežnik zaustavljen!{Barve.RESET}")

        input("Pritisni Enter...")

    def projekti_menu(self):
        """Menu za projekte"""
        while True:
            self.ocisti_terminal()
            Animacije.prikazi_banner()

            print(f"\n{Barve.BRIGHT_BLUE}📁 PROJEKTI CENTER{Barve.RESET}")
            print("═" * 50)

            projekti_mapa = Path(self.config['projekti_mapa'])
            if not projekti_mapa.exists():
                projekti_mapa.mkdir(parents=True, exist_ok=True)

            # Prikaži projekte
            projekti = [p for p in projekti_mapa.iterdir() if p.is_dir()]

            print(f"\n{Barve.CYAN}Projektna mapa: {projekti_mapa}{Barve.RESET}")
            print(f"{Barve.CYAN}Najdenih projektov: {len(projekti)}{Barve.RESET}\n")

            for i, projekt in enumerate(projekti[:10], 1):
                print(f"{Barve.YELLOW}{i:2d}){Barve.RESET} {projekt.name}")

            print(f"\n{Barve.CYAN}n){Barve.RESET} Nov projekt")
            print(f"{Barve.CYAN}o){Barve.RESET} Odpri projektno mapo")
            print(f"{Barve.CYAN}s){Barve.RESET} Spremeni projektno mapo")
            print(f"{Barve.CYAN}b){Barve.RESET} Nazaj")

            izbira = input(f"\n{Barve.BRIGHT_YELLOW}Izberi opcijo: {Barve.RESET}").strip().lower()

            if izbira == 'b':
                break
            elif izbira == 'n':
                self.nov_projekt()
            elif izbira == 'o':
                self.odpri_mapo(projekti_mapa)
            elif izbira == 's':
                self.spremeni_projektno_mapo()
            elif izbira.isdigit():
                idx = int(izbira) - 1
                if 0 <= idx < len(projekti):
                    self.odpri_mapo(projekti[idx])

    def nov_projekt(self):
        """Ustvari nov projekt"""
        ime = input(f"{Barve.BRIGHT_YELLOW}Ime novega projekta: {Barve.RESET}").strip()
        if not ime:
            return

        projekti_mapa = Path(self.config['projekti_mapa'])
        nova_mapa = projekti_mapa / ime

        try:
            nova_mapa.mkdir(exist_ok=True)

            # Ustvari osnovne datoteke
            (nova_mapa / "README.md").write_text(f"# {ime}\n\nOpis projekta...\n", encoding='utf-8')
            (nova_mapa / "index.html").write_text("<!DOCTYPE html>\n<html>\n<head>\n    <title>" + ime + "</title>\n</head>\n<body>\n    <h1>" + ime + "</h1>\n</body>\n</html>", encoding='utf-8')

            Animacije.loading_animation(f"Ustvarjam projekt {ime}", 1)
            print(f"{Barve.BRIGHT_GREEN}Projekt {ime} uspešno ustvarjen!{Barve.RESET}")

        except Exception as e:
            print(f"{Barve.BRIGHT_RED}Napaka: {e}{Barve.RESET}")

        input("Pritisni Enter...")

    def status_screen(self):
        """Prikaz sistemskega statusa"""
        self.ocisti_terminal()
        Animacije.prikazi_banner()

        print(f"\n{Barve.BRIGHT_MAGENTA}📊 SISTEMSKI STATUS{Barve.RESET}")
        print("═" * 50)

        # Sistemske informacije
        import platform
        print(f"\n{Barve.CYAN}🖥️  Sistem:{Barve.RESET} {platform.system()} {platform.release()}")
        print(f"{Barve.CYAN}🐍 Python:{Barve.RESET} {platform.python_version()}")
        print(f"{Barve.CYAN}📂 Delovna mapa:{Barve.RESET} {self.trenutna_mapa}")
        print(f"{Barve.CYAN}🏠 Domača mapa:{Barve.RESET} {Path.home()}")

        # Mrežne informacije
        lokalni_ip = self.pridobi_lokalni_ip()
        print(f"{Barve.CYAN}🌐 Lokalni IP:{Barve.RESET} {lokalni_ip}")

        # Hosting status
        if self.hosting_proces:
            print(f"{Barve.BRIGHT_GREEN}🌐 Hosting:{Barve.RESET} Aktiven na portu {self.config['default_port']}")
        else:
            print(f"{Barve.BRIGHT_RED}🌐 Hosting:{Barve.RESET} Neaktiven")

        # Disk prostor
        try:
            import shutil
            total, used, free = shutil.disk_usage(self.trenutna_mapa)
            total_gb = total // (1024**3)
            free_gb = free // (1024**3)
            print(f"{Barve.CYAN}💾 Disk:{Barve.RESET} {free_gb}GB prosto od {total_gb}GB")
        except:
            pass

        # Animacija za CPU "aktivnost"
        print(f"\n{Barve.YELLOW}⚡ VES Terminal aktivnost:{Barve.RESET}")
        for i in range(20):
            bar = "█" * (i % 10) + "░" * (10 - (i % 10))
            print(f"\r{Barve.CYAN}[{bar}]{Barve.RESET}", end="", flush=True)
            time.sleep(0.1)
        print(f"\r{Barve.GREEN}[██████████] Vse deluje optimalno!{Barve.RESET}")

        input(f"\n{Barve.BRIGHT_YELLOW}Pritisni Enter za nadaljevanje...{Barve.RESET}")

    def nastavitve_menu(self):
        """Menu za nastavitve"""
        while True:
            self.ocisti_terminal()
            Animacije.prikazi_banner()

            print(f"\n{Barve.BRIGHT_MAGENTA}⚙️  NASTAVITVE{Barve.RESET}")
            print("═" * 50)

            print(f"\n{Barve.CYAN}1){Barve.RESET} Projektna mapa: {self.config['projekti_mapa']}")
            print(f"{Barve.CYAN}2){Barve.RESET} Dokumenti mapa: {self.config['dokumenti_mapa']}")
            print(f"{Barve.CYAN}3){Barve.RESET} Privzeti port: {self.config['default_port']}")
            print(f"{Barve.CYAN}4){Barve.RESET} Avtomatski brskalnik: {'Da' if self.config['auto_browser'] else 'Ne'}")
            print(f"{Barve.CYAN}5){Barve.RESET} Ponastavi na privzeto")
            print(f"{Barve.CYAN}s){Barve.RESET} Shrani nastavitve")
            print(f"{Barve.CYAN}b){Barve.RESET} Nazaj")

            izbira = input(f"\n{Barve.BRIGHT_YELLOW}Izberi opcijo: {Barve.RESET}").strip().lower()

            if izbira == 'b':
                break
            elif izbira == 's':
                self.shrani_config()
                print(f"{Barve.BRIGHT_GREEN}Nastavitve shranjene!{Barve.RESET}")
                time.sleep(1)
            elif izbira == '4':
                self.config['auto_browser'] = not self.config['auto_browser']

    def orodja_menu(self):
        """Menu za orodja"""
        while True:
            self.ocisti_terminal()
            Animacije.prikazi_banner()

            print(f"\n{Barve.BRIGHT_GREEN}🔧 ORODJA{Barve.RESET}")
            print("═" * 50)

            print(f"\n{Barve.CYAN}1){Barve.RESET} Odpri datotečni raziskovalec")
            print(f"{Barve.CYAN}2){Barve.RESET} Odpri terminal/cmd")
            print(f"{Barve.CYAN}3){Barve.RESET} Generiraj QR kodo za IP")
            print(f"{Barve.CYAN}4){Barve.RESET} Pokaži mrežne informacije")
            print(f"{Barve.CYAN}5){Barve.RESET} Test internetne povezave")
            print(f"{Barve.CYAN}b){Barve.RESET} Nazaj")

            izbira = input(f"\n{Barve.BRIGHT_YELLOW}Izberi opcijo: {Barve.RESET}").strip().lower()

            if izbira == 'b':
                break
            elif izbira == '1':
                self.odpri_raziskovalec()
            elif izbira == '2':
                self.odpri_terminal()
            elif izbira == '3':
                self.generiraj_qr()
            elif izbira == '4':
                self.pokazi_ip()
            elif izbira == '5':
                self.test_povezave()

    # Pomožne funkcije
    def najdi_prost_port(self, start_port=8000):
        """Najdi prosti port"""
        port = start_port
        while True:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.bind(('localhost', port))
                    return port
            except OSError:
                port += 1
                if port > 9000:
                    raise Exception("Ni prostih portov!")

    def pridobi_lokalni_ip(self):
        """Pridobi lokalni IP naslov"""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except:
            return "localhost"

    def odpri_mapo(self, pot):
        """Odpri mapo v sistemu"""
        try:
            if os.name == 'nt':  # Windows
                os.startfile(pot)
            elif os.name == 'posix':  # macOS/Linux
                subprocess.run(['open' if sys.platform == 'darwin' else 'xdg-open', pot])
            print(f"{Barve.BRIGHT_GREEN}Mapa odprta!{Barve.RESET}")
        except Exception as e:
            print(f"{Barve.BRIGHT_RED}Napaka: {e}{Barve.RESET}")

        time.sleep(1)

    def odpri_brskalnik(self):
        """Odpri brskalnik"""
        if self.hosting_proces:
            webbrowser.open(f"http://localhost:{self.config['default_port']}")
            print(f"{Barve.BRIGHT_GREEN}Brskalnik odprt!{Barve.RESET}")
        else:
            print(f"{Barve.BRIGHT_RED}Strežnik ni aktiven!{Barve.RESET}")

        time.sleep(1)

    def pokazi_ip(self):
        """Prikaži IP informacije"""
        lokalni_ip = self.pridobi_lokalni_ip()
        print(f"\n{Barve.CYAN}🌐 Mrežne informacije:{Barve.RESET}")
        print(f"   Lokalni IP: {lokalni_ip}")
        if self.hosting_proces:
            print(f"   Hosting URL: http://{lokalni_ip}:{self.config['default_port']}")
        input("\nPritisni Enter...")

    def generiraj_qr(self):
        """ASCII QR koda placeholder"""
        print(f"\n{Barve.YELLOW}QR koda za: http://{self.pridobi_lokalni_ip()}:{self.config['default_port']}{Barve.RESET}")
        print("""
        ████ ▄▄▄▄▄ █▀█ █▄▄ ████
        █  █ █   █ ███ █ ▀ █  █
        █▄▄█ █▄▄▄█ █▀▀ █▀█ █▄▄█
        ▄▄▄▄▄▄▄▄▄▄▄ ▀▄▀ ▄▄▄▄▄▄▄
        █ █▀▄▄▄██▄▄▀█▄█▄▀ ▀ ▄▄▄
        """)
        input("Pritisni Enter...")

    def odpri_raziskovalec(self):
        """Odpri datotečni raziskovalec"""
        self.odpri_mapo(self.trenutna_mapa)

    def odpri_terminal(self):
        """Odpri novi terminal"""
        try:
            if os.name == 'nt':
                subprocess.run(['cmd'], shell=True)
            else:
                subprocess.run(['gnome-terminal'], shell=True)
        except:
            print(f"{Barve.YELLOW}Ni mogoče odpreti terminala{Barve.RESET}")
            time.sleep(1)

    def test_povezave(self):
        """Test internetne povezave"""
        print(f"\n{Barve.CYAN}Testiram povezavo...{Barve.RESET}")
        try:
            import urllib.request
            urllib.request.urlopen('http://www.google.com', timeout=3)
            print(f"{Barve.BRIGHT_GREEN}✓ Internetna povezava deluje!{Barve.RESET}")
        except:
            print(f"{Barve.BRIGHT_RED}✗ Ni internetne povezave!{Barve.RESET}")

        input("Pritisni Enter...")

    def run(self):
        """Glavna zanka"""
        try:
            while self.running:
                self.ocisti_terminal()
                Animacije.prikazi_banner()
                self.prikazi_menu()

                izbira = input(f"\n{Barve.BRIGHT_YELLOW}Izberi opcijo: {Barve.RESET}").strip().lower()

                if izbira == 'q' or izbira == 'quit':
                    self.running = False
                elif izbira == '1':
                    self.hosting_menu()
                elif izbira == '2':
                    self.projekti_menu()
                elif izbira == '3':
                    print(f"{Barve.YELLOW}Dokumenti funkcija v razvoju...{Barve.RESET}")
                    time.sleep(1)
                elif izbira == '4':
                    self.orodja_menu()
                elif izbira == '5':
                    self.nastavitve_menu()
                elif izbira == '6':
                    self.status_screen()
                else:
                    print(f"{Barve.BRIGHT_RED}Neveljavna izbira!{Barve.RESET}")
                    time.sleep(1)

        except KeyboardInterrupt:
            pass
        finally:
            print(f"\n{Barve.BRIGHT_GREEN}Hvala za uporabo VES terminala! 🜂{Barve.RESET}")

def main():
    """Glavna funkcija"""
    ves = VESTerminal()
    ves.run()

if __name__ == "__main__":
    main()
