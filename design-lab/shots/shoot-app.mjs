// Screenshot the running app (localhost) at 1440 + 375, reduced-motion final
// states, plus a motion hero. For /builder it registers an account first.
// Usage: node shoot-app.mjs <path> <prefix> [--auth]
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const CHROME = '/Users/abdelilahaithamou/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const [path, prefix, flag] = process.argv.slice(2);
const auth = flag === '--auth';
const BASE = 'http://127.0.0.1:3000';
const url = BASE + path;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const port = 9500 + Math.floor(Math.random() * 300);

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${port}`, '--no-first-run', '--no-default-browser-check',
  '--window-size=1440,900', 'about:blank',
], { stdio: 'ignore' });

for (let i = 0; i < 60; i++) {
  try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); if (r.ok) break; } catch {}
  await sleep(250);
}
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let id = 0; const pending = new Map(); const errors = [];
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value || a.description).join(' '));
  if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); }
};
const send = (method, params = {}) => { const i = ++id; ws.send(JSON.stringify({ id: i, method, params })); return new Promise((resolve, reject) => pending.set(i, { resolve, reject })); };
const evaluate = async (expression) => {
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (exceptionDetails) throw new Error(exceptionDetails.text);
  return result.value;
};

await send('Runtime.enable'); await send('Page.enable');

if (auth) {
  const email = `shot-${Date.now()}@menucraft.test`;
  const out = await evaluate(`fetch('${BASE}/api/auth/register', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email:'${email}', password:'screenshot-pass-123'})}).then(r => r.status)`);
  console.log('register status:', out);
}

async function shoot(width, height, suffix, useReduce) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
  if (useReduce) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  else await send('Emulation.setEmulatedMedia', { features: [] });
  await send('Page.navigate', { url });
  await sleep(useReduce ? 3500 : 6500);
  const loc = await evaluate('location.pathname');
  if (loc !== path.split('?')[0]) throw new Error(`WRONG PAGE: landed on ${loc}, wanted ${path}`);
  if (suffix === 'hero') {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`${prefix}-${suffix}.png`, Buffer.from(data, 'base64'));
    console.log(`wrote ${prefix}-${suffix}.png (viewport ${width}x${height})`);
    return;
  }
  const h = await evaluate('Math.min(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), 20000)');
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: h, scale: 1 } });
  writeFileSync(`${prefix}-${suffix}.png`, Buffer.from(data, 'base64'));
  console.log(`wrote ${prefix}-${suffix}.png (${width}x${h})`);
}

await shoot(1440, 900, 'full', true);
await shoot(375, 800, 'mobile', true);
await shoot(1440, 900, 'hero', false);
if (errors.length) console.log('CONSOLE ERRORS:', errors.slice(0, 5).join(' | '));
else console.log('no console errors');

ws.close(); chrome.kill(); process.exit(0);
