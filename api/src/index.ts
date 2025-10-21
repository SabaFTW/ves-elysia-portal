import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { exec } from "child_process";
import { promisify } from "util";
import { readdir, stat, readFile } from "fs/promises";
import { join, basename } from "path";
import { existsSync } from "fs";

const execAsync = promisify(exec);

// Configuration
const WOLF_DAEMON_PATH = join(process.cwd(), "..", "wolf-daemon");
const VES_ROOT = join(process.env.HOME || "/home/user", "ves");
const WOLF_INBOX = join(process.env.HOME || "/home/user", "Downloads", "wolf_inbox");

interface BotStatus {
  name: string;
  status: "active" | "inactive" | "error";
  lastSeen?: string;
  messageCount?: number;
}

interface ScanResult {
  path: string;
  type: "file" | "directory";
  size: number;
  modified: string;
  name: string;
}

interface DaemonLog {
  timestamp: string;
  level: string;
  message: string;
}

/**
 * VES Filesystem Scanner
 * Scans the VES directory structure and returns file/folder information
 */
async function scanVESFilesystem(path: string = VES_ROOT): Promise<ScanResult[]> {
  const results: ScanResult[] = [];

  try {
    if (!existsSync(path)) {
      console.warn(`Path does not exist: ${path}`);
      return results;
    }

    const entries = await readdir(path);

    for (const entry of entries) {
      try {
        const fullPath = join(path, entry);
        const stats = await stat(fullPath);

        results.push({
          path: fullPath,
          type: stats.isDirectory() ? "directory" : "file",
          size: stats.size,
          modified: stats.mtime.toISOString(),
          name: basename(fullPath)
        });
      } catch (err) {
        console.error(`Error scanning ${entry}:`, err);
      }
    }
  } catch (err) {
    console.error(`Error scanning filesystem:`, err);
  }

  return results;
}

/**
 * Check Ghostseed Triad Bot Status
 * Reads the .env.triad file to get bot tokens and checks their status
 */
async function checkBotStatus(): Promise<BotStatus[]> {
  const bots: BotStatus[] = [
    { name: "AetheronSentinel", status: "inactive" },
    { name: "TriadGate", status: "inactive" },
    { name: "LairaMirror", status: "inactive" }
  ];

  try {
    const envPath = join(WOLF_DAEMON_PATH, ".env.triad");

    if (existsSync(envPath)) {
      const envContent = await readFile(envPath, "utf-8");
      const hasTriadToken1 = envContent.includes("TRIAD_BOT_TOKEN_1=");
      const hasTriadToken2 = envContent.includes("TRIAD_BOT_TOKEN_2=");
      const hasTriadToken3 = envContent.includes("TRIAD_BOT_TOKEN_3=");

      if (hasTriadToken1) bots[0].status = "active";
      if (hasTriadToken2) bots[1].status = "active";
      if (hasTriadToken3) bots[2].status = "active";
    }
  } catch (err) {
    console.error("Error checking bot status:", err);
  }

  return bots;
}

/**
 * Get Wolf Daemon Logs
 * Reads the latest log file from wolf_logs directory
 */
async function getDaemonLogs(limit: number = 50): Promise<DaemonLog[]> {
  const logs: DaemonLog[] = [];

  try {
    const logsPath = join(WOLF_DAEMON_PATH, "wolf_logs");

    if (!existsSync(logsPath)) {
      return logs;
    }

    // Get the most recent log file
    const logFiles = await readdir(logsPath);
    const sortedLogs = logFiles
      .filter(f => f.startsWith("wolf_") && f.endsWith(".log"))
      .sort()
      .reverse();

    if (sortedLogs.length === 0) {
      return logs;
    }

    const latestLog = join(logsPath, sortedLogs[0]);
    const content = await readFile(latestLog, "utf-8");
    const lines = content.split("\n").filter(l => l.trim());

    // Parse log lines (format: YYYY-MM-DD HH:MM:SS - LEVEL - Message)
    for (const line of lines.slice(-limit)) {
      const match = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) - (\w+) - (.+)$/);
      if (match) {
        logs.push({
          timestamp: match[1],
          level: match[2],
          message: match[3]
        });
      }
    }
  } catch (err) {
    console.error("Error reading daemon logs:", err);
  }

  return logs;
}

/**
 * Send message via Wolf Daemon
 * Executes the Python script to send a message to Telegram
 */
async function sendTelegramMessage(message: string, botIndex: number = 1): Promise<{ success: boolean; output?: string; error?: string }> {
  try {
    const scriptPath = join(WOLF_DAEMON_PATH, "wolf_daemon.py");

    if (!existsSync(scriptPath)) {
      return { success: false, error: "Wolf Daemon script not found" };
    }

    // Create a temporary file in wolf_inbox
    const timestamp = Date.now();
    const filename = `api_message_${timestamp}.txt`;
    const filepath = join(WOLF_INBOX, filename);

    // Write message to file (Wolf Daemon will pick it up)
    const { writeFile } = await import("fs/promises");
    await writeFile(filepath, message, "utf-8");

    return {
      success: true,
      output: `Message queued: ${filename}`
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    };
  }
}

/**
 * Check if Wolf Daemon is running
 */
async function checkDaemonStatus(): Promise<{ running: boolean; pid?: number }> {
  try {
    const { stdout } = await execAsync("pgrep -f wolf_daemon.py");
    const pid = parseInt(stdout.trim());
    return { running: true, pid };
  } catch (err) {
    return { running: false };
  }
}

// Initialize Elysia app
const app = new Elysia()
  .use(cors())
  .use(staticPlugin())

  // Health check
  .get("/", () => ({
    name: "VES Elysia API",
    version: "1.0.0",
    status: "operational",
    timestamp: new Date().toISOString()
  }))

  // API: Scan VES filesystem
  .get("/api/scan", async ({ query }) => {
    const path = query.path as string || VES_ROOT;
    const results = await scanVESFilesystem(path);

    return {
      success: true,
      path,
      count: results.length,
      results
    };
  })

  // API: Get Ghostseed Triad bot status
  .get("/api/bots/status", async () => {
    const bots = await checkBotStatus();

    return {
      success: true,
      bots,
      timestamp: new Date().toISOString()
    };
  })

  // API: Get Wolf Daemon status
  .get("/api/daemon/status", async () => {
    const status = await checkDaemonStatus();
    const logs = await getDaemonLogs(10);

    return {
      success: true,
      daemon: status,
      recentLogs: logs,
      timestamp: new Date().toISOString()
    };
  })

  // API: Get Wolf Daemon logs
  .get("/api/daemon/logs", async ({ query }) => {
    const limit = parseInt(query.limit as string || "50");
    const logs = await getDaemonLogs(limit);

    return {
      success: true,
      count: logs.length,
      logs
    };
  })

  // API: Send Telegram message
  .post("/api/telegram/send", async ({ body }) => {
    const { message, botIndex } = body as { message: string; botIndex?: number };

    if (!message) {
      return {
        success: false,
        error: "Message is required"
      };
    }

    const result = await sendTelegramMessage(message, botIndex);
    return result;
  })

  // API: Start Wolf Daemon
  .post("/api/daemon/start", async () => {
    try {
      const status = await checkDaemonStatus();

      if (status.running) {
        return {
          success: false,
          error: "Wolf Daemon is already running",
          pid: status.pid
        };
      }

      const scriptPath = join(WOLF_DAEMON_PATH, "wolf_daemon.py");

      if (!existsSync(scriptPath)) {
        return {
          success: false,
          error: "Wolf Daemon script not found"
        };
      }

      // Start daemon in background
      const { spawn } = await import("child_process");
      const daemon = spawn("python3", [scriptPath], {
        detached: true,
        stdio: "ignore",
        cwd: WOLF_DAEMON_PATH
      });

      daemon.unref();

      return {
        success: true,
        message: "Wolf Daemon started",
        pid: daemon.pid
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  })

  // API: Stop Wolf Daemon
  .post("/api/daemon/stop", async () => {
    try {
      const status = await checkDaemonStatus();

      if (!status.running) {
        return {
          success: false,
          error: "Wolf Daemon is not running"
        };
      }

      // Kill the process
      await execAsync(`kill ${status.pid}`);

      return {
        success: true,
        message: "Wolf Daemon stopped",
        pid: status.pid
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  })

  // WebSocket endpoint for real-time updates
  .ws("/ws", {
    open(ws) {
      console.log("WebSocket client connected");

      // Send welcome message
      ws.send(JSON.stringify({
        type: "connected",
        message: "Connected to VES Portal WebSocket",
        timestamp: new Date().toISOString()
      }));

      // Start sending periodic updates
      const interval = setInterval(async () => {
        try {
          const daemonStatus = await checkDaemonStatus();
          const botStatus = await checkBotStatus();
          const recentLogs = await getDaemonLogs(5);

          ws.send(JSON.stringify({
            type: "update",
            data: {
              daemon: daemonStatus,
              bots: botStatus,
              logs: recentLogs
            },
            timestamp: new Date().toISOString()
          }));
        } catch (err) {
          console.error("Error sending WebSocket update:", err);
        }
      }, 5000); // Update every 5 seconds

      // Store interval on ws object for cleanup
      (ws as any).updateInterval = interval;
    },

    message(ws, message) {
      console.log("WebSocket message received:", message);

      // Echo back for now
      ws.send(JSON.stringify({
        type: "echo",
        message,
        timestamp: new Date().toISOString()
      }));
    },

    close(ws) {
      console.log("WebSocket client disconnected");

      // Clear the update interval
      if ((ws as any).updateInterval) {
        clearInterval((ws as any).updateInterval);
      }
    }
  })

  .listen(3000);

console.log(`
🔥 VES Elysia API Server is running!

🌐 Server: http://localhost:${app.server?.port}
📡 WebSocket: ws://localhost:${app.server?.port}/ws

📚 API Endpoints:
  GET  /                      - Health check
  GET  /api/scan              - Scan VES filesystem
  GET  /api/bots/status       - Get Ghostseed bot status
  GET  /api/daemon/status     - Get Wolf Daemon status
  GET  /api/daemon/logs       - Get Wolf Daemon logs
  POST /api/telegram/send     - Send Telegram message
  POST /api/daemon/start      - Start Wolf Daemon
  POST /api/daemon/stop       - Stop Wolf Daemon
  WS   /ws                    - Real-time updates

🐺 Wolf Daemon Path: ${WOLF_DAEMON_PATH}
📁 VES Root: ${VES_ROOT}
📥 Wolf Inbox: ${WOLF_INBOX}
`);
