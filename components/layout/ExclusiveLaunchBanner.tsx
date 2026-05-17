"use client";

import { useEffect, useState } from "react";
import { Flame, X } from "lucide-react";

/**
 * Sticky top banner announcing the exclusive Creek View launch
 * with a live countdown (10 days from first visit).
 */

function getTargetDate(): Date {
  if (typeof window === "undefined") {
    return new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  }
  const stored = localStorage.getItem("creek-view-countdown-target");
  if (stored) {
    return new Date(stored);
  }
  const target = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  localStorage.setItem("creek-view-countdown-target", target.toISOString());
  return target;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function ExclusiveLaunchBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [target, setTarget] = useState<Date | null>(null);

  useEffect(() => {
    const t = getTargetDate();
    setTarget(t);
    setTimeLeft(calcTimeLeft(t));
  }, []);

  useEffect(() => {
    if (!target) return;
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (dismissed || !timeLeft) return null;

  const expired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (expired) return null;

  return (
    <div
      className="sticky top-0 z-[100] w-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0b1f3a 0%, #1a3a5c 50%, #0b1f3a 100%)",
      }}
    >
      {/* Animated shimmer overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(201,152,42,0.4) 40px, rgba(201,152,42,0.4) 41px)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-center gap-3 sm:gap-5 text-white">
          {/* Fire icon */}
          <Flame
            size={20}
            className="shrink-0 text-amber-400 animate-pulse hidden sm:block"
            aria-hidden
          />

          {/* Text */}
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-4 text-center sm:text-right">
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              <span className="text-amber-300">🔥 إطلاق حصري</span>{" "}
              <span className="text-white/90">Creek View — فاضل على التسكين:</span>
            </span>

            {/* Countdown boxes */}
            <div className="flex items-center gap-1.5 sm:gap-2 dir-ltr" dir="ltr">
              <CountdownUnit value={timeLeft.days} label="يوم" />
              <span className="text-amber-400 font-bold text-lg leading-none animate-pulse">:</span>
              <CountdownUnit value={timeLeft.hours} label="ساعة" />
              <span className="text-amber-400 font-bold text-lg leading-none animate-pulse">:</span>
              <CountdownUnit value={timeLeft.minutes} label="دقيقة" />
              <span className="text-amber-400 font-bold text-lg leading-none animate-pulse">:</span>
              <CountdownUnit value={timeLeft.seconds} label="ثانية" />
            </div>
          </div>

          {/* CTA link */}
          <a
            href="#creek-view"
            className="hidden md:inline-flex shrink-0 rounded-full bg-amber-500 hover:bg-amber-400 text-navy font-bold text-xs px-4 py-1.5 transition-colors"
          >
            احجز الآن
          </a>

          {/* Close button */}
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors mr-1"
            aria-label="إغلاق"
          >
            <X size={16} className="text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="inline-flex items-center justify-center rounded-md font-mono font-bold text-sm sm:text-base tabular-nums min-w-[2rem] sm:min-w-[2.5rem] py-0.5 sm:py-1"
        style={{
          background: "rgba(201,152,42,0.15)",
          border: "1px solid rgba(201,152,42,0.3)",
          color: "#fbbf24",
        }}
      >
        {pad(value)}
      </span>
      <span className="text-[0.55rem] sm:text-[0.6rem] text-white/50 mt-0.5 leading-none">
        {label}
      </span>
    </div>
  );
}
