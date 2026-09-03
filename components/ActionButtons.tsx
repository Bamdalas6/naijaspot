"use client";

import React from "react";
import { X, RotateCcw, Heart } from "lucide-react";

interface ActionButtonsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onUndo: () => void;
  canUndo: boolean;
  disabled?: boolean;
}

export function ActionButtons({
  onSwipeLeft,
  onSwipeRight,
  onUndo,
  canUndo,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <div className="w-full max-w-xs mx-auto flex items-center justify-center gap-4 select-none pt-2">
      {/* Undo Button */}
      <button
        onClick={onUndo}
        disabled={!canUndo || disabled}
        title="Undo"
        className={`flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-md transition-all active:scale-90 ${
          canUndo && !disabled
            ? "text-amber-500 hover:bg-amber-50 cursor-pointer"
            : "text-slate-300 opacity-60 cursor-not-allowed"
        }`}
      >
        <RotateCcw className="w-4 h-4 stroke-[2.5]" />
      </button>

      {/* Dislike / Skip Button (Red 'X') */}
      <button
        onClick={onSwipeLeft}
        disabled={disabled}
        title="Pass Spot"
        className={`flex items-center justify-center w-14 h-14 rounded-full bg-white text-rose-500 shadow-lg hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <X className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Like / Save Button (Green Heart) */}
      <button
        onClick={onSwipeRight}
        disabled={disabled}
        title="Save Spot"
        className={`flex items-center justify-center w-14 h-14 rounded-full bg-white text-emerald-500 shadow-lg hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Heart className="w-7 h-7 fill-emerald-500/20 stroke-[2.5]" />
      </button>
    </div>
  );
}
