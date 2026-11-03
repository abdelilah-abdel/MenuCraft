'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MenuService } from '@/lib/services/menuService';
import { Menu } from '@/lib/types/menu';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [owner, setOwner] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOwnerWorkspace() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        const result = await response.json() as { owner?: { id: string; email: string } | null };
        if (!isMounted || !response.ok || !result.owner) return;

        setOwner(result.owner);
        setMenus(MenuService.getMenusForOwner(result.owner.id));
      } catch {
        // Keep the public landing page available when session lookup fails.
      }
    }

    void loadOwnerWorkspace();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setOwner(null);
    setMenus([]);
  };

  return (
    <div className="min-h-screen bg-menu-cream-200">
      {/* Top Navigation - Menu Style */}
      <nav className="sticky top-0 z-50 bg-menu-cream-50 border-b-menu border-menu-charcoal-200 shadow-menu-sm">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-serif menu-title text-menu-charcoal-900">MenuCraft</span>
              <span className="text-menu-gold-500 text-sm">∗</span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#templates" className="text-menu-charcoal-700 hover:text-menu-gold-600 transition-colors text-sm uppercase tracking-wider">
                Templates
              </a>
              <a href="#features" className="text-menu-charcoal-700 hover:text-menu-gold-600 transition-colors text-sm uppercase tracking-wider">
                Features
              </a>
              {owner && menus.length > 0 && (
                <a href="#your-menus" className="text-menu-charcoal-700 hover:text-menu-gold-600 transition-colors text-sm uppercase tracking-wider">
                  Your Menu
                </a>
              )}
              {owner ? (
                <>
                  <span className="text-xs text-menu-charcoal-500">{owner.email}</span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-menu-charcoal-700 hover:text-menu-gold-600 transition-colors text-sm uppercase tracking-wider"
                  >
                    Sign out
                  </button>
                  <Link href="/builder">
                    <Button variant="primary" size="sm">Manage Menu</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="text-menu-charcoal-700 hover:text-menu-gold-600 transition-colors text-sm uppercase tracking-wider">
                    Sign in
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="primary" size="sm">Create Account</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile */}
            <Link href={owner ? '/builder' : '/sign-up'} className="md:hidden">
              <Button variant="primary" size="sm">
                {owner ? 'Your Menu' : 'Get Started'}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Menu Cover */}
      <section className="relative py-20 px-6 lg:px-12 bg-menu-cream-50">
        <div className="max-w-5xl mx-auto text-center">
          {/* Ornamental Top */}
          <div className="menu-ornament"></div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif menu-title text-menu-charcoal-900 mb-6">
            Digital Menus
          </h1>

          <div className="menu-divider-center mb-6"></div>

          <p className="text-xl md:text-2xl menu-subtitle max-w-2xl mx-auto mb-8">
            Create elegant restaurant menus in minutes<br />
            <span className="text-base text-menu-charcoal-500">Professional • Simple • Beautiful</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href={owner ? '/builder' : '/sign-up'}>
              <Button variant="primary" size="lg">
                {owner ? 'Maintain Your Menu' : 'Create Your Menu'}
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              View Examples
            </Button>
          </div>

          {/* Preview Card */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="menu-card p-8 md:p-12">
              <div className="space-y-8">
                {/* Menu Header */}
                <div className="text-center border-b-menu border-menu-gold-300 pb-6">
                  <h2 className="text-3xl font-serif menu-title text-menu-charcoal-900 mb-2">
                    Your Restaurant
                  </h2>
                  <p className="menu-subtitle text-lg">Fine Dining Experience</p>
                </div>

                {/* Menu Items Preview */}
                <div className="space-y-6">
                  {[
                    { name: 'Signature Appetizer', price: '14', desc: 'Fresh seasonal ingredients' },
                    { name: 'Chef\'s Special Entrée', price: '28', desc: 'Premium cuts, locally sourced' },
                    { name: 'Artisan Dessert', price: '12', desc: 'House-made daily' }
                  ].map((item, i) => (
                    <div key={i} className="menu-item">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-lg font-serif text-menu-charcoal-900">{item.name}</h3>
                        <span className="menu-price text-lg">${item.price}</span>
                      </div>
                      <p className="menu-description">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 px-6 lg:px-12 bg-menu-cream-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="menu-divider-dots mb-6"></div>
            <h2 className="text-4xl md:text-5xl font-serif menu-title text-menu-charcoal-900 mb-4">
              Choose Your Template
            </h2>
            <p className="text-lg menu-description max-w-2xl mx-auto">
              Start with a professionally designed template
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Modern', desc: 'Clean & contemporary' },
              { name: 'Classic', desc: 'Timeless elegance' },
              { name: 'Minimal', desc: 'Simple & sophisticated' }
            ].map((template, index) => (
              <div
                key={index}
                className="menu-card p-8 hover-lift"
              >
                <div className="text-center space-y-4">
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto bg-menu-cream-200 flex items-center justify-center">
                    <svg className="w-8 h-8 text-menu-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif menu-title text-menu-charcoal-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="menu-description">{template.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 lg:px-12 bg-menu-cream-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="menu-divider-dots mb-6"></div>
            <h2 className="text-4xl md:text-5xl font-serif menu-title text-menu-charcoal-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg menu-description max-w-2xl mx-auto">
              Professional features for modern restaurants
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z', title: 'QR Codes', desc: 'Instant contactless menus' },
              { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', title: 'Image Upload', desc: 'Showcase your dishes' },
              { icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', title: 'Customization', desc: 'Match your brand' },
              { icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', title: 'Mobile First', desc: 'Perfect on any device' },
              { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Real-Time Updates', desc: 'Update instantly' },
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Secure & Free', desc: 'Your data protected' },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center space-y-4"
              >
                <div className="w-12 h-12 mx-auto bg-menu-cream-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-menu-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-serif text-menu-charcoal-900 uppercase tracking-wide mb-2">
                    {feature.title}
                  </h3>
                  <p className="menu-description text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Menus Section */}
      {owner && menus.length > 0 && (
        <section id="your-menus" className="py-20 px-6 lg:px-12 bg-menu-cream-100">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h2 className="text-4xl font-serif menu-title text-menu-charcoal-900 mb-2">Your Menu</h2>
                <p className="menu-description">One restaurant workspace, one menu to maintain.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.slice(0, 1).map((menu) => (
                <div
                  key={menu.id}
                  className="menu-card p-6 hover-lift"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-serif text-menu-charcoal-900 mb-1">
                      {menu.restaurantName}
                    </h3>
                    <p className="text-sm text-menu-charcoal-500 uppercase tracking-wide">
                      {menu.sections.length} sections • {menu.template}
                    </p>
                  </div>

                  <p className="menu-description text-sm line-clamp-2 mb-6 min-h-[40px]">
                    {menu.description || 'No description'}
                  </p>

                  <div className="flex gap-3">
                    <Link href={`/menu/${menu.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                    <Link href={`/builder?id=${menu.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-12 bg-menu-charcoal-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="menu-ornament opacity-30"></div>

          <h2 className="text-4xl md:text-5xl font-serif menu-title text-menu-cream-50 mb-6">
            Ready to Create Your Menu?
          </h2>

          <p className="text-lg text-menu-cream-200 max-w-2xl mx-auto mb-8">
            Join modern restaurants creating beautiful digital menus
          </p>

          <Link href={owner ? '/builder' : '/sign-up'}>
            <Button variant="gold" size="lg">
              {owner ? 'Maintain Your Menu' : 'Create Your Menu'}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-menu-cream-50 border-t-menu border-menu-charcoal-200 py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-serif menu-title text-menu-charcoal-900">MenuCraft</span>
              <span className="text-menu-gold-500">∗</span>
            </div>
            <p className="text-sm text-menu-charcoal-500 uppercase tracking-wider">
              © 2025 MenuCraft. Digital Menus Made Simple.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
