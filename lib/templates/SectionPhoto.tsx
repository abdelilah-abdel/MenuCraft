import React from 'react';
import type { Menu, MenuSection } from '../types/menu';
import { imageStyle } from '../imagePresentation';
import { getTemplateConfig } from './config';
import { usePreviewTarget } from './previewSelection';

export function SectionPhoto({ menu, section, placements }: { menu: Menu; section: MenuSection; placements?: readonly ('banner' | 'heading-side')[] }) {
  const target = usePreviewTarget();
  if (!section.image || section.imagePresentation?.hidden) return null;
  const allowed = placements || getTemplateConfig(menu.template).sectionPhotoPlacements;
  const placement = allowed.includes(section.imagePresentation?.placement as 'banner') ? section.imagePresentation?.placement : allowed[0];
  return <img
    key={section.image}
    {...target({ kind: 'section', sectionId: section.id, focus: 'section-image' }, `Edit section photo for ${section.name} in preview`)}
    data-section-photo="true"
    src={section.image}
    alt={`${section.name} photo`}
    className={placement === 'heading-side' ? 'mb-4 h-24 w-24' : 'mb-4 h-48 w-full'}
    style={{ ...imageStyle(section.imagePresentation), ...(placement === 'heading-side' ? { float: 'inline-start', marginInlineEnd: 16 } : {}) }}
    onError={event => { event.currentTarget.style.display = 'none'; }}
  />;
}
