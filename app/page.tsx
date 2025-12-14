'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MenuService } from '@/lib/services/menuService';
import { Menu } from '@/lib/types/menu';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    setMenus(MenuService.getAllMenus());
  }, []);

  const handleDeleteMenu = (menuId: string) => {
    if (confirm('Are you sure you want to delete this menu?')) {
      MenuService.deleteMenu(menuId);
      setMenus(MenuService.getAllMenus());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Clean & Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center transition-transform group-hover:scale-105">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">MenuCraft</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#templates" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                Templates
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                How It Works
              </a>
              {menus.length > 0 && (
                <a href="#your-menus" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                  Your Menus
                </a>
              )}
              <Link href="/builder">
                <button className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Link href="/builder" className="md:hidden">
              <button className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg">
                Start
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Clean & Editorial */}
      <section className="relative pt-32 pb-24 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
              Create Beautiful Digital Menus in Minutes
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Professional menu builder for restaurants. Design, customize, and share stunning digital menus with QR codes. No coding required.
            </p>

            {/* Primary CTA */}
            <div className="pt-4">
              <Link href="/builder">
                <button className="px-8 py-4 bg-gray-900 text-white text-base font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
                  Start Creating Free
                </button>
              </Link>
              <p className="text-sm text-gray-500 mt-4">No credit card required • Free forever</p>
            </div>
          </div>

          {/* Visual Preview - Menu Template Mockup */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-block bg-white px-4 py-1.5 rounded text-xs text-gray-600">
                    menucraft.app/menu/preview
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12 bg-gradient-to-br from-gray-50 to-white">
                <div className="space-y-8">
                  {/* Mock Menu Header */}
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Restaurant Name</h2>
                    <p className="text-gray-600">Fine Dining Experience</p>
                  </div>
                  
                  {/* Mock Menu Items */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">Menu Item {item}</h3>
                          <span className="text-gray-900 font-medium">$12</span>
                        </div>
                        <p className="text-sm text-gray-600">Delicious description of the menu item</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Choose Your Template
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start with a professionally designed template and customize it to match your brand
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Modern', desc: 'Clean and contemporary design' },
              { name: 'Classic', desc: 'Timeless and elegant layout' },
              { name: 'Minimal', desc: 'Simple and sophisticated' }
            ].map((template, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all group"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border-b border-gray-200">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 bg-gray-900 rounded-lg mx-auto flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white rounded p-3 shadow-sm">
                          <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-2 bg-gray-100 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm">{template.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create your digital menu in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Choose Template',
                description: 'Select from our collection of professionally designed menu templates'
              },
              {
                step: '02',
                title: 'Customize Content',
                description: 'Add your dishes, prices, descriptions, and images with our easy-to-use builder'
              },
              {
                step: '03',
                title: 'Share & Update',
                description: 'Generate QR codes, share your menu link, and update anytime instantly'
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white text-xl font-bold rounded-full">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-24 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Everything you need to create stunning menus
              </h2>
              <div className="space-y-4">
                {[
                  { title: 'QR Code Generation', desc: 'Instant QR codes for contactless ordering' },
                  { title: 'Real-time Updates', desc: 'Change prices and items without reprinting' },
                  { title: 'Image Upload', desc: 'Showcase your dishes with beautiful photos' },
                  { title: 'Custom Branding', desc: 'Match your restaurant\'s unique style' },
                  { title: 'Mobile Optimized', desc: 'Perfect viewing on any device' },
                  { title: 'Cloud Hosted', desc: 'Always accessible, never goes down' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-gray-900 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
              <div className="space-y-6">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">Scan to view menu</p>
                  <p className="text-xs text-gray-500 mt-1">QR code example</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Your Menus Section */}
      {menus.length > 0 && (
        <section id="your-menus" className="py-24 px-6 lg:px-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Menus</h2>
                <p className="text-gray-600">Manage and edit your created menus</p>
              </div>
              <Link href="/builder">
                <button className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  + New Menu
                </button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {menu.restaurantName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {menu.sections.length} sections • {menu.template}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[40px]">
                    {menu.description || 'No description'}
                  </p>

                  <div className="flex gap-2">
                    <Link href={`/menu/${menu.id}`} className="flex-1">
                      <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        View
                      </button>
                    </Link>
                    <Link href={`/builder?id=${menu.id}`} className="flex-1">
                      <button className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteMenu(menu.id)}
                      className="px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join restaurants using digital menus to enhance their customer experience. Create your first menu in minutes.
          </p>
          <Link href="/builder">
            <button className="px-8 py-4 bg-white text-gray-900 text-base font-medium rounded-lg hover:bg-gray-100 transition-all shadow-lg">
              Create Your Menu Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">MenuCraft</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 MenuCraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
