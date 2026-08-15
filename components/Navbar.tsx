"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music, Mic, BookOpen, Sun, Moon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("rhymes_theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("rhymes_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <header className="sticky top-0 z-40 bg-chalkboard-dark/90 backdrop-blur-md border-b border-white/10 text-white transition-colors">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-crayon-red flex items-center justify-center text-white shadow-coral transition-transform group-hover:scale-105">
            <Music size={20} />
          </div>
          <div>
            <h1 className="font-handwriting font-bold text-2xl sm:text-3xl tracking-wide text-white leading-none">
              Before We <span className="text-crayon-yellow">Forget...</span>
            </h1>
            <p className="text-[0.72rem] text-white/70 font-medium tracking-wide">
              Nigerian Oral Heritage Archive
            </p>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "danger" : "outline"}
              size="sm"
              leftIcon={<Mic size={15} />}
              className={pathname === "/" ? "bg-crayon-red hover:bg-crayon-red-hover text-white font-handwriting text-base border-none shadow-coral" : "text-white border-white/30 hover:bg-white/10 font-handwriting text-base"}
            >
              Drop your own one
            </Button>
          </Link>

          <Link href="/gallery">
            <Button
              variant={pathname === "/gallery" ? "danger" : "outline"}
              size="sm"
              leftIcon={<BookOpen size={15} />}
              className={pathname === "/gallery" ? "bg-crayon-red hover:bg-crayon-red-hover text-white font-handwriting text-base border-none shadow-coral" : "text-white border-white/30 hover:bg-white/10 font-handwriting text-base"}
            >
              See wetin others don share
            </Button>
          </Link>

          {/* Admin Queue Button */}
          <Link href="/admin">
            <button
              title="Admin Moderation Queue"
              className="p-2 rounded-full border border-white/20 bg-white/10 text-white hover:text-crayon-yellow hover:bg-white/20 transition-all"
            >
              <ShieldCheck size={17} />
            </button>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-9 h-9 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center transition-transform hover:scale-110"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} className="text-crayon-yellow" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
