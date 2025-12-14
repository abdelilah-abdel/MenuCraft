import React from 'react';
import { Menu, MenuItem as MenuItemType } from '../types/menu';
import { imageService } from '../services/imageService';

interface TemplateProps {
  menu: Menu;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ menu }) => {
  const { customization, restaurantName, description, sections } = menu;

  return (
    <div
      className="min-h-screen p-8 md:p-16"
      style={{
        backgroundColor: '#ffffff',
        fontFamily: customization.fontFamily,
      }}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-16">
        {customization.logoImage && (
          <div className="mb-8">
            <img
              src={imageService.getImageUrl(customization.logoImage)}
              alt={restaurantName}
              className="h-16 object-contain"
            />
          </div>
        )}
        <h1 className="text-6xl font-light mb-6 tracking-tight text-black">
          {restaurantName}
        </h1>
        {description && (
          <p className="text-lg text-gray-500 font-light leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Menu List */}
      <div className="max-w-3xl mx-auto space-y-20">
        {sections.map((section) => (
          <div key={section.id}>
            <div className="mb-10">
              <h2 className="text-2xl font-light mb-2 text-black uppercase tracking-widest">
                {section.name}
              </h2>
              {section.description && (
                <p className="text-sm text-gray-400 font-light mt-2">
                  {section.description}
                </p>
              )}
            </div>

            <div className="space-y-8">
              {section.items.map((item) => (
                <MinimalMenuItem
                  key={item.id}
                  item={item}
                  customization={customization}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MinimalMenuItem: React.FC<{
  item: MenuItemType;
  customization: Menu['customization'];
}> = ({ item, customization }) => {
  if (!item.available) return null;

  return (
    <div className="border-b border-gray-100 pb-8 last:border-0">
      <div className="flex gap-6">
        {customization.showImages && item.image && (
          <div className="flex-shrink-0">
            <img
              src={imageService.getImageUrl(item.image)}
              alt={item.name}
              className="w-32 h-32 object-cover grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        )}

        <div className="flex-1 flex justify-between">
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-3">
              <h3 className="text-2xl font-light text-black">
                {item.name}
              </h3>
              {item.tags && item.tags.length > 0 && (
                <div className="flex gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs uppercase tracking-wider text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {customization.showDescriptions && item.description && (
              <p className="text-gray-500 font-light leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {customization.showPrices && (
            <div className="flex-shrink-0 ml-6">
              <span className="text-2xl font-light text-black">
                {item.currency} {item.price.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
