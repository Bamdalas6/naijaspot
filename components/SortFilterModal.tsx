"use client";

import React from "react";
import { NigerianState, SpotCategory } from "@/types";
import { NIGERIAN_STATES, CATEGORIES } from "@/lib/mockData";
import { X, Check, ArrowUpDown, MapPin, Sparkles } from "lucide-react";

export type SortOption = "featured" | "rating" | "price-asc" | "price-desc";

interface SortFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedState: NigerianState;
  onSelectState: (state: NigerianState) => void;
  selectedCategory: SpotCategory;
  onSelectCategory: (category: SpotCategory) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export function SortFilterModal({
  isOpen,
  onClose,
  selectedState,
  onSelectState,
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
}: SortFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-hidden text-slate-900 animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e8f6ff] text-[#0284c7] flex items-center justify-center">
              <ArrowUpDown className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Sort & Filter</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 no-scrollbar">
          {/* Section 1: Location / State */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                State / Location
              </span>
              <span className="text-xs font-semibold text-[#0284c7]">
                {selectedState}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {NIGERIAN_STATES.map((st) => {
                const isSelected = selectedState === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => onSelectState(st.id as NigerianState)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-[#38b6ff] text-white shadow-md shadow-[#38b6ff]/30"
                        : "bg-[#f4f9fd] text-slate-700 hover:bg-[#e9f4fc]"
                    }`}
                  >
                    <span className="truncate">{st.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Sort By */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              Sort By
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "featured", label: "Recommended" },
                { id: "rating", label: "Highest Rated (★)" },
                { id: "price-asc", label: "Price: Low to High" },
                { id: "price-desc", label: "Price: High to Low" },
              ].map((opt) => {
                const isSelected = selectedSort === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSelectSort(opt.id as SortOption)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-[#38b6ff] text-white shadow-md shadow-[#38b6ff]/30"
                        : "bg-[#f4f9fd] text-slate-700 hover:bg-[#e9f4fc]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Categories */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              Category
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#0f172a] text-white"
                        : "bg-[#f4f9fd] text-slate-600 hover:bg-[#e9f4fc]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full bg-[#38b6ff] hover:bg-[#25abf7] active:scale-98 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-[#38b6ff]/25 transition-all text-sm cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
