export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 font-sans">
        {/* Left: branding */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">🌶️ Spicy Regs</span>
          <span className="text-sm text-zinc-400">Dashboard</span>
        </div>

        {/* Right: navigation links */}
        <nav className="flex items-center gap-4 text-sm text-zinc-400">
          <a href="#about" className="transition-colors hover:text-zinc-100">
            About
          </a>
          <a
            href="https://github.com/civictechdc/spicy-regs-dashboard"
            className="transition-colors hover:text-zinc-100"
          >
            GitHub
          </a>
          <a
            href="https://spicyregs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-100"
          >
            Main Site ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
