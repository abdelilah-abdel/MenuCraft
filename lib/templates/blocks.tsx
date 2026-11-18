import React from 'react';
import type { Menu, MenuItem, MenuSection, MenuSubsection } from '../types/menu';
import type { TemplateConfig } from './config';
import {
  formatMenuPrice,
  getMenuSectionGroups,
  getVisibleMenuSections,
  localizedMenuText,
  MenuItemPhoto,
  SoldOutLabel,
} from './menuTemplateUtils';

export interface MenuBlockProps {
  menu: Menu;
  config: TemplateConfig;
}

export function RestaurantHeaderBlock({ menu, config }: MenuBlockProps) {
  const { theme, layout } = config;
  return (
    <header
      className={`mb-14 pb-8 text-center ${layout.showSectionRules ? 'border-b-2' : ''}`}
      style={{ borderColor: theme.primaryColor }}
    >
      {menu.customization.logoImage && (
        <img src={menu.customization.logoImage} alt="" className="mx-auto mb-4 h-16 w-auto object-contain" />
      )}
      <h1
        className="text-4xl font-semibold tracking-tight sm:text-6xl"
        style={{ color: theme.primaryColor, fontFamily: theme.headingFont }}
      >
        {menu.restaurantName}
      </h1>
      {menu.description && (
        <p className="mx-auto mt-4 max-w-xl text-base" style={{ color: theme.secondaryColor }}>
          {menu.description}
        </p>
      )}
    </header>
  );
}

export function MenuSectionsBlock({ menu, config }: MenuBlockProps) {
  const { theme, layout } = config;
  return (
    <>
      {getVisibleMenuSections(menu).length === 0 && (
        <p className="text-center text-lg" style={{ color: theme.secondaryColor }}>
          {localizedMenuText(menu.originalLanguage, 'Menu coming soon', 'Menu à venir', 'القائمة قريبًا')}
        </p>
      )}

      <div className={layout.columns === 2 ? 'grid gap-x-12 gap-y-12 md:grid-cols-2' : 'space-y-12'}>
        {getVisibleMenuSections(menu).map((section) => (
          <MenuSectionBlock key={section.id} section={section} menu={menu} config={config} />
        ))}
      </div>
    </>
  );
}

export function SectionHeadingBlock({ section, config }: { section: MenuSection; config: TemplateConfig }) {
  const { theme, layout } = config;
  return (
    <header
      className="mb-5 flex items-baseline justify-between gap-4 pb-3"
      style={layout.showSectionRules ? { borderBottom: `1px solid ${theme.primaryColor}` } : undefined}
    >
      <div>
        <h2
          id={`config-section-${section.id}`}
          className={layout.kind === 'minimal' ? 'text-lg font-semibold' : 'text-2xl font-semibold'}
          style={{ color: theme.primaryColor, fontFamily: theme.headingFont }}
        >
          {section.name}
        </h2>
        {section.description && (
          <p className="mt-1 text-sm" style={{ color: theme.secondaryColor }}>
            {section.description}
          </p>
        )}
      </div>
    </header>
  );
}

export function SubsectionHeadingBlock({
  subsection,
  config,
}: {
  subsection: MenuSubsection;
  config: TemplateConfig;
}) {
  const { theme } = config;
  return (
    <h3 className="mb-3 text-base font-semibold" style={{ color: theme.secondaryColor }}>
      {subsection.name}
    </h3>
  );
}

function MenuSectionBlock({
  section,
  menu,
  config,
}: {
  section: MenuSection;
  menu: Menu;
  config: TemplateConfig;
}) {
  const { layout } = config;
  return (
    <section aria-labelledby={`config-section-${section.id}`}>
      <SectionHeadingBlock section={section} config={config} />

      {getMenuSectionGroups(section).map((group) => (
        <div key={group.subsection?.id || 'all'} className="mb-4 last:mb-0">
          {group.subsection && <SubsectionHeadingBlock subsection={group.subsection} config={config} />}
          <div className={layout.kind === 'cards' ? 'grid gap-5 sm:grid-cols-2' : undefined}>
            {group.items.map((item) => (
              <DishRowBlock key={item.id} item={item} menu={menu} config={config} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export function DishRowBlock({ item, menu, config }: { item: MenuItem; menu: Menu; config: TemplateConfig }) {
  const { theme, layout } = config;
  const isCard = layout.imageStyle === 'cards';
  const visible = item.available;

  if (isCard) {
    return (
      <article
        className={`overflow-hidden border-2 ${visible ? '' : 'opacity-60'}`}
        style={{ borderColor: theme.primaryColor, borderRadius: layout.cornerRadius }}
      >
        <MenuItemPhoto
          item={item}
          showImages={menu.customization.showImages}
          className="h-48 w-full object-cover"
        />
        <div className="p-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            {menu.customization.showPrices && (
              <span className="shrink-0 font-bold tabular-nums" style={{ color: theme.primaryColor }}>
                {formatMenuPrice(item)}
              </span>
            )}
          </div>
          {item.description && menu.customization.showDescriptions && (
            <p className="mt-2 text-sm" style={{ color: theme.secondaryColor }}>
              {item.description}
            </p>
          )}
          {!visible && <SoldOutLabel className="mt-3" language={menu.originalLanguage} />}
        </div>
      </article>
    );
  }

  return (
    <article className={`border-b border-black/10 py-4 ${visible ? '' : 'opacity-60'}`}>
      <div className="flex items-start gap-4">
        {layout.imageStyle === 'row-thumbs' && (
          <MenuItemPhoto
            item={item}
            showImages={menu.customization.showImages}
            className="h-20 w-20 shrink-0 object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <h3 className={layout.kind === 'minimal' ? 'font-medium' : 'font-semibold'}>{item.name}</h3>
            {layout.showPricesWithLeaders && (
              <span aria-hidden="true" className="mb-1 flex-1 border-b-2 border-dotted border-current/40" />
            )}
            {menu.customization.showPrices && (
              <span
                className="shrink-0 font-semibold tabular-nums"
                style={{ color: theme.primaryColor, fontFamily: theme.headingFont }}
              >
                {formatMenuPrice(item)}
              </span>
            )}
          </div>
          {item.description && menu.customization.showDescriptions && (
            <p className="mt-1 text-sm" style={{ color: theme.secondaryColor }}>
              {item.description}
            </p>
          )}
          {!visible && <SoldOutLabel className="mt-2" language={menu.originalLanguage} />}
        </div>
      </div>
    </article>
  );
}
