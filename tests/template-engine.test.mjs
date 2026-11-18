import assert from 'node:assert/strict';
import { mkdtemp, rm, symlink } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

let outputDirectory;
let config;
let rendering;

before(async () => {
  outputDirectory = await mkdtemp(path.join(os.tmpdir(), 'menucraft-template-engine-'));
  const program = ts.createProgram(['lib/templates/config.ts', 'lib/templates/index.tsx'], {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
    skipLibCheck: true,
    rootDir: process.cwd(),
    outDir: outputDirectory,
  });
  assert.equal(program.emit().emitSkipped, false);
  await symlink(path.join(process.cwd(), 'node_modules'), path.join(outputDirectory, 'node_modules'), 'dir');
  const require = createRequire(import.meta.url);
  config = require(path.join(outputDirectory, 'lib/templates/config.js'));
  rendering = require(path.join(outputDirectory, 'lib/templates/index.js'));
});

after(async () => {
  if (outputDirectory) await rm(outputDirectory, { recursive: true, force: true });
});

const menu = {
  id: 'menu-existing-public-id',
  restaurantName: 'Atlas Kitchen',
  originalLanguage: 'fr',
  description: 'Seasonal plates',
  template: 'atlas-simple',
  sections: [
    {
      id: 'lunch',
      name: 'Lunch',
      order: 0,
      subsections: [{ id: 'tagines', name: 'Tagines', order: 0 }],
      items: [
        {
          id: 'dish',
          subsectionId: 'tagines',
          name: 'Vegetable tagine',
          price: 72,
          currency: 'MAD',
          available: true,
        },
      ],
    },
  ],
  customization: {
    primaryColor: '#123456',
    secondaryColor: '#654321',
    fontFamily: 'Georgia, serif',
    showPrices: true,
    showDescriptions: true,
    showImages: false,
  },
  createdAt: '2026-11-17T12:00:00.000Z',
  updatedAt: '2026-11-17T12:00:00.000Z',
};

test('one template definition makes a new preset discoverable and renders its own composition', () => {
  const registry = config.defineTemplateRegistry({
    ...config.TEMPLATE_CONFIGS,
    'fixture-noir': {
      ...config.TEMPLATE_CONFIGS['atlas-simple'],
      id: 'fixture-noir',
      name: 'Fixture Noir',
      category: 'Café',
      theme: { ...config.TEMPLATE_CONFIGS['atlas-simple'].theme, backgroundColor: '#010203' },
      composition: ['menu-sections', 'restaurant-header'],
    },
  });
  const options = config.getTemplateOptions(registry);
  assert.equal(options.length, 8);
  assert.equal(options.find((option) => option.id === 'fixture-noir').name, 'Fixture Noir');
  assert.equal(options.find((option) => option.id === 'fixture-noir').category, 'Café');
  const Template = rendering.getTemplate('fixture-noir', registry);
  const html = renderToStaticMarkup(
    React.createElement(Template, { menu: { ...menu, template: 'fixture-noir' } })
  );
  assert.match(html, /background:#010203/);
  assert.match(html, /Vegetable tagine/);
  assert.match(html, /MAD 72\.00/);
  assert.match(html, /Tagines/);
  assert.ok(
    html.indexOf('Vegetable tagine') < html.indexOf('Atlas Kitchen'),
    'block order follows the new composition'
  );
});

test('invalid definitions and block or renderer references are rejected at registration', () => {
  const atlas = config.TEMPLATE_CONFIGS['atlas-simple'];
  const invalidDefinitions = [
    { ...atlas, id: 'different-id' },
    { ...atlas, theme: {} },
    { ...atlas, formats: ['UNKNOWN'] },
    { ...atlas, layout: { ...atlas.layout, columns: 9 } },
    { ...atlas, composition: ['restaurant-header', 'unregistered-block'] },
    { ...atlas, composition: ['restaurant-header', 'restaurant-header'] },
    { ...atlas, composition: undefined },
    { ...atlas, renderer: 'unregistered-renderer' },
    { ...atlas, renderer: 'legacy', composition: undefined, legacyRenderer: 'unregistered-renderer' },
  ];
  for (const definition of invalidDefinitions) {
    assert.throws(() => config.defineTemplateRegistry({ 'atlas-simple': definition }), /Invalid template/);
  }
  assert.throws(() => config.defineTemplateRegistry({}), /cannot be empty/);
});

test('all seven existing IDs render the supplied menu without changing its data', () => {
  const original = structuredClone(menu);
  const ids = [
    'classic',
    'modern',
    'minimal',
    'medina-cafe',
    'moroccan-fine-dining',
    'modern-moroccan-garden',
    'atlas-simple',
  ];
  assert.deepEqual(
    config.getTemplateOptions(config.TEMPLATE_CONFIGS).map((entry) => entry.id),
    ids
  );
  for (const template of ids) {
    const Template = rendering.getTemplate(template);
    const html = renderToStaticMarkup(React.createElement(Template, { menu }));
    for (const text of ['Atlas Kitchen', 'Lunch', 'Tagines', 'Vegetable tagine', 'MAD 72.00'])
      assert.ok(html.includes(text), `${template}: ${text}`);
    assert.match(html, /lang="fr"/);
  }
  assert.deepEqual(menu, original);
});

test('unknown template IDs render a clear error instead of a substitute design', () => {
  assert.throws(() => rendering.getTemplate('missing-template'), /Unknown menu template/);
  assert.throws(() => config.getTemplateConfig('constructor'), /Unknown menu template/);
  const html = renderToStaticMarkup(
    React.createElement(rendering.MenuTemplate, { menu: { ...menu, template: 'missing-template' } })
  );
  assert.match(html, /role="alert"/);
  assert.match(html, /design is unavailable/);
  assert.doesNotMatch(html, /Vegetable tagine/);
});
