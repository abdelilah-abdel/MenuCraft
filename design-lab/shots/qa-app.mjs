import { spawn } from 'node:child_process';
const CHROME = '/Users/abdelilahaithamou/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const BASE = 'http://127.0.0.1:3000';
const port = 9821;
const chrome = spawn(CHROME, ['--headless=new','--disable-gpu',`--remote-debugging-port=${port}`,'--no-first-run','about:blank'], { stdio: 'ignore' });
for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); if (r.ok) break; } catch {} await sleep(250); }
const t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const pending = new Map(); const errors = [];
ws.onmessage = (ev) => { const m = JSON.parse(ev.data);
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value || a.description || '').join(' ').slice(0, 120));
  if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); } };
const send = (method, params = {}) => { const i = ++id; ws.send(JSON.stringify({ id: i, method, params })); return new Promise((resolve, reject) => pending.set(i, { resolve, reject })); };
const ev = async (expr) => { const { result, exceptionDetails } = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (exceptionDetails) throw new Error(exceptionDetails.text); return result.value; };
await send('Runtime.enable'); await send('Page.enable');

// account + a saved menu for builder/menu views (fetch must run from the app origin)
await send('Page.navigate', { url: BASE + '/' });
await sleep(2500);
const email = `qa-${Date.now()}@menucraft.test`;
console.log('register:', await ev(`fetch('${BASE}/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'${email}',password:'qa-password-123'})}).then(r=>r.status)`));
console.log('save menu:', await ev(`fetch('${BASE}/api/menus/current',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
  id:'menu-qa-1', restaurantName:'Casa Medina', description:'QA fixture',
  template:'classic', sections:[{id:'s1',name:'Starters',order:0,items:[{id:'i1',name:'Harira',price:45,currency:'MAD',available:true}]}],
  customization:{primaryColor:'#17140F',secondaryColor:'#C4311F',fontFamily:'Bricolage',showPrices:true,showDescriptions:true,showImages:true}
})}).then(r=>r.status)`));

for (const [path, name] of [['/','landing'],['/sign-in','sign-in'],['/sign-up','sign-up'],['/builder','builder'],['/menu/menu-qa-1','menu']]) {
  for (const width of [375, 1440]) {
    errors.length = 0;
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 500 });
    await send('Page.navigate', { url: BASE + path });
    await sleep(3000);
    const info = JSON.parse(await ev(`JSON.stringify({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      font: document.fonts.check('16px Bricolage Grotesque'),
      h1: (document.querySelector('h1,h2')?.innerText || '').replace(/\\n/g,' ').slice(0, 45),
      emptyHeads: [...document.querySelectorAll('h1,h2,h3')].filter(e => !e.innerText.trim()).length,
      bg: getComputedStyle(document.body).backgroundColor
    })`));
    const err = errors.filter(e => !/hydrat/i.test(e));
    console.log(`${name} @${width}: overflow=${info.overflow} font=${info.font} bg=${info.bg} emptyHeads=${info.emptyHeads} errors=${err.length ? err.slice(0,2).join(' | ') : 'none'} h1="${info.h1}"`);
  }
}
ws.close(); chrome.kill(); process.exit(0);
