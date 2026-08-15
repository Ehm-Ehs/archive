"use client";
import React, { useState } from "react";
import { RhymeEntry } from "@/types/rhyme";
import RhymeCard from "@/components/RhymeCard";
import ProposeEditModal from "@/components/ProposeEditModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  Edit3,
  PlusCircle,
  X,
  ArrowRight
} from "lucide-react";

interface SimilarityCheckModalProps {
  existingEntry: RhymeEntry;
  matchScore: number; // 1.0 for exact, 0.45+ for similar
  userSubmission: any;
  onConfirmAddNew: () => void;
  onCancel: () => void;
}

export default function SimilarityCheckModal({
  existingEntry,
  matchScore,
  userSubmission,
  onConfirmAddNew,
  onCancel,
}: SimilarityCheckModalProps) {
  const isExact = matchScore >= 0.95;
  const [showProposeEdit, setShowProposeEdit] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="notebook-paper p-6 sm:p-8 max-w-2xl w-full flex flex-col gap-5 border border-white/20 shadow-2xl relative my-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 text-ink transition-colors"
        >
          <X size={20} />
        </button>

        {isExact ? (
          /* EXACT DUPLICATE FOUND */
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-crayon-red">
              <AlertTriangle size={24} className="shrink-0 animate-bounce" />
              <h2 className="font-handwriting font-bold text-3xl text-ink">
                Exact Duplicate Found! 🛑
              </h2>
            </div>
            <p className="text-sm text-ink/80 font-medium">
              This exact rhyme/riddle/proverb is already preserved in the public archive!
            </p>

            <div className="my-2 border-2 border-crayon-red/30 rounded-2xl p-2 bg-black/5">
              <RhymeCard rhyme={existingEntry} />
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2 border-t border-black/10">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="font-handwriting text-lg text-ink border-black/20"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => setShowProposeEdit(true)}
                leftIcon={<Edit3 size={16} />}
                className="bg-crayon-red hover:bg-crayon-red-hover text-white font-handwriting text-xl shadow-coral"
              >
                Propose Edit / Correction to This Entry ✏️
              </Button>
            </div>
          </div>
        ) : (
          /* SIMILAR ENTRY FOUND */
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-crayon-yellow">
              <Search size={24} className="shrink-0" />
              <h2 className="font-handwriting font-bold text-3xl text-ink">
                Similar Entry Found in Archive 🔍
              </h2>
            </div>
            <p className="text-sm text-ink/80 font-medium">
              We found a similar entry in our database ({Math.round(matchScore * 100)}% text match). Is this what you are trying to submit?
            </p>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-1">
              {/* Existing Entry Preview */}
              <div className="flex flex-col gap-2 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10">
                <span className="text-xs font-bold text-crayon-red uppercase tracking-wider font-heading">
                  Existing Archive Entry
                </span>
                <p className="text-xs leading-relaxed whitespace-pre-wrap text-ink font-semibold italic">
                  {existingEntry.text}
                </p>
                {existingEntry.riddleAnswer && (
                  <span className="text-xs font-bold text-crayon-yellow">
                    Answer: {existingEntry.riddleAnswer}
                  </span>
                )}
                <span className="text-[0.7rem] text-ink/60">
                  By {existingEntry.name || "Anonymous"} · {existingEntry.language}
                </span>
              </div>

              {/* Your New Input */}
              <div className="flex flex-col gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-heading">
                  Your Proposed Input
                </span>
                <p className="text-xs leading-relaxed whitespace-pre-wrap text-ink font-semibold">
                  {userSubmission.text || "(Voice Recording)"}
                </p>
                {userSubmission.riddleAnswer && (
                  <span className="text-xs font-bold text-crayon-yellow">
                    Answer: {userSubmission.riddleAnswer}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-black/10">
              <span className="text-xs font-bold text-ink uppercase tracking-wider">
                What would you like to do?
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProposeEdit(true)}
                  leftIcon={<Edit3 size={16} />}
                  className="w-full text-crayon-red border-crayon-red/40 hover:bg-crayon-red/10 font-handwriting text-lg"
                >
                  It&apos;s similar — I want to propose an edit / correction!
                </Button>

                <Button
                  type="button"
                  variant="danger"
                  onClick={onConfirmAddNew}
                  leftIcon={<PlusCircle size={16} />}
                  className="w-full bg-brand-green hover:bg-emerald-800 text-white font-handwriting text-lg shadow-coral"
                >
                  No, mine is completely different — submit as new!
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Propose Edit Modal overlay */}
        {showProposeEdit && (
          <ProposeEditModal
            rhyme={existingEntry}
            onClose={() => {
              setShowProposeEdit(false);
              onCancel();
            }}
          />
        )}
      </div>
    </div>
  );
}
