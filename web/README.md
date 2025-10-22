# VES Portal - React Frontend

Beautiful, real-time dashboard for monitoring and controlling the VES ecosystem.

## Quick Start

```bash
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

## Features

- **Command Center** - Real-time Wolf Daemon monitoring
- **System Scanner** - Browse VES filesystem
- **Bot Monitor** - Track Ghostseed Triad status
- **Message Builder** - Send Telegram messages
- **WebSocket Integration** - Live updates every 5s
- **Beautiful UI** - Modern dark theme

## Components

1. **CommandCenter.jsx** - Dashboard with daemon status and logs
2. **VESSystemScanner.jsx** - File system explorer
3. **BotMonitor.jsx** - Ghostseed Triad bot status
4. **MessageBuilder.jsx** - Telegram message interface

## API Configuration

Edit `src/App.jsx`:

```javascript
const API_URL = 'http://localhost:3000';
const WS_URL = 'ws://localhost:3000/ws';
```

## Tech Stack

- React 18 + Vite 6
- WebSocket for real-time updates
- Modern CSS with glassmorphism
- Responsive grid layout
