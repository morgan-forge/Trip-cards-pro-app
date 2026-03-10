#!/usr/bin/env bash
# Serve Trip Cards Pro over local network so you can open HTML on iPhone.
# Run from the trip-cards-pro folder (or from repo root; script will cd).
# Requires: Mac and iPhone on the same Wi‑Fi.

set -e
cd "$(dirname "$0")"
PORT="${TCP_PORT:-8765}"

# Prefer Wi‑Fi IP (en0); fallback to first non-loopback
IP=$(ipconfig getifaddr en0 2>/dev/null) || \
  IP=$(ifconfig | awk '/inet .* broadcast/ { print $2; exit }')
if [ -z "$IP" ]; then
  echo "Could not detect local IP. Connect Mac to Wi‑Fi and try again."
  exit 1
fi

echo "Trip Cards Pro – local server"
echo "================================"
echo "On your iPhone (Safari or Hexstatic), open:"
echo ""
echo "  http://${IP}:${PORT}/"
echo ""
echo "Then navigate to: 01 Travel → _plans → Japan → Views of the Japanese trip"
JAPAN_V2_URL="http://${IP}:${PORT}/01%20Travel/_plans/Japan/Views%20of%20the%20Japanese%20trip/Japan%202026%20TCP%20v2.html"
echo "  or open directly (this URL is in your clipboard):"
echo "  ${JAPAN_V2_URL}"
echo ""
printf '%s' "$JAPAN_V2_URL" | pbcopy
echo "Press Ctrl+C to stop the server."
echo "================================"

# Bind to 0.0.0.0 so iPhone (and other devices) on the same network can connect
exec python3 -m http.server "$PORT" --bind 0.0.0.0
