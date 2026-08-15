"use client";
import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-chalkboard-dark/90 text-white backdrop-blur-sm py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="max-w-md">
            <h3 className="font-handwriting font-bold text-2xl text-crayon-yellow mb-2">
              Before We Forget...
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              A public initiative dedicated to documenting, recording, and preserving traditional assembly march-in songs, nursery rhymes, riddles, proverbs, and street playground chants for future generations.
            </p>
          </div>

          <div className="flex gap-10 flex-wrap">
            <div>
              <h4 className="font-heading font-bold text-sm text-white mb-3">Navigation</h4>
              <ul className="flex flex-col gap-2 text-xs sm:text-sm text-white/70 font-sans">
                <li><Link href="/" className="hover:text-crayon-yellow transition-colors font-handwriting text-lg">Drop your own one</Link></li>
                <li><Link href="/gallery" className="hover:text-crayon-yellow transition-colors font-handwriting text-lg">See wetin others don share</Link></li>
                <li><Link href="/admin" className="hover:text-crayon-yellow transition-colors font-handwriting text-lg flex items-center gap-1"><ShieldCheck size={14} /> Admin Queue</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-sm text-white mb-3">Preserved Languages</h4>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                English • Yoruba • Igbo • Hausa • Pidgin • Efik / Ibibio • Edo • Urhobo • Tiv
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/50 font-sans">
          <span>© {new Date().getFullYear()} Nigerian Oral Heritage Archive. Open Access Cultural Preservation Project.</span>
          <span className="flex items-center gap-1.5">
            Built with <Heart size={14} className="text-crayon-red fill-crayon-red" /> for African Heritage & Storytelling
          </span>
        </div>
      </div>
    </footer>
  );
}
