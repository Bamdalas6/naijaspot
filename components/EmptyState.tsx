"use client";

import React from "react";
import Link from "next/link";
import { NigerianState, SpotCategory } from "@/types";
import { NIGERIAN_STATES } from "@/lib/mockData";
import { RotateCcw, Bookmark, Sparkles, SlidersHorizontal } from "lucide-react";

interface EmptyStateProps {
  selectedState: NigerianState;
  selectedCategory: SpotCategory;
  onResetDeck: () => void;
  onSelectState: (state: NigerianState) => void;
  onResetCategory: () => void;
  onOpenSortModal?: () => void;
  savedCount: number;
}

export function EmptyState({
  selectedState,
  selectedCategory,
  onResetDeck,
  onSelectState,
  onResetCategory,
  onOpenSortModal,
  savedCount,
}: EmptyStateProps) {
  const otherStates = NIGERIAN_STATES.filter((s) => s.id !== selectedState).slice(0, 3);

  return (
    <div className="w-full max-w-md mx-auto h-[530px] max-h-[73vh] flex flex-col items-center justify-center text-center p-7 bg-white rounded-[32px] shadow-2xl border border-slate-100 text-slate-900">
      {/* Friendly Icon */}
      <div className="w-16 h-16 rounded-full bg-[#e8f6ff] text-[#0284c7] flex items-center justify-center mb-4 shadow-inner">
        <Sparkles className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1.5">
        All spots explored in {selectedState}!
      </h3>

      <p className="text-slate-500 text-xs leading-relaxed mb-6 max-w-xs">
        {selectedCategory !== "All" ? (
          <>
            No more spots in <span className="font-bold text-slate-800">{selectedCategory}</span>. Try resetting filters or switching locations.
          </>
        ) : (
          "You've swiped through every spot in this state. Ready to replay or discover a new state?"
        )}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 w-full max-w-xs">
        <button
          onClick={onResetDeck}
          className="w-full flex items-center justify-center gap-2 bg-[#38b6ff] hover:bg-[#20a6f5] text-white font-bold py-3.5 rounded-2xl shadow-md shadow-[#38b6ff]/25 active:scale-95 transition-all text-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Replay {selectedState}</span>
        </button>

        {onOpenSortModal && (
          <button
            onClick={onOpenSortModal}
            className="w-full flex items-center justify-center gap-2 bg-[#f4f9fd] hover:bg-[#e9f4fc] text-[#0284c7] font-bold py-3 rounded-2xl text-xs transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Change Location or Filters</span>
          </button>
        )}

        <Link
          href="/saved"
          className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold py-2.5 rounded-2xl text-xs transition-all"
        >
          <Bookmark className="w-3.5 h-3.5 text-[#0284c7]" />
          <span>View Saved Spots ({savedCount})</span>
        </Link>
      </div>

      {/* Quick State chips */}
      <div className="mt-5 pt-3 border-t border-slate-100 w-full max-w-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
          Switch State:
        </span>
        <div className="flex items-center justify-center gap-1.5">
          {otherStates.map((st) => (
            <button
              key={st.id}
              onClick={() => onSelectState(st.id as NigerianState)}
              className="px-3 py-1.5 rounded-xl bg-[#f4f9fd] text-slate-700 hover:bg-[#38b6ff] hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              {st.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
