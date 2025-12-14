'use client';

import React, { useState } from 'react';
import { Menu, MenuSection, MenuItem } from '@/lib/types/menu';
import { MenuService } from '@/lib/services/menuService';
import { imageService } from '@/lib/services/imageService';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

interface MenuBuilderProps {
  initialMenu?: Menu;
  onSave?: (menu: Menu) => void;
  onPreview?: (menu: Menu) => void;
}

export const MenuBuilder: React.FC<MenuBuilderProps> = ({
  initialMenu,
  onSave,
  onPreview,
}) => {
  const [menu, setMenu] = useState<Menu>(
    initialMenu || MenuService.createDefaultMenu()
  );
  const [uploading, setUploading] = useState(false);

  const updateMenu = (updates: Partial<Menu>) => {
    setMenu((prev) => ({ ...prev, ...updates }));
  };

  const updateCustomization = (updates: Partial<Menu['customization']>) => {
    setMenu((prev) => ({
      ...prev,
      customization: { ...prev.customization, ...updates },
    }));
  };

  const addSection = () => {
    const newSection: MenuSection = {
      id: `section-${Date.now()}`,
      name: 'New Section',
      description: '',
      items: [],
      order: menu.sections.length,
    };
    setMenu((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<MenuSection>) => {
    setMenu((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));
  };

  const deleteSection = (sectionId: string) => {
    setMenu((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
  };

  const addItem = (sectionId: string) => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: 'New Item',
      description: '',
      price: 0,
      currency: '$',
      available: true,
    };

    updateSection(sectionId, {
      items: [
        ...menu.sections.find((s) => s.id === sectionId)!.items,
        newItem,
      ],
    });
  };

  const updateItem = (
    sectionId: string,
    itemId: string,
    updates: Partial<MenuItem>
  ) => {
    const section = menu.sections.find((s) => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      items: section.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
    });
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    const section = menu.sections.find((s) => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      items: section.items.filter((i) => i.id !== itemId),
    });
  };

  const handleImageUpload = async (
    file: File,
    sectionId: string,
    itemId: string
  ) => {
    setUploading(true);
    try {
      const result = await imageService.uploadImage(file);
      if (result.success) {
        updateItem(sectionId, itemId, { image: result.url });
      } else {
        alert(result.error || 'Failed to upload image');
      }
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await imageService.uploadImage(file);
      if (result.success) {
        updateCustomization({ logoImage: result.url });
      } else {
        alert(result.error || 'Failed to upload logo');
      }
    } catch (error) {
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    MenuService.saveMenu(menu);
    onSave?.(menu);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-6">
      {/* Restaurant Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Restaurant Information</h2>
            <p className="text-sm text-gray-600">Basic details about your business</p>
          </div>
        </div>

        <div className="space-y-5">
          <Input
            label="Restaurant Name"
            value={menu.restaurantName}
            onChange={(e) => updateMenu({ restaurantName: e.target.value })}
            placeholder="Your Restaurant Name"
          />

          <Textarea
            label="Description"
            value={menu.description || ''}
            onChange={(e) => updateMenu({ description: e.target.value })}
            placeholder="Tell customers about your restaurant..."
            rows={3}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Logo
            </label>
            <div className="flex items-center gap-4">
              {menu.customization.logoImage && (
                <img
                  src={menu.customization.logoImage}
                  alt="Logo"
                  className="h-16 w-16 object-contain rounded-lg border-2 border-gray-200"
                />
              )}
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 hover:bg-gray-50 transition-all text-center">
                  <svg className="w-6 h-6 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-gray-700 font-medium">Click to upload logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Customization */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Design & Colors</h2>
            <p className="text-sm text-gray-600">Customize your brand appearance</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={menu.customization.primaryColor}
                  onChange={(e) =>
                    updateCustomization({ primaryColor: e.target.value })
                  }
                  className="h-12 w-20 rounded-xl cursor-pointer border-2 border-gray-200"
                />
                <Input
                  value={menu.customization.primaryColor}
                  onChange={(e) =>
                    updateCustomization({ primaryColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={menu.customization.secondaryColor}
                  onChange={(e) =>
                    updateCustomization({ secondaryColor: e.target.value })
                  }
                  className="h-12 w-20 rounded-xl cursor-pointer border-2 border-gray-200"
                />
                <Input
                  value={menu.customization.secondaryColor}
                  onChange={(e) =>
                    updateCustomization({ secondaryColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-4">Display Options</p>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={menu.customization.showPrices}
                  onChange={(e) =>
                    updateCustomization({ showPrices: e.target.checked })
                  }
                  className="w-5 h-5 text-gray-900 rounded border-gray-300 focus:ring-gray-500"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">Show Prices</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={menu.customization.showDescriptions}
                  onChange={(e) =>
                    updateCustomization({ showDescriptions: e.target.checked })
                  }
                  className="w-5 h-5 text-gray-900 rounded border-gray-300 focus:ring-gray-500"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">Show Descriptions</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={menu.customization.showImages}
                  onChange={(e) =>
                    updateCustomization({ showImages: e.target.checked })
                  }
                  className="w-5 h-5 text-gray-900 rounded border-gray-300 focus:ring-gray-500"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">Show Images</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Menu Sections</h2>
            <p className="text-sm text-gray-600">Organize your menu into categories</p>
          </div>
          <Button onClick={addSection}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Section
          </Button>
        </div>

        {menu.sections.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sections yet</h3>
            <p className="text-gray-600 mb-6">Create your first menu section to get started</p>
            <Button onClick={addSection}>Create First Section</Button>
          </div>
        )}

        {menu.sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-gray-300 transition-all"
          >
            <div className="flex justify-between items-start gap-4 mb-6">
              <div className="flex-1 space-y-4">
                <Input
                  label={`Section ${sectionIndex + 1} Name`}
                  value={section.name}
                  onChange={(e) =>
                    updateSection(section.id, { name: e.target.value })
                  }
                  placeholder="e.g., Appetizers, Main Course"
                />

                <Textarea
                  label="Section Description (Optional)"
                  value={section.description || ''}
                  onChange={(e) =>
                    updateSection(section.id, { description: e.target.value })
                  }
                  placeholder="Describe this section..."
                  rows={2}
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteSection(section.id)}
                className="!text-red-600 hover:!bg-red-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>

            {/* Items */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Menu Items</h3>
                <Button size="sm" variant="secondary" onClick={() => addItem(section.id)}>
                  + Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 rounded-lg p-5 border border-gray-200"
                  >
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Item Name"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(section.id, item.id, {
                            name: e.target.value,
                          })
                        }
                        placeholder="Dish name"
                      />

                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          label="Currency"
                          value={item.currency}
                          onChange={(e) =>
                            updateItem(section.id, item.id, {
                              currency: e.target.value,
                            })
                          }
                          placeholder="$"
                        />
                        <div className="col-span-2">
                          <Input
                            label="Price"
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) =>
                              updateItem(section.id, item.id, {
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>

                    <Textarea
                      label="Description"
                      value={item.description || ''}
                      onChange={(e) =>
                        updateItem(section.id, item.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe this item..."
                      rows={2}
                      className="mb-4"
                    />

                    <div className="flex items-end justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item Photo (Optional)
                        </label>
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-16 object-cover rounded-lg border-2 border-gray-200"
                            />
                          )}
                          <label className="cursor-pointer flex-1">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-2.5 hover:border-gray-400 hover:bg-white transition-all text-center">
                              <span className="text-sm text-gray-700">
                                {item.image ? 'Change photo' : 'Upload photo'}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file)
                                    handleImageUpload(file, section.id, item.id);
                                }}
                                disabled={uploading}
                                className="hidden"
                              />
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.available}
                            onChange={(e) =>
                              updateItem(section.id, item.id, {
                                available: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-gray-900 rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-600">Available</span>
                        </label>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(section.id, item.id)}
                          className="!text-red-600 hover:!bg-red-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {section.items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-3">No items in this section yet</p>
                    <Button size="sm" variant="outline" onClick={() => addItem(section.id)}>
                      Add First Item
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Actions */}
      <div className="sticky bottom-6 bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => onPreview?.(menu)}>
            👁️ Preview Menu
          </Button>
          <Button onClick={handleSave} className="min-w-[160px]">
            💾 Save Menu
          </Button>
        </div>
      </div>
    </div>
  );
};
