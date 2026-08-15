"use client";
import React from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { RhymeSubmissionFormData } from "@/lib/validations/rhymeSchema";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AlertCircle, ArrowLeft, Send } from "lucide-react";

interface ReflectionsStepProps {
  register: UseFormRegister<RhymeSubmissionFormData>;
  watch: UseFormWatch<RhymeSubmissionFormData>;
  errors: any;
  submitting: boolean;
  formError: string;
  onBack: () => void;
}

export default function ReflectionsStep({
  register,
  watch,
  errors,
  submitting,
  formError,
  onBack,
}: ReflectionsStepProps) {
  const watchCategory = watch("category");
  const watchHasMorals = watch("hasMorals");
  const watchMoralsStrength = watch("moralsStrength");
  const watchGoingExtinct = watch("goingExtinct");
  const watchExtinctStrength = watch("extinctStrength");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-crayon-red italic font-handwriting text-lg">
          STEP 3 OF 3
        </span>
        <h2 className="font-handwriting font-bold text-4xl text-ink">
          Cultural Reflections
        </h2>
        <p className="text-sm text-ink/70 font-medium mt-1">
          Share your reflections on how this memory is remembered today.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-heading font-semibold text-sm text-text-main">
          Does this {watchCategory.toLowerCase()} carry a moral or life lesson?
        </label>
        <div className="flex gap-6 mt-1">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <input type="radio" value="Yes" className="accent-crayon-red w-4 h-4" {...register("hasMorals")} />
            <span>Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <input type="radio" value="No" className="accent-crayon-red w-4 h-4" {...register("hasMorals")} />
            <span>No</span>
          </label>
        </div>
        {errors.hasMorals && (
          <p className="text-xs font-semibold text-crayon-red mt-1">{errors.hasMorals.message}</p>
        )}
      </div>

      {watchHasMorals === "Yes" && (
        <div className="flex flex-col gap-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10">
          <Textarea
            label="What moral or life lesson does it carry?"
            placeholder="e.g. Respect for elders, honesty, hard work, obedience to parents..."
            {...register("moralDescription")}
            error={errors.moralDescription?.message}
          />
          <div className="flex flex-col gap-2">
            <label className="font-heading font-semibold text-xs text-text-main flex justify-between">
              <span>How strong is the moral lesson?</span>
              <span className="text-crayon-yellow font-bold">{watchMoralsStrength}/5</span>
            </label>
            <input type="range" min="1" max="5" className="w-full accent-crayon-red" {...register("moralsStrength")} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-heading font-semibold text-sm text-text-main">
          Do you feel traditional {watchCategory.toLowerCase()}s like this are dying out?
        </label>
        <div className="flex gap-6 mt-1">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <input type="radio" value="Yes" className="accent-crayon-red w-4 h-4" {...register("goingExtinct")} />
            <span>Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <input type="radio" value="No" className="accent-crayon-red w-4 h-4" {...register("goingExtinct")} />
            <span>No</span>
          </label>
        </div>
        {errors.goingExtinct && (
          <p className="text-xs font-semibold text-crayon-red mt-1">{errors.goingExtinct.message}</p>
        )}
      </div>

      {watchGoingExtinct === "Yes" && (
        <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 flex flex-col gap-2">
          <label className="font-heading font-semibold text-xs text-text-main flex justify-between">
            <span>How concerned are you about extinction?</span>
            <span className="text-crayon-red font-bold">{watchExtinctStrength}/5</span>
          </label>
          <input type="range" min="1" max="5" className="w-full accent-crayon-red" {...register("extinctStrength")} />
        </div>
      )}

      <Textarea
        label="Why do you think that? (Optional)"
        placeholder="e.g. Children spend more time on smartphones & cartoons..."
        {...register("extinctReason")}
        error={errors.extinctReason?.message}
      />

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
          type="submit"
          variant="danger"
          size="lg"
          isLoading={submitting}
          leftIcon={<Send size={20} />}
          className="bg-crayon-red hover:bg-crayon-red-hover text-white font-handwriting text-2xl px-8 py-3 rounded-2xl shadow-coral"
        >
          Submit {watchCategory} to Archive
        </Button>
      </div>
    </div>
  );
}
