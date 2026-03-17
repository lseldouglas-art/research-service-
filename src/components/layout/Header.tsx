'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Sparkles,
  Menu,
  X,
  Heart,
} from 'lucide-react';
import { useState } from 'react';
import { UserMenu } from '@/components/auth';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/services', label: '服务' },
    { href: '/tools', label: '工具' },
    { href: '/training', label: '培训' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d69e2e] to-[#ecc94b] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline">
              科研助手
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/donate"
              className="ml-2 px-4 py-2 rounded-lg flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
            >
              <Heart className="w-4 h-4" />
              支持
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <UserMenu />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/donate"
                className="px-4 py-3 rounded-lg flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="w-4 h-4" />
                支持我们
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
