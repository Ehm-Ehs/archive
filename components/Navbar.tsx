"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mic, BookOpen, Sun, Moon, ShieldCheck } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full bg-chalkboard-dark/95 backdrop-blur-md border-b border-white/10 text-white transition-colors">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0" title="Before We Forget... Nigerian Oral Heritage Archive">
          <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
            <Image
              src="/before_we_forget_icon_only.svg"
              alt="Before We Forget Icon"
              width={80}
              height={60}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="block">
            <h1 className="font-handwriting font-bold text-xl sm:text-2xl md:text-3xl tracking-wide text-white leading-none whitespace-nowrap">
              Before We <span className="text-crayon-yellow underline">Forget...</span>
            </h1>
            <p className="text-[0.65rem] sm:text-[0.72rem] text-white/70 font-medium tracking-wide hidden md:block">
              Nigerian Oral Heritage Archive
            </p>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <nav className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link href="/" title="Drop your own one">
            <Button
              variant={pathname === "/" ? "danger" : "outline"}
              size="sm"
              leftIcon={<Mic size={16} />}
              className={
                pathname === "/"
                  ? "bg-crayon-red hover:bg-crayon-red-hover text-white font-handwriting text-base border-none shadow-coral p-2 md:px-3.5 md:py-1.5 rounded-full md:rounded-2xl"
                  : "text-white border-white/30 hover:bg-white/10 font-handwriting text-base p-2 md:px-3.5 md:py-1.5 rounded-full md:rounded-2xl"
              }
            >
              <span className="hidden md:inline">Drop your own one</span>
            </Button>
          </Link>

          <Link href="/gallery" title="See wetin others don share">
            <Button
              variant={pathname === "/gallery" ? "danger" : "outline"}
              size="sm"
              leftIcon={<BookOpen size={16} />}
              className={
                pathname === "/gallery"
                  ? "bg-crayon-red hover:bg-crayon-red-hover text-white font-handwriting text-base border-none shadow-coral p-2 md:px-3.5 md:py-1.5 rounded-full md:rounded-2xl"
                  : "text-white border-white/30 hover:bg-white/10 font-handwriting text-base p-2 md:px-3.5 md:py-1.5 rounded-full md:rounded-2xl"
              }
            >
              <span className="hidden md:inline">See wetin others don share</span>
            </Button>
          </Link>

          {/* Admin Queue Button */}
          <Link href="/admin" title="Admin Moderation Queue">
            <button
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center hover:text-crayon-yellow hover:bg-white/20 transition-all"
            >
              <ShieldCheck size={16} />
            </button>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title="Toggle Theme"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center transition-transform hover:scale-110"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} className="text-crayon-yellow" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
