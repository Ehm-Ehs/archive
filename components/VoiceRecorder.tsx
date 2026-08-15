"use client";
import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Plus, Trash2, Volume2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AudioRecordingItem {
  id: string;
  blob: Blob;
  url: string;
  name: string;
}

interface VoiceRecorderProps {
  onRecordingComplete?: (blob: Blob | null) => void;
  onRecordingsChange?: (blobs: Blob[]) => void;
}

export default function VoiceRecorder({ onRecordingComplete, onRecordingsChange }: VoiceRecorderProps) {
  const [recording, setRecording] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<AudioRecordingItem[]>([]);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const notifyChanges = (updated: AudioRecordingItem[]) => {
    const blobs = updated.map((item) => item.blob);
    if (onRecordingsChange) {
      onRecordingsChange(blobs);
    }
    if (onRecordingComplete) {
      onRecordingComplete(blobs.length > 0 ? blobs[0] : null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const newItem: AudioRecordingItem = {
          id: `audio-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          blob,
          url,
          name: `Song / Voice Note #${recordings.length + 1}`,
        };

        const updated = [...recordings, newItem];
        setRecordings(updated);
        notifyChanges(updated);

        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100);
      setRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setErrorMsg("Microphone access blocked. Please allow mic permission in your browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = (id: string) => {
    const updated = recordings.filter((r) => r.id !== id);
    setRecordings(updated);
    notifyChanges(updated);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-heading font-semibold text-sm text-text-main">
          <Mic size={18} className={recording ? "text-brand-terracotta" : "text-brand-green"} />
          <span>
            {recording ? "Recording Song / Voice Note..." : recordings.length > 0 ? `Recorded Audio Clips (${recordings.length})` : "Record Voice Note / Song (Optional)"}
          </span>
        </div>

        {recording && (
          <div className="flex items-center gap-2 bg-brand-terracotta-light text-brand-terracotta px-3 py-1 rounded-full font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-brand-terracotta animate-ping" />
            {formatTime(recordingTime)}
          </div>
        )}
      </div>

      {/* Visualizer bars */}
      {recording && (
        <div className="h-9 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center gap-1.5 px-4">
          <div className="wave-bar" />
          <div className="wave-bar" />
          <div className="wave-bar" />
          <div className="wave-bar" />
          <div className="wave-bar" />
        </div>
      )}

      {/* List of Recorded Clips */}
      {recordings.length > 0 && (
        <div className="flex flex-col gap-3 my-1">
          {recordings.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-text-main">
                <Volume2 size={15} className="text-brand-green shrink-0" />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <audio controls src={item.url} className="h-8 w-full sm:w-60" />
                <button
                  type="button"
                  onClick={() => deleteRecording(item.id)}
                  title="Remove Recording"
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-terracotta hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant={recording ? "danger" : recordings.length > 0 ? "outline" : "primary"}
          size="md"
          onClick={recording ? stopRecording : startRecording}
          leftIcon={recording ? <Square size={16} /> : recordings.length > 0 ? <Plus size={16} /> : <Mic size={16} />}
          className="w-full"
        >
          {recording
            ? "Stop Recording"
            : recordings.length > 0
            ? "Record Another Song / Voice Note"
            : "Record Voice Note"}
        </Button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-terracotta bg-brand-terracotta-light p-3 rounded-xl">
          <AlertCircle size={15} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
