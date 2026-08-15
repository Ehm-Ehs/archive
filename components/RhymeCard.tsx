"use client";
import React, { useState } from "react";
import { RhymeEntry } from "@/types/rhyme";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import ProposeEditModal from "@/components/ProposeEditModal";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { cleanTextContent, cleanContributorName } from "@/lib/similarity";
import { 
  Volume2, 
  MapPin, 
  Calendar, 
  User, 
  Star, 
  AlertTriangle, 
  Copy, 
  Check, 
  Share2, 
  Heart,
  Quote,
  School,
  Home,
  Edit3,
  Users,
  Music,
  HelpCircle,
  BookOpen,
  Eye,
  EyeOff,
  Sparkles
} from "lucide-react";

interface RhymeCardProps {
  rhyme: RhymeEntry;
}

export default function RhymeCard({ rhyme }: RhymeCardProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(rhyme.likesCount || 0);
  const [liked, setLiked] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const category = rhyme.category || "Rhyme / Song";

  const getLanguageBadgeVariant = (lang: string) => {
    switch (lang) {
      case "Yoruba":
        return "terracotta";
      case "Igbo":
        return "green";
      case "Hausa":
        return "gold";
      default:
        return "neutral";
    }
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  const handleCopy = () => {
    const textParts = [];
    if (rhyme.text) textParts.push(rhyme.text);
    if (rhyme.riddleAnswer) textParts.push(`Answer: ${rhyme.riddleAnswer}`);
    if (rhyme.proverbMeaning) textParts.push(`Meaning: ${rhyme.proverbMeaning}`);

    const contentToCopy = textParts.join("\n\n");
    if (!contentToCopy) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(contentToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => fallbackCopyText(contentToCopy));
    } else {
      fallbackCopyText(contentToCopy);
    }
  };

  const handleLike = async () => {
    const nextLiked = !liked;
    const nextCount = nextLiked ? likes + 1 : Math.max(0, likes - 1);
    setLiked(nextLiked);
    setLikes(nextCount);

    if (isFirebaseConfigured && db && rhyme.id && !rhyme.id.startsWith("local-") && !rhyme.id.startsWith("mock-")) {
      try {
        const rhymeRef = doc(db, "rhymes", rhyme.id);
        await updateDoc(rhymeRef, {
          likesCount: increment(nextLiked ? 1 : -1),
        });
      } catch (err) {
        console.warn("Could not save like to Firestore:", err);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${rhyme.type} - Nigerian Rhymes Archive`,
        text: rhyme.text || `Check out this ${rhyme.language} ${rhyme.category} on Nigerian Rhymes Archive!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const audioList = rhyme.audioURLs && rhyme.audioURLs.length > 0
    ? rhyme.audioURLs
    : rhyme.audioURL
    ? [rhyme.audioURL]
    : [];

  const hasEditors = rhyme.editors && rhyme.editors.length > 0;

  const getCategoryBorderClass = () => {
    if (category === "Riddle") return "border-l-4 border-crayon-yellow";
    return "border-l-4 border-brand-green";
  };

  const getCategoryIcon = () => {
    if (category === "Riddle") return <HelpCircle size={13} className="text-crayon-yellow" />;
    if (category === "Proverb / Adage") return <BookOpen size={13} className="text-crayon-red" />;
    return <Music size={13} className="text-brand-green" />;
  };

  const canCopy = Boolean(rhyme.text || rhyme.riddleAnswer || rhyme.proverbMeaning);

  return (
    <Card className="flex flex-col gap-4 relative notebook-paper border border-black/10 dark:border-white/10">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={getLanguageBadgeVariant(rhyme.language)}>{rhyme.language}</Badge>
          <Badge variant={category === "Riddle" ? "gold" : category === "Proverb / Adage" ? "terracotta" : "green"} className="flex items-center gap-1">
            {getCategoryIcon()}
            <span>{category}</span>
          </Badge>
          <Badge variant="neutral">{rhyme.type}</Badge>
          {hasEditors && (
            <Badge variant="gold">
              <Users size={11} /> Co-Authored
            </Badge>
          )}
          {rhyme.era && (
            <Badge variant="neutral">
              <Calendar size={11} /> {rhyme.era}
            </Badge>
          )}
          {rhyme.schoolType && (
            <Badge variant="neutral">
              <School size={11} /> {rhyme.schoolType}
            </Badge>
          )}
          {rhyme.locationGrewUp && (
            <Badge variant="neutral">
              <Home size={11} /> Grew up in {rhyme.locationGrewUp}
            </Badge>
          )}
          {rhyme.region && (
            <Badge variant="neutral">
              <MapPin size={11} /> {rhyme.region}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowEditModal(true)}
            title="Suggest Correction / Add Stanza"
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-crayon-red/10 text-crayon-red hover:bg-crayon-red/20 transition-all font-heading"
          >
            <Edit3 size={12} />
            <span>Propose Edit</span>
          </button>

          <button
            onClick={handleLike}
            title={liked ? "Unlike" : "Like this entry"}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
              liked
                ? "bg-crayon-red text-white shadow-sm"
                : "bg-black/5 dark:bg-white/10 text-ink/70 hover:text-ink"
            }`}
          >
            <Heart size={13} fill={liked ? "currentColor" : "none"} />
            <span>{likes}</span>
          </button>

          {canCopy && (
            <button
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy Text"}
              className={`p-1.5 rounded-full transition-colors ${
                copied
                  ? "bg-emerald-500/20 text-emerald-600"
                  : "bg-black/5 dark:bg-white/10 text-ink/70 hover:text-ink"
              }`}
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </button>
          )}

          <button
            onClick={handleShare}
            title="Share Entry"
            className="p-1.5 rounded-full bg-black/5 dark:bg-white/10 text-ink/70 hover:text-ink transition-colors"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {rhyme.text && (
        <div className={`bg-white/70 dark:bg-neutral-900/70 rounded-xl p-4 text-base leading-relaxed whitespace-pre-wrap text-ink ${getCategoryBorderClass()}`}>
          {cleanTextContent(rhyme.text)}
        </div>
      )}

      {category === "Riddle" && rhyme.riddleAnswer && (
        <div className="flex flex-col gap-2 bg-crayon-yellow/15 p-3.5 rounded-xl border border-crayon-yellow/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink uppercase tracking-wider font-heading flex items-center gap-1.5">
              <Sparkles size={14} className="text-crayon-yellow" /> Can you guess the answer?
            </span>
            <button
              type="button"
              onClick={() => setShowAnswer(!showAnswer)}
              className="flex items-center gap-1 text-xs font-bold text-crayon-red hover:underline font-heading bg-white dark:bg-neutral-800 px-3 py-1 rounded-full shadow-sm"
            >
              {showAnswer ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>{showAnswer ? "Hide Answer" : "Tap to Reveal Answer"}</span>
            </button>
          </div>

          {showAnswer && (
            <div className="mt-2 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-crayon-yellow text-sm font-bold text-ink animate-in fade-in slide-in-from-top-1 duration-200">
              Answer: <span className="text-crayon-red underline">{rhyme.riddleAnswer}</span>
            </div>
          )}
        </div>
      )}

      {category === "Proverb / Adage" && rhyme.proverbMeaning && (
        <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/10 dark:border-white/10 text-xs italic text-ink flex items-start gap-2">
          <Quote size={14} className="shrink-0 mt-0.5 text-ink/70" />
          <span><strong>As it&apos;s used:</strong> &quot;{cleanTextContent(rhyme.proverbMeaning)}&quot;</span>
        </div>
      )}

      {audioList.length > 0 && (
        <div className="flex flex-col gap-2">
          {audioList.map((url, idx) => (
            <div key={idx} className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-black/10 dark:border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-crayon-red uppercase tracking-wider font-heading">
                <Volume2 size={15} /> Audio Recording {audioList.length > 1 ? `${idx + 1}` : ""}
              </div>
              <audio controls src={url} className="w-full h-9" />
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-black/10 dark:border-white/10 pt-3 flex flex-col gap-2 text-xs text-ink/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-wrap">
          <span className="flex items-center gap-1 font-semibold text-ink">
            <User size={13} className="text-crayon-red shrink-0" />
            Original by {cleanContributorName(rhyme.name)}
          </span>

          <div className="flex items-center gap-3">
            {rhyme.hasMorals === "Yes" && (
              <span className="flex items-center gap-1 text-crayon-yellow font-bold">
                <Star size={13} fill="currentColor" /> Moral ({rhyme.moralsStrength}/5)
              </span>
            )}

            {rhyme.goingExtinct === "Yes" && (
              <span className="flex items-center gap-1 text-crayon-red font-bold">
                <AlertTriangle size={13} /> Dying Out ({rhyme.extinctStrength}/5)
              </span>
            )}
          </div>
        </div>

        {hasEditors && (
          <div className="flex flex-col gap-1 mt-1 bg-crayon-yellow/15 p-2.5 rounded-xl border border-crayon-yellow/30">
            <span className="font-bold text-ink flex items-center gap-1 text-xs">
              <Users size={13} className="text-crayon-yellow" /> Co-Editors / Verified Contributors:
            </span>
            {rhyme.editors!.map((ed, i) => (
              <div key={i} className="text-[0.75rem] text-ink/80 pl-4 border-l-2 border-crayon-yellow">
                <strong>{ed.editorName}</strong> {ed.editReason ? `— "${ed.editReason}"` : ""}
              </div>
            ))}
          </div>
        )}

        {rhyme.moralDescription && (
          <div className="flex items-start gap-2 text-ink bg-crayon-yellow/10 p-2.5 rounded-lg text-xs mt-1 border border-crayon-yellow/20">
            <Star size={13} className="shrink-0 mt-0.5 text-crayon-yellow fill-crayon-yellow" />
            <span><strong>Moral Lesson:</strong> {rhyme.moralDescription}</span>
          </div>
        )}

        {rhyme.extinctReason && (
          <div className="flex items-start gap-2 italic text-ink/60 bg-black/5 dark:bg-white/5 p-2.5 rounded-lg text-xs mt-1">
            <Quote size={13} className="shrink-0 mt-0.5 text-crayon-yellow" />
            <span>&quot;{rhyme.extinctReason}&quot;</span>
          </div>
        )}
      </div>

      {showEditModal && (
        <ProposeEditModal rhyme={rhyme} onClose={() => setShowEditModal(false)} />
      )}
    </Card>
  );
}
