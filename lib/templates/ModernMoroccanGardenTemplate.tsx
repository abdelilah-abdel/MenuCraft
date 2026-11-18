import { SectionPhoto } from './SectionPhoto';
import { RestaurantLogo, RestaurantBanner } from './RestaurantImages';
import React from 'react';
import { imageStyle } from '../imagePresentation';
import { Menu, MenuItem } from '../types/menu';
import {
  MenuEmptyState, getMenuSectionGroups,
  getVisibleMenuSections,
  localizedMenuText,
  MenuItemPhoto,
  MenuItemTags,
  menuDirection,
  SoldOutLabel,
  formatMenuPrice,
} from './menuTemplateUtils';
import { PreviewHeading, PreviewHeroImageTarget, usePreviewTarget } from './previewSelection';

interface TemplateProps { menu: Menu }

export const ModernMoroccanGardenTemplate: React.FC<TemplateProps> = ({ menu }) => {
  const { customization } = menu;
  const sections = getVisibleMenuSections(menu);
  const imageItems = sections.flatMap(section => getMenuSectionGroups(section).flatMap(group => group.items)).filter((item) => item.image && !item.imagePresentation?.hidden).slice(0, 3);
  const heroImage = customization.showImages ? imageItems[0]?.image : undefined;
  const previewTarget = usePreviewTarget();

  const renderItem = (item: MenuItem, index: number, sectionId: string) => (
    <article {...previewTarget({ kind: 'item', sectionId, itemId: item.id }, `Edit dish ${item.name || 'Untitled dish'} in preview`)} key={item.id} className={`group overflow-hidden rounded-2xl border border-[#dbe3d2] bg-white shadow-[0_8px_28px_rgba(43,67,45,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(43,67,45,.14)] ${!item.available ? 'opacity-80' : ''}`}>
      {customization.showImages && item.image && !item.imagePresentation?.hidden ? (
        <div className="relative overflow-hidden">
          <MenuItemPhoto item={item} showImages className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          <span className="absolute left-4 top-4 rounded-full bg-[#f4f3e8]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#496342]">{String(index + 1).padStart(2, '0')}</span>
          {!item.available && <span className="absolute right-4 top-4"><SoldOutLabel language={menu.originalLanguage} /></span>}
        </div>
      ) : (
        <div aria-hidden="true" className="relative h-20 overflow-hidden bg-[radial-gradient(circle_at_18%_30%,#dbe7c9_0_12%,transparent_13%),radial-gradient(circle_at_86%_65%,#eac59e_0_11%,transparent_12%),linear-gradient(120deg,#edf1e4,#faf4e9)]">
          <span className="absolute bottom-3 left-5 font-serif text-3xl italic text-[#78916c]/50">{item.name.trim().charAt(0) || 'M'}</span>
          {!item.available && <span className="absolute right-4 top-4"><SoldOutLabel language={menu.originalLanguage} /></span>}
        </div>
      )}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-xl font-semibold leading-snug text-[#2f3b2c]">{item.name || 'Untitled dish'}</h3>
          {customization.showPrices && <span className="shrink-0 rounded-full bg-[#f1f3e8] px-3 py-1.5 text-sm font-bold text-[#647c4e]">{formatMenuPrice(item)}</span>}
        </div>
        {customization.showDescriptions && item.description && <p className="mt-3 text-sm leading-6 text-[#687164]">{item.description}</p>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <MenuItemTags item={item} className="text-[#647c4e]" />
          {!item.available && <SoldOutLabel language={menu.originalLanguage} />}
        </div>
      </div>
    </article>
  );

  return (
    <main dir={menuDirection(menu)} lang={menu.originalLanguage} className="min-h-screen bg-[#f7f8f1] text-[#2f3b2c]" style={{ fontFamily: customization.fontFamily }}>
      <header className="relative isolate overflow-hidden bg-[#526d49] text-white">
        <RestaurantBanner menu={menu} position="above" />
        {heroImage && <img style={imageStyle(imageItems[0]?.imagePresentation)} src={heroImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35" />}
        {heroImage && imageItems[0] && <PreviewHeroImageTarget item={imageItems[0]} />}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgba(27,47,31,.9),rgba(49,78,54,.58),rgba(35,55,36,.78))]" />
        {customization.showImages && imageItems.length > 1 && <div className="absolute bottom-0 right-0 hidden h-28 w-1/3 gap-2 p-3 opacity-70 lg:flex">{imageItems.slice(1).map((item) => <MenuItemPhoto key={item.id} item={item} showImages className="h-full min-w-0 flex-1 rounded-t-xl object-cover" />)}</div>}
        <div className="pointer-events-none relative z-10 mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-20">
          <div className="max-w-2xl">
            <RestaurantLogo menu={menu} className="mb-6 h-16 max-w-40 object-contain" />
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#e5d4a8]">{localizedMenuText(menu.originalLanguage, 'Welcome', 'Bienvenue', 'مرحباً')}</p>
            <PreviewHeading as="h1" target={{ kind: 'restaurant' }} editLabel={`Edit restaurant ${menu.restaurantName} in preview`} className="font-serif text-5xl font-semibold leading-tight sm:text-7xl">{menu.restaurantName}</PreviewHeading>
            {customization.showDescriptions && menu.description && <p className="mt-5 max-w-xl text-base leading-7 text-white/85">{menu.description}</p>}
            <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs uppercase tracking-widest text-[#f5edcf]">{localizedMenuText(menu.originalLanguage, 'Our menu', 'Notre carte', 'قائمتنا')}</div>
          </div>
        </div>
      <RestaurantBanner menu={menu} position="below" />
      </header>

      {sections.length > 1 && <nav aria-label="Menu sections" className="border-b border-[#dbe3d2] bg-white"><div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3">{sections.map((section, index) => <a key={section.id} href={`#garden-section-${index}`} className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold text-[#526d49] hover:bg-[#eef2e6]">{section.name}</a>)}</div></nav>}

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {sections.length === 0 ? <p className="py-16 text-center font-serif text-xl text-[#687164]">{<MenuEmptyState language={menu.originalLanguage} />}</p> : sections.map((section, sectionIndex) => (
          <section id={`garden-section-${sectionIndex}`} key={section.id} className="mb-14 scroll-mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.34em] text-[#8b9b6a]">{localizedMenuText(menu.originalLanguage, 'To share', 'À partager', 'للمشاركة')} · {String(sectionIndex + 1).padStart(2, '0')}</p>
                <SectionPhoto menu={menu} section={section} /><PreviewHeading as="h2" target={{ kind: 'section', sectionId: section.id }} editLabel={`Edit section ${section.name} in preview`} className="font-serif text-3xl font-semibold sm:text-4xl" style={{ color: customization.primaryColor }}>{section.name}</PreviewHeading>
                {customization.showDescriptions && section.description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#687164]">{section.description}</p>}
              </div>
              <span aria-hidden="true" className="mb-2 hidden h-px flex-1 bg-[#dbe3d2] sm:block" />
            </div>
            <div className="space-y-9">
              {getMenuSectionGroups(section).map((group) => (
                <div key={group.subsection?.id || 'section-items'}>
                  {group.subsection && <div className="mb-4 flex items-center gap-3"><PreviewHeading as="h3" target={{ kind: 'subsection', sectionId: section.id, subsectionId: group.subsection.id }} editLabel={`Edit subsection ${group.subsection.name} in preview`} className="rounded-full bg-[#e9efe0] px-4 py-2 font-serif text-lg font-semibold text-[#526d49]">{group.subsection.name}</PreviewHeading><span aria-hidden="true" className="h-px flex-1 bg-[#dbe3d2]" /></div>}
                  {customization.showDescriptions && group.subsection?.description && <p className="mb-4 text-sm text-[#687164]">{group.subsection.description}</p>}
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{group.items.map((item, index) => renderItem(item, index, section.id))}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <footer className="bg-[#e8eddf] px-6 py-7 text-center text-xs uppercase tracking-[0.28em] text-[#526d49]">{localizedMenuText(menu.originalLanguage, 'Welcome to our table', 'Bienvenue à notre table', 'أهلاً بكم على مائدتنا')}</footer>
    </main>
  );
};
