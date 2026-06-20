"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/ui/Modal";
import { BreakingTicker } from "@/components/feed/BreakingTicker";

export default function ReaderLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-dvh pb-16 md:pb-0">
      <BreakingTicker />
      <Navbar onMenu={() => setMenuOpen(true)} />
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="grid gap-6 md:grid-cols-[220px,1fr]">
          <Sidebar className="sticky top-20 hidden h-[calc(100vh-6rem)] overflow-y-auto pr-2 md:block" />
          <main id="main" className="min-w-0">{children}</main>
        </div>
      </div>
      <Footer />
      <MobileNav />
      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} title="Navigation">
        <Sidebar />
      </Modal>
    </div>
  );
}
