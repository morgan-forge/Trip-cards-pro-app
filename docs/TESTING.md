# Testing Trip Cards Pro on iPhone

Ways to preview TCP HTML (e.g. Japan 2026 TCP v2, or the root app) on your iPhone.

---

## Option A: Host on your Mac mini (recommended)

Serve the project over your local Wi‑Fi so the iPhone opens pages from a real URL (same as reading from a server). Mac and iPhone must be on the **same network**.

### 1. Start the server on the Mac

In Terminal, from the **trip-cards-pro** folder:

```bash
cd /path/to/trip-cards-pro
chmod +x serve.sh
./serve.sh
```

Or from anywhere, if you’re already in the repo:

```bash
./trip-cards-pro/serve.sh
```

You’ll see something like:

```
On your iPhone (Safari or Hexstatic), open:
  http://192.168.1.42:8765/
```

**Note:** Opening the root URL shows the main app (`index.html`), not a folder list. Use the direct Japan v2 link below to open that file.

### 2. Open on iPhone

- In **Safari** or **Hexstatic**, go to that URL (e.g. `http://192.168.1.42:8765/`).
- To open the Japan v2 card view directly:
  - `http://<YOUR-IP>:8765/01%20Travel/_plans/Japan/Views%20of%20the%20Japanese%20trip/Japan%202026%20TCP%20v2.html`
  - Replace `<YOUR-IP>` with the IP shown in Terminal (e.g. `192.168.1.42`).
- You can bookmark that URL on the iPhone for quick retesting.

### 3. Stop the server

In the Terminal window where the server is running, press **Ctrl+C**.

### Notes

- Port is **8765** by default. To use another port: `TCP_PORT=8888 ./serve.sh`
- If the IP is wrong (e.g. you’re on Ethernet), run `ifconfig` and use the address for your active interface (e.g. `en0` for Wi‑Fi).

### If it works on Mac but not from iPhone

1. **Mac firewall**  
   **System Settings → Network → Firewall** (or **Security & Privacy → Firewall**).  
   - Turn the firewall off temporarily to test, or  
   - Add a rule to allow incoming connections for **Python** (or allow “Built-in Python” / the Terminal app you use to run `serve.sh`).

2. **Use the IP the script prints**  
   When you run `./serve.sh`, it shows a URL with your Mac’s IP. Use that exact IP on the iPhone (e.g. `http://192.168.1.42:8765/...`).  
   To double-check the IP: `ipconfig getifaddr en0` (Wi‑Fi) in Terminal.

3. **Same Wi‑Fi**  
   iPhone and Mac must be on the same network (same SSID). Not cellular, not a guest network that isolates devices.

4. **Router “AP isolation” / “client isolation”**  
   Some routers have a setting that stops Wi‑Fi devices from talking to each other. If it’s enabled, turn it off so the iPhone can reach the Mac.

5. **Restart the server after a change**  
   Stop it (Ctrl+C), then run `./serve.sh` again. The script now uses `--bind 0.0.0.0` so the server accepts connections from the network, not only localhost.

---

## Option B: iCloud + Files / Hexstatic (current workflow)

- Put the HTML in iCloud (e.g. the Cursor/CloudDocs folder that syncs).
- On iPhone: **Files** → iCloud → open the file → **Preview**, or open in **Hexstatic** and use Preview.

**Limitation:** Opening via Files often uses a `file://` URL. Some behaviour (e.g. strict MIME types, service workers, or relative paths) can differ from viewing the same file over `http://` from a server. Hosting (Option A) matches “real” server behaviour.

---

## Option C: Safari on Mac with responsive mode

- Open the HTML file (or `http://localhost:8765/...`) in Safari on the Mac.
- **Develop** → **Enter Responsive Design Mode** (or **Develop** → **User Agent** to mimic iPhone).
- Good for quick layout checks; doesn’t replace testing touch and real device rendering on the iPhone.

---

## Summary

| Method              | Best for                          |
|---------------------|-----------------------------------|
| **A. Mac mini host**| Real URL, same as a server; bookmark on iPhone. |
| **B. iCloud + Files** | Quick look when you’ve just synced a file.     |
| **C. Safari responsive** | Fast layout check on Mac.                    |

For consistent, server-like testing on iPhone, use **Option A** and open the printed URL (or the Japan v2 direct link) in Safari or Hexstatic.
