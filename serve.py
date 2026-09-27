#!/usr/bin/env python3
"""
Server lokal untuk testing undangan pernikahan di Smartphone / Handphone.
Menampilkan QR Code di terminal agar bisa langsung discan kamera HP.
"""

import http.server
import socket
import socketserver
import sys

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Does not need to be reachable
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

PORT = 8080
local_ip = get_local_ip()
url = f"http://{local_ip}:{PORT}"

print("=" * 60)
print("  DHAUP SUCI - SERVER UNDANGAN PERNIKAHAN SMARTPHONE")
print("=" * 60)
print(f"\n[+] Server berjalan di port: {PORT}")
print(f"[+] Akses dari Laptop/Komputer : http://localhost:{PORT}")
print(f"[+] Akses dari HP (Satu Wi-Fi) : {url}\n")

try:
    import qrcode
    qr = qrcode.QRCode(border=1)
    qr.add_data(url)
    print("Scan QR Code ini menggunakan Kamera Smartphone Anda:")
    print("-" * 50)
    qr.print_ascii(invert=True)
    print("-" * 50)
except Exception:
    print(f"Buka browser di HP Anda lalu ketik URL: {url}")

print("\nTekan Ctrl+C untuk menghentikan server.\n")

Handler = http.server.SimpleHTTPRequestHandler
try:
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer dihentikan.")
    sys.exit(0)
