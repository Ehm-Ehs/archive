"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, storage, isFirebaseConfigured, MOCK_RHYMES } from "@/lib/firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CategoryStep from "@/components/submit/CategoryStep";
import ContentStep, { getSubTypesForCategory } from "@/components/submit/ContentStep";
import ReflectionsStep from "@/components/submit/ReflectionsStep";
import SimilarityCheckModal from "@/components/SimilarityCheckModal";
import { calculateTextSimilarity, deduplicateRhymes } from "@/lib/similarity";
import { rhymeSubmissionSchema, RhymeSubmissionFormData } from "@/lib/validations/rhymeSchema";
import { RhymeCategory, RhymeEntry } from "@/types/rhyme";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, BookOpen, Mic } from "lucide-react";

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const uploadAudioToGoogleDrive = async (blob: Blob, customFileName?: string): Promise<string | null> => {
  const appsScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;
  if (!appsScriptUrl) return null;
  try {
    const base64Data = await blobToBase64(blob);
    const fileName = customFileName || `rhyme-${Date.now()}-${Math.random().toString(36).slice(2)}.webm`;
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ fileData: base64Data, mimeType: blob.type || "audio/webm", fileName }),
      redirect: "follow",
    });
    const resText = await response.text();
    const result = JSON.parse(resText);
    return result?.url || null;
  } catch (err) {
    return null;
  }
};

export default function SubmitPage() {
  const [step, setStep] = useState<number>(1);
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [totalMemories, setTotalMemories] = useState<number>(306);
  const [similarityMatch, setSimilarityMatch] = useState<{
    existingEntry: RhymeEntry;
    matchScore: number;
    pendingData: RhymeSubmissionFormData;
  } | null>(null);
  const [bypassedCheck, setBypassedCheck] = useState<boolean>(false);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        if (isFirebaseConfigured && db) {
          const snap = await getDocs(collection(db, "rhymes"));
          if (!snap.empty) {
            const rawDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as RhymeEntry));
            setTotalMemories(deduplicateRhymes(rawDocs).length);
          }
        }
      } catch (e) {}
    };
    fetchTotal();
  }, []);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<RhymeSubmissionFormData>({
    resolver: zodResolver(rhymeSubmissionSchema) as any,
    defaultValues: {
      category: "Rhyme / Song",
      name: "",
      language: "English",
      type: "Assembly / march-in chant",
      text: "",
      riddleAnswer: "",
      proverbMeaning: "",
      learnedWhere: "School assembly",
      locationGrewUp: "",
      schoolType: undefined,
      era: "1990s",
      region: "",
      hasMorals: undefined,
      moralsStrength: 3,
      moralDescription: "",
      goingExtinct: undefined,
      extinctStrength: 3,
      extinctReason: "",
    },
  });

  const watchCategory = watch("category");
  const watchText = watch("text");

  useEffect(() => {
    const subTypes = getSubTypesForCategory(watchCategory);
    setValue("type", subTypes[0] as RhymeCategory);
  }, [watchCategory, setValue]);

  const handleNextFromStep2 = () => {
    setFormError("");
    if (watchCategory === "Rhyme / Song" && audioBlobs.length === 0) {
      setFormError("Recording a voice note is required for songs!");
      return;
    }
    if (watchCategory === "Riddle" && !watch("riddleAnswer")?.trim()) {
      setFormError("Please provide the answer to the riddle!");
      return;
    }
    if (!watchText?.trim() && audioBlobs.length === 0) {
      setFormError("Please write the text OR record a voice note.");
      return;
    }
    setStep(3);
  };

  const executeSaveSubmission = async (data: RhymeSubmissionFormData) => {
    setSubmitting(true);
    try {
      const audioURLs: string[] = [];
      for (let i = 0; i < audioBlobs.length; i++) {
        const blob = audioBlobs[i];
        const rawLoc = data.locationGrewUp || data.region || data.language || data.name || "Rhyme";
        const locSlug = rawLoc.trim().replace(/[^a-zA-Z0-9\s_-]/g, "").replace(/\s+/g, "-");
        let url = await uploadAudioToGoogleDrive(blob, `${locSlug}-${i + 1}.webm`);
        if (!url && storage) {
          try {
            const fileRef = ref(storage, `voice-notes/${locSlug}-${i + 1}.webm`);
            await uploadBytes(fileRef, blob);
            url = await getDownloadURL(fileRef);
          } catch (e) {}
        }
        if (!url) url = await blobToBase64(blob);
        if (url) audioURLs.push(url);
      }

      const firstAudioUrl = audioURLs[0] || null;
      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, "rhymes"), {
          ...data,
          moralsStrength: Number(data.moralsStrength),
          extinctStrength: Number(data.extinctStrength),
          audioURL: firstAudioUrl,
          audioURLs,
          createdAt: serverTimestamp(),
          likesCount: 0,
        });
      }
      setTotalMemories((prev) => prev + 1);
      setDone(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      reset();
      setAudioBlobs([]);
      setStep(1);
      setSimilarityMatch(null);
      setBypassedCheck(false);
    } catch (err) {
      setFormError("Something went wrong submitting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit: SubmitHandler<RhymeSubmissionFormData> = async (data) => {
    setFormError("");
    if (!bypassedCheck && (data.text?.trim() || data.riddleAnswer?.trim())) {
      setSubmitting(true);
      try {
        let bestMatch: RhymeEntry | null = null;
        let highestScore = 0;
        const existingList = isFirebaseConfigured && db
          ? (await getDocs(collection(db, "rhymes"))).docs.map((d) => ({ id: d.id, ...d.data() } as RhymeEntry))
          : MOCK_RHYMES;

        for (const item of existingList) {
          const textScore = calculateTextSimilarity(data.text || "", item.text || "");
          const riddleScore = data.riddleAnswer ? calculateTextSimilarity(data.riddleAnswer, item.riddleAnswer || "") : 0;
          const score = Math.max(textScore, riddleScore);
          if (score > highestScore) {
            highestScore = score;
            bestMatch = item;
          }
        }
        if (bestMatch && highestScore >= 0.45) {
          setSimilarityMatch({ existingEntry: bestMatch, matchScore: highestScore, pendingData: data });
          setSubmitting(false);
          return;
        }
      } catch (err) {} finally {
        setSubmitting(false);
      }
    }
    await executeSaveSubmission(data);
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 text-center flex flex-col items-center gap-5 notebook-paper border border-white/20">
        <div className="w-20 h-20 rounded-full bg-crayon-green/20 text-crayon-green flex items-center justify-center p-4">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="font-handwriting font-bold text-4xl text-ink">Thank You</h2>
        <p className="text-ink/80 text-lg font-medium max-w-md">
          You just saved one priceless cultural memory for future generations!
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          <Button variant="outline" onClick={() => setDone(false)} className="font-handwriting text-lg text-ink">
            Drop Another One
          </Button>
          <Link href="/gallery">
            <Button variant="danger" leftIcon={<BookOpen size={18} />} className="bg-crayon-red text-white font-handwriting text-xl px-6">
              View Public Archive
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="text-center mb-10 flex flex-col items-center gap-4">
        <h1 className="font-handwriting font-bold text-5xl sm:text-6xl text-white">
          Before We <span className="text-crayon-yellow underline">Forget...</span>
        </h1>
        <p className="text-white/90 text-lg font-sans max-w-2xl">
          Songs. March-in chants. Riddles. Proverbs. Wise sayings.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <a href="#wizard-form">
            <Button variant="danger" size="lg" leftIcon={<Mic size={20} />} className="bg-crayon-red text-white font-handwriting text-2xl px-7 py-3 rounded-2xl">
              Drop Your Memory
            </Button>
          </a>
          <Link href="/gallery">
            <Button variant="outline" size="lg" leftIcon={<BookOpen size={20} />} className="border-2 border-white/40 text-white font-handwriting text-2xl px-7 py-3 rounded-2xl">
              View Archive
            </Button>
          </Link>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-xs text-white">
          <span><strong className="text-crayon-yellow font-bold">{totalMemories}</strong> memories saved across 3 categories</span>
        </div>
      </div>

      <div id="wizard-form" className="notebook-paper p-6 sm:p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && <CategoryStep register={register} watch={watch} setValue={setValue} errors={errors} onNext={() => setStep(2)} />}
          {step === 2 && <ContentStep register={register} watch={watch} errors={errors} audioBlobs={audioBlobs} setAudioBlobs={setAudioBlobs} formError={formError} onBack={() => setStep(1)} onNext={handleNextFromStep2} />}
          {step === 3 && <ReflectionsStep register={register} watch={watch} errors={errors} submitting={submitting} formError={formError} onBack={() => setStep(2)} />}
        </form>
      </div>

      {similarityMatch && (
        <SimilarityCheckModal
          existingEntry={similarityMatch.existingEntry}
          matchScore={similarityMatch.matchScore}
          userSubmission={similarityMatch.pendingData}
          onConfirmAddNew={() => {
            const pending = similarityMatch.pendingData;
            setSimilarityMatch(null);
            setBypassedCheck(true);
            executeSaveSubmission(pending);
          }}
          onCancel={() => {
            setSimilarityMatch(null);
            setSubmitting(false);
          }}
        />
      )}
    </div>
  );
}
