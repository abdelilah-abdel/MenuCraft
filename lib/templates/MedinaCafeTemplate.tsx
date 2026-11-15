import React from 'react';
import { Menu, MenuItem } from '../types/menu';
import {
  getMenuSectionGroups,
  getVisibleMenuSections,
  localizedMenuText,
  MenuItemPhoto,
  MenuItemTags,
  menuDirection,
  SoldOutLabel,
  formatMenuPrice,
} from './menuTemplateUtils';

interface TemplateProps { menu: Menu }

export const MedinaCafeTemplate: React.FC<TemplateProps> = ({ menu }) => {
  const { customization } = menu;
  const sections = getVisibleMenuSections(menu);
  const heroItem = sections.flatMap((section) => section.items).find((item) => item.image);

  const renderItem = (item: MenuItem) => (
    <article key={item.id} className={`group flex gap-4 border-b border-[#d8c8a5] py-4 last:border-0 ${!item.available ? 'opacity-75' : ''}`}>
      <MenuItemPhoto item={item} showImages={customization.showImages} className="h-20 w-20 shrink-0 rounded-sm object-cover shadow-sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <h3 className="font-serif text-lg font-semibold text-[#352b22]">{item.name || 'Untitled dish'}</h3>
          {customization.showPrices && <span className="shrink-0 font-semibold text-[#8b4b2b]">{formatMenuPrice(item)}</span>}
        </div>
        {customization.showDescriptions && item.description && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#74685a]">{item.description}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {item.tags?.length ? <MenuItemTags item={item} className="text-[#8b4b2b]" /> : null}
          {!item.available && <SoldOutLabel language={menu.originalLanguage} />}
        </div>
      </div>
    </article>
  );

  return (
    <main dir={menuDirection(menu)} lang={menu.originalLanguage} className="min-h-screen bg-[#f5f0e3] text-[#352b22]" style={{ fontFamily: customization.fontFamily }}>
      <header className="relative isolate overflow-hidden border-b-[6px] border-[#1e6b70] bg-[#1e6b70] text-white">
        {customization.showImages && heroItem?.image ? (
          <img src={heroItem.image} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35" />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_15%,rgba(238,196,122,.32),transparent_26%),radial-gradient(circle_at_85%_85%,rgba(9,47,50,.55),transparent_35%),linear-gradient(120deg,#1e6b70,#174f54)]" />
        )}
        <div aria-hidden="true" className="absolute inset-3 -z-10 border border-white/30" />
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-12 text-center sm:px-10 sm:py-16">
          {customization.logoImage && <img src={customization.logoImage} alt={`${menu.restaurantName} logo`} className="mb-5 h-16 max-w-40 object-contain" />}
          <span className="mb-3 text-[11px] font-semibold uppercase tracking-[0.42em] text-[#f1d29a]">{localizedMenuText(menu.originalLanguage, 'Moroccan hospitality · Since always', 'Cuisine du Maroc · Depuis toujours', 'الضيافة المغربية · منذ الأزل')}</span>
          <h1 className="font-serif text-4xl font-bold sm:text-6xl" style={{ color: '#fff' }}>{menu.restaurantName}</h1>
          {menu.description && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">{menu.description}</p>}
          <div className="mt-6 flex items-center gap-3 text-[#f1d29a]" aria-hidden="true"><span className="h-px w-10 bg-current" /><span>✦</span><span className="h-px w-10 bg-current" /></div>
        </div>
      </header>

      {sections.length > 1 && (
        <nav aria-label="Menu sections" className="sticky top-0 z-20 border-b border-[#d8c8a5] bg-[#f5f0e3]/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-3">
            {sections.map((section, index) => <a key={section.id} href={`#medina-section-${index}`} className="shrink-0 rounded-full border border-[#cbb890] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#4f4539] transition hover:bg-[#e8ddc7]">{section.name}</a>)}
          </div>
        </nav>
      )}

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        {sections.length === 0 ? <p className="py-16 text-center font-serif text-xl text-[#74685a]">{localizedMenuText(menu.originalLanguage, 'Menu coming soon', 'Menu bientôt disponible', 'قائمة الطعام قريباً')}</p> : sections.map((section, sectionIndex) => (
          <section id={`medina-section-${sectionIndex}`} key={section.id} className="mb-12 scroll-mt-20 rounded-sm border border-[#d8c8a5] bg-[#fbf8f0] px-5 py-7 shadow-[0_8px_30px_rgba(53,43,34,.06)] sm:px-9 sm:py-9">
            <div className="mb-6 text-center">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1e6b70]">{localizedMenuText(menu.originalLanguage, 'Menu', 'Carte', 'قائمة الطعام')} · {String(sectionIndex + 1).padStart(2, '0')}</p>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl" style={{ color: customization.primaryColor }}>{section.name}</h2>
              {section.description && <p className="mx-auto mt-2 max-w-2xl text-sm italic leading-relaxed text-[#74685a]">{section.description}</p>}
              <div className="mx-auto mt-4 h-px w-20 bg-[#c98b48]" />
            </div>

            <div className="space-y-7">
              {getMenuSectionGroups(section).map((group) => (
                <div key={group.subsection?.id || 'section-items'}>
                  {group.subsection && <div className="mb-2 flex items-center gap-3"><h3 className="font-serif text-xl font-semibold text-[#8b4b2b]">{group.subsection.name}</h3><span aria-hidden="true" className="h-px flex-1 bg-[#e1d5c0]" /></div>}
                  {group.subsection?.description && <p className="mb-3 text-sm text-[#74685a]">{group.subsection.description}</p>}
                  <div>{group.items.map(renderItem)}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <footer className="border-t border-[#d8c8a5] bg-[#ebe2d1] px-6 py-6 text-center text-xs uppercase tracking-[0.2em] text-[#74685a]">{localizedMenuText(menu.originalLanguage, 'Bismillah · Welcome to our table', 'Bismillah · Bienvenue à notre table', 'بسم الله · أهلاً بكم على مائدتنا')}</footer>
    </main>
  );
};
