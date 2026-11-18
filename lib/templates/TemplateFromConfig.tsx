import React from 'react';
import type { Menu } from '../types/menu';
import type { TemplateConfig } from './config';
import type { TemplateBlockType } from './registry';
import { resolveAppearance, resolveLayout } from '../menuDesign';
import { menuDirection } from './menuTemplateUtils';
import { RestaurantHeaderBlock, MenuSectionsBlock, type MenuBlockProps } from './blocks';

const blockRenderers: Record<TemplateBlockType, React.FC<MenuBlockProps>> = {
  'restaurant-header': RestaurantHeaderBlock,
  'menu-sections': MenuSectionsBlock,
};

/** Compositions describe presentation; every block reads the same Menu. */
export function TemplateFromConfig({
  menu,
  config,
}: {
  menu: Menu;
  config: Extract<TemplateConfig, { renderer: 'configurable' }>;
}) {
  config = { ...config, theme: resolveAppearance(menu, config) };
  const { theme, layout } = config;
  const columns = resolveLayout(menu, config).columns;
  return (
    <main
      lang={menu.originalLanguage}
      dir={menuDirection(menu)}
      className="min-h-screen px-5 py-10 sm:px-8 sm:py-16"
      style={{ background: theme.backgroundColor, color: theme.inkColor, fontFamily: theme.bodyFont }}
    >
      <article className={`mx-auto w-full ${columns > 1 || layout.kind === 'cards' ? 'max-w-6xl' : 'max-w-3xl'}`}>
        {config.composition.map((type) => {
          const Block = blockRenderers[type];
          return <Block key={type} menu={menu} config={config} />;
        })}
      </article>
    </main>
  );
}
