import React from 'react';
import { Menu, MenuItem as MenuItemType } from '../types/menu';
import { imageService } from '../services/imageService';

interface TemplateProps {
  menu: Menu;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ menu }) => {
  const { customization, restaurantName, description, sections } = menu;

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundColor: '#faf9f6',
        fontFamily: customization.fontFamily,
      }}
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        {customization.logoImage && (
          <div className="mb-6">
            <img
              src={imageService.getImageUrl(customization.logoImage)}
              alt={restaurantName}
              className="h-24 mx-auto object-contain"
            />
          </div>
        )}
        <h1
          className="text-5xl font-bold mb-4"
          style={{ color: customization.primaryColor }}
        >
          {restaurantName}
        </h1>
        {description && (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        <div className="mt-4 w-32 h-1 mx-auto" style={{ backgroundColor: customization.primaryColor }} />
      </div>

      {/* Menu Sections */}
      <div className="max-w-4xl mx-auto space-y-12">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-gray-200 pb-8 last:border-0">
            <div className="text-center mb-8">
              <h2
                className="text-3xl font-semibold mb-2"
                style={{ color: customization.secondaryColor }}
              >
                {section.name}
              </h2>
              {section.description && (
                <p className="text-gray-600 italic">{section.description}</p>
              )}
            </div>

            <div className="space-y-6">
              {section.items.map((item) => (
                <ClassicMenuItem
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

const ClassicMenuItem: React.FC<{
  item: MenuItemType;
  customization: Menu['customization'];
}> = ({ item, customization }) => {
  if (!item.available) return null;

  return (
    <div className="flex gap-4">
      {customization.showImages && item.image && (
        <div className="flex-shrink-0">
          <img
            src={imageService.getImageUrl(item.image)}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-lg shadow-sm"
          />
        </div>
      )}

      <div className="flex-1 flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {item.name}
            </h3>
            {item.tags && item.tags.length > 0 && (
              <div className="flex gap-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${customization.primaryColor}20`,
                      color: customization.primaryColor,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {customization.showDescriptions && item.description && (
            <p className="text-gray-600 mt-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {customization.showPrices && (
          <div className="flex-shrink-0">
            <span
              className="text-xl font-semibold"
              style={{ color: customization.primaryColor }}
            >
              {item.currency} {item.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
