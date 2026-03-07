import Link from "next/link";
import { SubscribeForm } from "@/components/shared/subscribe-form";

export function Footer() {
  return (
      <footer className="border-t border-[hsl(var(--border))] mt-24">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid gap-12 mb-12" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {/* Brand */}
            <div className="space-y-3">
              <p className="text-xl font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>
                Krish<span className="text-[hsl(var(--accent))]">.</span>
              </p>
              <p className="text-sm font-sans text-[hsl(var(--muted-foreground))] leading-relaxed">
                Writing about code, ideas, and whatever else captures my attention.
              </p>
            </div>

            {/* Nav */}
            <div className="space-y-4">
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                Pages
              </p>
              <nav className="flex flex-col gap-2 font-sans text-sm">
                <Link href="/" className="hover:text-[hsl(var(--accent))] transition-colors">Home</Link>
                <Link href="/about" className="hover:text-[hsl(var(--accent))] transition-colors">About</Link>
                <Link href="/search" className="hover:text-[hsl(var(--accent))] transition-colors">Search</Link>
                <Link href="/rss" className="hover:text-[hsl(var(--accent))] transition-colors">RSS</Link>
              </nav>
            </div>

            {/* Subscribe */}
            <div className="space-y-4">
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                Stay updated
              </p>
              <p className="text-sm font-sans text-[hsl(var(--muted-foreground))]">
                New posts to your inbox. No spam.
              </p>
              <SubscribeForm compact />
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-[hsl(var(--border))] font-sans text-xs text-[hsl(var(--muted-foreground))]">
            <p>© {new Date().getFullYear()} Krish. All rights reserved.</p>
            <nav className="flex gap-4">
              <Link href="/about" className="hover:text-[hsl(var(--foreground))] transition-colors">About</Link>
              <Link href="/rss" className="hover:text-[hsl(var(--foreground))] transition-colors">RSS</Link>
            </nav>
          </div>
        </div>
      </footer>
  );
}
