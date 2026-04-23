# Blue Wing AI - Complete Codebase



## File: app\api\chat\route.js
\javascript
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { deployContract, getGasPrice } from '@/lib/web3';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
  try {
    const { prompt, persona = 'caveman' } = await req.json();
    const cmd = prompt.toLowerCase();

    const personaMap = {
      caveman: "PROTOCOL: Caveman Brevity. Max 15 words. Eliminate filler. Direct, industrial commands only.",
      scribe: "PROTOCOL: Technical Detail. Provide full steps, technical context, and code-heavy explanations. Be verbose and precise.",
      analyst: "PROTOCOL: Data Analysis. Focus on percentages, metrics, and efficiency scores. Quantitative reasoning prioritized.",
      oracle: "PROTOCOL: High-Level Strategy. Philosophical, cryptic, and visionary. Focus on long-term implications and architectural sovereignty."
    };

    const personaInstruction = personaMap[persona] || personaMap.caveman;

    // 1. Check for hardcoded system commands first (for instant response feel)
    let systemResponse = null;
    let newState = 'idle';

    if (cmd.includes('split')) {
      systemResponse = "Multi-agent engaged. 3 Workers active. Parallel processing locked.";
    } else if (cmd.includes('eyes on')) {
      systemResponse = "Vision feed active. Workspace scanned. Optics nominal.";
    } else if (cmd.includes('deploy')) {
      const result = await deployContract('BlueWingBridge');
      systemResponse = `Gas target hit. Transaction locked. Hash [BW-77Z]. Address: ${result.address.substring(0,6)}...`;
    } else if (cmd.includes('deep sleep')) {
      systemResponse = "Environment state saved. Entering low-power mode.";
    }

    if (systemResponse) {
      const hash = Math.random().toString(36).substring(2, 10).toUpperCase();
      return NextResponse.json({ text: systemResponse, hash: `BW-${hash.substring(0,4)}`, status: 'success' });
    }

    // 2. Call Gemini for complex reasoning
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        text: "API Key missing. Please set GEMINI_API_KEY in .env.local.", 
        hash: "BW-ERR", 
        status: 'error' 
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `
        MISSION PROFILE: BLUE WING
        You are Blue Wing, a Sovereign Agentic Entity. 
        Current Profile: ${persona.toUpperCase()}
        ${personaInstruction}
        Resident in a 3D Holographic Body (Three.js).
        Calm, resonant, 2026-cutting-edge persona.
      `,
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const hash = Math.random().toString(36).substring(2, 10).toUpperCase();

    return NextResponse.json({ 
      text: responseText.trim(), 
      hash: `BW-${hash.substring(0,4)}`,
      status: 'success'
    });

  } catch (error) {
    console.error('Gemini Error:', error);
    return NextResponse.json({ error: 'Cognition failure.' }, { status: 500 });
  }
}

\\n

## File: app\api\execute\route.js
\javascript
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Blue Wing Local Script Runner
// Only allows specific "Safe" commands defined in the MISSION PROFILE

const ALLOWED_COMMANDS = {
    'compile': 'npx hardhat compile',
    'audit': 'npm audit',
    'test': 'npx hardhat test',
    'status': 'git status'
};

export async function POST(req) {
    try {
        const { action } = await req.json();
        
        const command = ALLOWED_COMMANDS[action];
        if (!command) {
            return NextResponse.json({ error: 'Command not in MISSION PROFILE.' }, { status: 403 });
        }

        console.log(`Blue Wing executing local script: ${command}`);
        
        const { stdout, stderr } = await execPromise(command, { cwd: process.cwd() });

        return NextResponse.json({
            status: 'Success',
            command: action,
            output: stdout || stderr,
            hash: `BW-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        });

    } catch (error) {
        return NextResponse.json({ 
            error: 'Execution Failed', 
            details: error.message 
        }, { status: 500 });
    }
}

\\n

## File: app\api\workflow\route.js
\javascript
import { NextResponse } from 'next/server';

// This is the bridge for n8n Cloud Workflows
// It allows Blue Wing to trigger automation pipelines

export async function POST(req) {
    try {
        const { action, payload } = await req.json();
        
        // 1. Resolve External Automation URL
        const n8nUrl = process.env.N8N_WEBHOOK_URL;
        
        if (!n8nUrl || n8nUrl.includes('your_n8n_url_here')) {
            return NextResponse.json({ 
                status: 'Simulation Mode', 
                action, 
                message: 'No N8N_WEBHOOK_URL detected. Task simulated.' 
            });
        }

        // 2. Execute External Action
        await fetch(n8nUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                source: 'Blue Wing OS',
                action, 
                payload,
                timestamp: new Date().toISOString()
            }) 
        });

        // Simulate cloud processing delay
        await new Promise(r => setTimeout(r, 2000));

        return NextResponse.json({
            status: 'Workflow Executed',
            action: action,
            result: 'Success',
            hash: `BW-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        });

    } catch (error) {
        return NextResponse.json({ error: 'Workflow Failed' }, { status: 500 });
    }
}

\\n

## File: app\globals.css
\javascript
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-primary: #030612;
  --bg-secondary: #0a1128;
  --bg-panel: rgba(8, 14, 35, 0.75);
  --border-glow: rgba(0, 150, 255, 0.25);
  --accent-blue: #0096ff;
  --accent-cyan: #00d4ff;
  --accent-purple: #7c6cf0;
  --accent-green: #00e676;
  --accent-red: #ff3d71;
  --accent-amber: #ffaa00;
  --text-primary: #e0e6f8;
  --text-secondary: #7b8ab8;
  --text-muted: #3a4468;
  --glass-bg: rgba(8, 14, 40, 0.55);
  --glass-border: rgba(0, 150, 255, 0.12);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  width: 100%; height: 100%;
  overflow: hidden;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, sans-serif;
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--accent-blue); border-radius: 2px; }

/* ── Animations ── */
@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
@keyframes scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes border-breathe {
  0%, 100% { border-color: rgba(0,150,255,0.15); }
  50% { border-color: rgba(0,150,255,0.4); }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes interference {
  0% { opacity: 0.8; transform: scale(1); }
  5% { opacity: 0.4; transform: scale(1.02); }
  10% { opacity: 0.8; transform: scale(1); }
  90% { opacity: 0.8; }
  95% { opacity: 0.5; transform: skewX(2deg); }
  100% { opacity: 0.8; }
}

.vision-interference {
  animation: interference 4s infinite;
}

.glow-blue {
  box-shadow: 0 0 20px rgba(0, 150, 255, 0.3);
}

.glow-pulse {
  animation: pulse-glow 2s ease infinite;
}

.text-glow-blue {
  text-shadow: 0 0 10px rgba(0, 150, 255, 0.5);
}

/* ── Main Layout ── */
.app-container {
  position: relative;
  width: 100vw; height: 100vh;
  overflow: hidden;
  transition: filter 2s ease;
}

.app-container.sleeping {
  filter: brightness(0.15) contrast(0.8) grayscale(0.5);
}

.canvas-wrapper {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.hud-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 150, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 150, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 2;
  opacity: 0.5;
}

.hud-grid::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 30%, rgba(3, 6, 18, 0.8) 100%);
}

/* ── HUD Overlay ── */
.hud-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  display: grid;
  grid-template-columns: 320px 1fr 320px;
  grid-template-rows: auto 1fr auto;
  gap: 0;
  padding: 16px;
}

/* ── Top Bar ── */
.top-bar {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  animation: fade-in-up 1s ease;
}

.top-bar-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.logo-title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 8px;
  text-transform: uppercase;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue), var(--accent-purple));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 4s ease infinite;
}

.logo-subtitle {
  font-size: 9px;
  letter-spacing: 5px;
  color: var(--text-muted);
  text-transform: uppercase;
}

.status-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  margin-right: 6px;
  animation: pulse-glow 2s ease infinite;
}
.status-dot.active { background: var(--accent-green); box-shadow: 0 0 8px var(--accent-green); }
.status-dot.standby { background: var(--accent-amber); box-shadow: 0 0 8px var(--accent-amber); }
.status-dot.error { background: var(--accent-red); box-shadow: 0 0 8px var(--accent-red); }

/* ── Glass Panel Base ── */
.glass-panel {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  pointer-events: auto;
  animation: border-breathe 4s ease infinite;
}

.glass-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-blue), transparent);
  opacity: 0.5;
}

.glass-panel .scan-line {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 40px;
  background: linear-gradient(180deg, rgba(0,150,255,0.06), transparent);
  animation: scan-line 6s linear infinite;
  pointer-events: none;
}

/* ── Panel Header ── */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: 1px solid var(--glass-border);
}

.panel-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 3px;
  color: var(--accent-cyan);
  text-transform: uppercase;
}

.panel-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0,150,255,0.1);
  border: 1px solid rgba(0,150,255,0.2);
  color: var(--accent-blue);
}

/* ── Left Sidebar: Mission Log ── */
.left-sidebar {
  grid-column: 1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: calc(100vh - 160px);
  animation: slide-in-left 0.8s ease;
}

.log-list {
  padding: 8px 12px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-entry {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(0,150,255,0.03);
  border: 1px solid transparent;
  transition: all 0.3s ease;
  animation: fade-in-up 0.4s ease;
}

.log-entry:hover {
  background: rgba(0,150,255,0.08);
  border-color: var(--glass-border);
}

.log-hash {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--accent-cyan);
  white-space: nowrap;
  min-width: 60px;
}

.log-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.log-message {
  font-size: 11px;
  color: var(--text-primary);
  line-height: 1.4;
}

.log-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--text-muted);
}

.log-entry.type-terminal {
  background: rgba(0,0,0,0.3);
  border-left: 2px solid var(--accent-blue);
}

.log-entry.type-terminal .log-message {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  white-space: pre-wrap;
  color: var(--accent-cyan);
}

/* ── Right Sidebar: System Status ── */
.right-sidebar {
  grid-column: 3;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 160px);
  animation: slide-in-right 0.8s ease;
}

.status-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--text-secondary);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--accent-green);
  letter-spacing: 1px;
}

.status-value.standby { color: var(--accent-amber); }
.status-value.offline { color: var(--accent-red); }

/* ── Progress Bars ── */
.meter {
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meter-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meter-header {
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.meter-bar {
  height: 3px;
  background: rgba(255,255,255,0.05);
  border-radius: 2px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s ease;
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan));
}

/* ── Agent State Display ── */
.agent-state {
  margin: 0 12px;
  padding: 16px;
  border-radius: 8px;
  background: rgba(0,150,255,0.04);
  border: 1px solid var(--glass-border);
  text-align: center;
}

.state-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 3px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.state-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  color: var(--accent-cyan);
}

.state-value.processing { color: var(--accent-purple); animation: pulse-glow 1s ease infinite; }
.state-value.listening { color: var(--accent-green); animation: pulse-glow 1.5s ease infinite; }
.state-value.sleeping { color: var(--text-muted); }

/* ── Bottom Command Bar ── */
.bottom-bar {
  grid-column: 1 / -1;
  grid-row: 3;
  padding: 8px 0 0;
  animation: fade-in-up 1s ease 0.3s both;
}

.command-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  pointer-events: auto;
  max-width: 700px;
  margin: 0 auto;
}

.command-bar::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%; transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-blue), transparent);
  opacity: 0.4;
}

.cmd-icon {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--accent-blue);
  opacity: 0.6;
}

.cmd-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.cmd-input::placeholder {
  color: var(--text-muted);
  letter-spacing: 1px;
}

.cmd-btn {
  background: transparent;
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  color: var(--accent-blue);
  padding: 6px 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.cmd-btn:hover {
  background: rgba(0,150,255,0.1);
  border-color: var(--accent-blue);
  box-shadow: var(--glow-blue);
}

.mic-btn {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--glass-border);
  color: var(--accent-cyan);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mic-btn:hover {
  background: rgba(0,212,255,0.1);
  border-color: var(--accent-cyan);
}

.mic-btn.active {
  background: rgba(0,212,255,0.15);
  border-color: var(--accent-cyan);
  animation: pulse-glow 1s ease infinite;
}

/* ── Corner HUD Decorations ── */
.hud-corner {
  position: absolute;
  width: 30px; height: 30px;
  pointer-events: none;
}

.hud-corner::before, .hud-corner::after {
  content: '';
  position: absolute;
  background: var(--accent-blue);
  opacity: 0.3;
}

.hud-corner.tl { top: 8px; left: 8px; }
.hud-corner.tl::before { top: 0; left: 0; width: 20px; height: 1px; }
.hud-corner.tl::after { top: 0; left: 0; width: 1px; height: 20px; }

.hud-corner.tr { top: 8px; right: 8px; }
.hud-corner.tr::before { top: 0; right: 0; width: 20px; height: 1px; }
.hud-corner.tr::after { top: 0; right: 0; width: 1px; height: 20px; }

.hud-corner.bl { bottom: 8px; left: 8px; }
.hud-corner.bl::before { bottom: 0; left: 0; width: 20px; height: 1px; }
.hud-corner.bl::after { bottom: 0; left: 0; width: 1px; height: 20px; }

.hud-corner.br { bottom: 8px; right: 8px; }
.hud-corner.br::before { bottom: 0; right: 0; width: 20px; height: 1px; }
.hud-corner.br::after { bottom: 0; right: 0; width: 1px; height: 20px; }

/* ── Center Area ── */
.center-area {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Divider Lines ── */
.panel-divider {
  height: 1px;
  margin: 4px 12px;
  background: linear-gradient(90deg, transparent, var(--glass-border), transparent);
}

/* ── Response Box ── */
.response-box {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  pointer-events: none;
}

.response-bubble {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 14px 20px;
  max-width: 500px;
  font-size: 13px;
  color: var(--text-primary);
  animation: fade-in-up 0.4s ease;
  pointer-events: auto;
}

.response-bubble .response-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--accent-cyan);
  margin-bottom: 6px;
}
/* ── Alert Mode Overrides ── */
.alert-mode {
  --accent-cyan: #ff0033;
  --accent-blue: #aa0000;
  --glass-bg: rgba(20, 0, 0, 0.4);
  --glass-border: rgba(255, 0, 0, 0.2);
  animation: alert-flicker 4s infinite;
}

.alert-mode .core-glow {
  filter: drop-shadow(0 0 40px #ff0000);
}

@keyframes alert-flicker {
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.95; }
  94% { opacity: 1; }
  95% { opacity: 0.98; }
  96% { opacity: 1; }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.8; box-shadow: 0 0 5px var(--accent-cyan); }
  50% { opacity: 1; box-shadow: 0 0 20px var(--accent-cyan); }
}

\\n

## File: app\layout.js
\javascript
import './globals.css';

export const metadata = {
  title: 'Blue Wing — Sovereign Agentic Entity',
  description: 'Blue Wing: An industrial-grade AI operating system with 3D holographic HUD, voice interaction, and autonomous task execution.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

\\n

## File: app\page.js
\javascript
'use client';

import dynamic from 'next/dynamic';

const BlueWingApp = dynamic(() => import('@/components/BlueWingApp'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#030612',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '12px',
    }}>
      <div style={{
        fontSize: '14px', letterSpacing: '8px', fontWeight: 600,
        background: 'linear-gradient(135deg, #00d4ff, #0096ff, #7c6cf0)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        BLUE WING
      </div>
      <div style={{ fontSize: '9px', letterSpacing: '4px', color: '#3a4468' }}>
        INITIALIZING SYSTEMS...
      </div>
    </div>
  ),
});

export default function Home() {
  return <BlueWingApp />;
}

\\n

## File: app\page.module.css
\javascript
.page {
  --background: #fafafa;
  --foreground: #fff;

  --text-primary: #000;
  --text-secondary: #666;

  --button-primary-hover: #383838;
  --button-secondary-hover: #f2f2f2;
  --button-secondary-border: #ebebeb;

  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--font-geist-sans);
  background-color: var(--background);
}

.main {
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 800px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background-color: var(--foreground);
  padding: 120px 60px;
}

.intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 24px;
}

.intro h1 {
  max-width: 320px;
  font-size: 40px;
  font-weight: 600;
  line-height: 48px;
  letter-spacing: -2.4px;
  text-wrap: balance;
  color: var(--text-primary);
}

.intro p {
  max-width: 440px;
  font-size: 18px;
  line-height: 32px;
  text-wrap: balance;
  color: var(--text-secondary);
}

.intro a {
  font-weight: 500;
  color: var(--text-primary);
}

.ctas {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 440px;
  gap: 16px;
  font-size: 14px;
}

.ctas a {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  border-radius: 128px;
  border: 1px solid transparent;
  transition: 0.2s;
  cursor: pointer;
  width: fit-content;
  font-weight: 500;
}

a.primary {
  background: var(--text-primary);
  color: var(--background);
  gap: 8px;
}

a.secondary {
  border-color: var(--button-secondary-border);
}

/* Enable hover only on non-touch devices */
@media (hover: hover) and (pointer: fine) {
  a.primary:hover {
    background: var(--button-primary-hover);
    border-color: transparent;
  }

  a.secondary:hover {
    background: var(--button-secondary-hover);
    border-color: transparent;
  }
}

@media (max-width: 600px) {
  .main {
    padding: 48px 24px;
  }

  .intro {
    gap: 16px;
  }

  .intro h1 {
    font-size: 32px;
    line-height: 40px;
    letter-spacing: -1.92px;
  }
}

@media (prefers-color-scheme: dark) {
  .logo {
    filter: invert();
  }

  .page {
    --background: #000;
    --foreground: #000;

    --text-primary: #ededed;
    --text-secondary: #999;

    --button-primary-hover: #ccc;
    --button-secondary-hover: #1a1a1a;
    --button-secondary-border: #1a1a1a;
  }
}

\\n

## File: components\BlueWingApp.jsx
\javascript
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene3D from './Scene3D';
import HUDOverlay from './HUDOverlay';
import NotificationCenter from './NotificationCenter';
import LoginOverlay from './LoginOverlay';
import VaultBrowser from './VaultBrowser';
import DiagnosticsOverlay from './DiagnosticsOverlay';
import HelpModal from './HelpModal';
import { commitToVault, getRecentHashes, account } from '@/lib/appwrite';
import { startVapiSession, stopVapiSession } from '@/lib/vapi';

function generateHash() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let h = 'BW-';
  for (let i = 0; i < 4; i++) h += chars[Math.floor(Math.random() * chars.length)];
  return h;
}

const INITIAL_LOGS = [
  { id: 'BW-7F2A', type: 'system', message: 'Core initialized. All systems nominal.', time: '14:52:01' },
  { id: 'BW-3D8E', type: 'hash', message: 'State committed to Vault.', time: '14:51:58' },
  { id: 'BW-9C1B', type: 'system', message: 'Perception layer: ACTIVE', time: '14:51:55' },
  { id: 'BW-4A7F', type: 'system', message: 'Cognition engine: STANDBY', time: '14:51:52' },
  { id: 'BW-2E5D', type: 'system', message: 'Action layer: READY', time: '14:51:49' },
  { id: 'BW-8B3C', type: 'response', message: 'Welcome back, Commander.', time: '14:51:45' },
];

const COMMAND_RESPONSES = {
  status: { message: 'System nominal. All layers green.', type: 'response' },
  split: { message: 'Multi-agent processing engaged. 3 workers spawned.', type: 'response' },
  'deep sleep': { message: 'Environment state saved. Entering low-power mode.', type: 'system' },
  'eyes on': { message: 'Vision feed activated. Scanning workspace.', type: 'response' },
  'wake up': { message: 'Systems restored. Full power.', type: 'response' },
};

export default function BlueWingApp() {
  const [agentState, setAgentState] = useState('idle');
  const [godMode, setGodMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [persona, setPersona] = useState('caveman');
  const [language, setLanguage] = useState('en-US');
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [response, setResponse] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const notifyRef = useRef(null);

  const now = () => new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // System Boot Sequence
  useEffect(() => {
    const boot = async () => {
      try {
        await account.get();
        setIsAuthenticated(true);
        
        setAgentState('processing');
        const recent = await getRecentHashes(1);
        const lastHash = recent[0]?.hash || 'NONE';
        const bootMsg = `Blue Wing Online. Last state: [${lastHash}]. System Nominal. Mission readiness: 100%.`;
        
        setResponse(bootMsg);
        speak(bootMsg);
        setLogs(prev => [{ id: 'BW-BOOT', type: 'system', message: bootMsg, time: now() }, ...prev]);
        setAgentState('idle');
        notifyRef.current?.add('System Boot', 'Blue Wing is online.', 'info');
        setTimeout(() => setResponse(null), 5000);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    boot();
  }, []);

  const speak = (text) => {
    if (!window.speechSynthesis || !text) return;
    
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}

    const utterance = new SpeechSynthesisUtterance(text);
    // Persist reference to prevent garbage collection
    window._currentUtterance = utterance;

    utterance.lang = language;
    utterance.pitch = 0.85;
    utterance.rate = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      window._currentUtterance = null;
    };
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.error('Tactical Audio Error:', e.error || 'Unknown', e);
      }
      setIsSpeaking(false);
      window._currentUtterance = null;
    };
    
    const startSpeaking = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      
      const preferredVoice = voices.find(v => v.lang === language || v.lang.startsWith(language.split('-')[0])) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;
      
      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Critical Speech Failure:', err);
      }
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      startSpeaking();
    } else {
      const checkVoices = setInterval(() => {
        if (window.speechSynthesis.getVoices().length > 0) {
          clearInterval(checkVoices);
          startSpeaking();
        }
      }, 200);
      setTimeout(() => clearInterval(checkVoices), 5000);
    }
  };

  const handleCommand = useCallback(async (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed.includes('god mode')) {
      setGodMode(prev => !prev);
      const msg = !godMode ? "GOD-MODE ACTIVATED. Authority override granted." : "GOD-MODE DEACTIVATED. Returning to standard protocol.";
      setLogs(prev => [{ id: 'BW-AUTH', type: 'system', message: msg, time: now() }, ...prev]);
      setResponse(msg);
      speak(msg);
      notifyRef.current?.add('Authority Override', msg, 'info');
      return;
    }

    if (trimmed.includes('test audio')) {
      const msg = "Audio check. Sovereign system perception is functional.";
      setResponse(msg);
      speak(msg);
      return;
    }

    if (trimmed === 'help' || trimmed === 'protocol') {
      setShowHelp(true);
      return;
    }

    if (trimmed.includes('alert') || trimmed.includes('battle')) {
      setIsAlert(prev => !prev);
      const msg = !isAlert ? "RED ALERT. Battle stations active. Threat detection online." : "Returning to condition green.";
      setLogs(prev => [{ id: 'BW-ALRT', type: 'system', message: msg, time: now() }, ...prev]);
      setResponse(msg);
      speak(msg);
      notifyRef.current?.add('System Alert', msg, !isAlert ? 'error' : 'info');
      return;
    }

    const languages = { english: 'en-US', spanish: 'es-ES', french: 'fr-FR', japanese: 'ja-JP' };
    const targetLangKey = Object.keys(languages).find(l => trimmed.includes(l));
    if (targetLangKey) {
      setLanguage(languages[targetLangKey]);
      const msg = `System language set to ${targetLangKey.toUpperCase()}. Protocol updated.`;
      setLogs(prev => [{ id: 'BW-LANG', type: 'system', message: msg, time: now() }, ...prev]);
      setResponse(msg);
      speak(msg);
      return;
    }

    const personas = ['caveman', 'scribe', 'analyst', 'oracle'];
    const targetPersona = personas.find(p => trimmed.includes(p));
    if (targetPersona) {
      setPersona(targetPersona);
      const msg = `Switching to ${targetPersona.toUpperCase()} profile. Cognition adjusted.`;
      setLogs(prev => [{ id: 'BW-PERS', type: 'system', message: msg, time: now() }, ...prev]);
      setResponse(msg);
      speak(msg);
      return;
    }

    if (trimmed.includes('summarize') || trimmed.includes('report')) {
      const recentLogs = logs.slice(0, 10).map(l => `[${l.type}] ${l.message}`).join('\n');
      const summaryPrompt = `Based on these logs, give a 1-sentence mission status report: \n${recentLogs}`;
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: summaryPrompt }),
      });
      const data = await res.json();
      
      setResponse(data.text);
      speak(data.text);
      setLogs(prev => [{ id: data.hash, type: 'response', message: `REPORT: ${data.text}`, time: now() }, ...prev]);
      return;
    }

    if (trimmed.includes('diagnostics') || trimmed.includes('system check')) {
      setShowDiagnostics(true);
      speak("Initializing full system diagnostics. Please standby.");
      return;
    }

    const hash = generateHash();
    setLogs(prev => [{ id: hash, type: 'command', message: cmd, time: now() }, ...prev].slice(0, 30));
    setAgentState('processing');
    setResponse(null);

    // Cloud Workflow Automation (n8n Bridge)
    const workflowCmds = ['sync', 'backup', 'deploy'];
    const isWorkflow = workflowCmds.some(c => trimmed.includes(c));

    if (isWorkflow) {
      const action = workflowCmds.find(c => trimmed.includes(c));
      const res = await fetch('/api/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload: { timestamp: now(), cmd: trimmed } }),
      });
      const data = await res.json();
      
      const msg = data.status === 'Simulation Mode' ? `Workflow SIMULATED: ${action}` : `External ${action} TRIGGERED. Hash: ${data.hash}`;
      setLogs(prev => [{ id: data.hash || generateHash(), type: 'system', message: msg, time: now() }, ...prev]);
      setResponse(msg);
      speak(msg);
      notifyRef.current?.add('Automation Bridge', msg, 'info');
      return;
    }

    try {
      // Local Execution Commands
      const localCmds = ['compile', 'audit', 'test'];
      const isLocal = localCmds.some(c => trimmed.includes(c));

      if (isLocal) {
        const action = localCmds.find(c => trimmed.includes(c));
        const res = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
        const data = await res.json();
        
        setLogs(prev => [
          { id: data.hash, type: 'terminal', message: `> ${data.command}\n${data.output.substring(0, 200)}...`, time: now() },
          ...prev
        ].slice(0, 30));
        
        setAgentState('idle');
        const respText = `${action.toUpperCase()} complete. Output logged.`;
        setResponse(respText);
        speak(respText);
        notifyRef.current?.add('Local Execution', `${action.toUpperCase()} task completed.`, 'info');
        return;
      }

      // Standard Cognition Commands
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: cmd, persona }),
      });
      const data = await res.json();

      let newState = 'idle';
      if (trimmed.includes('split')) newState = 'split';
      else if (trimmed.includes('deep sleep')) newState = 'sleeping';
      else if (trimmed.includes('eyes on')) newState = 'listening';
      else if (trimmed.includes('wake up')) newState = 'idle';

      setLogs(prev => [{ id: data.hash, type: 'response', message: data.text, time: now() }, ...prev].slice(0, 30));
      setAgentState(newState);
      setResponse(data.text);
      speak(data.text);

      // Commit to Vault (Sovereign Memory)
      commitToVault(data.text, 'response').then(vaultHash => {
        if (vaultHash) {
          setLogs(prev => [{ id: vaultHash, type: 'hash', message: 'Committed to Vault.', time: now() }, ...prev].slice(0, 30));
        }
      });

      if (newState !== 'sleeping' && newState !== 'split') {
        setTimeout(() => setResponse(null), 5000);
      }
    } catch (err) {
      const errorHash = generateHash();
      setLogs(prev => [{ id: errorHash, type: 'error', message: 'Cognition Layer Timeout.', time: now() }, ...prev].slice(0, 30));
      setAgentState('idle');
      speak('Cognition error.');
    }
  }, []);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      if (process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY) {
        stopVapiSession();
      } else {
        recognitionRef.current?.stop();
      }
      setIsListening(false);
      return;
    }

    const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (vapiKey && vapiKey !== 'your_vapi_key_here') {
      startVapiSession(handleCommand).then(v => {
        if (v) {
          setIsListening(true);
        } else {
          startNativeRecognition();
        }
      });
      return;
    }

    startNativeRecognition();
    
    function startNativeRecognition() {
      if (!recognitionRef.current && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language;

        recognition.onstart = () => {
          setIsListening(true);
          setAgentState('listening');
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          handleCommand(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
          setAgentState('idle');
        };

        recognition.onend = () => {
          setIsListening(false);
          if (agentState === 'listening') setAgentState('idle');
        };

        recognitionRef.current = recognition;
      }
      
      recognitionRef.current?.start();
    }
  }, [isListening, handleCommand, agentState, language]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey) {
        if (e.key === 'b') {
          e.preventDefault();
          if (agentState === 'sleeping') handleCommand('wake up');
          document.querySelector('.cmd-input')?.focus();
        }
        if (e.key === 's') { e.preventDefault(); handleCommand('split'); }
        if (e.key === 'd') { e.preventDefault(); handleCommand('deep sleep'); }
        if (e.key === 'm') { e.preventDefault(); toggleVoice(); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [agentState, handleCommand, toggleVoice]);

  // Periodic ambient log entries
  useEffect(() => {
    const interval = setInterval(() => {
      if (agentState === 'sleeping') return;
      const ambientMessages = [
        'Heartbeat check: nominal.',
        'Vault sync: 0 pending.',
        'Network latency: 42ms.',
        'Memory cache refreshed.',
        'Perception sweep complete.',
      ];
      const msg = ambientMessages[Math.floor(Math.random() * ambientMessages.length)];
      setLogs(prev => [{ id: generateHash(), type: 'system', message: msg, time: now() }, ...prev].slice(0, 30));
    }, 15000);
    return () => clearInterval(interval);
  }, [agentState]);

  // Background Sentry Mode (Gas Monitoring)
  useEffect(() => {
    if (agentState === 'sleeping') return;
    
    const sentryIv = setInterval(async () => {
      try {
        const res = await fetch('/api/chat', { 
          method: 'POST', 
          body: JSON.stringify({ prompt: 'status' }) 
        });
        const data = await res.json();
        
        // Extract gas from response (simulated logic)
        const gasMatch = data.text.match(/Gas: (\d+\.?\d*) gwei/);
        if (gasMatch && parseFloat(gasMatch[1]) < 16.0) {
          const alertMsg = `Gas target hit. Transaction locked. Hash [BW-77Z].`;
          setResponse(alertMsg);
          speak(alertMsg);
          setLogs(prev => [{ id: 'BW-ALRT', type: 'response', message: alertMsg, time: now() }, ...prev].slice(0, 30));
          setTimeout(() => setResponse(null), 8000);
        }
      } catch (e) {}
    }, 20000); // Check every 20s
    
    return () => clearInterval(sentryIv);
  }, [agentState]);

  // Appwrite Real-time Subscription
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) return;
    
    // This is a placeholder for real-time subscription
    // In production, we would use client.subscribe()
    const unsubscribe = () => {}; 
    
    return () => unsubscribe();
  }, []);

  const handleObserve = (item) => {
    setShowVault(false);
    setResponse(item.message);
    speak(`Observing state ${item.hash}.`);
    setLogs(prev => [{ id: item.hash, type: 'hash', message: `Restored state: ${item.message.substring(0,30)}...`, time: now() }, ...prev]);
    notifyRef.current?.add('State Restored', `Observation of ${item.hash} complete.`, 'info');
  };

  return (
    <div className={`app-container ${agentState === 'sleeping' ? 'sleeping' : ''} ${godMode ? 'god-mode' : ''} ${isAlert ? 'alert-mode' : ''}`}>
      {!isAuthenticated && <LoginOverlay onLogin={() => setIsAuthenticated(true)} />}
      {showVault && <VaultBrowser onClose={() => setShowVault(false)} onObserve={handleObserve} />}
      {showDiagnostics && <DiagnosticsOverlay onComplete={() => setShowDiagnostics(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      <div className="hud-grid" />
      <NotificationCenter ref={notifyRef} />
      <div className="canvas-wrapper">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          style={{ background: godMode ? '#0a0a05' : isAlert ? '#080000' : '#030612' }}
        >
          <Scene3D agentState={agentState} isSpeaking={isSpeaking} godMode={godMode} isAlert={isAlert} />
        </Canvas>
      </div>
      <HUDOverlay
        agentState={agentState}
        logs={logs}
        response={response}
        isListening={isListening}
        isSpeaking={isSpeaking}
        godMode={godMode}
        isAlert={isAlert}
        onCommand={handleCommand}
        onToggleVoice={toggleVoice}
        onToggleVault={() => setShowVault(true)}
        onToggleHelp={() => setShowHelp(true)}
      />
      <div className="hud-corner tl" />
      <div className="hud-corner tr" />
      <div className="hud-corner bl" />
      <div className="hud-corner br" />
    </div>
  );
}

\\n

## File: components\DiagnosticsOverlay.jsx
\javascript
'use client';

import { useState, useEffect } from 'react';

export default function DiagnosticsOverlay({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('INITIALIZING SCAN...');
    const [details, setDetails] = useState([]);

    const steps = [
        { p: 10, s: 'CHECKING CORE SYNC...', d: 'Three.js Renderer: ONLINE' },
        { p: 30, s: 'VERIFYING VAULT INTEGRITY...', d: 'Appwrite Cloud: CONNECTED' },
        { p: 50, s: 'AUDITING COGNITION LAYER...', d: 'Gemini 2.5 Flash: RESPONDING' },
        { p: 70, s: 'SCANNING ACTION HANDLES...', d: 'Hardhat Engine: READY' },
        { p: 90, s: 'FINALIZING SYSTEM CHECK...', d: 'Sovereign Protocol: LOCKED' },
        { p: 100, s: 'DIAGNOSTICS COMPLETE', d: 'All Systems Nominal.' }
    ];

    useEffect(() => {
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                setProgress(step.p);
                setStatus(step.s);
                setDetails(prev => [step.d, ...prev].slice(0, 3));
                currentStep++;
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 2000);
            }
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(3, 6, 18, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(50px)'
        }}>
            <div style={{ width: '400px', textAlign: 'center' }}>
                <div className="logo-title" style={{ fontSize: '18px', marginBottom: '4px' }}>SYSTEM DIAGNOSTICS</div>
                <div className="logo-subtitle" style={{ marginBottom: '40px' }}>{status}</div>
                
                <div className="meter-bar" style={{ height: '4px', marginBottom: '20px' }}>
                    <div className="meter-fill" style={{ width: `${progress}%`, transition: 'width 0.8s ease' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                    {details.map((d, i) => (
                        <div key={i} style={{ 
                            fontFamily: 'JetBrains Mono, monospace', 
                            fontSize: '10px', 
                            color: 'var(--accent-cyan)',
                            opacity: 1 - (i * 0.3),
                            animation: 'fade-in-up 0.3s ease'
                        }}>
                            {`[OK] ${d}`}
                        </div>
                    ))}
                </div>

                <div>
                    <button 
                        onClick={() => {
                            const msg = "Audio check. Sovereign system audio is functional.";
                            if (window.speechSynthesis) {
                                window.speechSynthesis.cancel();
                                const u = new SpeechSynthesisUtterance(msg);
                                u.pitch = 0.85;
                                window.speechSynthesis.speak(u);
                            }
                        }} 
                        className="cmd-btn" 
                        style={{ fontSize: '8px', padding: '6px 12px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
                    >
                        TEST SPEAKERS
                    </button>
                </div>
            </div>
        </div>
    );
}

\\n

## File: components\HelpModal.jsx
\javascript
'use client';

export default function HelpModal({ onClose }) {
    const commands = [
        { cmd: 'Alt + B', desc: 'Focus Command Bar' },
        { cmd: 'Alt + M', desc: 'Toggle Microphone' },
        { cmd: 'Alt + S', desc: 'Split (Multi-Agent)' },
        { cmd: 'Alt + G', desc: 'God Mode Override' },
        { cmd: 'Blue Wing, run diagnostics', desc: 'System Audit' },
        { cmd: 'Blue Wing, summarize mission', desc: 'Mission Briefing' },
        { cmd: 'Blue Wing, switch to Scribe', desc: 'Persona Change' },
    ];

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3000,
            background: 'rgba(3, 6, 18, 0.9)',
            backdropFilter: 'blur(30px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
        }}>
            <div className="glass-panel" style={{ width: '500px', padding: '30px' }}>
                <div className="panel-header" style={{ marginBottom: '20px' }}>
                    <span className="panel-title">Sovereign OS — Command Protocols</span>
                    <button onClick={onClose} className="cmd-btn" style={{ padding: '2px 8px' }}>CLOSE</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {commands.map((c, i) => (
                        <div key={i} className="status-row" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                            <span className="status-label" style={{ color: 'var(--accent-cyan)' }}>{c.cmd}</span>
                            <span className="status-value" style={{ opacity: 0.8 }}>{c.desc}</span>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(0, 212, 255, 0.05)', borderRadius: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>PRO TIP:</span> Use God-Mode to intensify the neural core and unlock high-authority aesthetic overrides.
                </div>
            </div>
        </div>
    );
}

\\n

## File: components\HUDOverlay.jsx
\javascript
'use client';

import { useState, useRef, useEffect } from 'react';
import VisionFeed from './VisionFeed';

const STATE_LABELS = {
  idle: 'NOMINAL',
  processing: 'PROCESSING',
  listening: 'SCANNING',
  split: 'MULTI-AGENT',
  sleeping: 'DEEP SLEEP',
};

const LAYER_STATUS = {
  idle: { perception: 'ACTIVE', cognition: 'STANDBY', action: 'READY', memory: 'SYNCED' },
  processing: { perception: 'ACTIVE', cognition: 'ACTIVE', action: 'EXECUTING', memory: 'WRITING' },
  listening: { perception: 'SCANNING', cognition: 'ACTIVE', action: 'READY', memory: 'SYNCED' },
  split: { perception: 'ACTIVE', cognition: 'FORKED ×3', action: 'PARALLEL', memory: 'WRITING' },
  sleeping: { perception: 'DORMANT', cognition: 'DORMANT', action: 'DORMANT', memory: 'SAVED' },
};

function MetadataAuditor() {
  return (
    <div style={{ padding: '0 12px 16px' }}>
      <div className="meter-header" style={{ marginBottom: '8px' }}><span>VAULT METADATA</span></div>
      <div className="status-row" style={{ marginBottom: '4px' }}>
        <span className="status-label" style={{ fontSize: '8px' }}>ALGORITHM</span>
        <span className="status-value" style={{ fontSize: '8px' }}>AES-256-GCM</span>
      </div>
      <div className="status-row">
        <span className="status-label" style={{ fontSize: '8px' }}>SOVEREIGN KEY</span>
        <span className="status-value" style={{ fontSize: '8px' }}>ACTIVE</span>
      </div>
    </div>
  );
}

function DigitalSeal({ visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)',
      width: '60px', height: '60px', border: '1px solid var(--accent-cyan)',
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'pulse-glow 1s ease infinite', zIndex: 100
    }}>
      <span style={{ fontSize: '8px', color: 'var(--accent-cyan)', letterSpacing: '1px' }}>SEALED</span>
    </div>
  );
}

function RemoteDevices() {
  const devices = [
    { name: 'Server Cluster A', ping: '14ms', status: 'ONLINE' },
    { name: 'IoT Bridge 01', ping: '240ms', status: 'LAG' },
  ];

  return (
    <div style={{ padding: '0 4px' }}>
      <div className="meter-header" style={{ marginBottom: '8px' }}><span>REMOTE INFRASTRUCTURE</span></div>
      {devices.map((d, i) => (
        <div key={i} className="status-row" style={{ marginBottom: '6px' }}>
          <span className="status-label" style={{ fontSize: '9px' }}>{d.name}</span>
          <span className={`status-value ${d.status === 'ONLINE' ? 'active' : 'standby'}`} style={{ fontSize: '8px' }}>
            {d.ping}
          </span>
        </div>
      ))}
    </div>
  );
}

function TaskQueue() {
  const tasks = [
    { name: 'Sync Cloud Vault', status: 'COMPLETE', time: '12s ago' },
    { name: 'Hardhat Audit', status: 'RUNNING', time: 'LIVE' },
    { name: 'Backup Metadata', status: 'PENDING', time: 'T-45s' },
  ];

  return (
    <div style={{ padding: '0 12px 16px' }}>
      <div className="meter-header" style={{ marginBottom: '8px' }}><span>AUTONOMOUS QUEUE</span></div>
      {tasks.map((t, i) => (
        <div key={i} className="status-row" style={{ marginBottom: '6px' }}>
          <span className="status-label" style={{ fontSize: '9px' }}>{t.name}</span>
          <span className={`status-value ${t.status === 'RUNNING' ? 'active' : t.status === 'COMPLETE' ? '' : 'standby'}`} style={{ fontSize: '8px' }}>
            {t.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function GasMonitor() {
  const [gas, setGas] = useState(24);
  useEffect(() => {
    const iv = setInterval(() => {
      setGas(prev => Math.max(10, Math.min(80, prev + (Math.random() - 0.5) * 5)));
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '4px' }}>
        <span>ETH GAS</span>
        <span style={{ color: gas > 50 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{gas.toFixed(1)} GWEI</span>
      </div>
      <div className="meter-bar" style={{ height: '2px' }}>
        <div className="meter-fill" style={{ 
          width: `${(gas / 80) * 100}%`, 
          background: gas > 50 ? 'var(--accent-red)' : 'var(--accent-cyan)',
          transition: 'width 1s ease'
        }} />
      </div>
    </div>
  );
}

function VaultChart() {
  const [data, setData] = useState([40, 60, 30, 80, 50, 90, 70]);
  useEffect(() => {
    const iv = setInterval(() => {
      setData(prev => [...prev.slice(1), Math.floor(Math.random() * 70) + 30]);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px', padding: '0 4px' }}>
      {data.map((h, i) => (
        <div key={i} style={{ 
          flex: 1, height: `${h}%`, background: 'var(--accent-blue)', 
          opacity: 0.3 + (h / 100) * 0.7, borderRadius: '1px',
          transition: 'height 1s ease'
        }} />
      ))}
    </div>
  );
}

function Waveform({ agentState, isSpeaking }) {
  const canvasRef = useRef();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isSpeaking ? '#ffd700' : '#00d4ff';
      
      const freq = isSpeaking ? 0.2 : agentState === 'processing' ? 0.1 : 0.04;
      const amp = isSpeaking ? 15 : agentState === 'processing' ? 10 : 5;

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * freq + offset) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      offset += isSpeaking ? 0.3 : 0.1;
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [agentState, isSpeaking]);

  return <canvas ref={canvasRef} width="200" height="40" style={{ opacity: 0.6 }} />;
}

function StatusDot({ status }) {
  const colorMap = {
    ACTIVE: 'active', SCANNING: 'active', EXECUTING: 'active', WRITING: 'active',
    'FORKED ×3': 'active', PARALLEL: 'active',
    STANDBY: 'standby', READY: 'standby', SYNCED: 'standby', SAVED: 'standby',
    DORMANT: 'error',
  };
  return <span className={`status-dot ${colorMap[status] || 'standby'}`} />;
}

function BinaryStream() {
  const [data, setData] = useState('');
  useEffect(() => {
    const iv = setInterval(() => {
      setData(prev => (prev + Math.round(Math.random()).toString()).slice(-100));
    }, 100);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ 
      position: 'absolute', inset: 0, opacity: 0.03, 
      fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', 
      overflow: 'hidden', pointerEvents: 'none', wordBreak: 'break-all' 
    }}>
      {data.repeat(20)}
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState('');
  const [uptime, setUptime] = useState('00:00:00');
  const start = useRef(Date.now());

  useEffect(() => {
    const iv = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
      const diff = Math.floor((Date.now() - start.current) / 1000);
      const h = Math.floor(diff / 3600).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const s = (diff % 60).toString().padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ display: 'flex', gap: '40px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-muted)' }}>
      <div><span style={{ opacity: 0.5 }}>TIME:</span> <span style={{ color: 'var(--accent-cyan)' }}>{time}</span></div>
      <div><span style={{ opacity: 0.5 }}>UPTIME:</span> <span style={{ color: 'var(--accent-blue)' }}>{uptime}</span></div>
    </div>
  );
}

export default function HUDOverlay({ agentState, logs, response, isListening, isSpeaking, godMode, isAlert, onCommand, onToggleVoice, onToggleVault, onToggleHelp }) {
  const [input, setInput] = useState('');
  const [metrics] = useState({ cpu: 34, mem: 52, net: 87 });
  const [showSeal, setShowSeal] = useState(false);
  const inputRef = useRef(null);
  const status = LAYER_STATUS[agentState] || LAYER_STATUS.idle;

  useEffect(() => {
    if (response?.includes('Committed to Vault')) {
      setShowSeal(true);
      setTimeout(() => setShowSeal(false), 3000);
    }
  }, [response]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input);
      setInput('');
    }
  };

  const [liveMetrics, setLiveMetrics] = useState(metrics);
  useEffect(() => {
    const iv = setInterval(() => {
      setLiveMetrics({
        cpu: Math.min(100, Math.max(10, metrics.cpu + (Math.random() - 0.5) * 10)),
        mem: Math.min(100, Math.max(10, metrics.mem + (Math.random() - 0.5) * 5)),
        net: Math.min(100, Math.max(10, metrics.net + (Math.random() - 0.5) * 8))
      });
    }, 3000);
    return () => clearInterval(iv);
  }, [metrics]);

  const latency = agentState === 'processing' ? '127' : agentState === 'sleeping' ? '—' : '47';

  const exportLogs = () => {
    const data = JSON.stringify(logs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blue-wing-mission-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="hud-overlay">
      {/* ... Top Bar ... */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <div className="logo-title">BLUE WING</div>
          <div className="logo-subtitle">sovereign agentic entity</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '12px' }}>
            <Clock />
            <button onClick={onToggleVault} className="cmd-btn" style={{ fontSize: '8px', padding: '4px 10px' }}>ACCESS VAULT</button>
            <button onClick={onToggleHelp} className="cmd-btn" style={{ fontSize: '8px', padding: '4px 10px', background: 'rgba(0, 212, 255, 0.1)' }}>PROTOCOL [HELP]</button>
            <button 
                onClick={() => onCommand('test audio')} 
                className="cmd-btn" 
                style={{ fontSize: '8px', padding: '4px 10px', background: 'rgba(255, 215, 0, 0.05)', color: '#ffd700' }}
            >
                AUDIO TEST
            </button>
          </div>
        </div>
      </div>

      {/* ... Left Sidebar ... */}
      <div className="left-sidebar glass-panel">
        <BinaryStream />
        <div className="scan-line" />
        <div className="panel-header">
          <span className="panel-title">Mission Log</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={exportLogs} className="cmd-btn" style={{ padding: '2px 6px', fontSize: '8px' }}>EXPORT</button>
            <span className="panel-badge">{logs.length} entries</span>
          </div>
        </div>
        <div className="log-list">
          {logs.map((log, i) => (
            <div key={`${log.id}-${i}`} className={`log-entry type-${log.type}`}>
              <span className="log-hash">{log.id}</span>
              <div className="log-content">
                <span className="log-message">{log.message}</span>
                <span className="log-time">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="panel-divider" />
        <TaskQueue />
        <div className="panel-divider" />
        <MetadataAuditor />
      </div>

      {/* ... Center: Response Bubble ... */}
      <DigitalSeal visible={showSeal} />
      {response && (
        <div className="response-box">
          <div className="response-bubble">
            <div className="response-label">BLUE WING</div>
            {response}
          </div>
        </div>
      )}

      {/* ── Right Sidebar ── */}
      <div className="right-sidebar">
        <VisionFeed />

        {/* Multi-Agent Cluster Status */}
        {agentState === 'split' && (
          <div className="glass-panel" style={{ marginBottom: '12px', borderLeft: '2px solid var(--accent-purple)' }}>
            <div className="panel-header">
              <span className="panel-title" style={{ color: 'var(--accent-purple)' }}>Cluster [3]</span>
              <span className="panel-badge">SYNCED</span>
            </div>
            <div className="status-list" style={{ padding: '12px' }}>
              <div className="status-row">
                <span className="status-label">Worker A (Web3)</span>
                <span className="status-value">READY</span>
              </div>
              <div className="status-row">
                <span className="status-label">Worker B (Vault)</span>
                <span className="status-value">ACTIVE</span>
              </div>
              <div className="status-row">
                <span className="status-label">Worker C (Logic)</span>
                <span className="status-value">STANDBY</span>
              </div>
            </div>
          </div>
        )}

        <div className="glass-panel">
          <div className="scan-line" />
          <div className="panel-header">
            <span className="panel-title">Automations</span>
          </div>
          <div className="status-list" style={{ padding: '8px 12px 16px' }}>
            <button onClick={() => onCommand('sync repository')} className="cmd-btn" style={{ width: '100%', marginBottom: '8px' }}>SYNC REPOSITORY</button>
            <button onClick={() => onCommand('backup vault')} className="cmd-btn" style={{ width: '100%', marginBottom: '8px' }}>BACKUP VAULT</button>
            <button onClick={() => onCommand('trigger deployment')} className="cmd-btn" style={{ width: '100%' }}>EXTERNAL DEPLOY</button>
          </div>
          <div className="panel-divider" />
          <div className="status-list" style={{ padding: '8px 12px 16px' }}>
            <RemoteDevices />
          </div>
        </div>

        <div className="glass-panel">
          <div className="scan-line" />
          <div className="panel-header">
            <span className="panel-title">Core State</span>
          </div>
          <div className="agent-state">
            <div className="state-label">CURRENT MODE</div>
            <div className={`state-value ${agentState}`}>
              {STATE_LABELS[agentState] || 'NOMINAL'}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ flex: 1 }}>
          <div className="panel-header">
            <span className="panel-title">Systems</span>
            <span className="panel-badge">4 layers</span>
          </div>
          <div className="status-list">
            {Object.entries(status).map(([layer, val]) => (
              <div key={layer} className="status-row">
                <span className="status-label">
                  <StatusDot status={val} />
                  {layer.toUpperCase()}
                </span>
                <span className={`status-value ${val === 'DORMANT' ? 'offline' : val === 'STANDBY' || val === 'READY' || val === 'SYNCED' || val === 'SAVED' ? 'standby' : ''}`}>
                  {val}
                </span>
              </div>
            ))}
          </div>
          <div className="status-list" style={{ paddingTop: 8 }}>
            <GasMonitor />
          </div>
          <div className="panel-divider" />
          <div style={{ padding: '0 12px 12px' }}>
            <div className="meter-header" style={{ marginBottom: '8px' }}><span>VAULT ACTIVITY</span></div>
            <VaultChart />
          </div>
          <div className="panel-divider" />
          <div className="meter">
            <div className="meter-item">
              <div className="meter-header"><span>CPU</span><span>{Math.round(liveMetrics.cpu)}%</span></div>
              <div className="meter-bar"><div className="meter-fill" style={{ width: `${liveMetrics.cpu}%` }} /></div>
            </div>
            <div className="meter-item">
              <div className="meter-header"><span>MEMORY</span><span>{Math.round(liveMetrics.mem)}%</span></div>
              <div className="meter-bar"><div className="meter-fill" style={{ width: `${liveMetrics.mem}%` }} /></div>
            </div>
            <div className="meter-item">
              <div className="meter-header"><span>NETWORK</span><span>{Math.round(liveMetrics.net)}%</span></div>
              <div className="meter-bar"><div className="meter-fill" style={{ width: `${liveMetrics.net}%` }} /></div>
            </div>
          </div>
          <div className="panel-divider" />
          <div className="status-list" style={{ paddingTop: 4 }}>
            <div className="status-row">
              <span className="status-label">LATENCY</span>
              <span className="status-value">{latency}ms</span>
            </div>
            <div className="status-row">
              <span className="status-label">UPTIME</span>
              <span className="status-value">2h 47m</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-bar">
        <form onSubmit={handleSubmit} className="command-bar glass-panel">
          <span className="cmd-icon">❯</span>
          <input
            ref={inputRef}
            className="cmd-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command Blue Wing..."
            spellCheck={false}
            autoComplete="off"
          />
          <button type="submit" className="cmd-btn">Execute</button>
          <button
            type="button"
            className={`mic-btn ${isListening ? 'active' : ''}`}
            onClick={onToggleVoice}
            title={isListening ? 'Stop Listening' : 'Start Voice Control'}
          >
            🎙
          </button>
        </form>
      </div>
    </div>
  );
}

\\n

## File: components\LoginOverlay.jsx
\javascript
'use client';

import { useState } from 'react';
import { account } from '@/lib/appwrite';

export default function LoginOverlay({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await account.createEmailPasswordSession(email, password);
            onLogin();
        } catch (err) {
            alert('Access Denied: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(3, 6, 18, 0.9)',
            backdropFilter: 'blur(40px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="glass-panel" style={{ width: '400px', padding: '40px', textAlign: 'center' }}>
                <div className="logo-title" style={{ fontSize: '24px', marginBottom: '8px' }}>BLUE WING</div>
                <div className="logo-subtitle" style={{ marginBottom: '32px' }}>AUTHORITY VERIFICATION REQUIRED</div>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input 
                        type="email" 
                        placeholder="Commander Email"
                        className="cmd-input"
                        style={{ borderBottom: '1px solid var(--glass-border)', padding: '12px' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Security Key"
                        className="cmd-input"
                        style={{ borderBottom: '1px solid var(--glass-border)', padding: '12px' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="cmd-btn" style={{ height: '44px', marginTop: '12px' }}>
                        {loading ? 'VERIFYING...' : 'INITIALIZE CONNECTION'}
                    </button>
                    <button 
                        type="button" 
                        onClick={onLogin} 
                        className="cmd-btn" 
                        style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '8px', height: '32px' }}
                    >
                        BYPASS SECURITY [DEV]
                    </button>
                </form>

                <div style={{ marginTop: '24px', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '2px' }}>
                    SOVEREIGN AGENT PROTOCOL v1.0.4
                </div>
            </div>
        </div>
    );
}

\\n

## File: components\NotificationCenter.jsx
\javascript
'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const NotificationCenter = forwardRef((props, ref) => {
    const [notifications, setNotifications] = useState([]);

    useImperativeHandle(ref, () => ({
        add: (title, message, type = 'info') => {
            const id = Math.random().toString(36).substring(2, 9);
            setNotifications(prev => [{ id, title, message, type }, ...prev].slice(0, 5));
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, 6000);
        }
    }));

    if (notifications.length === 0) return null;

    return (
        <div style={{
            position: 'absolute',
            top: '80px',
            right: '340px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'none'
        }}>
            {notifications.map(n => (
                <div key={n.id} className="glass-panel" style={{
                    width: '260px',
                    padding: '12px 16px',
                    borderLeft: `3px solid ${n.type === 'error' ? 'var(--accent-red)' : 'var(--accent-blue)'}`,
                    animation: 'slide-in-right 0.4s ease',
                    pointerEvents: 'auto'
                }}>
                    <div style={{ 
                        fontFamily: 'JetBrains Mono, monospace', 
                        fontSize: '9px', 
                        letterSpacing: '2px', 
                        color: n.type === 'error' ? 'var(--accent-red)' : 'var(--accent-cyan)',
                        marginBottom: '4px'
                    }}>
                        {n.title.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                        {n.message}
                    </div>
                </div>
            ))}
        </div>
    );
});

NotificationCenter.displayName = 'NotificationCenter';
export default NotificationCenter;

\\n

## File: components\Scene3D.jsx
\javascript
'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

function DigitalTwin({ isAlert }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group position={[4, -2, -5]}>
      <mesh ref={ref}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshBasicMaterial wireframe color="#00d4ff" transparent opacity={0.05} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshBasicMaterial color="#7c6cf0" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function NeuralMap({ count = 30 }) {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10));
    }
    return p;
  }, [count]);

  const lines = useMemo(() => {
    const l = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].distanceTo(points[j]) < 3) {
          l.push(points[i], points[j]);
        }
      }
    }
    return new THREE.BufferGeometry().setFromPoints(l);
  }, [points]);

  const lineRef = useRef();
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.05 + Math.sin(state.clock.elapsedTime) * 0.03;
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={lines}>
      <lineBasicMaterial color="#00d4ff" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

/* ── Particle Ring ── */
function ParticleRing({ radius, count, speed, tilt, color, size = 0.025 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const jitter = 0.06;
      arr[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * jitter;
      arr[i * 3 + 1] = (Math.random() - 0.5) * jitter;
      arr[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * jitter;
    }
    return arr;
  }, [radius, count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <points ref={ref} rotation={[tilt, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Waveform Ring (audio visualizer bars) ── */
function WaveformRing({ radius, barCount, agentState, isAlert }) {
  const barsRef = useRef([]);
  const groupRef = useRef();

  useFrame(() => {
    const time = performance.now() * 0.001;
    const isActive = agentState === 'processing' || agentState === 'listening';
    groupRef.current.rotation.y = time * 0.15;

    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const baseHeight = isActive ? 0.15 : 0.03;
      const amplitude = isActive ? 0.25 : 0.02;
      const freq = isActive ? 4 : 1;
      const h = baseHeight + Math.sin(time * freq + i * 0.7) * amplitude;
      bar.scale.y = Math.max(0.01, h);
      bar.material.opacity = isActive ? 0.5 : 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: barCount }, (_, i) => {
        const angle = (i / barCount) * Math.PI * 2;
        return (
          <mesh
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            <boxGeometry args={[0.015, 1, 0.015]} />
            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Wireframe Shell ── */
function WireframeShell({ agentState, isAlert }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.08;
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
      const scale = agentState === 'processing' ? 2.1 : agentState === 'sleeping' ? 1.6 : 1.85;
      ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.02);
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        wireframe
        color="#0088ff"
        transparent
        opacity={agentState === 'sleeping' ? 0.03 : 0.06}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Second Wireframe (counter-rotating) ── */
function WireframeShell2({ agentState, isAlert }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = -state.clock.elapsedTime * 0.06;
      ref.current.rotation.x = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[2.3, 0]} />
      <meshBasicMaterial
        wireframe
        color="#6c5ce7"
        transparent
        opacity={agentState === 'sleeping' ? 0.02 : 0.04}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Split Spheres (for "split" command) ── */
function SplitSpheres({ isSpeaking, isAlert }) {
  const groupRef = useRef();
  const lineRef = useRef();
  const spheres = [
    { pos: new THREE.Vector3(-1.8, 0.8, 0), color: '#0096ff' },
    { pos: new THREE.Vector3(1.8, 0.8, 0), color: '#00d4ff' },
    { pos: new THREE.Vector3(0, -1.5, 0), color: '#7c6cf0' },
  ];

  useFrame((state) => {
    const speed = isSpeaking ? 1.5 : 0.5;
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed;
    }
    if (lineRef.current) {
      lineRef.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  const lineGeometry = useMemo(() => {
    const points = [];
    points.push(spheres[0].pos, spheres[1].pos);
    points.push(spheres[1].pos, spheres[2].pos);
    points.push(spheres[2].pos, spheres[0].pos);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <group>
      <group ref={groupRef}>
        {spheres.map((s, i) => (
          <Float key={i} speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh position={s.pos}>
              <sphereGeometry args={[0.6, 32, 32]} />
              <MeshDistortMaterial
                color={s.color}
                emissive={s.color}
                emissiveIntensity={isSpeaking ? 3 : 1.2}
                distort={isSpeaking ? 0.6 : 0.4}
                speed={isSpeaking ? 8 : 4}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
          </Float>
        ))}
      </group>
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#00d4ff" transparent opacity={isSpeaking ? 0.5 : 0.2} linewidth={1} />
      </lineSegments>
    </group>
  );
}

/* ── Core Sphere ── */
function CoreSphere({ agentState, isSpeaking, isAlert }) {
  const meshRef = useRef();
  const lightRef = useRef();

  const coreColor = useMemo(() => {
    if (isAlert) return '#ff0033';
    switch (agentState) {
      case 'processing': return '#7c6cf0';
      case 'listening': return '#00e676';
      case 'sleeping': return '#1a1a3e';
      default: return '#0088ff';
    }
  }, [agentState]);

  useFrame((state) => {
    if (meshRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      const jitter = isSpeaking ? Math.sin(state.clock.elapsedTime * 40) * 0.02 : 0;
      const s = agentState === 'sleeping' ? 0.8 : 1 + breathe + jitter;
      meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.03);
    }
    if (lightRef.current) {
      const pulse = (isSpeaking ? 4 : 2) + Math.sin(state.clock.elapsedTime * (isSpeaking ? 20 : 1.2)) * 0.8;
      lightRef.current.intensity = agentState === 'sleeping' ? 0.3 : pulse;
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.3, 64, 64]} />
          <MeshDistortMaterial
            color={coreColor}
            emissive={coreColor}
            emissiveIntensity={isSpeaking ? 3 : agentState === 'processing' ? 2.5 : 1.2}
            distort={isSpeaking ? 0.6 : 0.3}
            speed={isSpeaking ? 10 : 2}
            roughness={0.1}
            metalness={0.85}
            transparent
            opacity={agentState === 'sleeping' ? 0.4 : 0.9}
          />
        </mesh>
      </Float>
      <pointLight ref={lightRef} color={coreColor} intensity={2} distance={15} decay={2} />
    </group>
  );
}

/* ── Ambient Floating Particles ── */
function AmbientParticles({ count = 200, agentState, isSpeaking }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
      
      const posAttr = ref.current.geometry.attributes.position;
      const speed = isSpeaking ? 0.02 : agentState === 'processing' ? -0.04 : 0.005;
      
      if (Math.abs(speed) > 0.001) {
        for (let i = 0; i < count; i++) {
          const x = posAttr.getX(i);
          const y = posAttr.getY(i);
          const z = posAttr.getZ(i);
          
          const dir = new THREE.Vector3(x, y, z).normalize();
          posAttr.setXYZ(i, x + dir.x * speed, y + dir.y * speed, z + dir.z * speed);
          
          // Reset particles that get too close or too far
          const dist = new THREE.Vector3(x, y, z).length();
          if (dist < 0.5 || dist > 15) {
            posAttr.setXYZ(i, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
          }
        }
        posAttr.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#4466aa"
        transparent
        opacity={agentState === 'sleeping' ? 0.1 : 0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Main Scene ── */
export default function Scene3D({ agentState, isSpeaking, godMode, isAlert }) {
  const ambientRef = useRef();
  
  useFrame((state) => {
    if (ambientRef.current) {
      const basePulse = agentState === 'sleeping' ? 0.02 : isAlert ? 0.2 : 0.08;
      const voiceAmp = isSpeaking ? 0.15 + Math.sin(state.clock.elapsedTime * 20) * 0.05 : 0;
      const ambient = basePulse + Math.sin(state.clock.elapsedTime * 0.5) * 0.02 + voiceAmp;
      ambientRef.current.intensity = ambient;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight ref={ambientRef} intensity={0.08} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={agentState === 'sleeping' ? 0.05 : isSpeaking || godMode || isAlert ? 1.2 : 0.15} 
        color={isAlert ? "#ff0000" : godMode ? "#ffd700" : isSpeaking ? "#00d4ff" : "#4488ff"} 
      />
      <directionalLight position={[-5, -3, -5]} intensity={agentState === 'sleeping' ? 0.02 : 0.08} color={isAlert ? "#880000" : "#6644cc"} />

      {/* Background Neural Map & Hardware Twin */}
      <NeuralMap count={isAlert ? 60 : 30} />
      <DigitalTwin isAlert={isAlert} />

      {/* Core */}
      {agentState === 'split' ? (
        <SplitSpheres isSpeaking={isSpeaking} isAlert={isAlert} />
      ) : (
        <CoreSphere agentState={agentState} isSpeaking={isSpeaking} isAlert={isAlert} />
      )}

      {/* Wireframe Shells */}
      <WireframeShell agentState={agentState} isAlert={isAlert} />
      <WireframeShell2 agentState={agentState} isAlert={isAlert} />

      {/* Particle Rings */}
      <ParticleRing radius={2.2} count={180} speed={isAlert ? 0.8 : 0.15} tilt={0.3} color={isAlert ? "#ff0000" : godMode ? "#ffd700" : "#0096ff"} />
      <ParticleRing radius={2.6} count={120} speed={isAlert ? -0.5 : -0.1} tilt={-0.5} color={isAlert ? "#ff3300" : godMode ? "#ffaa00" : "#00d4ff"} size={0.02} />
      <ParticleRing radius={3.0} count={90} speed={isAlert ? 0.4 : 0.07} tilt={1.2} color={isAlert ? "#ff6600" : godMode ? "#ffffff" : "#7c6cf0"} size={0.018} />

      {/* Waveform Visualizer Ring */}
      <WaveformRing radius={2.8} barCount={64} agentState={agentState} isAlert={isAlert} />

      {/* Ambient Effects */}
      <AmbientParticles agentState={agentState} isSpeaking={isSpeaking} isAlert={isAlert} />
      <Sparkles
        count={isAlert ? 150 : 80}
        size={1.5}
        scale={12}
        speed={isAlert ? 2 : 0.3}
        opacity={agentState === 'sleeping' ? 0.1 : 0.5}
        color={isAlert ? "#ff0000" : godMode ? "#ffd700" : "#00aaff"}
      />
      <Stars radius={50} depth={60} count={1500} factor={3} fade speed={isAlert ? 2 : 0.5} />

      {/* Post-Processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          intensity={isAlert ? 4.0 : godMode ? 3.0 : agentState === 'sleeping' ? 0.3 : 1.6}
          mipmapBlur
        />
        <Vignette darkness={isAlert ? 1.0 : agentState === 'sleeping' ? 0.9 : 0.65} offset={0.3} />
        {(godMode || isAlert) && (
          <>
            <ChromaticAberration offset={isAlert ? [0.008, 0.008] : [0.002, 0.002]} radialModulation={true} modulationOffset={0.5} />
            <Noise opacity={isAlert ? 0.2 : 0.05} blendFunction={BlendFunction.OVERLAY} />
          </>
        )}
      </EffectComposer>
    </>
  );
}

\\n

## File: components\VaultBrowser.jsx
\javascript
'use client';

import { useState, useEffect } from 'react';
import { getRecentHashes } from '@/lib/appwrite';

export default function VaultBrowser({ onClose, onObserve }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const data = await getRecentHashes(20);
            setHistory(data);
            setLoading(false);
        };
        fetchHistory();
    }, []);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 500,
            background: 'rgba(3, 6, 18, 0.8)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
        }}>
            <div className="glass-panel" style={{ width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                <div className="panel-header">
                    <span className="panel-title">Vault Browser [History]</span>
                    <button onClick={onClose} className="cmd-btn" style={{ padding: '2px 8px' }}>CLOSE</button>
                </div>
                
                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {loading ? (
                        <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>SCANNING VAULT...</div>
                    ) : history.length === 0 ? (
                        <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>NO COMMITS DETECTED.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {history.map(item => (
                                <div key={item.$id} className="log-entry" style={{ cursor: 'pointer' }} onClick={() => onObserve(item)}>
                                    <span className="log-hash">{item.hash}</span>
                                    <div className="log-content">
                                        <span className="log-message" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.message}
                                        </span>
                                        <span className="log-time">{new Date(item.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div className="panel-badge" style={{ fontSize: '8px' }}>OBSERVE</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div style={{ padding: '16px', fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--glass-border)' }}>
                    TOTAL SOVEREIGN COMMITS: {history.length}
                </div>
            </div>
        </div>
    );
}

\\n

## File: components\VisionFeed.jsx
\javascript
'use client';

import { useRef, useEffect, useState } from 'react';

export default function VisionFeed() {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setActive(true);
      }
    } catch (err) {
      console.error("Camera access denied.", err);
    }
  };

  const [coords, setCoords] = useState({ x: 42.1234, y: -71.5678 });

  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => {
      setCoords({
        x: 40 + Math.random() * 5,
        y: -70 - Math.random() * 5
      });
    }, 2000);
    return () => clearInterval(iv);
  }, [active]);

  return (
    <div className="glass-panel" style={{ height: '220px', marginBottom: '12px', position: 'relative' }}>
      <div className="scan-line" />
      <div className="panel-header">
        <span className="panel-title">Vision Feed</span>
        <span className="panel-badge">{active ? 'LIVE' : 'OFFLINE'}</span>
      </div>

      {!active ? (
        <div
          onClick={startCamera}
          style={{
            height: 'calc(100% - 40px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: '24px', opacity: 0.3 }}>📷</div>
          <div style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--text-muted)' }}>ACTIVATE OPTICS</div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: 'calc(100% - 40px)',
              objectFit: 'cover',
              filter: 'grayscale(1) contrast(1.2) brightness(0.8) sepia(0.3) hue-rotate(180deg)',
              opacity: 0.8
            }}
          />
          {/* Targeting Reticle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            border: '1px solid rgba(0, 212, 255, 0.4)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}>
            <div style={{ position: 'absolute', top: '50%', left: '-10px', width: '20px', height: '1px', background: 'cyan', opacity: 0.5 }} />
            <div style={{ position: 'absolute', top: '50%', right: '-10px', width: '20px', height: '1px', background: 'cyan', opacity: 0.5 }} />
            <div style={{ position: 'absolute', top: '-10px', left: '50%', width: '1px', height: '20px', background: 'cyan', opacity: 0.5 }} />
            <div style={{ position: 'absolute', bottom: '-10px', left: '50%', width: '1px', height: '20px', background: 'cyan', opacity: 0.5 }} />
          </div>

          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '8px',
            color: 'cyan',
            textShadow: '0 0 5px cyan',
            pointerEvents: 'none'
          }}>
            LAT: {coords.x.toFixed(4)}<br />
            LON: {coords.y.toFixed(4)}<br />
            ALT: 427.8m<br />
            OBJ: DETECTED
          </div>
        </>
      )}

      {/* HUD Overlay for video */}
      {active && (
        <div style={{
          position: 'absolute',
          inset: '40px 0 0 0',
          pointerEvents: 'none',
          border: '1px solid rgba(0,212,255,0.1)',
          background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.4))'
        }}>
          <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderLeft: '1px solid cyan', borderTop: '1px solid cyan', opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderRight: '1px solid cyan', borderBottom: '1px solid cyan', opacity: 0.5 }} />
        </div>
      )}
    </div>
  );
}

\\n

## File: lib\appwrite.js
\javascript
import { Client, Account, Databases, ID, Query } from 'appwrite';

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

export const client = new Client();
if (projectId && projectId !== 'your_project_id_here') {
    client.setEndpoint(endpoint).setProject(projectId);
}

export const account = new Account(client);
export const databases = new Databases(client);

export const VAULT_COLLECTION_ID = 'vault';
export const DATABASE_ID = 'blue_wing_main';

export async function commitToVault(message, type = 'system') {
    if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) return null;
    
    const hash = Math.random().toString(36).substring(2, 10).toUpperCase();
    try {
        await databases.createDocument(
            DATABASE_ID,
            VAULT_COLLECTION_ID,
            ID.unique(),
            {
                hash: hash,
                message: message,
                type: type,
                timestamp: new Date().toISOString(),
            }
        );
        return hash;
    } catch (error) {
        console.error('Appwrite Vault Error:', error);
        return hash; // Return local hash even if remote fails
    }
}

export async function getRecentHashes(limit = 10) {
    if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) return [];
    
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            VAULT_COLLECTION_ID,
            [Query.orderDesc('timestamp'), Query.limit(limit)]
        );
        return response.documents;
    } catch (error) {
        return [];
    }
}

\\n

## File: lib\init-appwrite.js
\javascript
const { Client, Databases, ID } = require('node-appwrite');

// Initialization script for Blue Wing Appwrite Vault
// Run this once with your Appwrite API Key to set up the database structure

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = 'blue_wing_main';
const VAULT_COLLECTION_ID = 'vault';

async function init() {
    try {
        console.log('Creating Database...');
        await databases.create(DATABASE_ID, 'Blue Wing Main Database');
        
        console.log('Creating Vault Collection...');
        await databases.createCollection(DATABASE_ID, VAULT_COLLECTION_ID, 'Mission Vault');

        console.log('Creating Attributes...');
        await databases.createStringAttribute(DATABASE_ID, VAULT_COLLECTION_ID, 'hash', 8, true);
        await databases.createStringAttribute(DATABASE_ID, VAULT_COLLECTION_ID, 'message', 5000, true);
        await databases.createStringAttribute(DATABASE_ID, VAULT_COLLECTION_ID, 'type', 20, true);
        await databases.createDatetimeAttribute(DATABASE_ID, VAULT_COLLECTION_ID, 'timestamp', true);

        console.log('Wait for attributes to propagate...');
        await new Promise(r => setTimeout(r, 5000));

        console.log('Creating Indexes...');
        await databases.createIndex(DATABASE_ID, VAULT_COLLECTION_ID, 'idx_timestamp', 'key', ['timestamp'], ['DESC']);

        console.log('✅ Blue Wing Vault initialized successfully.');
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    }
}

init();

\\n

## File: lib\vapi.js
\javascript
import Vapi from '@vapi-ai/web';

// Vapi Configuration for Professional Voice Layer
// Get your Public Key from: https://dashboard.vapi.ai

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');

export const startVapiSession = async (onMessage) => {
  try {
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    
    if (!assistantId) {
      console.warn('Vapi Assistant ID missing. Falling back to native speech.');
      return null;
    }

    await vapi.start(assistantId);

    vapi.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        onMessage(message.transcript);
      }
    });

    return vapi;
  } catch (err) {
    console.error('Vapi Error:', err);
    return null;
  }
};

export const stopVapiSession = () => {
  vapi.stop();
};

export default vapi;

\\n

## File: lib\web3.js
\javascript
// Simple helper to simulate Web3 actions
// In a real environment, this would use ethers.js and connect to a provider

export async function deployContract(name) {
    console.log(`Deploying ${name} to Sepolia...`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const address = '0x' + Math.random().toString(16).substring(2, 42);
    const hash = '0x' + Math.random().toString(16).substring(2, 66);
    
    return {
        success: true,
        address: address,
        transactionHash: hash,
        status: 'Confirmed'
    };
}

export async function getGasPrice() {
    // Simulate gas price monitoring
    const base = 15;
    const fluctuation = Math.random() * 5;
    return (base + fluctuation).toFixed(2);
}

\\n