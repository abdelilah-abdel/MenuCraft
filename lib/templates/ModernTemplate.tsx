import React from 'react';
import { Menu, MenuItem as MenuItemType } from '../types/menu';
import { imageService } from '../services/imageService';

interface TemplateProps {
  menu: Menu;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ menu }) => {
  const { customization, restaurantName, description, sections } = menu;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#0f0f0f',
        fontFamily: customization.fontFamily,
      }}
    >
      {/* Header with gradient */}
      <div
        className="relative py-20 px-8"
        style={{
          background: `linear-gradient(135deg, ${customization.primaryColor} 0%, ${customization.secondaryColor} 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          {customization.logoImage && (
            <div className="mb-6">
              <img
                src={imageService.getImageUrl(customization.logoImage)}
                alt={restaurantName}
                className="h-20 mx-auto object-contain filter brightness-0 invert"
              />
            </div>
          )}
          <h1 className="text-6xl font-bold mb-4 text-white tracking-tight">
            {restaurantName}
          </h1>
          {description && (
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {sections.map((section) => (
          <div key={section.id} className="mb-16">
            <div className="mb-10">
              <h2
                className="text-4xl font-bold mb-2 text-white"
              >
                {section.name}
              </h2>
              {section.description && (
                <p className="text-gray-400 text-lg">{section.description}</p>
              )}
              <div className="mt-4 h-1 w-24" style={{ backgroundColor: customization.primaryColor }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.items.map((item) => (
                <ModernMenuItem
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

const ModernMenuItem: React.FC<{
  item: MenuItemType;
  customization: Menu['customization'];
}> = ({ item, customization }) => {
  if (!item.available) return null;

  return (
    <div
      className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 border border-zinc-800"
    >
      {customization.showImages && item.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageService.getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              {item.name}
            </h3>
            {item.tags && item.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: customization.primaryColor,
                      color: '#fff',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {customization.showPrices && (
            <div
              className="text-2xl font-bold ml-4"
              style={{ color: customization.primaryColor }}
            >
              {item.currency}{item.price.toFixed(2)}
            </div>
          )}
        </div>

        {customization.showDescriptions && item.description && (
          <p className="text-gray-400 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};
