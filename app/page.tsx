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
    <div className="min-h-screen bg-white">
      {/* Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">MenuCraft</span>
            </div>
            <Link href="/builder">
              <Button className="shadow-lg shadow-emerald-500/20">Create Menu</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Modern & Bold */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-full border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-900">Trusted by modern restaurants</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="block text-gray-900">Digital Menus</span>
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Made Simple</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create beautiful, professional menus in minutes. Generate QR codes, share instantly, and impress your customers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/builder">
                <Button size="lg" className="text-lg px-8 py-4 shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300">
                  Start Creating Free →
                </Button>
              </Link>
              <button className="px-8 py-4 text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors group">
                See Examples
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 pt-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional tools designed for modern restaurants
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                title: 'Beautiful Templates',
                description: 'Choose from professionally designed templates that make your menu stand out'
              },
              {
                icon: '📱',
                title: 'QR Code Ready',
                description: 'Generate branded QR codes instantly for contactless ordering'
              },
              {
                icon: '⚡',
                title: 'Instant Updates',
                description: 'Update prices and items in real-time without reprinting'
              },
              {
                icon: '🖼️',
                title: 'Image Upload',
                description: 'Showcase your dishes with beautiful photos'
              },
              {
                icon: '🎯',
                title: 'Full Customization',
                description: 'Match your brand with custom colors and fonts'
              },
              {
                icon: '☁️',
                title: 'Cloud Hosted',
                description: 'Always available, accessible from any device'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-emerald-100 text-lg">Free to Start</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">3</div>
              <div className="text-emerald-100 text-lg">Premium Templates</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">&lt;5min</div>
              <div className="text-emerald-100 text-lg">Setup Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Menus Section */}
      {menus.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Menus</h2>
                <p className="text-gray-600">Manage and edit your created menus</p>
              </div>
              <Link href="/builder">
                <Button>+ New Menu</Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                        {menu.restaurantName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {menu.sections.length} sections
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                      {menu.template}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[40px]">
                    {menu.description || 'No description'}
                  </p>

                  <div className="flex gap-2">
                    <Link href={`/menu/${menu.id}`} className="flex-1">
                      <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        View
                      </button>
                    </Link>
                    <Link href={`/builder?id=${menu.id}`} className="flex-1">
                      <button className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm hover:shadow-md">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900"></div>
        <div className="absolute inset-0 bg-grid-white/5"></div>

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join modern restaurants using digital menus to enhance their customer experience
          </p>
          <Link href="/builder">
            <Button size="lg" className="text-lg px-10 py-5 !bg-white !text-gray-900 hover:!bg-gray-100 shadow-2xl hover:scale-105 transition-all duration-300">
              Create Your Menu Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">MenuCraft</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 MenuCraft. Elevating restaurant experiences.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-white\/10 {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .bg-grid-white\/5 {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}
