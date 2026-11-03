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
    const savedMenu = MenuService.saveMenu(menu);
    setMenu(savedMenu);
    onSave?.(savedMenu);
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Basic Information */}
      <div className="bg-menu-cream-50 border border-menu-charcoal-200/60 shadow-menu">
        <div className="bg-menu-cream-200 border-b border-menu-charcoal-200/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-menu-gold-600 text-white flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-menu-charcoal-900 uppercase tracking-wide">Basic Information</h2>
              <p className="text-xs text-menu-charcoal-600">Start by adding your restaurant details</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5 bg-menu-cream-100">
          <Input
            label="Restaurant Name *"
            value={menu.restaurantName}
            onChange={(e) => updateMenu({ restaurantName: e.target.value })}
            placeholder="e.g., La Bella Italia"
          />

          <Textarea
            label="Restaurant Description"
            value={menu.description || ''}
            onChange={(e) => updateMenu({ description: e.target.value })}
            placeholder="Brief description of your restaurant (optional)"
            rows={3}
          />

          <div>
            <label className="block text-xs font-semibold text-menu-charcoal-700 uppercase tracking-wider mb-2">
              Restaurant Logo (Optional)
            </label>
            <div className="flex items-center gap-4">
              {menu.customization.logoImage && (
                <div className="relative">
                  <img
                    src={menu.customization.logoImage}
                    alt="Logo"
                    className="h-20 w-20 object-contain border border-menu-charcoal-200/60"
                  />
                  <button
                    onClick={() => updateCustomization({ logoImage: '' })}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              )}
              <label className="flex-1 cursor-pointer">
                <div className="border border-dashed border-menu-charcoal-300/60 p-6 hover:border-menu-gold-500 hover:bg-white transition-all text-center bg-menu-cream-200">
                  <svg className="w-8 h-8 mx-auto mb-2 text-menu-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-menu-charcoal-700 font-semibold">Upload Logo</span>
                  <p className="text-xs text-menu-charcoal-500 mt-1">PNG, JPG up to 5MB</p>
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

      {/* Step 2: Display Settings */}
      <div className="bg-menu-cream-50 border border-menu-charcoal-200/60 shadow-menu">
        <div className="bg-menu-cream-200 border-b border-menu-charcoal-200/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-menu-gold-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-menu-charcoal-900 uppercase tracking-wide">Display Settings</h2>
              <p className="text-xs text-menu-charcoal-600">Control what appears on your menu</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5 bg-menu-cream-100">
          <div className="bg-menu-cream-200 border border-menu-charcoal-200/60 p-5 rounded-sm">
            <p className="text-xs font-bold text-menu-charcoal-700 uppercase tracking-wider mb-4">What to Display</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-menu-cream-50 transition-colors rounded-sm">
                <input
                  type="checkbox"
                  checked={menu.customization.showPrices}
                  onChange={(e) =>
                    updateCustomization({ showPrices: e.target.checked })
                  }
                  className="w-5 h-5 text-menu-gold-600 rounded border border-menu-charcoal-300/60 focus:ring-2 focus:ring-menu-gold-500"
                />
                <div>
                  <span className="text-sm font-semibold text-menu-charcoal-900 block">Show Prices</span>
                  <span className="text-xs text-menu-charcoal-600">Display item prices on the menu</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-menu-cream-50 transition-colors rounded-sm">
                <input
                  type="checkbox"
                  checked={menu.customization.showDescriptions}
                  onChange={(e) =>
                    updateCustomization({ showDescriptions: e.target.checked })
                  }
                  className="w-5 h-5 text-menu-gold-600 rounded border border-menu-charcoal-300/60 focus:ring-2 focus:ring-menu-gold-500"
                />
                <div>
                  <span className="text-sm font-semibold text-menu-charcoal-900 block">Show Descriptions</span>
                  <span className="text-xs text-menu-charcoal-600">Display item descriptions</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-menu-cream-50 transition-colors rounded-sm">
                <input
                  type="checkbox"
                  checked={menu.customization.showImages}
                  onChange={(e) =>
                    updateCustomization({ showImages: e.target.checked })
                  }
                  className="w-5 h-5 text-menu-gold-600 rounded border border-menu-charcoal-300/60 focus:ring-2 focus:ring-menu-gold-500"
                />
                <div>
                  <span className="text-sm font-semibold text-menu-charcoal-900 block">Show Images</span>
                  <span className="text-xs text-menu-charcoal-600">Display item photos</span>
                </div>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-menu-charcoal-700 uppercase tracking-wider mb-2">
                Primary Color
              </label>
              <div className="flex gap-3 items-stretch">
                <input
                  type="color"
                  value={menu.customization.primaryColor}
                  onChange={(e) =>
                    updateCustomization({ primaryColor: e.target.value })
                  }
                  className="h-auto w-16 cursor-pointer border border-menu-charcoal-200/60 rounded-sm"
                />
                <Input
                  value={menu.customization.primaryColor}
                  onChange={(e) =>
                    updateCustomization({ primaryColor: e.target.value })
                  }
                  className="flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-menu-charcoal-700 uppercase tracking-wider mb-2">
                Secondary Color
              </label>
              <div className="flex gap-3 items-stretch">
                <input
                  type="color"
                  value={menu.customization.secondaryColor}
                  onChange={(e) =>
                    updateCustomization({ secondaryColor: e.target.value })
                  }
                  className="h-auto w-16 cursor-pointer border border-menu-charcoal-200/60 rounded-sm"
                />
                <Input
                  value={menu.customization.secondaryColor}
                  onChange={(e) =>
                    updateCustomization({ secondaryColor: e.target.value })
                  }
                  className="flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Menu Sections & Items */}
      <div className="bg-menu-cream-50 border border-menu-charcoal-200/60 shadow-menu">
        <div className="bg-menu-cream-200 border-b border-menu-charcoal-200/60 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-menu-gold-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h2 className="text-lg font-bold text-menu-charcoal-900 uppercase tracking-wide">Menu Sections & Items</h2>
                <p className="text-xs text-menu-charcoal-600">Add your menu categories and dishes</p>
              </div>
            </div>
            <Button onClick={addSection} variant="gold" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Section
            </Button>
          </div>
        </div>

        <div className="p-6 bg-menu-cream-100">
          {menu.sections.length === 0 && (
            <div className="border border-dashed border-menu-charcoal-300/60 bg-menu-cream-200 p-12 text-center rounded-sm">
              <svg className="w-16 h-16 mx-auto mb-4 text-menu-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-bold text-menu-charcoal-900 mb-2 uppercase tracking-wide">No Sections Yet</h3>
              <p className="text-sm text-menu-charcoal-600 mb-6">Create your first menu section (e.g., Appetizers, Main Courses, Desserts)</p>
              <Button onClick={addSection} variant="gold">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create First Section
              </Button>
            </div>
          )}

          <div className="space-y-4">

        {menu.sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className="bg-white border border-menu-charcoal-200/60 shadow-menu rounded-sm"
          >
            <div className="bg-menu-cream-100 border-b border-menu-charcoal-200/60 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 bg-menu-charcoal-700 text-white flex items-center justify-center text-sm font-bold">
                  {sectionIndex + 1}
                </span>
                <span className="text-sm font-bold text-menu-charcoal-900 uppercase tracking-wide">Section {sectionIndex + 1}</span>
              </div>
              <button
                onClick={() => deleteSection(section.id)}
                className="text-red-600 hover:bg-red-50 p-2 transition-colors"
                title="Delete Section"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4 bg-menu-cream-50">
              <Input
                label={`Section Name *`}
                value={section.name}
                onChange={(e) =>
                  updateSection(section.id, { name: e.target.value })
                }
                placeholder="e.g., Appetizers, Main Courses, Desserts"
              />

              <Textarea
                label="Section Description (Optional)"
                value={section.description || ''}
                onChange={(e) =>
                  updateSection(section.id, { description: e.target.value })
                }
                placeholder="Optional description for this section..."
                rows={2}
              />
            </div>

            {/* Items */}
            <div className="border-t border-menu-charcoal-200/60 bg-white p-5">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-bold text-menu-charcoal-900 uppercase tracking-wider">Items in this Section</h3>
                <Button size="sm" variant="secondary" onClick={() => addItem(section.id)}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-menu-cream-50 p-4 border border-menu-charcoal-200/60 rounded-sm"
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
                        <label className="block text-sm font-medium text-menu-charcoal-700 uppercase tracking-wide mb-2">
                          Item Photo (Optional)
                        </label>
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-16 object-cover border-menu border-menu-charcoal-200"
                            />
                          )}
                          <label className="cursor-pointer flex-1">
                            <div className="border border-dashed border-menu-charcoal-300/60 px-4 py-2.5 hover:border-menu-gold-500 hover:bg-white transition-all text-center rounded-sm bg-menu-cream-100">
                              <span className="text-sm text-menu-charcoal-700 uppercase tracking-wide">
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
                            className="w-4 h-4 text-menu-gold-600 border-menu-charcoal-300"
                          />
                          <span className="text-sm text-menu-charcoal-600 uppercase tracking-wide">Available</span>
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
                  <div className="text-center py-10 border border-dashed border-menu-charcoal-300/60 bg-menu-cream-100 rounded-sm">
                    <svg className="w-12 h-12 mx-auto mb-3 text-menu-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="mb-4 text-sm font-semibold text-menu-charcoal-700">No Items Yet</p>
                    <Button size="sm" variant="gold" onClick={() => addItem(section.id)}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add First Item
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
          </div>
        </div>
      </div>

      {/* Save Actions */}
      <div className="sticky bottom-6 bg-menu-cream-50 border border-menu-charcoal-200/60 shadow-menu-lg p-4 rounded-sm">
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => onPreview?.(menu)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview Menu
          </Button>
          <Button onClick={handleSave} variant="primary" className="min-w-[160px]">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Menu
          </Button>
        </div>
      </div>
    </div>
  );
};
