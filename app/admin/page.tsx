"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayUnion, 
  getDoc 
} from "firebase/firestore";
import { RhymeEditRequest } from "@/types/rhyme";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  ArrowLeft, 
  Edit3, 
  User, 
  AlertCircle,
  FileText,
  Lock,
  Volume2
} from "lucide-react";

export default function AdminPage() {
  const [passcode, setPasscode] = useState<string>("");
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [editRequests, setEditRequests] = useState<RhymeEditRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string>("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin123" || passcode === "rhymes2026") {
      setAuthorized(true);
      fetchPendingRequests();
    } else {
      alert("Incorrect admin passcode. Try 'admin123'");
    }
  };

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && db) {
        const q = query(collection(db, "edit_requests"), where("status", "==", "pending"));
        const snap = await getDocs(q);
        const docs: RhymeEditRequest[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<RhymeEditRequest, "id">),
        }));
        setEditRequests(docs);
      } else {
        // Fallback mock pending edits
        setEditRequests([
          {
            id: "req-1",
            rhymeId: "mock-1",
            rhymeType: "English Assembly / march-in chant",
            originalText: "Parents listen to your children,\nWe are the leaders of tomorrow...",
            editorName: "Olawale K.",
            proposedText: "Parents listen to your children,\nWe are the leaders of tomorrow,\nTry and pay our school fees,\nAnd buy us books to read!\nWhen we grow up, we will remember,\nThe good things you have done for us!",
            editReason: "Completed full 2nd verse of the assembly song.",
            status: "pending",
            createdAt: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching edit requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (req: RhymeEditRequest) => {
    setActionMessage("");
    try {
      if (isFirebaseConfigured && db) {
        const rhymeRef = doc(db, "rhymes", req.rhymeId);
        const rhymeSnap = await getDoc(rhymeRef);

        if (rhymeSnap.exists()) {
          const rhymeData = rhymeSnap.data();
          const updatePayload: any = {
            text: req.proposedText || rhymeData.text,
            editors: arrayUnion({
              editorName: req.editorName,
              editReason: req.editReason,
              editedAt: new Date().toISOString(),
            }),
          };

          // Attach proposed audio if provided
          if (req.proposedAudioURL) {
            updatePayload.audioURL = req.proposedAudioURL;
            if (req.proposedAudioURLs && req.proposedAudioURLs.length > 0) {
              updatePayload.audioURLs = arrayUnion(...req.proposedAudioURLs);
            } else {
              updatePayload.audioURLs = arrayUnion(req.proposedAudioURL);
            }
          }

          await updateDoc(rhymeRef, updatePayload);
        }

        // 2. Mark edit_request as approved
        const reqRef = doc(db, "edit_requests", req.id);
        await updateDoc(reqRef, { status: "approved" });
      }

      setEditRequests((prev) => prev.filter((r) => r.id !== req.id));
      setActionMessage(`✅ Edit by ${req.editorName} approved! Both names and audio will now display on the card.`);
    } catch (err) {
      console.error("Approve error:", err);
      alert("Failed to approve edit.");
    }
  };

  const handleReject = async (req: RhymeEditRequest) => {
    setActionMessage("");
    try {
      if (isFirebaseConfigured && db) {
        const reqRef = doc(db, "edit_requests", req.id);
        await updateDoc(reqRef, { status: "rejected" });
      }

      setEditRequests((prev) => prev.filter((r) => r.id !== req.id));
      setActionMessage(`❌ Edit by ${req.editorName} rejected.`);
    } catch (err) {
      console.error("Reject error:", err);
      alert("Failed to reject edit.");
    }
  };

  if (!authorized) {
    return (
      <div className="max-w-md mx-auto my-16 notebook-paper p-8 flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 rounded-full bg-crayon-red/20 text-crayon-red flex items-center justify-center p-3">
          <Lock size={36} />
        </div>
        <div>
          <h2 className="font-handwriting font-bold text-3xl text-ink">
            Admin Moderation Queue
          </h2>
          <p className="text-xs text-ink/70 mt-1">
            Enter passcode to approve or reject community edit requests.
          </p>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter Admin Passcode (e.g. admin123)"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/20 text-ink text-center font-mono focus:outline-none focus:ring-2 focus:ring-crayon-red"
          />
          <Button
            type="submit"
            variant="danger"
            className="w-full bg-crayon-red hover:bg-crayon-red-hover text-white font-handwriting text-xl py-2.5"
          >
            Access Admin Queue 🔑
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <Link href="/gallery" className="text-xs font-bold text-crayon-red hover:underline flex items-center gap-1 font-heading mb-2">
            <ArrowLeft size={14} /> Back to Public Archive
          </Link>
          <h1 className="font-handwriting font-bold text-4xl text-white flex items-center gap-2">
            <ShieldCheck size={32} className="text-crayon-yellow" /> Edit Request Moderation Queue
          </h1>
        </div>

        <Badge variant="gold" size="md">
          {editRequests.length} Pending {editRequests.length === 1 ? "Request" : "Requests"}
        </Badge>
      </div>

      {actionMessage && (
        <div className="mb-6 p-4 rounded-xl bg-crayon-green/20 text-crayon-green text-sm font-bold flex items-center gap-2 border border-crayon-green/30">
          <Check size={18} />
          <span>{actionMessage}</span>
        </div>
      )}

      {loading && (
        <div className="notebook-paper p-8 text-center text-ink font-handwriting text-2xl">
          Loading edit requests...
        </div>
      )}

      {!loading && editRequests.length === 0 && (
        <div className="notebook-paper p-12 text-center flex flex-col items-center gap-3">
          <Clock size={44} className="text-ink/40" />
          <h3 className="font-handwriting font-bold text-3xl text-ink">
            No Pending Edit Requests! 🎉
          </h3>
          <p className="text-ink/70 text-sm max-w-sm">
            All submitted community rhyme corrections have been reviewed.
          </p>
        </div>
      )}

      {/* Edit Request Cards */}
      {!loading && editRequests.length > 0 && (
        <div className="flex flex-col gap-6">
          {editRequests.map((req) => (
            <div key={req.id} className="notebook-paper p-6 flex flex-col gap-5 border border-black/10">
              <div className="flex justify-between items-start flex-wrap gap-2 border-b border-black/10 pb-3">
                <div>
                  <span className="text-xs font-bold text-crayon-red uppercase tracking-wider font-heading flex items-center gap-1">
                    <Edit3 size={13} /> {req.rhymeType}
                  </span>
                  <h3 className="font-handwriting font-bold text-2xl text-ink mt-0.5">
                    Proposed Edit by {req.editorName}
                  </h3>
                </div>

                <Badge variant="neutral">
                  Rhyme ID: {req.rhymeId}
                </Badge>
              </div>

              {/* Edit Reason Note */}
              <div className="bg-crayon-yellow/15 p-3 rounded-xl border border-crayon-yellow/30 text-xs text-ink">
                <strong>Editor&apos;s Note:</strong> &quot;{req.editReason}&quot;
              </div>

              {/* Side by Side Lyrics Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Lyrics */}
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    Original Text & Audio
                  </span>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap text-ink italic">
                    {req.originalText || "(No original text)"}
                  </p>
                  {req.originalAudioURL && (
                    <div className="mt-2">
                      <span className="text-[0.7rem] font-bold text-red-700 uppercase">Original Audio:</span>
                      <audio controls src={req.originalAudioURL} className="w-full h-8 mt-1" />
                    </div>
                  )}
                </div>

                {/* Proposed Corrections */}
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Proposed Corrected Text & Audio
                  </span>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap text-ink font-semibold">
                    {req.proposedText || "(No text changed)"}
                  </p>

                  {/* Proposed New Audio Player Preview */}
                  {req.proposedAudioURL && (
                    <div className="mt-2 bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-emerald-500/30">
                      <span className="text-[0.7rem] font-bold text-emerald-600 uppercase flex items-center gap-1">
                        <Volume2 size={13} /> Proposed New Voice Note:
                      </span>
                      <audio controls src={req.proposedAudioURL} className="w-full h-8 mt-1" />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2 border-t border-black/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleReject(req)}
                  leftIcon={<X size={16} />}
                  className="text-red-600 border-red-300 hover:bg-red-50 font-handwriting text-lg"
                >
                  Reject Edit
                </Button>

                <Button
                  type="button"
                  variant="danger"
                  onClick={() => handleApprove(req)}
                  leftIcon={<Check size={16} />}
                  className="bg-brand-green hover:bg-emerald-800 text-white font-handwriting text-xl px-6"
                >
                  Approve & Merge Audio/Lyrics ✅
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
