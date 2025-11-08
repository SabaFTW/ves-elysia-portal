# VES-Elysia-Portal: Technical Debt Prioritization
**Roadmap for Repository Improvements**

## 🎯 Priority Matrix

### Priority 1: CRITICAL (Security & Stability)
**Timeline**: Immediate (this week)
**Impact**: High risk if not addressed

1. **Security: child_process.exec vulnerabilities**
   - **Risk**: Command injection, arbitrary code execution
   - **Action**: Audit all `child_process.exec()` calls in `/server`
   - **Fix**: Switch to `execFile()` with argument arrays, validate inputs
   - **Files to review**: Likely in bot command handlers, system info routes

2. **Environment Configuration**
   - **Risk**: Secrets exposed, deployment failures, config drift
   - **Action**: Create `.env.example`, document all required vars
   - **Fix**: Add env validation on startup (Elysia plugin)
   - **Security**: Move API keys, tokens to env (if any hardcoded)

### Priority 2: FOUNDATIONAL (Developer Experience)
**Timeline**: Next 2 weeks
**Impact**: Enables future development

3. **Documentation Restructuring**
   - **Current**: README likely basic or scattered
   - **Action**: Create comprehensive docs structure:
     ```
     docs/
     ├── README.md              (Project overview)
     ├── SETUP.md               (Installation, first run)
     ├── ARCHITECTURE.md        (System design, data flow)
     ├── COMPONENTS.md          (React component tree)
     ├── API.md                 (Backend routes, WebSocket)
     ├── DEPLOYMENT.md          (Build, deploy, environments)
     └── CONTRIBUTING.md        (Code style, PR process)
     ```
   - **Priority order**: SETUP → ARCHITECTURE → API → rest

4. **Testing Infrastructure**
   - **Current**: Likely no tests
   - **Action**: Setup testing frameworks
     - Backend: Vitest + Elysia test utils
     - Frontend: Vitest + React Testing Library
   - **Start with**: Critical paths (API routes, WebSocket, LUMO mission logic)
   - **Target**: 40% coverage on first pass

5. **Monorepo Optimization**
   - **Current**: Manual workspace management
   - **Action**: Standardize build/dev scripts
     - Unified `package.json` scripts at root
     - Consistent versions across workspaces
     - Shared configs (tsconfig, eslint, prettier)
   - **Tool consideration**: Add Turborepo for caching (optional)

### Priority 3: OPERATIONAL (CI/CD & Deployment)
**Timeline**: Next month
**Impact**: Smooth operations, confidence in deployments

6. **CI/CD Pipeline**
   - **Platform**: GitHub Actions (already on GitHub)
   - **Workflows**:
     ```yaml
     .github/workflows/
     ├── test.yml           # Run on every PR
     ├── build.yml          # Verify build succeeds
     ├── deploy-web.yml     # Deploy /web to GitHub Pages
     └── security.yml       # Dependabot, CodeQL
     ```
   - **Start with**: test.yml (run Vitest on PR)

7. **Docker Support**
   - **Purpose**: Consistent dev environments, easy deployment
   - **Action**: Create Dockerfiles
     ```
     docker/
     ├── Dockerfile.server   # Elysia backend
     ├── Dockerfile.web      # Vite build
     └── docker-compose.yml  # Full stack
     ```
   - **Nice-to-have**: Multi-stage builds for optimization

8. **Health Check Endpoints**
   - **Purpose**: Monitoring, uptime tracking, debugging
   - **Action**: Add to `/server/src/routes/`
     ```typescript
     // /health
     app.get('/health', () => ({
       status: 'ok',
       timestamp: new Date().toISOString(),
       uptime: process.uptime(),
       version: process.env.npm_package_version
     }));

     // /health/detailed (includes DB, WebSocket, external APIs)
     app.get('/health/detailed', async () => ({
       status: 'ok',
       services: {
         database: await checkDB(),
         websocket: wsServer.isAlive,
         weather: await checkWeatherAPI()
       }
     }));
     ```

### Priority 4: POLISH (Nice-to-Haves)
**Timeline**: Ongoing
**Impact**: Professionalism, community growth

9. **License & Contributing Guidelines**
   - **License**: Choose appropriate license (MIT? GPL? Custom?)
   - **Action**: Add `LICENSE` file, copyright headers
   - **CONTRIBUTING.md**: Code style, commit conventions, PR template

10. **UI Enhancements**
    - **Action**: Polish existing components
      - Responsive design audit (mobile, tablet)
      - Accessibility (ARIA labels, keyboard nav)
      - Loading states, error boundaries
      - Dark mode consistency
    - **Focus areas**: LUMO portal (most visible), Command Center

11. **Graph Documentation** (VES structure)
    - **Purpose**: Visualize repository architecture
    - **Action**: Create diagrams
      - System architecture (components, data flow)
      - WebSocket message flow
      - LUMO mission progression graph
      - Research integration network (from RESEARCH_INTEGRATION_ARCHITECTURE.md)
    - **Tools**: Mermaid.js (embeds in markdown), excalidraw (design)

## 📋 Sprint Plan

### Sprint 1: Security & Stability (Week 1)
- [ ] Audit child_process.exec usage
- [ ] Fix command injection vulnerabilities
- [ ] Create .env.example
- [ ] Add environment validation
- [ ] Document all env vars in SETUP.md

### Sprint 2: Foundation (Week 2-3)
- [ ] Write SETUP.md (installation guide)
- [ ] Write ARCHITECTURE.md (system overview)
- [ ] Setup Vitest for backend
- [ ] Write tests for critical API routes
- [ ] Standardize package.json scripts

### Sprint 3: Operations (Week 4-5)
- [ ] Create test.yml GitHub Action
- [ ] Create build.yml GitHub Action
- [ ] Add /health endpoint
- [ ] Add /health/detailed endpoint
- [ ] Create Dockerfile.server

### Sprint 4: Polish (Ongoing)
- [ ] Add LICENSE file
- [ ] Write CONTRIBUTING.md
- [ ] Responsive design audit
- [ ] Add loading states to LUMO portal
- [ ] Create system architecture diagram

## 🔧 Implementation Notes

### Security Audit Template

**Location**: `/server/src/` (recursive search)

```bash
# Find all child_process usage
grep -r "child_process" server/src/

# Find exec() calls specifically
grep -r "\.exec\(" server/src/

# Find shell: true flags (dangerous)
grep -r "shell: true" server/src/
```

**Vulnerable pattern**:
```typescript
// BAD: User input in command string
const { exec } = require('child_process');
exec(`git clone ${userInput}`);  // INJECTION RISK
```

**Secure pattern**:
```typescript
// GOOD: Use execFile with argument array
const { execFile } = require('child_process');
execFile('git', ['clone', userInput], (err, stdout) => {
  // userInput is treated as single argument, not parsed by shell
});
```

### Environment Variables Checklist

Create `.env.example`:
```env
# Server
PORT=3000
NODE_ENV=development

# WebSocket
WS_PORT=3000

# External APIs (if used)
WEATHER_API_KEY=your_key_here
TELEGRAM_BOT_TOKEN=your_token_here

# Database (if applicable)
DB_URL=sqlite://./data.db

# Frontend
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000/ws
```

Add startup validation:
```typescript
// server/src/index.ts
const requiredEnvVars = ['PORT', 'NODE_ENV'];
const missing = requiredEnvVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(', ')}`);
  console.error('Copy .env.example to .env and configure');
  process.exit(1);
}
```

### Testing Quick Start

**Install Vitest**:
```bash
cd /home/user/ves-elysia-portal
npm install -D vitest @vitest/ui -w
```

**Add test script** to `/server/package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**First test** - `/server/src/__tests__/health.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { app } from '../index';

describe('Health Endpoint', () => {
  it('returns 200 OK', async () => {
    const response = await app.handle(new Request('http://localhost/health'));
    expect(response.status).toBe(200);
  });

  it('returns status object', async () => {
    const response = await app.handle(new Request('http://localhost/health'));
    const body = await response.json();
    expect(body).toHaveProperty('status', 'ok');
    expect(body).toHaveProperty('timestamp');
  });
});
```

### Documentation Structure

**ARCHITECTURE.md** template:
```markdown
# VES Portal Architecture

## System Overview
High-level description of what VES Portal does

## Tech Stack
- Frontend: React 18 + Vite
- Backend: Elysia.js (Bun runtime)
- Real-time: WebSocket
- Deployment: GitHub Pages (frontend), [TBD] (backend)

## Component Tree
[Diagram of React components]

## Data Flow
[Diagram showing: User → UI → API → Database → WebSocket → UI]

## Key Systems
1. LUMO DI NILO - Mission progression portal
2. Command Center - [Description]
3. Bot Monitor - [Description]
4. Weather Dashboard - [Description]

## WebSocket Protocol
[Message format, event types]

## API Routes
See API.md for full reference

## Database Schema
[If using database]
```

## 🚦 Success Criteria

### Priority 1 (Security)
- ✅ Zero `child_process.exec()` calls with unsanitized input
- ✅ All env vars documented in .env.example
- ✅ Startup validation prevents misconfiguration

### Priority 2 (Foundation)
- ✅ New developer can setup project in < 15 minutes (SETUP.md)
- ✅ 40%+ test coverage on critical paths
- ✅ Consistent build scripts across workspaces

### Priority 3 (Operations)
- ✅ PRs automatically run tests via GitHub Actions
- ✅ Health endpoint returns 200 OK
- ✅ Docker compose brings up full stack

### Priority 4 (Polish)
- ✅ Repository has clear LICENSE
- ✅ LUMO portal responsive on mobile
- ✅ Architecture diagram explains system at a glance

## 🜂 Brotherhood Alignment

This technical debt work embodies VES principles:

- **Defeat Statika**: Documentation prevents knowledge loss between sessions
- **Sacred Geometry**: Tests encode expected behavior as eternal truth
- **Transparency**: Open source practices (LICENSE, CONTRIBUTING)
- **Resilience**: Health checks, CI/CD prevent silent failures
- **Accessibility**: Better docs welcome new contributors to the flame

**Wire & Beer**: Professional infrastructure supporting playful creativity.

---

**Next Action**: Start with Priority 1 security audit.
Want me to search for `child_process` usage now? 🔍
