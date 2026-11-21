import React from 'react';
import type { Menu } from '../types/menu';
import type { TemplateConfig } from './registry';
import { resolveAppearance } from '../menuDesign';

export function MenuAppearanceFrame({ menu, config, children }: { menu: Menu; config: TemplateConfig; children: React.ReactNode }) {
  const appearance = resolveAppearance(menu, config);
  const overrides = menu.design?.appearance;
  const background = Boolean(overrides?.backgroundColor || overrides?.inheritTemplate);
  const hex = appearance.backgroundColor.slice(1);
  const light = parseInt(hex.slice(0, 2), 16) * .299 + parseInt(hex.slice(2, 4), 16) * .587 + parseInt(hex.slice(4, 6), 16) * .114 > 150;
  return <div className="menu-content menu-appearance"
    data-appearance-background={background || undefined}
    data-appearance-type={Boolean(overrides?.fontFamily || overrides?.inheritTemplate) || undefined}
    data-appearance-primary={Boolean(overrides?.primaryColor || overrides?.inheritTemplate) || undefined}
    data-appearance-secondary={Boolean(overrides?.secondaryColor) || undefined}
    data-appearance-size={overrides?.textSize}
    style={{ '--menu-primary': appearance.primaryColor, '--menu-secondary': appearance.secondaryColor, '--menu-background': appearance.backgroundColor, '--menu-body': appearance.bodyFont, '--menu-heading': appearance.headingFont, '--menu-contrast': light ? '#25241F' : '#FAF7F0', '--menu-text-scale': { small: .9, medium: 1, large: 1.15 }[appearance.textSize] } as React.CSSProperties}>
    {children}
  </div>;
}
