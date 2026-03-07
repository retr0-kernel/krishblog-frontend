import Link from "next/link";

export function Footer() {
  return (
      <footer className="border-t border-[hsl(var(--border))] mt-24 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-sans text-[hsl(var(--muted-foreground))]">
          <p>
          <span style={{ fontFamily: '"Playfair Display", serif' }} className="font-bold text-[hsl(var(--foreground))]">
            Krish<span className="text-[hsl(var(--accent))]">.</span>
          </span>
            {" "}— A personal chronicle.
          </p>
          <nav className="flex gap-6">
            <Link href="/" className="hover:text-[hsl(var(--foreground))] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[hsl(var(--foreground))] transition-colors">About</Link>
            <Link href="/rss" className="hover:text-[hsl(var(--foreground))] transition-colors">RSS</Link>
          </nav>
          <p>© {new Date().getFullYear()} Krish</p>
        </div>
      </footer>
  );
}
