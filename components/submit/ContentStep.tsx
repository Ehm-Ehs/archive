"use client";
import React from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { RhymeSubmissionFormData } from "@/lib/validations/rhymeSchema";
import { ItemCategory } from "@/types/rhyme";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import VoiceRecorder from "@/components/VoiceRecorder";
import { HelpCircle, Mic, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";

interface ContentStepProps {
  register: UseFormRegister<RhymeSubmissionFormData>;
  watch: UseFormWatch<RhymeSubmissionFormData>;
  errors: any;
  audioBlobs: Blob[];
  setAudioBlobs: (blobs: Blob[]) => void;
  formError: string;
  onBack: () => void;
  onNext: () => void;
}

export function getSubTypesForCategory(category: ItemCategory): string[] {
  if (category === "Riddle") {
    return ["Word riddle / Puzzle", "Picture / Gesture riddle", "Tricky question", "Other"];
  }
  if (category === "Proverb / Adage") {
    return ["Moral / Wisdom proverb", "Warning / Caution adage", "Philosophical saying", "Humorous / Satirical proverb", "Other"];
  }
  return ["Assembly / march-in chant", "Nursery rhyme", "Playground song", "Folk tale / Lullaby", "Game / Counting chant", "Other"];
}

export default function ContentStep({
  register,
  watch,
  errors,
  audioBlobs,
  setAudioBlobs,
  formError,
  onBack,
  onNext,
}: ContentStepProps) {
  const watchCategory = watch("category");
  const watchText = watch("text");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-crayon-red italic font-handwriting text-lg">
          STEP 2 OF 3
        </span>
        <h2 className="font-handwriting font-bold text-4xl text-ink">
          Contribute your {watchCategory}
        </h2>
        <p className="text-sm text-ink/70 font-medium mt-1">
          {watchCategory === "Riddle"
            ? "Write out the riddle question and provide the answer below."
            : watchCategory === "Proverb / Adage"
            ? "Keep the original language primary and explain the wisdom below."
            : "Record your voice singing it or write out the lyrics."}
        </p>
      </div>

      <Select
        label={`${watchCategory} Type`}
        options={getSubTypesForCategory(watchCategory)}
        {...register("type")}
        error={errors.type?.message}
      />

      <Textarea
        label={
          watchCategory === "Proverb / Adage"
            ? "Write out the proverb in original language"
            : watchCategory === "Riddle"
            ? "Write out the riddle question"
            : "Write out lyrics (Optional if recording voice note)"
        }
        placeholder={
          watchCategory === "Proverb / Adage"
            ? "e.g. Ile la ti n ko eso re ode..."
            : watchCategory === "Riddle"
            ? "e.g. What goes up and never comes down?"
            : "e.g. Parents listen to your children..."
        }
        helperText={
          watchCategory === "Proverb / Adage"
            ? "Keep original language text primary."
            : watchCategory === "Riddle"
            ? "Frame clearly as a riddle question."
            : "Written lyrics help preserve regional variants."
        }
        maxLength={1500}
        value={watchText || ""}
        {...register("text")}
        error={errors.text?.message}
      />

      {watchCategory === "Riddle" && (
        <div className="p-4 rounded-2xl bg-crayon-yellow/15 border border-crayon-yellow/40 flex flex-col gap-2">
          <Input
            label="What's the answer? (Required *)"
            placeholder="e.g. Your Age, Pineapple, Moonlight, Fire..."
            leftIcon={<HelpCircle size={16} className="text-crayon-yellow" />}
            {...register("riddleAnswer")}
            error={errors.riddleAnswer?.message}
          />
        </div>
      )}

      {watchCategory === "Proverb / Adage" && (
        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 flex flex-col gap-2">
          <Textarea
            label="What does it mean / How is it used? (Optional)"
            placeholder="e.g. It means good behavior begins at home before anywhere else..."
            helperText="Explanation of when this proverb is spoken."
            {...register("proverbMeaning")}
            error={errors.proverbMeaning?.message}
          />
        </div>
      )}

      <div className="flex flex-col gap-2 p-4 rounded-2xl bg-brand-terracotta-light/30 border border-crayon-red/30">
        <label className="font-heading font-semibold text-sm text-text-main flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-crayon-red font-bold">
            <Mic size={18} /> Record Voice Note / Audio ({watchCategory === "Rhyme / Song" ? "Required *" : "Optional"})
          </span>
          {audioBlobs.length > 0 && (
            <Badge variant="green" size="sm">
              {audioBlobs.length} {audioBlobs.length === 1 ? "recording" : "recordings"} saved
            </Badge>
          )}
        </label>
        <VoiceRecorder onRecordingsChange={setAudioBlobs} />
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-crayon-red/15 text-crayon-red text-sm font-semibold flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          leftIcon={<ArrowLeft size={18} />}
          className="font-handwriting text-xl text-ink border-black/20"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="bg-crayon-red hover:bg-crayon-red-hover text-white font-handwriting text-2xl px-8 py-3 rounded-2xl shadow-coral"
          rightIcon={<ArrowRight size={20} />}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
