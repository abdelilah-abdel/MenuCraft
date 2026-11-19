import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const CHROME = '/Users/abdelilahaithamou/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const files = process.argv.slice(2);
const port = 9816;
const chrome = spawn(CHROME, ['--headless=new','--disable-gpu',`--remote-debugging-port=${port}`,'--no-first-run','about:blank'], { stdio: 'ignore' });
for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); if (r.ok) break; } catch {} await sleep(250); }
const t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const pending = new Map();
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); } };
const send = (method, params = {}) => { const i = ++id; ws.send(JSON.stringify({ id: i, method, params })); return new Promise((resolve, reject) => pending.set(i, { resolve, reject })); };
await send('Page.enable'); await send('Runtime.enable');
const imgs = files.map(f => readFileSync(f).toString('base64'));
const { result, exceptionDetails } = await send('Runtime.evaluate', { expression: `
  Promise.all(${JSON.stringify(imgs)}.map(src => new Promise((res, rej) => {
    const i = new Image(); i.onload = () => res(i); i.onerror = rej;
    i.src = 'data:image/png;base64,' + src;
  }))).then(list => {
    const w = 1440, gap = 12;
    const h = list.reduce((a, i) => a + i.height, 0) + gap * (list.length - 1);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#C4311F'; ctx.fillRect(0, 0, w, h);
    let y = 0;
    list.forEach(i => { ctx.drawImage(i, 0, y, w, i.height); y += i.height + gap; });
    return c.toDataURL('image/png').split(',')[1];
  })`, awaitPromise: true, returnByValue: true });
if (exceptionDetails) { console.error(exceptionDetails.text); process.exit(1); }
writeFileSync('sheet-sections.png', Buffer.from(result.value, 'base64'));
console.log('wrote sheet-sections.png');
ws.close(); chrome.kill(); process.exit(0);
