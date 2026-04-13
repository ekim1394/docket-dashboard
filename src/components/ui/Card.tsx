/**
 * Card — reusable wrapper for dashboard sections.
 * Renders a dark-themed container with an optional title and consistent spacing.
 */

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50 ${className}`}
    >
      {title && (
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
