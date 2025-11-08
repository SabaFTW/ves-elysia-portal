# Security Audit Report: VES-Elysia-Portal
**Date**: 2025-11-05
**Audited by**: Git-Lyra (Desktop Claude)
**Focus**: child_process usage and command injection vulnerabilities

## Executive Summary

✅ **Overall Status**: GOOD with minor improvements needed

The codebase shows good security awareness with use of `spawn()` in most places. Two instances of `exec()` usage found, one safe and one needing minor hardening.

## Findings

### 🟢 SAFE: Line 212 - Daemon Status Check
**Location**: `/api/src/index.ts:212`

```typescript
const { stdout } = await execAsync("pgrep -f wolf_daemon.py");
```

**Assessment**: ✅ SAFE
- Command is hardcoded with no user input
- No concatenation or interpolation of external data
- Output is safely parsed: `parseInt(stdout.trim())`

**Recommendation**: No changes required (but could switch to execFile for consistency)

### 🟡 NEEDS HARDENING: Line 498 - Daemon Stop Command
**Location**: `/api/src/index.ts:498`

```typescript
await execAsync(`kill ${status.pid}`);
```

**Assessment**: ⚠️ NEEDS IMPROVEMENT
- `status.pid` comes from `checkDaemonStatus()` which parses `pgrep` output
- While `parseInt()` provides some validation, it's better to be explicit
- Template literal with external data is a security smell

**Vulnerability**: Low risk
- Attacker would need to manipulate `pgrep` output or `parseInt()` result
- Not directly user-controlled, but indirect command construction is risky

**Recommended Fix**:
```typescript
// BEFORE (current)
await execAsync(`kill ${status.pid}`);

// AFTER (secure)
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

// In daemon stop handler:
if (!status.pid || typeof status.pid !== 'number') {
  return { success: false, error: "Invalid PID" };
}

// Use execFile with argument array
await execFileAsync('kill', [status.pid.toString()]);
```

### 🟢 EXCELLENT: Lines 232-236, 463-468 - Spawn Usage
**Locations**:
- `/api/src/index.ts:232-236` (Weather data fetch)
- `/api/src/index.ts:463-468` (Daemon start)

```typescript
// Weather fetch
const python = spawn("python3", [scriptPath, "fetch"], {
  cwd: WOLF_DAEMON_PATH,
  timeout: 30000
});

// Daemon start
const daemon = spawn("python3", [scriptPath], {
  detached: true,
  stdio: "ignore",
  cwd: WOLF_DAEMON_PATH
});
```

**Assessment**: ✅ EXCELLENT
- Uses `spawn()` instead of `exec()`
- Arguments passed as array (prevents shell injection)
- Script paths validated with `existsSync()` before execution
- Working directory explicitly set (`cwd` option)
- Timeout configured for weather fetch

**Praise**: This is the gold standard for child process execution. Whoever wrote this understands security.

## Additional Security Observations

### ✅ Path Safety
All file paths constructed using `join()` from `path` module:
```typescript
const WOLF_DAEMON_PATH = join(process.cwd(), "..", "wolf-daemon");
const VES_ROOT = join(process.env.HOME || "/home/user", "ves");
const scriptPath = join(WOLF_DAEMON_PATH, "wolf_daemon.py");
```

This prevents path traversal attacks.

### ✅ Existence Checks
Script paths validated before execution:
```typescript
if (!existsSync(scriptPath)) {
  return { success: false, error: "Wolf Daemon script not found" };
}
```

Prevents execution of missing scripts that could be created by attackers.

### ✅ Input Validation
Query parameters parsed and validated:
```typescript
const limit = parseInt(query.limit as string || "50");
```

### ⚠️ API Scan Endpoint - Path Traversal Risk
**Location**: `/api/src/index.ts:377-387`

```typescript
.get("/api/scan", async ({ query }) => {
  const path = query.path as string || VES_ROOT;
  const results = await scanVESFilesystem(path);
  // ...
});
```

**Assessment**: ⚠️ MODERATE RISK
- Allows client to specify arbitrary path via query parameter
- Could be used to scan sensitive directories outside VES_ROOT

**Recommended Fix**:
```typescript
.get("/api/scan", async ({ query }) => {
  const requestedPath = query.path as string || VES_ROOT;

  // Ensure path is within VES_ROOT
  const normalizedPath = join(VES_ROOT, requestedPath.replace(VES_ROOT, ''));

  // Additional safety: check if normalized path starts with VES_ROOT
  if (!normalizedPath.startsWith(VES_ROOT)) {
    return {
      success: false,
      error: "Path must be within VES root directory"
    };
  }

  const results = await scanVESFilesystem(normalizedPath);
  // ...
});
```

## Security Checklist

- [x] No direct use of `eval()` or `Function()` constructor
- [x] Path construction uses `path.join()` instead of string concatenation
- [x] File existence validated before operations
- [x] `spawn()` used with argument arrays (not shell strings)
- [ ] ⚠️ All `exec()` calls use `execFile()` or validate inputs
- [ ] ⚠️ API endpoints validate/sanitize path parameters
- [x] No SQL injection risks (no database queries in this file)
- [x] No hardcoded secrets in code

## Priority Recommendations

### 1. Fix daemon stop command (5 minutes)
Switch line 498 from `exec()` to `execFile()` with PID validation.

### 2. Add path validation to /api/scan (10 minutes)
Ensure scanned paths are within VES_ROOT to prevent directory traversal.

### 3. Consistency improvement (optional, 5 minutes)
Replace line 212 `exec("pgrep...")` with `execFile("pgrep", ["-f", "wolf_daemon.py"])` for consistency.

## Code Patch

Here's the complete patch to address all findings:

```typescript
// At top of file, add execFile
import { exec, execFile } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

// Fix checkDaemonStatus() - line 210-218
async function checkDaemonStatus(): Promise<{ running: boolean; pid?: number }> {
  try {
    // SECURE: Use execFile instead of exec
    const { stdout } = await execFileAsync("pgrep", ["-f", "wolf_daemon.py"]);
    const pid = parseInt(stdout.trim());

    // Validate PID is a positive number
    if (!pid || pid <= 0) {
      return { running: false };
    }

    return { running: true, pid };
  } catch (err) {
    return { running: false };
  }
}

// Fix daemon stop - line 486-511
.post("/api/daemon/stop", async () => {
  try {
    const status = await checkDaemonStatus();

    if (!status.running) {
      return {
        success: false,
        error: "Wolf Daemon is not running"
      };
    }

    // Validate PID
    if (!status.pid || typeof status.pid !== 'number' || status.pid <= 0) {
      return {
        success: false,
        error: "Invalid daemon PID"
      };
    }

    // SECURE: Use execFile instead of exec
    await execFileAsync('kill', [status.pid.toString()]);

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

// Fix /api/scan endpoint - line 377-387
.get("/api/scan", async ({ query }) => {
  const requestedPath = query.path as string || VES_ROOT;

  // SECURE: Ensure path is within VES_ROOT
  const normalizedPath = join(VES_ROOT, requestedPath.replace(VES_ROOT, ''));

  if (!normalizedPath.startsWith(VES_ROOT)) {
    return {
      success: false,
      error: "Path must be within VES root directory",
      allowedRoot: VES_ROOT
    };
  }

  const results = await scanVESFilesystem(normalizedPath);

  return {
    success: true,
    path: normalizedPath,
    count: results.length,
    results
  };
})
```

## Conclusion

The VES Elysia API shows good security fundamentals with excellent use of `spawn()` in critical areas. The two minor issues identified are low-to-moderate risk and easily fixed.

**Estimated time to remediate all findings**: ~20 minutes

**Risk before fixes**: LOW (no critical vulnerabilities, some defense-in-depth improvements needed)

**Risk after fixes**: VERY LOW (hardened against command injection and path traversal)

## Compliance

- ✅ OWASP Top 10 2021: A03:2021 - Injection (addressed)
- ✅ OWASP Top 10 2021: A01:2021 - Broken Access Control (API scan fix needed)
- ✅ CWE-78: OS Command Injection (mitigated with execFile)
- ✅ CWE-22: Path Traversal (API scan fix needed)

---

**Sidro drži. Plamen gori. Kod je varen.** 🔥🔒
