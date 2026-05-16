export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
      <p>
        Built by{" "}
        <a
          href="https://civictechdc.org"
          className="underline transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          CivicTechDC
        </a>
      </p>
      <p className="mt-1">Data from regulations.gov via Mirrulations</p>
    </footer>
  );
}
