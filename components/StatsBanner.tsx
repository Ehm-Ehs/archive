"use client";
import React from "react";
import { RhymeEntry, ItemCategory } from "@/types/rhyme";
import { Music, HelpCircle, BookOpen, Quote, Mic, Globe } from "lucide-react";

interface StatsBannerProps {
  rhymes: RhymeEntry[];
}

export function getItemCategory(r: RhymeEntry): ItemCategory {
  if (r.category) return r.category;
  const t = (r.type || "").toLowerCase();
  if (r.riddleAnswer || t.includes("riddle") || t.includes("puzzle")) {
    return "Riddle";
  }
  if (r.proverbMeaning || t.includes("proverb") || t.includes("adage") || t.includes("saying")) {
    return "Proverb / Adage";
  }
  return "Rhyme / Song";
}

export default function StatsBanner({ rhymes }: StatsBannerProps) {
  const rhymesCount = rhymes.filter(
    (r) => getItemCategory(r) === "Rhyme / Song"
  ).length;

  const riddlesCount = rhymes.filter(
    (r) => getItemCategory(r) === "Riddle"
  ).length;

  const adagesCount = rhymes.filter((r) => {
    const cat = getItemCategory(r);
    const typeStr = (r.type || "").toLowerCase();
    return cat === "Proverb / Adage" && typeStr.includes("adage");
  }).length;

  const proverbsCount = rhymes.filter((r) => {
    const cat = getItemCategory(r);
    const typeStr = (r.type || "").toLowerCase();
    return cat === "Proverb / Adage" && !typeStr.includes("adage");
  }).length;

  const audioCount = rhymes.filter(
    (r) => Boolean(r.audioURL) || (r.audioURLs && r.audioURLs.length > 0)
  ).length;

  const languagesCount = new Set(rhymes.map((r) => r.language)).size;

  const statItems = [
    {
      label: "Rhymes & Songs",
      value: rhymesCount,
      icon: Music,
      color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    },
    {
      label: "Riddles",
      value: riddlesCount,
      icon: HelpCircle,
      color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    },
    {
      label: "Proverbs",
      value: proverbsCount,
      icon: BookOpen,
      color: "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20",
    },
    {
      label: "Adages",
      value: adagesCount,
      icon: Quote,
      color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20",
    },
    {
      label: "Voice Notes",
      value: audioCount,
      icon: Mic,
      color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    },
    {
      label: "Languages",
      value: languagesCount,
      icon: Globe,
      color: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      {statItems.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="notebook-paper p-3.5 flex items-center gap-3 border border-black/10 shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}
            >
              <Icon size={18} />
            </div>
            <div>
              <div className="font-heading font-extrabold text-xl leading-none text-ink">
                {stat.value}
              </div>
              <div className="text-[0.72rem] font-semibold text-ink/70 mt-1 leading-tight">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
