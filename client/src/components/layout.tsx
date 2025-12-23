import React from "react";
import { Link } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-white">
      <header className="border-b-2 border-black sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-mono font-bold text-lg md:text-xl tracking-tighter hover:bg-black hover:text-white px-2 py-1 transition-colors uppercase border-2 border-transparent hover:border-transparent">
            Competitor Change Monitor
          </Link>
          <nav>
            <a href="#pricing" className="font-mono font-medium hover:underline decoration-2 underline-offset-4">
              Pricing
            </a>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t-2 border-black py-8 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-sm opacity-60">
            © {new Date().getFullYear()} COMPETITOR CHANGE MONITOR.
          </div>
          <div className="text-sm font-mono opacity-60">
            SIMPLE. RUTHLESS. USEFUL.
          </div>
        </div>
      </footer>
    </div>
  );
}
