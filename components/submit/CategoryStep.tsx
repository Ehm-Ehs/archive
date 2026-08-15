"use client";
import React from "react";
import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { RhymeSubmissionFormData } from "@/lib/validations/rhymeSchema";
import { ItemCategory } from "@/types/rhyme";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Music, HelpCircle, BookOpen, User, Home, MapPin, School, ArrowRight } from "lucide-react";

interface CategoryStepProps {
  register: UseFormRegister<RhymeSubmissionFormData>;
  watch: UseFormWatch<RhymeSubmissionFormData>;
  setValue: UseFormSetValue<RhymeSubmissionFormData>;
  errors: any;
  onNext: () => void;
}

const categoryOptions: { label: string; value: ItemCategory; icon: any }[] = [
  { label: "Rhyme / Song", value: "Rhyme / Song", icon: Music },
  { label: "Riddle", value: "Riddle", icon: HelpCircle },
  { label: "Proverb / Adage", value: "Proverb / Adage", icon: BookOpen },
];

const languagesList = ["English", "Yoruba", "Hausa", "Igbo", "Other"];

export default function CategoryStep({
  register,
  watch,
  setValue,
  errors,
  onNext,
}: CategoryStepProps) {
  const watchCategory = watch("category");
  const watchLanguage = watch("language");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-crayon-red italic font-handwriting text-lg">
          STEP 1 OF 3
        </span>
        <h2 className="font-handwriting font-bold text-4xl text-ink">
          What are you sharing?
        </h2>
        <p className="text-sm text-ink/70 font-medium mt-1">
          Choose a category to adapt the form fields to your cultural memory.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-heading font-semibold text-sm text-text-main">
          Select Category *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {categoryOptions.map((cat) => {
            const isSelected = watchCategory === cat.value;
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setValue("category", cat.value)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 font-handwriting text-2xl transition-all border ${
                  isSelected
                    ? "bg-crayon-red text-white border-crayon-red shadow-coral scale-105"
                    : "bg-white dark:bg-neutral-800 text-ink border-black/15 hover:bg-black/5"
                }`}
              >
                <Icon size={24} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Your name (optional)"
          placeholder="e.g. Aunty Ngozi or Brother Tunde"
          leftIcon={<User size={16} />}
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label="Where did you grow up? (State/City)"
          placeholder="e.g. Benin City, Lagos, Jos, Aba, Kano"
          leftIcon={<Home size={16} />}
          {...register("locationGrewUp")}
          error={errors.locationGrewUp?.message}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-heading font-semibold text-sm text-text-main">
          Language *
        </label>
        <div className="flex flex-wrap gap-2">
          {languagesList.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setValue("language", lang as any)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                watchLanguage === lang
                  ? "bg-brand-green text-white border-brand-green shadow-sm scale-105"
                  : "bg-white dark:bg-neutral-800 text-ink border-black/15 hover:bg-black/5"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Region / State"
          placeholder="e.g. Lagos State, Kano, Enugu..."
          leftIcon={<MapPin size={16} />}
          {...register("region")}
          error={errors.region?.message}
        />
        <Select
          label="Type of school attended"
          options={[
            "Public / Government Primary",
            "Private / International",
            "Mission / Convent / Islamic",
            "Boarding School",
            "Community / Village School",
            "Other",
          ]}
          {...register("schoolType")}
          error={errors.schoolType?.message}
        />
      </div>

      <Input
        label="Where did you learn it?"
        placeholder="e.g. St. Peters Primary, Sagamu"
        leftIcon={<School size={16} />}
        {...register("learnedWhere")}
        error={errors.learnedWhere?.message}
      />

      <div className="flex justify-end mt-4">
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
