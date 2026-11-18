import type { Menu, MenuSection } from './types/menu';
import type { EditorSelection } from './types/editorSelection';

export function editMenuEntry(menu: Menu, target: EditorSelection, action: 'duplicate' | 'visibility' | 'remove'): Menu {
  if (target.kind === 'restaurant') return menu;
  const source = menu.sections.find(section => section.id === target.sectionId);
  if (!source) return menu;
  const id = () => crypto.randomUUID();
  const copyItem = (item: MenuSection['items'][number]) => ({ ...item, id: id() });
  if (target.kind === 'section') {
    if (action === 'remove') return { ...menu, sections: menu.sections.filter(section => section !== source).map((section, order) => ({ ...section, order })) };
    if (action === 'visibility') return { ...menu, sections: menu.sections.map(section => section === source ? { ...section, hidden: !section.hidden } : section) };
    const groups = new Map((source.subsections || []).map(group => [group.id, id()]));
    const copy = { ...source, id: id(), name: `${source.name} (copy)`, subsections: source.subsections?.map(group => ({ ...group, id: groups.get(group.id)! })), items: source.items.map(item => ({ ...copyItem(item), subsectionId: item.subsectionId ? groups.get(item.subsectionId) : undefined })) };
    const sections = [...menu.sections];
    sections.splice(sections.indexOf(source) + 1, 0, copy);
    return { ...menu, sections: sections.map((section, order) => ({ ...section, order })) };
  }
  let section = source;
  if (target.kind === 'item') {
    const item = source.items.find(item => item.id === target.itemId);
    if (!item) return menu;
    const items = [...source.items];
    const index = items.indexOf(item);
    if (action === 'remove') items.splice(index, 1);
    else if (action === 'duplicate') items.splice(index + 1, 0, { ...copyItem(item), name: `${item.name} (copy)` });
    else items[index] = { ...item, hidden: !item.hidden };
    section = { ...source, items };
  } else {
    const group = source.subsections?.find(group => group.id === target.subsectionId);
    if (!group) return menu;
    let groups = [...(source.subsections || [])];
    let items = source.items;
    if (action === 'remove') {
      groups = groups.filter(entry => entry !== group);
      items = items.map(item => item.subsectionId === group.id ? { ...item, subsectionId: undefined } : item);
    } else if (action === 'visibility') groups = groups.map(entry => entry === group ? { ...entry, hidden: !entry.hidden } : entry);
    else {
      const groupId = id();
      groups.splice(groups.indexOf(group) + 1, 0, { ...group, id: groupId, name: `${group.name} (copy)` });
      items = [...items, ...items.filter(item => item.subsectionId === group.id).map(item => ({ ...copyItem(item), subsectionId: groupId }))];
    }
    section = { ...source, items, subsections: groups.map((entry, order) => ({ ...entry, order })) };
  }
  return { ...menu, sections: menu.sections.map(entry => entry === source ? section : entry) };
}
