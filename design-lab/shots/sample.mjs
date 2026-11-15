import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
const CHROME = '/Users/abdelilahaithamou/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const port = 9815;
const chrome = spawn(CHROME, ['--headless=new','--disable-gpu',`--remote-debugging-port=${port}`,'--no-first-run','about:blank'], { stdio: 'ignore' });
for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); if (r.ok) break; } catch {} await sleep(250); }
const t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const pending = new Map();
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); } };
const send = (method, params = {}) => { const i = ++id; ws.send(JSON.stringify({ id: i, method, params })); return new Promise((resolve, reject) => pending.set(i, { resolve, reject })); };
await send('Page.enable'); await send('Runtime.enable');
for (const f of process.argv.slice(2)) {
  const b64 = readFileSync(f).toString('base64');
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression: `
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const pts = [[720,10],[720,Math.floor(img.height/2)],[100,Math.floor(img.height*0.75)],[720,img.height-10]];
        const px = pts.map(([x,y]) => { const d = ctx.getImageData(x,y,1,1).data; return [d[0],d[1],d[2]]; });
        resolve(JSON.stringify({ h: img.height, px }));
      };
      img.onerror = () => resolve('ERR');
      img.src = 'data:image/png;base64,${b64}';
    })`, awaitPromise: true, returnByValue: true });
  console.log(f, result.value);
}
ws.close(); chrome.kill(); process.exit(0);
