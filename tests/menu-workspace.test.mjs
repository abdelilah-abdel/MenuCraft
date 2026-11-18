import assert from 'node:assert/strict';
import { after, afterEach, before, beforeEach, test } from 'node:test';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';
import { compileTypeScript } from './helpers/compile-typescript.mjs';

let compiled, MenuWorkspace, root, container, dom, createRoot;
const initialMenu = {
  id: 'published-menu',
  ownerId: 'owner',
  restaurantName: 'Atlas Kitchen',
  originalLanguage: 'en',
  template: 'classic',
  description: 'Seasonal plates',
  sections: [
    {
      id: 'dinner',
      name: 'Dinner',
      order: 0,
      subsections: [{ id: 'tagines', name: 'Tagines', order: 0 }],
      items: [
        {
          id: 'vegetable',
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
    showImages: false,
    showPrices: true,
    showDescriptions: true,
  },
  createdAt: '2026-11-17T12:00:00.000Z',
  updatedAt: '2026-11-17T12:00:00.000Z',
};

before(async () => {
  dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/builder' });
  for (const key of [
    'window',
    'document',
    'HTMLElement',
    'HTMLInputElement',
    'HTMLTextAreaElement',
    'Node',
    'Event',
    'MouseEvent',
    'FileReader',
  ]) {
    globalThis[key] = dom.window[key];
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.ResizeObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {
      this.callback([{ contentRect: { width: 900, height: 600 } }]);
    }
    disconnect() {}
  };
  window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
  ({ createRoot } = await import('react-dom/client'));
  compiled = await compileTypeScript(['components/builder/MenuWorkspace.tsx']);
  ({ MenuWorkspace } = compiled.load('components/builder/MenuWorkspace.tsx'));
});

beforeEach(() => {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
});
after(async () => {
  await compiled?.dispose();
  dom?.window.close();
});

function button(name) {
  const result = [...container.querySelectorAll('button')].find(
    (element) => (element.getAttribute('aria-label') || element.textContent).trim() === name
  );
  assert.ok(result, `Button "${name}" is available`);
  return result;
}
async function click(name) {
  await act(async () => {
    button(name).click();
  });
}
function field(name) {
  const label = [...container.querySelectorAll('label')].find(
    (element) => element.textContent.trim() === name
  );
  assert.ok(label, `Field "${name}" is available`);
  return document.getElementById(label.htmlFor);
}
async function fill(name, value) {
  const input = field(name);
  await act(() => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, value);
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
  });
}
async function mount(saveMenu = async (menu) => menu, menu = initialMenu) {
  await act(() =>
    root.render(
      React.createElement(MenuWorkspace, {
        initialMenu: structuredClone(menu),
        initiallyPublished: true,
        saveMenu,
      })
    )
  );
}

test('focused editing survives Customize and Done without publishing and keeps undo history', async () => {
  let saves = 0;
  await mount(async (menu) => {
    saves++;
    return menu;
  });
  await click('Expand Dinner');
  await click('Edit Vegetable tagine');
  await fill('Price', '95');
  assert.match(container.querySelector('[aria-label="Live menu preview"]').textContent, /MAD 95\.00/);
  await click('Customize');
  await click('Content');
  assert.equal(field('Price').value, '95');
  await click('Done');
  assert.equal(document.activeElement, button('Edit Vegetable tagine'));
  await click('Edit Vegetable tagine');
  assert.equal(field('Price').value, '95');
  assert.equal(saves, 0, 'editing views do not publish');
  await click('Undo menu change');
  assert.equal(field('Price').value, '72');
});

test('a failed save keeps the focused edits and can be retried successfully', async () => {
  const submissions = [];
  await mount(async (menu) => {
    submissions.push(structuredClone(menu));
    if (submissions.length === 1) throw new Error('Connection unavailable.');
    return { ...menu, updatedAt: '2026-11-18T12:00:00.000Z' };
  });
  await click('Expand Dinner');
  await click('Edit Vegetable tagine');
  await fill('Price', '95');
  await click('Save menu');
  assert.match(container.querySelector('[role="alert"]').textContent, /Connection unavailable/);
  assert.equal(field('Price').value, '95');
  assert.match(container.querySelector('[role="status"]').textContent, /Save failed/);
  await click('Retry save');
  assert.equal(submissions.length, 2);
  assert.equal(submissions[1].sections[0].items[0].price, 95);
  assert.equal(container.querySelector('[role="alert"]'), null);
  assert.equal(container.querySelector('[role="status"]').textContent, 'Saved');
  assert.equal(button('Save menu').disabled, true);
  await click('Undo menu change');
  assert.equal(field('Price').value, '72');
  assert.equal(container.querySelector('[role="status"]').textContent, 'Unsaved changes');
});

test('editing during an in-flight save preserves the newer version and reports it as unsaved', async () => {
  let finishSave;
  const submissions = [];
  await mount((menu) => {
    submissions.push(structuredClone(menu));
    return new Promise((resolve) => {
      finishSave = () => resolve({ ...menu, id: 'canonical-menu-id', updatedAt: '2026-11-18T12:00:00.000Z' });
    });
  });
  await click('Expand Dinner');
  await click('Edit Vegetable tagine');
  await fill('Price', '95');
  await click('Save menu');
  assert.equal(container.querySelector('[role="status"]').textContent, 'Saving…');
  assert.equal(button('Saving…').disabled, true);
  await fill('Price', '105');
  await act(async () => finishSave());
  assert.equal(submissions[0].sections[0].items[0].price, 95);
  assert.equal(field('Price').value, '105');
  assert.equal(container.querySelector('[role="status"]').textContent, 'Unsaved changes');
  assert.equal(button('Save menu').disabled, false);
  assert.equal(
    container.querySelector('a[href="/menu/canonical-menu-id"]').getAttribute('aria-label'),
    'View live menu'
  );
  await click('Done');
  await click('Edit Vegetable tagine');
  assert.equal(field('Price').value, '105');
});

test('preview zoom changes only the view and a new dish opens in its focused form', async () => {
  let saves = 0;
  await mount(async (menu) => {
    saves++;
    return menu;
  });
  const zoom = field('Zoom');
  await act(() => {
    zoom.value = '0.5';
    zoom.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
  assert.equal(zoom.value, '0.5');
  assert.equal(container.querySelector('[role="status"]').textContent, 'Saved');
  await click('Expand Dinner');
  await click('+ Add dish');
  assert.equal(field('Item Name').value, 'New Item');
  await fill('Item Name', 'Mint tea');
  await click('Done');
  assert.ok(button('Edit Mint tea'));
  assert.equal(saves, 0);
});

test('movement follows the visible subsection order even when stored dishes are interleaved', async () => {
  const menu = structuredClone(initialMenu);
  menu.sections[0].subsections.push({ id: 'drinks', name: 'Drinks', order: 1 });
  menu.sections[0].items.push(
    { id: 'tea', subsectionId: 'drinks', name: 'Mint tea', price: 20, currency: 'MAD', available: true },
    {
      id: 'chicken',
      subsectionId: 'tagines',
      name: 'Chicken tagine',
      price: 90,
      currency: 'MAD',
      available: true,
    }
  );
  await mount(async (value) => value, menu);
  await click('Expand Dinner');
  await click('Move Vegetable tagine down');
  const preview = container.querySelector('[aria-label="Live menu preview"]').textContent;
  assert.ok(preview.indexOf('Chicken tagine') < preview.indexOf('Vegetable tagine'));
  assert.equal(button('Move Vegetable tagine down').disabled, true);
  await click('Undo menu change');
  const restored = container.querySelector('[aria-label="Live menu preview"]').textContent;
  assert.ok(restored.indexOf('Vegetable tagine') < restored.indexOf('Chicken tagine'));
});

test('moving the focused dish follows its destination and deletion restores a surviving outline target', async () => {
  const menu = structuredClone(initialMenu);
  menu.sections.push({ id: 'lunch', name: 'Lunch', order: 1, items: [] });
  await mount(async (value) => value, menu);
  await click('Expand Dinner');
  await click('Edit Vegetable tagine');
  const destination = field('Move Vegetable tagine to section');
  await act(async () => {
    destination.value = 'lunch';
    destination.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
  assert.equal(field('Item Name').value, 'Vegetable tagine');
  assert.equal(field('Move Vegetable tagine to section').value, 'lunch');
  await click('Delete Vegetable tagine');
  assert.equal(document.activeElement, button('Edit section Lunch'));
  await click('Undo menu change');
  assert.ok(button('Edit Vegetable tagine'));
});

test('dropping a dish onto another subsection follows the visible destination as one undoable edit', async () => {
  const menu = structuredClone(initialMenu);
  menu.sections[0].subsections.push({ id: 'drinks', name: 'Drinks', order: 1 });
  menu.sections[0].items.push({
    id: 'tea',
    subsectionId: 'drinks',
    name: 'Mint tea',
    price: 20,
    currency: 'MAD',
    available: true,
  });
  await mount(async (value) => value, menu);
  await click('Expand Dinner');
  const data = new Map();
  const transfer = {
    setData: (key, value) => data.set(key, value),
    getData: (key) => data.get(key) || '',
    effectAllowed: '',
  };
  await act(async () => {
    const start = new window.Event('dragstart', { bubbles: true });
    Object.defineProperty(start, 'dataTransfer', { value: transfer });
    button('Drag Vegetable tagine to reorder').dispatchEvent(start);
    const drop = new window.Event('drop', { bubbles: true });
    Object.defineProperty(drop, 'dataTransfer', { value: transfer });
    Object.defineProperty(drop, 'clientY', { value: -1 });
    button('Edit Mint tea').closest('li').dispatchEvent(drop);
  });
  const preview = container.querySelector('[aria-label="Live menu preview"]').textContent;
  assert.ok(preview.indexOf('Drinks') < preview.indexOf('Vegetable tagine'));
  assert.ok(preview.indexOf('Vegetable tagine') < preview.indexOf('Mint tea'));
  await click('Undo menu change');
  const restored = container.querySelector('[aria-label="Live menu preview"]').textContent;
  assert.ok(restored.indexOf('Vegetable tagine') < restored.indexOf('Drinks'));
});

test('preview dish selection uses menu identities across duplicate names, rename, and reorder', async () => {
  const menu = structuredClone(initialMenu);
  menu.sections.push({
    id: 'lunch',
    name: 'Lunch',
    order: 1,
    items: [
      { id: 'lunch-vegetable', name: 'Vegetable tagine', price: 48, currency: 'MAD', available: true },
      { id: 'soup', name: 'Harira', price: 36, currency: 'MAD', available: true },
    ],
  });
  await mount(async (value) => value, menu);
  const dishes = [...container.querySelectorAll('[aria-label="Edit dish Vegetable tagine in preview"]')];
  assert.equal(dishes.length, 2, 'both displayed dishes are independently actionable');
  await act(() => dishes[1].click());
  assert.equal(field('Price').value, '48');
  await fill('Item Name', 'Lunch tagine');
  await click('Move Lunch tagine down');
  const previewText = container.querySelector('[aria-label="Live menu preview"]').textContent;
  assert.ok(previewText.indexOf('Harira') < previewText.indexOf('Lunch tagine'));
  await click('Done');
  const renamed = container.querySelector('[aria-label="Edit dish Lunch tagine in preview"]');
  assert.ok(renamed);
  await act(() => renamed.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
  assert.equal(field('Price').value, '48');
  assert.equal(container.querySelector('[role="status"]').textContent, 'Unsaved changes');
  await click('Undo menu change');
  await click('Undo menu change');
  assert.equal(field('Item Name').value, 'Vegetable tagine');
});

for (const template of ['classic', 'modern', 'minimal', 'medina-cafe', 'moroccan-fine-dining', 'modern-moroccan-garden', 'atlas-simple']) {
  test(`${template} preview targets open the matching dish`, async () => {
    const menu = structuredClone(initialMenu);
    menu.template = template;
    await mount(async (value) => value, menu);
    const dish = container.querySelector('[aria-label="Edit dish Vegetable tagine in preview"]');
    assert.ok(dish);
    await act(() => dish.click());
    assert.equal(field('Item Name').value, 'Vegetable tagine');
    assert.equal(dish.getAttribute('data-preview-selected'), 'true');
  });
}

test('preview headings and photos are keyboard actionable without changing publication or history', async () => {
  const menu = structuredClone(initialMenu);
  menu.customization.showImages = true;
  menu.customization.logoImage = 'data:image/png;base64,aGVsbG8=';
  menu.sections[0].items[0].image = 'data:image/png;base64,aGVsbG8=';
  let saves = 0;
  await mount(async (value) => {
    saves++;
    return value;
  }, menu);
  const sectionHeading = container.querySelector('[aria-label="Edit section Dinner in preview"]');
  assert.equal(sectionHeading.getAttribute('tabindex'), '0');
  assert.equal(sectionHeading.closest('h2')?.getAttribute('aria-label'), 'Dinner', 'section remains a named heading');
  assert.equal(sectionHeading.closest('h2')?.getAttribute('role'), null);
  await act(() => sectionHeading.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
  assert.equal(field('Section Name *').value, 'Dinner');
  const photo = container.querySelector('[aria-label="Edit photo for Vegetable tagine in preview"]');
  await act(() => photo.dispatchEvent(new window.KeyboardEvent('keydown', { key: ' ', bubbles: true })));
  assert.equal(field('Item Name').value, 'Vegetable tagine');
  assert.equal(document.activeElement.getAttribute('data-editor-image-control'), 'item');
  const logo = container.querySelector('[aria-label="Edit restaurant logo in preview"]');
  await act(() => logo.click());
  assert.equal(document.activeElement.getAttribute('data-editor-image-control'), 'restaurant');
  assert.equal(container.querySelector('[role="status"]').textContent, 'Saved');
  assert.equal(button('Undo menu change').disabled, true);
  assert.equal(saves, 0);
});

test('removing a preview-selected dish clears its marker and leaves a usable editor target', async () => {
  await mount();
  const dish = container.querySelector('[aria-label="Edit dish Vegetable tagine in preview"]');
  await act(() => dish.click());
  assert.equal(dish.getAttribute('data-preview-selected'), 'true');
  await click('Delete Vegetable tagine');
  assert.equal(container.querySelector('[data-preview-selected="true"]'), null);
  assert.equal(document.activeElement, button('Edit section Dinner'));
  await click('Undo menu change');
  assert.ok(container.querySelector('[aria-label="Edit dish Vegetable tagine in preview"]'));
});

for (const template of ['medina-cafe', 'moroccan-fine-dining', 'modern-moroccan-garden']) {
  test(`${template} hero image opens its source dish photo control`, async () => {
    const menu = structuredClone(initialMenu);
    menu.template = template;
    menu.customization.showImages = true;
    menu.sections[0].items[0].image = 'data:image/png;base64,aGVsbG8=';
    await mount(async (value) => value, menu);
    const hero = container.querySelector('[aria-label="Edit hero photo for Vegetable tagine in preview"]');
    assert.ok(hero, 'visible dish-derived hero image is actionable');
    await act(() => hero.click());
    assert.equal(field('Item Name').value, 'Vegetable tagine');
    assert.equal(document.activeElement.getAttribute('data-editor-image-control'), 'item');
  });
}


test('outline duplicates nested content, hides independently of sold out, and restores removal', async () => {
  let submitted;
  await mount(async value => { submitted = value; return value; });
  await click('Duplicate section Dinner');
  await click('Hide section Dinner (copy)');
  assert.equal(container.querySelectorAll('[aria-label="Edit dish Vegetable tagine in preview"]').length, 1);
  await click('Expand Dinner');
  await click('Edit Vegetable tagine');
  await act(() => [...container.querySelectorAll('label')].find(label => label.textContent.trim() === 'Available').querySelector('input').click());
  assert.match(container.querySelector('[aria-label="Live menu preview"]').textContent, /Sold out/);
  await click('Done');
  await click('Remove section Dinner');
  assert.equal(container.querySelectorAll('[aria-label="Edit dish Vegetable tagine in preview"]').length, 0);
  await click('Undo menu change');
  await click('Save menu');
  const [original, copy] = submitted.sections;
  assert.equal(copy.hidden, true);
  assert.notEqual(copy.id, original.id);
  assert.notEqual(copy.items[0].id, original.items[0].id);
  assert.notEqual(copy.subsections[0].id, original.subsections[0].id);
  assert.equal(copy.items[0].subsectionId, copy.subsections[0].id);
  assert.equal(copy.items[0].available, true);
});


test('dish can move to an empty subsection and empty section without losing its photo', async () => {
  const menu = structuredClone(initialMenu);
  menu.sections[0].items[0].image = 'data:image/png;base64,photo';
  menu.sections.push({ id: 'lunch', name: 'Lunch', order: 1, items: [], subsections: [{ id: 'specials', name: 'Specials', order: 0 }] });
  let saved;
  await mount(async value => { saved = value; return value; }, menu);
  await click('Expand Dinner'); await click('Edit Vegetable tagine');
  const destination = field('Move dish to group');
  await act(() => { destination.value = JSON.stringify(['lunch','specials']); destination.dispatchEvent(new window.Event('change',{bubbles:true})); });
  assert.equal(field('Move dish to group').value, JSON.stringify(['lunch','specials']));
  await click('Save menu');
  assert.equal(saved.sections[1].items[0].subsectionId,'specials');
  assert.equal(saved.sections[1].items[0].image,'data:image/png;base64,photo');
  await click('Undo menu change');
  assert.equal(field('Move dish to group').value,JSON.stringify(['dinner','tagines']));
});


test('dish photo crop and placement are undoable and preserve the source on failed upload', async () => {
  const menu = structuredClone(initialMenu); menu.template = 'atlas-simple'; menu.customization.showImages = true;
  menu.sections[0].items[0].image = 'data:image/png;base64,original';
  let saved;
  await mount(async value => { saved = value; return value; }, menu);
  await click('Expand Dinner'); await click('Edit Vegetable tagine');
  const select = container.querySelector('[aria-label="Dish photo placement"]');
  await act(() => { select.value = 'card-top'; select.dispatchEvent(new window.Event('change',{bubbles:true})); });
  const upload = container.querySelector('[aria-label="Upload dish photo"]');
  await act(async () => { Object.defineProperty(upload,'files',{configurable:true,value:[new window.File(['bad'],'bad.txt',{type:'text/plain'})]}); upload.dispatchEvent(new window.Event('change',{bubbles:true})); });
  assert.match(container.querySelector('[role="alert"]').textContent,/File must be an image/);
  await click('Save menu');
  assert.equal(saved.sections[0].items[0].image,'data:image/png;base64,original');
  assert.equal(saved.sections[0].items[0].imagePresentation.placement,'card-top');
  await click('Remove dish photo');
  assert.equal(container.querySelector('[aria-label="Edit photo for Vegetable tagine in preview"]'),null);
  await click('Undo menu change');
  assert.ok(container.querySelector('[aria-label="Edit photo for Vegetable tagine in preview"]'));
});


test('logo and banner controls stay independent and undo retains both sources', async () => {
  const menu = structuredClone(initialMenu); menu.customization.logoImage = 'data:image/png;base64,logo'; menu.customization.bannerImage = 'data:image/png;base64,banner';
  await mount(async value => value, menu);
  await click('Edit restaurant information');
  await click('Remove restaurant logo');
  assert.ok(container.querySelector('[aria-label="Edit restaurant banner in preview"]'));
  assert.equal(container.querySelector('[aria-label="Edit restaurant logo in preview"]'),null);
  await click('Undo menu change');
  assert.ok(container.querySelector('[aria-label="Edit restaurant logo in preview"]'));
  await act(() => container.querySelector('[aria-label="Edit restaurant banner in preview"]').click());
  assert.equal(document.activeElement.getAttribute('data-editor-image-control'),'banner');
});


test('section photos survive duplication, reordering, hiding and undo', async () => {
  const menu = structuredClone(initialMenu); menu.sections[0].image = 'data:image/png;base64,section';
  menu.sections[0].imagePresentation = { placement: 'heading-side', focalX: 30 };
  let saved;
  await mount(async value => { saved = value; return value; }, menu);
  await click('Duplicate section Dinner'); await click('Move section Dinner (copy) up');
  await click('Hide section Dinner');
  assert.equal(container.querySelectorAll('[aria-label="Edit section photo for Dinner in preview"]').length,0);
  assert.ok(container.querySelector('[aria-label="Edit section photo for Dinner (copy) in preview"]'));
  await click('Save menu');
  assert.equal(saved.sections[0].image,'data:image/png;base64,section');
  assert.equal(saved.sections[0].imagePresentation.focalX,30);
  await act(() => container.querySelector('[aria-label="Edit section photo for Dinner (copy) in preview"]').click());
  assert.equal(document.activeElement.getAttribute('data-editor-image-control'),'section');
  await click('Remove section photo'); await click('Undo menu change');
  assert.ok(container.querySelector('[aria-label="Edit section photo for Dinner (copy) in preview"]'));
});


test('dropping the last dish on its own group does not create a history step', async () => {
  const menu = structuredClone(initialMenu);
  menu.sections[0].items.push({ id:'tea',name:'Tea',price:20,currency:'MAD',available:true });
  await mount(async value => value,menu); await click('Expand Dinner');
  const transfer = { getData: () => JSON.stringify({type:'item',sectionId:'dinner',itemId:'vegetable'}) };
  await act(() => { const drop = new window.Event('drop',{bubbles:true}); Object.defineProperty(drop,'dataTransfer',{value:transfer}); button('Edit subsection Tagines').parentElement.dispatchEvent(drop); });
  assert.equal(button('Undo menu change').disabled,true);
});


test('appearance edits preview immediately and resetting is undoable without changing content', async () => {
  const menu = structuredClone(initialMenu); menu.template = 'atlas-simple';
  let saved;
  await mount(async value => { saved = value; return value; }, menu);
  await click('Customize');
  await fill('Primary color', '#174f54');
  assert.match(container.querySelector('[aria-label="Live menu preview"]').innerHTML, /#174f54/);
  await click('Reset appearance');
  assert.equal(field('Primary color').value.toLowerCase(),'#873e25');
  await click('Undo menu change');
  assert.equal(field('Primary color').value.toLowerCase(),'#174f54');
  await click('Save menu');
  assert.deepEqual(saved.sections,menu.sections);
  assert.equal(saved.design.appearance.primaryColor,'#174f54');
});
