import { Hammer } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-12 border-t py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-neutral-500 sm:flex-row">
        <p>© 2026 NewsAI. Frontend-only demo.</p>
        <p className="inline-flex items-center gap-1.5">
          Developed by
          <a
            href="#"
            className="inline-flex items-center gap-1 font-semibold text-neutral-700 transition-colors hover:text-brand-600 dark:text-neutral-200"
          >
            <Hammer className="h-3.5 w-3.5 text-brand-600" />
            Digital Hammer
          </a>
        </p>
      </div>
    </footer>
  );
}
