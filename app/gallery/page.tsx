"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db, isFirebaseConfigured, MOCK_RHYMES } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import RhymeCard from "@/components/RhymeCard";
import StatsBanner, { getItemCategory } from "@/components/StatsBanner";
import { RhymeEntry, RhymeLanguage, ItemCategory, SortOption } from "@/types/rhyme";
import { deduplicateRhymes } from "@/lib/similarity";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Loader";
import { Search, Mic, Plus, ArrowUpDown, Music, BookOpen, Shuffle, HelpCircle, Layers } from "lucide-react";

const languagesList: ("All" | RhymeLanguage)[] = ["All", "English", "Yoruba", "Hausa", "Igbo", "Pidgin", "Efik / Ibibio", "Edo", "Other"];
const categoryFilterList: ("All" | ItemCategory)[] = ["All", "Rhyme / Song", "Riddle", "Proverb / Adage"];

export default function GalleryPage() {
  const [rhymes, setRhymes] = useState<RhymeEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [audioOnly, setAudioOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [randomRhyme, setRandomRhyme] = useState<RhymeEntry | null>(null);

  useEffect(() => {
    const fetchRhymes = async () => {
      setLoading(true);
      try {
        if (isFirebaseConfigured && db) {
          const q = query(collection(db, "rhymes"), orderBy("createdAt", "desc"));
          const snap = await getDocs(q);
          const docs: RhymeEntry[] = snap.docs.map((d) => {
            const raw = d.data();
            const entry: RhymeEntry = { id: d.id, category: raw.category || "Rhyme / Song", ...(raw as Omit<RhymeEntry, "id" | "category">) };
            entry.category = getItemCategory(entry);
            return entry;
          });
          setRhymes(deduplicateRhymes(docs.length > 0 ? docs : MOCK_RHYMES));
        } else {
          setRhymes(deduplicateRhymes(MOCK_RHYMES));
        }
      } catch (err) {
        setRhymes(deduplicateRhymes(MOCK_RHYMES));
      } finally {
        setLoading(false);
      }
    };
    fetchRhymes();
  }, []);

  const handleSurpriseMe = () => {
    if (rhymes.length > 0) {
      setRandomRhyme(rhymes[Math.floor(Math.random() * rhymes.length)]);
    }
  };

  const filteredRhymes = rhymes
    .filter((r) => {
      if (selectedCategory !== "All" && getItemCategory(r) !== selectedCategory) return false;
      if (selectedLanguage !== "All" && r.language !== selectedLanguage) return false;
      if (audioOnly && !r.audioURL && (!r.audioURLs || r.audioURLs.length === 0)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.text?.toLowerCase().includes(q) ||
          r.riddleAnswer?.toLowerCase().includes(q) ||
          r.proverbMeaning?.toLowerCase().includes(q) ||
          r.name?.toLowerCase().includes(q) ||
          r.region?.toLowerCase().includes(q) ||
          r.type?.toLowerCase().includes(q) ||
          r.locationGrewUp?.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "moral") return (b.moralsStrength || 0) - (a.moralsStrength || 0);
      if (sortBy === "extinct") return (b.extinctStrength || 0) - (a.extinctStrength || 0);
      if (sortBy === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  return (
    <div className="max-w-5xl mx-auto pb-12 px-2 sm:px-0">
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-4 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-extrabold uppercase bg-crayon-yellow/20 text-crayon-yellow border border-crayon-yellow/30 mb-2">
            <BookOpen size={13} /> Public Cultural Repository
          </div>
          <h1 className="font-handwriting font-bold text-3xl sm:text-5xl text-white">
            Wetin People Don Share
          </h1>
          <p className="text-white/70 text-xs sm:text-base mt-1 font-sans max-w-xl">
            Browse traditional nursery songs, riddles, and proverbs saved in our public memory box.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Button type="button" variant="outline" onClick={handleSurpriseMe} leftIcon={<Shuffle size={15} />} className="flex-1 md:flex-none border-crayon-yellow/40 text-crayon-yellow font-handwriting text-base sm:text-lg px-4 py-2">
            Surprise Me
          </Button>
          <Link href="/" className="flex-1 md:flex-none">
            <Button variant="danger" leftIcon={<Plus size={16} />} className="w-full bg-crayon-red text-white font-handwriting text-base sm:text-lg shadow-coral px-4 py-2">
              Drop Your Own One
            </Button>
          </Link>
        </div>
      </div>

      {randomRhyme && (
        <div className="mb-6 sm:mb-8 notebook-paper p-4 sm:p-6 border-2 border-crayon-yellow relative">
          <div className="flex justify-between items-center mb-3">
            <span className="font-handwriting font-bold text-xl sm:text-2xl text-crayon-red flex items-center gap-2">
              Random Memory Spotlight
            </span>
            <button onClick={() => setRandomRhyme(null)} className="text-xs font-bold px-2.5 py-1 rounded-full bg-black/10 text-ink">
              Close
            </button>
          </div>
          <RhymeCard rhyme={randomRhyme} />
        </div>
      )}

      <StatsBanner rhymes={rhymes} />

      <div className="notebook-paper p-3.5 sm:p-5 mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-black/10 pb-3 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-ink/60 uppercase tracking-wider font-heading shrink-0 mr-1 hidden xs:inline">Category:</span>
          {categoryFilterList.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-heading font-bold flex items-center gap-1.5 shrink-0 ${selectedCategory === cat ? "bg-crayon-red text-white shadow-coral" : "bg-white/80 dark:bg-neutral-800 text-ink border border-black/10"}`}>
              {cat === "All" && <Layers size={13} />}
              {cat === "Rhyme / Song" && <Music size={13} />}
              {cat === "Riddle" && <HelpCircle size={13} />}
              {cat === "Proverb / Adage" && <BookOpen size={13} />}
              <span>
                {cat === "All"
                  ? "All"
                  : cat === "Rhyme / Song"
                  ? "Songs"
                  : cat === "Riddle"
                  ? "Riddles"
                  : "Proverbs"}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2.5 sm:gap-3">
          <div className="w-full md:flex-1">
            <Input placeholder="Search lyrics, riddles, proverbs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} leftIcon={<Search size={16} />} className="bg-white dark:bg-neutral-900 border-black/15 text-ink text-xs sm:text-sm py-2" />
          </div>
          <div className="w-full md:w-auto flex items-center gap-2">
            <ArrowUpDown size={15} className="text-ink/50 shrink-0" />
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} options={[{ label: "Newest First", value: "newest" }, { label: "Oldest First", value: "oldest" }, { label: "Highest Moral Lesson", value: "moral" }, { label: "Extinction Concern", value: "extinct" }]} className="w-full sm:w-48 bg-white dark:bg-neutral-900 border-black/15 text-ink text-xs sm:text-sm py-2" />
            <Button type="button" variant={audioOnly ? "danger" : "outline"} size="md" onClick={() => setAudioOnly(!audioOnly)} leftIcon={<Mic size={15} />} className={audioOnly ? "bg-crayon-red text-white font-handwriting text-base sm:text-lg shrink-0 px-3 py-1.5" : "border-black/20 text-ink font-handwriting text-base sm:text-lg shrink-0 px-3 py-1.5"}>
              <span className="hidden sm:inline">Voice Notes Only</span>
              <span className="sm:hidden">Audio</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 pt-1">
          <span className="text-xs font-bold text-ink/60 uppercase tracking-wider font-heading shrink-0 mr-1 hidden xs:inline">Language:</span>
          {languagesList.map((lang) => (
            <button key={lang} onClick={() => setSelectedLanguage(lang)} className={`px-3 sm:px-3.5 py-1 rounded-full text-xs font-heading font-semibold shrink-0 ${selectedLanguage === lang ? "bg-brand-green text-white" : "bg-white/80 dark:bg-neutral-800 text-ink border border-black/10"}`}>
              {lang}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64 rounded-2xl bg-white/20" />)}
        </div>
      )}

      {!loading && filteredRhymes.length === 0 && (
        <div className="notebook-paper p-8 sm:p-12 text-center flex flex-col items-center gap-3">
          <Music size={40} className="text-ink/40" />
          <h3 className="font-handwriting font-bold text-2xl sm:text-3xl text-ink">No entries match your search</h3>
          <p className="text-ink/70 text-xs sm:text-sm max-w-sm">Be the first to contribute a song, riddle, or proverb in this category.</p>
          <Link href="/" className="mt-2">
            <Button variant="danger" leftIcon={<Plus size={16} />} className="bg-crayon-red text-white font-handwriting text-lg sm:text-xl px-5 py-2 rounded-2xl shadow-coral">
              Drop an Entry Now
            </Button>
          </Link>
        </div>
      )}

      {!loading && filteredRhymes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredRhymes.map((rhyme) => <RhymeCard key={rhyme.id} rhyme={rhyme} />)}
        </div>
      )}
    </div>
  );
}
