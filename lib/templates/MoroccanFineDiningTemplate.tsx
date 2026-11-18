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

export const MoroccanFineDiningTemplate: React.FC<TemplateProps> = ({ menu }) => {
  const { customization } = menu;
  const sections = getVisibleMenuSections(menu);
  const heroItem = sections.flatMap(section => getMenuSectionGroups(section).flatMap(group => group.items)).find((item) => item.image && !item.imagePresentation?.hidden);
  const previewTarget = usePreviewTarget();

  const renderItem = (item: MenuItem, sectionId: string) => (
    <article {...previewTarget({ kind: 'item', sectionId, itemId: item.id }, `Edit dish ${item.name || 'Untitled dish'} in preview`)} key={item.id} className={`overflow-hidden border border-[#e4d9ca] bg-white ${!item.available ? 'opacity-75' : ''}`}>
      {customization.showImages && item.image && <MenuItemPhoto item={item} showImages className="h-44 w-full object-cover sm:h-52" />}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-serif text-xl font-semibold leading-snug text-[#352b2b]">{item.name || 'Untitled dish'}</h3>
            <MenuItemTags item={item} className="mt-2 text-[#8b6a38]" />
          </div>
          {customization.showPrices && <span className="shrink-0 border-b border-[#a98956] pb-1 font-serif text-base text-[#8b6a38]">{formatMenuPrice(item)}</span>}
        </div>
        {customization.showDescriptions && item.description && <p className="mt-3 max-w-xl text-sm leading-7 text-[#716c65]">{item.description}</p>}
        {!item.available && <SoldOutLabel className="mt-3" language={menu.originalLanguage} />}
      </div>
    </article>
  );

  return (
    <main dir={menuDirection(menu)} lang={menu.originalLanguage} className="min-h-screen bg-[#f7f4ee] text-[#352b2b]" style={{ fontFamily: customization.fontFamily }}>
      <header className="relative overflow-hidden bg-[#332323] text-[#f7f1e7]">
        <RestaurantBanner menu={menu} position="above" />
        {customization.showImages && heroItem?.image ? <img style={imageStyle(heroItem.imagePresentation)} src={heroItem.image} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} className="absolute inset-0 h-full w-full object-cover opacity-25" /> : <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(176,134,74,.32),transparent_48%),linear-gradient(120deg,#332323,#241919)]" />}
        {customization.showImages && heroItem?.image && <PreviewHeroImageTarget item={heroItem} />}
        <div className="pointer-events-none relative z-10 mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-16">
          <div className="mx-auto max-w-3xl border-y border-[#c6a66d]/60 py-8 text-center">
            <RestaurantLogo menu={menu} className="mx-auto mb-5 h-16 max-w-40 object-contain" />
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d8bd8a]">{localizedMenuText(menu.originalLanguage, 'The art of hospitality · Moroccan cuisine', 'L’art de recevoir · Cuisine marocaine', 'فن الضيافة · المطبخ المغربي')}</p>
            <PreviewHeading as="h1" target={{ kind: 'restaurant' }} editLabel={`Edit restaurant ${menu.restaurantName} in preview`} className="font-serif text-4xl font-light tracking-wide sm:text-6xl">{menu.restaurantName}</PreviewHeading>
            {customization.showDescriptions && menu.description && <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#eee4d3]/80 sm:text-base">{menu.description}</p>}
            <div className="mt-6 text-[#d8bd8a]" aria-hidden="true">✦　✦　✦</div>
          </div>
        </div>
      <RestaurantBanner menu={menu} position="below" />
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {sections.length === 0 ? <p className="py-16 text-center font-serif text-xl text-[#716c65]">{<MenuEmptyState language={menu.originalLanguage} />}</p> : sections.map((section, sectionIndex) => (
          <section key={section.id} className="mb-14">
            <div className="mb-7 flex items-end gap-4 border-b border-[#d6c9b6] pb-4">
              <div>
                <p className="mb-2 text-[10px] uppercase tracking-[0.32em] text-[#9a7844]">{localizedMenuText(menu.originalLanguage, 'Selection', 'Sélection', 'اختيار')} · {String(sectionIndex + 1).padStart(2, '0')}</p>
                <PreviewHeading as="h2" target={{ kind: 'section', sectionId: section.id }} editLabel={`Edit section ${section.name} in preview`} className="font-serif text-3xl font-medium sm:text-4xl" style={{ color: customization.primaryColor }}>{section.name}</PreviewHeading>
                {customization.showDescriptions && section.description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#716c65]">{section.description}</p>}
              </div>
              <span aria-hidden="true" className="mb-2 hidden h-px flex-1 bg-[#d6c9b6] sm:block" />
            </div>

            <div className="space-y-9">
              {getMenuSectionGroups(section).map((group) => (
                <div key={group.subsection?.id || 'section-items'}>
                  {group.subsection && <div className="mb-4 flex items-center gap-3"><PreviewHeading as="h3" target={{ kind: 'subsection', sectionId: section.id, subsectionId: group.subsection.id }} editLabel={`Edit subsection ${group.subsection.name} in preview`} className="font-serif text-xl italic text-[#765c3b]">{group.subsection.name}</PreviewHeading><span aria-hidden="true" className="h-px flex-1 bg-[#e4d9ca]" /></div>}
                  {customization.showDescriptions && group.subsection?.description && <p className="mb-4 text-sm text-[#716c65]">{group.subsection.description}</p>}
                  <div className="grid gap-4 md:grid-cols-2">{group.items.map((item) => renderItem(item, section.id))}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <footer className="bg-[#332323] px-6 py-7 text-center text-[10px] uppercase tracking-[0.35em] text-[#d8bd8a]">{localizedMenuText(menu.originalLanguage, 'Welcome to our table', 'Bienvenue à notre table', 'أهلاً بكم على مائدتنا')}</footer>
    </main>
  );
};
