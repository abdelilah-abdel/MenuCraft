import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const CHROME = '/Users/abdelilahaithamou/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const [src, ...cuts] = process.argv.slice(2); // cuts: name:y:h pairs
const port = 9814;
const chrome = spawn(CHROME, ['--headless=new','--disable-gpu',`--remote-debugging-port=${port}`,'--no-first-run','about:blank'], { stdio: 'ignore' });
for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); if (r.ok) break; } catch {} await sleep(250); }
const t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const pending = new Map();
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); } };
const send = (method, params = {}) => { const i = ++id; ws.send(JSON.stringify({ id: i, method, params })); return new Promise((resolve, reject) => pending.set(i, { resolve, reject })); };
await send('Page.enable'); await send('Runtime.enable');
const b64 = readFileSync(src).toString('base64');
await send('Page.navigate', { url: 'about:blank' });
await sleep(300);
for (const cut of cuts) {
  const [name, yStr, hStr] = cut.split(':');
  const y = Number(yStr), h = Number(hStr);
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression: `
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = ${Math.min(1440, 1440)}; c.height = ${h};
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, ${y}, 1440, ${h}, 0, 0, 1440, ${h});
        resolve(c.toDataURL('image/png').split(',')[1]);
      };
      img.onerror = () => reject(new Error('img load failed'));
      img.src = 'data:image/png;base64,' + '${b64}';
    })`, awaitPromise: true, returnByValue: true });
  if (exceptionDetails) { console.error('crop fail', name, exceptionDetails.text); continue; }
  writeFileSync(`sec-${name}.png`, Buffer.from(result.value, 'base64'));
  console.log('wrote sec-' + name + '.png');
}
ws.close(); chrome.kill(); process.exit(0);
