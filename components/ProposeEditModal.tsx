"use client";
import React, { useState } from "react";
import { RhymeEntry } from "@/types/rhyme";
import { db, storage, isFirebaseConfigured } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import VoiceRecorder from "@/components/VoiceRecorder";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  User, 
  FileText, 
  Mic, 
  VolumeX, 
  Volume2, 
  Sparkles,
  Calendar,
  MapPin,
  School,
  Home
} from "lucide-react";

interface ProposeEditModalProps {
  rhyme: RhymeEntry;
  onClose: () => void;
}

// Convert audio blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Upload audio blob to Google Drive via Google Apps Script
const uploadAudioToGoogleDrive = async (blob: Blob, customFileName?: string): Promise<string | null> => {
  const appsScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;
  if (!appsScriptUrl) return null;

  try {
    const base64Data = await blobToBase64(blob);
    const fileName = customFileName || `edit-rhyme-${Date.now()}.webm`;

    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        fileData: base64Data,
        mimeType: blob.type || "audio/webm",
        fileName: fileName,
      }),
      redirect: "follow",
    });

    const responseText = await response.text();
    let result: any = null;
    try {
      result = JSON.parse(responseText);
    } catch (e) {}

    if (result && result.status === "success" && result.url) {
      return result.url;
    }
    return null;
  } catch (err) {
    console.warn("Google Apps Script upload failed:", err);
    return null;
  }
};

export default function ProposeEditModal({ rhyme, onClose }: ProposeEditModalProps) {
  const [editorName, setEditorName] = useState<string>("");
  const [proposedText, setProposedText] = useState<string>(rhyme.text || "");
  const [editReason, setEditReason] = useState<string>("");
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const hasAudio = Boolean(rhyme.audioURL || (rhyme.audioURLs && rhyme.audioURLs.length > 0));
  const audioListCount = rhyme.audioURLs?.length || (rhyme.audioURL ? 1 : 0);

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

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!editorName.trim()) {
      setErrorMsg("Please enter your name so we can credit you on the card.");
      return;
    }

    if (!proposedText.trim() && audioBlobs.length === 0) {
      setErrorMsg("Please provide corrected lyrics OR record a voice note.");
      return;
    }

    if (!editReason.trim()) {
      setErrorMsg("Please add a brief note about what you corrected or added (e.g. 'Added voice recording & 2nd verse').");
      return;
    }

    setSubmitting(true);
    try {
      const proposedAudioURLs: string[] = [];

      if (audioBlobs.length > 0) {
        for (let i = 0; i < audioBlobs.length; i++) {
          const blob = audioBlobs[i];
          const rawLoc = rhyme.locationGrewUp || rhyme.region || rhyme.language || "edit";
          const locSlug = rawLoc.trim().replace(/[^a-zA-Z0-9\s_-]/g, "").replace(/\s+/g, "-");
          const customFileName = `${locSlug}-edit-${i + 1}.webm`;

          let url: string | null = await uploadAudioToGoogleDrive(blob, customFileName);

          if (!url && storage) {
            try {
              const fileRef = ref(storage, `voice-notes/${customFileName}`);
              await uploadBytes(fileRef, blob);
              url = await getDownloadURL(fileRef);
            } catch (err) {}
          }

          if (!url) {
            url = await blobToBase64(blob);
          }

          if (url) {
            proposedAudioURLs.push(url);
          }
        }
      }

      const firstProposedAudioUrl = proposedAudioURLs.length > 0 ? proposedAudioURLs[0] : "";

      if (isFirebaseConfigured && db) {
        try {
          const payload: any = {
            rhymeId: rhyme.id || "",
            rhymeType: `${rhyme.language || "English"} ${rhyme.type || "Rhyme"}`,
            originalText: rhyme.text || "",
            editorName: editorName.trim(),
            proposedText: proposedText.trim(),
            editReason: editReason.trim(),
            status: "pending",
            createdAt: serverTimestamp(),
          };

          if (rhyme.audioURL) {
            payload.originalAudioURL = rhyme.audioURL;
          }
          if (firstProposedAudioUrl) {
            payload.proposedAudioURL = firstProposedAudioUrl;
          }
          if (proposedAudioURLs.length > 0) {
            payload.proposedAudioURLs = proposedAudioURLs;
          }

          await addDoc(collection(db, "edit_requests"), payload);
        } catch (dbErr: any) {
          console.warn("Firestore edit_requests save error:", dbErr);
          if (dbErr?.code === "permission-denied" || dbErr?.message?.includes("permission")) {
            setErrorMsg("Firestore permission error: Please update Firestore Security Rules in Firebase Console to allow 'edit_requests' (see rules.md).");
            setSubmitting(false);
            return;
          }
          throw dbErr;
        }
      } else {
        await new Promise((res) => setTimeout(res, 600));
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Edit submission error:", err);
      setErrorMsg("Failed to submit proposed edit. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="notebook-paper p-6 sm:p-8 max-w-xl w-full flex flex-col gap-5 border border-white/20 shadow-2xl relative my-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 text-ink transition-colors"
        >
          <X size={20} />
        </button>

        {!success ? (
          <>
            <div>
              <span className="text-xs font-bold text-crayon-red uppercase tracking-wider font-heading flex items-center gap-1">
                <Edit3 size={14} /> Community Collaboration
              </span>
              <h2 className="font-handwriting font-bold text-3xl text-ink mt-0.5">
                Propose Edit / Submit Voice Note
              </h2>
            </div>

            {/* RHYME TAGS DISPLAY */}
            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/10 flex flex-col gap-2">
              <span className="text-[0.7rem] font-bold uppercase tracking-wider text-ink/60">
                Rhyme Entry Tags & Details
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={getLanguageBadgeVariant(rhyme.language)}>{rhyme.language}</Badge>
                <Badge variant="neutral">{rhyme.type}</Badge>
                
                {/* Audio Status Tag */}
                {hasAudio ? (
                  <Badge variant="green" className="flex items-center gap-1">
                    <Volume2 size={11} /> {audioListCount} Audio {audioListCount === 1 ? "File" : "Files"} Attached
                  </Badge>
                ) : (
                  <Badge variant="terracotta" className="flex items-center gap-1 animate-pulse">
                    <VolumeX size={11} /> 🎙️ Audio Missing!
                  </Badge>
                )}

                {rhyme.era && <Badge variant="neutral"><Calendar size={11} /> {rhyme.era}</Badge>}
                {rhyme.schoolType && <Badge variant="neutral"><School size={11} /> {rhyme.schoolType}</Badge>}
                {rhyme.locationGrewUp && <Badge variant="neutral"><Home size={11} /> {rhyme.locationGrewUp}</Badge>}
                {rhyme.region && <Badge variant="neutral"><MapPin size={11} /> {rhyme.region}</Badge>}
              </div>

              {!hasAudio && (
                <div className="mt-1 text-xs text-crayon-red font-semibold flex items-center gap-1.5 bg-crayon-red/10 p-2 rounded-lg">
                  <Sparkles size={14} className="shrink-0" />
                  <span>This rhyme currently has no audio recording! You can record and submit one below.</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitEdit} className="flex flex-col gap-4">
              <Input
                label="Your Name (for co-author credit) *"
                placeholder="e.g. Olawale K. or Sister Mary"
                value={editorName}
                onChange={(e) => setEditorName(e.target.value)}
                leftIcon={<User size={16} />}
              />

              <Textarea
                label="Corrected / Complete Lyrics"
                placeholder="Write out corrected lyrics or add missing verses..."
                value={proposedText}
                onChange={(e) => setProposedText(e.target.value)}
                rows={4}
              />

              {/* VOICE NOTE RECORDING SECTION */}
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-brand-terracotta-light/30 border border-crayon-red/30">
                <label className="font-heading font-semibold text-sm text-text-main flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-crayon-red font-bold">
                    <Mic size={18} /> Record New Voice Note / Song (Optional)
                  </span>
                  {audioBlobs.length > 0 && (
                    <Badge variant="green" size="sm">
                      {audioBlobs.length} {audioBlobs.length === 1 ? "song" : "songs"} recorded
                    </Badge>
                  )}
                </label>
                <VoiceRecorder onRecordingsChange={setAudioBlobs} />
              </div>

              <Input
                label="What did you correct or add? *"
                placeholder="e.g. Added missing 2nd verse & recorded audio note..."
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                leftIcon={<FileText size={16} />}
              />

              {errorMsg && (
                <div className="p-3 rounded-xl bg-crayon-red/15 text-crayon-red text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="font-handwriting text-lg text-ink border-black/20"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  isLoading={submitting}
                  className="bg-crayon-red hover:bg-crayon-red-hover text-white font-handwriting text-xl px-6 shadow-coral"
                >
                  Submit Edit Request ✏️
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-crayon-green/20 text-crayon-green flex items-center justify-center p-3">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="font-handwriting font-bold text-3xl text-ink">
              Edit Proposal Submitted! 🙏
            </h3>
            <p className="text-sm text-ink/80 max-w-sm">
              Thank you! Your proposed correction and voice recording have been sent to the admin moderation queue. Once approved, your name and contribution note will appear on the card!
            </p>
            <Button
              type="button"
              variant="danger"
              onClick={onClose}
              className="bg-crayon-red text-white font-handwriting text-lg mt-2 px-6"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
