// Minimal CDP driver: full-page screenshots at 1440 and 375, optional reduced motion.
// Usage: node shoot.mjs <url> <outPrefix> [--reduce]
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const CHROME = '/Users/abdelilahaithamou/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const [url, outPrefix, flag] = process.argv.slice(2);
const reduce = flag === '--reduce';
const port = 9333 + Math.floor(Math.random() * 500);

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${port}`, '--no-first-run', '--no-default-browser-check',
  '--window-size=1440,900', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function waitForChrome() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return await res.json();
    } catch {}
    await sleep(250);
  }
  throw new Error('chrome did not start');
}

await waitForChrome();
// create a page target and attach to *its* websocket (browser-level WS has no page domains)
const targetRes = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
const target = await targetRes.json();
await sleep(500);
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let id = 0;
const pending = new Map();
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  }
};
function send(method, params = {}) {
  const mid = ++id;
  ws.send(JSON.stringify({ id: mid, method, params }));
  return new Promise((resolve, reject) => pending.set(mid, { resolve, reject }));
}

async function shoot(width, height, suffix, useReduce) {
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: width < 500,
  });
  if (useReduce) {
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });
  }
  const nav = await send('Page.navigate', { url });
  if (nav.errorText) throw new Error('navigate failed: ' + nav.errorText);
  // wait for the load event, then settle
  await new Promise((resolve) => {
    const handler = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.method === 'Page.loadEventFired') { ws.removeEventListener('message', handler); resolve(); }
    };
    ws.addEventListener('message', handler);
    setTimeout(resolve, 8000);
  });
  await sleep(1500);
  const { result } = await send('Runtime.evaluate', {
    expression: 'JSON.stringify({t: document.title, h: location.href})',
    returnByValue: true,
  });
  const info = JSON.parse(result.value);
  if (!info.h.includes(outPrefix)) throw new Error(`WRONG PAGE: shot ${info.h} for ${outPrefix}`);
  console.log('capturing', outPrefix, '←', info.t);
  const { data } = await send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height: await pageHeight(width), scale: 1 },
  });
  const path = `${outPrefix}-${suffix}.png`;
  writeFileSync(path, Buffer.from(data, 'base64'));
  console.log('wrote', path);
}

async function pageHeight(width) {
  const { result } = await send('Runtime.evaluate', {
    expression: 'Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)',
    returnByValue: true,
  });
  return Math.min(result.value, 20000);
}

// desktop + mobile, reduced motion (final states) — honest layout review
await shoot(1440, 900, 'full', true);
await shoot(375, 800, 'mobile', true);
// desktop with motion enabled at the top of the page (hero as a visitor sees it)
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Emulation.setEmulatedMedia', { features: [] });
await send('Page.navigate', { url });
await sleep(6000); // GSAP intro finishes
const { result: heroInfo } = await send('Runtime.evaluate', {
  expression: 'location.href', returnByValue: true,
});
if (!heroInfo.value.includes(outPrefix)) throw new Error(`WRONG PAGE (hero): ${heroInfo.value}`);
const { data } = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(`${outPrefix}-hero.png`, Buffer.from(data, 'base64'));
console.log('wrote', `${outPrefix}-hero.png`);

ws.close();
chrome.kill();
process.exit(0);
