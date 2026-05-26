"use client";

import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_SECONDS = 25 * 60;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TasksFocusTimer() {
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const id = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, seconds]);

  const reset = () => {
    setRunning(false);
    setSeconds(DEFAULT_SECONDS);
  };

  return (
    <section className="glass rounded-2xl border border-emerald-100/60 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="h-5 w-5 text-emerald-600" />
        <h3 className="font-semibold text-emerald-900">Focus Timer</h3>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-emerald-100 bg-gradient-to-br from-emerald-50 to-white mb-4">
          <span className="text-3xl font-bold tabular-nums text-emerald-800 tracking-tight">
            {formatTime(seconds)}
          </span>
          <span className="absolute -bottom-1 text-lg" aria-hidden>
            🌿
          </span>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            onClick={() => setRunning((r) => !r)}
            disabled={seconds === 0}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
          >
            {running ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Start Session
              </>
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={reset} aria-label="Reset timer">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-emerald-600/60 mt-3">Pomodoro · 25 min focus</p>
      </div>
    </section>
  );
}
