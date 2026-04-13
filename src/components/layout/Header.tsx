import ThemeToggle from './ThemeToggle'; // <--- Add this import

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur transition-colors dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 font-sans">
        {/* Left: branding */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-zinc-900 dark:text-white">🌶️ Spicy Regs</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Dashboard</span>
        </div>

        {/* Right: navigation links */}
        <nav className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
          <a href="#about" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
            About
          </a>
          <a
            href="https://github.com"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
          
          {/* THE TOGGLE */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
