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
import { Search, Mic, Plus, ArrowUpDown, Music, BookOpen, Shuffle, HelpCircle } from "lucide-react";

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
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-extrabold uppercase bg-crayon-yellow/20 text-crayon-yellow border border-crayon-yellow/30 mb-2">
            <BookOpen size={13} /> Public Cultural Repository
          </div>
          <h1 className="font-handwriting font-bold text-4xl sm:text-5xl text-white">
            Wetin People Don Share
          </h1>
          <p className="text-white/70 text-sm sm:text-base mt-1 font-sans max-w-xl">
            Browse traditional nursery songs, riddles, and proverbs saved in our public memory box.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={handleSurpriseMe} leftIcon={<Shuffle size={16} />} className="border-crayon-yellow/40 text-crayon-yellow font-handwriting text-lg">
            Surprise Me
          </Button>
          <Link href="/">
            <Button variant="danger" leftIcon={<Plus size={18} />} className="bg-crayon-red text-white font-handwriting text-lg shadow-coral">
              Drop Your Own One
            </Button>
          </Link>
        </div>
      </div>

      {randomRhyme && (
        <div className="mb-8 notebook-paper p-6 border-2 border-crayon-yellow relative">
          <div className="flex justify-between items-center mb-3">
            <span className="font-handwriting font-bold text-2xl text-crayon-red flex items-center gap-2">
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

      <div className="notebook-paper p-5 mb-8 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-black/10 pb-3 overflow-x-auto">
          <span className="text-xs font-bold text-ink/60 uppercase tracking-wider font-heading shrink-0 mr-1">Category:</span>
          {categoryFilterList.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold flex items-center gap-1 ${selectedCategory === cat ? "bg-crayon-red text-white shadow-coral" : "bg-white/80 dark:bg-neutral-800 text-ink border border-black/10"}`}>
              {cat === "Rhyme / Song" && <Music size={12} />}
              {cat === "Riddle" && <HelpCircle size={12} />}
              {cat === "Proverb / Adage" && <BookOpen size={12} />}
              <span>{cat === "All" ? "All Categories" : cat}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="w-full md:flex-1">
            <Input placeholder="Search lyrics, riddles, proverbs, contributor, state..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} leftIcon={<Search size={18} />} className="bg-white dark:bg-neutral-900 border-black/15 text-ink" />
          </div>
          <div className="w-full md:w-auto flex items-center gap-2">
            <ArrowUpDown size={16} className="text-ink/50 shrink-0" />
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} options={[{ label: "Newest First", value: "newest" }, { label: "Oldest First", value: "oldest" }, { label: "Highest Moral Lesson", value: "moral" }, { label: "Extinction Concern", value: "extinct" }]} className="w-full sm:w-48 bg-white dark:bg-neutral-900 border-black/15 text-ink" />
          </div>
          <Button type="button" variant={audioOnly ? "danger" : "outline"} size="md" onClick={() => setAudioOnly(!audioOnly)} leftIcon={<Mic size={16} />} className={audioOnly ? "bg-crayon-red text-white font-handwriting text-lg" : "border-black/20 text-ink font-handwriting text-lg"}>
            Voice Notes Only
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-bold text-ink/60 uppercase tracking-wider font-heading shrink-0 mr-1">Language:</span>
          {languagesList.map((lang) => (
            <button key={lang} onClick={() => setSelectedLanguage(lang)} className={`px-3.5 py-1 rounded-full text-xs font-heading font-semibold ${selectedLanguage === lang ? "bg-brand-green text-white" : "bg-white/80 dark:bg-neutral-800 text-ink border border-black/10"}`}>
              {lang}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64 rounded-2xl bg-white/20" />)}
        </div>
      )}

      {!loading && filteredRhymes.length === 0 && (
        <div className="notebook-paper p-12 text-center flex flex-col items-center gap-3">
          <Music size={48} className="text-ink/40" />
          <h3 className="font-handwriting font-bold text-3xl text-ink">No entries match your search</h3>
          <p className="text-ink/70 text-sm max-w-sm">Be the first to contribute a song, riddle, or proverb in this category.</p>
          <Link href="/" className="mt-2">
            <Button variant="danger" leftIcon={<Plus size={18} />} className="bg-crayon-red text-white font-handwriting text-xl px-6 py-2.5 rounded-2xl shadow-coral">
              Drop an Entry Now
            </Button>
          </Link>
        </div>
      )}

      {!loading && filteredRhymes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRhymes.map((rhyme) => <RhymeCard key={rhyme.id} rhyme={rhyme} />)}
        </div>
      )}
    </div>
  );
}
