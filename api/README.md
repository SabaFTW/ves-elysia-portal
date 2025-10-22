# VES Elysia API Server

The bridge between your VES Python backend and React frontend.

## What This Does

This Elysia API server provides:

- **REST API endpoints** for VES filesystem scanning, bot status, and Telegram messaging
- **WebSocket server** for real-time Wolf Daemon updates
- **Python integration** to control and monitor Wolf Daemon
- **CORS support** for frontend access

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`)
- Wolf Daemon configured in `../wolf-daemon/`
- Python 3.x with required dependencies

### Installation

```bash
cd api
bun install
```

### Development

```bash
bun run dev
```

Server runs at: **http://localhost:3000**

### Production

```bash
bun run start
```

## API Endpoints

### Health Check

```bash
GET /
```

Returns server status and version info.

### Filesystem Scanning

```bash
GET /api/scan?path=/home/user/ves
```

Scans VES directory structure and returns file/folder information.

**Query Parameters:**
- `path` (optional): Path to scan (defaults to `~/ves`)

**Response:**
```json
{
  "success": true,
  "path": "/home/user/ves",
  "count": 42,
  "results": [
    {
      "path": "/home/user/ves/file.txt",
      "type": "file",
      "size": 1024,
      "modified": "2025-10-21T14:30:00Z",
      "name": "file.txt"
    }
  ]
}
```

### Bot Status

```bash
GET /api/bots/status
```

Returns Ghostseed Triad bot status (active/inactive).

**Response:**
```json
{
  "success": true,
  "bots": [
    { "name": "AetheronSentinel", "status": "active" },
    { "name": "TriadGate", "status": "active" },
    { "name": "LairaMirror", "status": "inactive" }
  ],
  "timestamp": "2025-10-21T14:30:00Z"
}
```

### Wolf Daemon Status

```bash
GET /api/daemon/status
```

Returns Wolf Daemon process status and recent logs.

**Response:**
```json
{
  "success": true,
  "daemon": {
    "running": true,
    "pid": 12345
  },
  "recentLogs": [
    {
      "timestamp": "2025-10-21 14:30:00",
      "level": "INFO",
      "message": "File processed: message.txt"
    }
  ],
  "timestamp": "2025-10-21T14:30:00Z"
}
```

### Wolf Daemon Logs

```bash
GET /api/daemon/logs?limit=50
```

Returns Wolf Daemon log entries.

**Query Parameters:**
- `limit` (optional): Number of log entries (default: 50)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "logs": [
    {
      "timestamp": "2025-10-21 14:30:00",
      "level": "INFO",
      "message": "Wolf Daemon started"
    }
  ]
}
```

### Send Telegram Message

```bash
POST /api/telegram/send
Content-Type: application/json

{
  "message": "Hello from VES Portal!",
  "botIndex": 1
}
```

Sends a message via Wolf Daemon to Telegram.

**Body Parameters:**
- `message` (required): Message text
- `botIndex` (optional): Bot index (1-3, default: 1)

**Response:**
```json
{
  "success": true,
  "output": "Message queued: api_message_1234567890.txt"
}
```

### Start Wolf Daemon

```bash
POST /api/daemon/start
```

Starts Wolf Daemon process in background.

**Response:**
```json
{
  "success": true,
  "message": "Wolf Daemon started",
  "pid": 12345
}
```

### Stop Wolf Daemon

```bash
POST /api/daemon/stop
```

Stops running Wolf Daemon process.

**Response:**
```json
{
  "success": true,
  "message": "Wolf Daemon stopped",
  "pid": 12345
}
```

## WebSocket

### Real-time Updates

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

**Message Types:**

1. **connected** - Initial connection confirmation
2. **update** - Periodic status updates (every 5s)
3. **echo** - Echo of client messages

**Update Payload:**
```json
{
  "type": "update",
  "data": {
    "daemon": { "running": true, "pid": 12345 },
    "bots": [...],
    "logs": [...]
  },
  "timestamp": "2025-10-21T14:30:00Z"
}
```

## Architecture

```
┌─────────────────────────────────┐
│  React Frontend (Port 5173)     │
│  - Dashboard UI                 │
│  - Real-time monitoring         │
└────────────┬────────────────────┘
             │ HTTP/WebSocket
┌────────────▼────────────────────┐
│  Elysia API Server (Port 3000)  │  ← YOU ARE HERE
│  ├─ REST endpoints              │
│  ├─ WebSocket server            │
│  └─ Python integration          │
└────────────┬────────────────────┘
             │ exec/spawn
┌────────────▼────────────────────┐
│  VES Python Backend             │
│  ├─ wolf_daemon.py              │
│  ├─ Ghostseed Triad             │
│  └─ Telegram API                │
└─────────────────────────────────┘
```

## Configuration

The server uses these paths (configurable in `src/index.ts`):

- **Wolf Daemon**: `../wolf-daemon/`
- **VES Root**: `~/ves`
- **Wolf Inbox**: `~/Downloads/wolf_inbox`

## Development

### File Structure

```
api/
├── src/
│   └── index.ts          # Main server file
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md             # This file
```

### Adding New Endpoints

```typescript
app.get("/api/your-endpoint", async () => {
  // Your logic here
  return { success: true, data: "..." };
});
```

### Testing

```bash
# Health check
curl http://localhost:3000/

# Scan filesystem
curl http://localhost:3000/api/scan

# Get bot status
curl http://localhost:3000/api/bots/status

# Send message
curl -X POST http://localhost:3000/api/telegram/send \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message"}'
```

## Tech Stack

- **Elysia** - Blazing fast TypeScript web framework
- **Bun** - Fast all-in-one JavaScript runtime
- **TypeScript** - Type-safe development
- **WebSocket** - Real-time communication

## Next Steps

1. Install dependencies: `bun install`
2. Start server: `bun run dev`
3. Test endpoints with curl or browser
4. Connect React frontend
5. Monitor Wolf Daemon in real-time

---

**Built with ❤️ for the VES Portal**
