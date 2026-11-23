import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { webcrypto } from 'node:crypto';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = readFileSync(new URL('../components/builder/prototype/canvasData.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const exports = {};
runInNewContext(compiled, {
  exports,
  crypto: webcrypto,
  require(specifier) {
    assert.equal(specifier, './compositionData');
    return { makeSample: () => Array.from({ length: 7 }, (_, i) => ({ id: String(i), name: 'Dish ' + i })) };
  },
});

for (const starter of ['cafe-forest', 'cafe-rose']) {
  test(starter + ' title and tagline have vertical clearance', () => {
    const doc = exports.makeCanvas(starter);
    const title = doc.elements.find(node => node.name === 'Menu title');
    const tagline = doc.elements.find(node => node.name === 'Tagline');
    const rule = doc.elements.find(node => node.name === 'Header rule');
    assert.ok(title && tagline && rule);
    assert.ok(tagline.y >= title.y + title.h + 12, 'tagline must clear title box by at least 12px');
    assert.ok(tagline.y + tagline.h <= rule.y, 'tagline must remain above the header rule');
  });
}
