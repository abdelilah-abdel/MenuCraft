// Check each direction at 375px and 1440px for horizontal overflow + console errors.
import { spawn } from 'node:child_process';

const CHROME = '/Users/abdelilahaithamou/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const port = 9800 + Math.floor(Math.random() * 100);
const chrome = spawn(CHROME, ['--headless=new','--disable-gpu',`--remote-debugging-port=${port}`,'--no-first-run','about:blank'], { stdio: 'ignore' });

for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); if (r.ok) break; } catch {} await sleep(250); }

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

await send('Runtime.enable'); await send('Page.enable');

const dirs = ['a-garage', 'b-wall', 'c-shopfloor'];
for (const width of [375, 1440]) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 500 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const d of dirs) {
    errors.length = 0;
    await send('Page.navigate', { url: `file://${process.cwd()}/../${d}/index.html` });
    await sleep(3000);
    const { result } = await send('Runtime.evaluate', { expression: `JSON.stringify({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      fontLoaded: document.fonts.check('16px Bricolage'),
      sections: document.querySelectorAll('section, footer.closing').length,
      h1: document.querySelector('h1')?.innerText.slice(0, 40),
      wordmarkVisible: (() => { const s = document.querySelector('.wordmark span'); if (!s) return null; const r = s.getBoundingClientRect(); return r.top < window.innerHeight * 30; })(),
      emptyText: [...document.querySelectorAll('h1,h2,h3')].filter(e => !e.innerText.trim()).length
    })`, returnByValue: true });
    const info = JSON.parse(result.value);
    console.log(`${d} @${width}: overflow=${info.overflow}px font=${info.fontLoaded} sections=${info.sections} emptyHeadings=${info.emptyText} errors=${errors.length ? errors.join('|') : 'none'}`);
    if (errors.length) console.log('   ', errors.slice(0, 3).join(' | '));
  }
}
ws.close(); chrome.kill(); process.exit(0);
