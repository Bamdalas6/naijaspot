"use client";

import React from "react";
import { SpotCategory } from "@/types";
import { CATEGORIES } from "@/lib/mockData";
import {
  Sparkles,
  UtensilsCrossed,
  Wine,
  Landmark,
  Trees,
  Palette,
} from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: SpotCategory;
  onSelectCategory: (category: SpotCategory) => void;
}

const CATEGORY_ICONS: Record<SpotCategory, React.ReactNode> = {
  All: <Sparkles className="w-5 h-5 stroke-[1.8]" />,
  "Eatery & Dining": <UtensilsCrossed className="w-5 h-5 stroke-[1.8]" />,
  "Bars & Lounges": <Wine className="w-5 h-5 stroke-[1.8]" />,
  "Historical & Memory": <Landmark className="w-5 h-5 stroke-[1.8]" />,
  "Nature & Parks": <Trees className="w-5 h-5 stroke-[1.8]" />,
  "Arts & Culture": <Palette className="w-5 h-5 stroke-[1.8]" />,
};

const CATEGORY_LABELS: Record<SpotCategory, string> = {
  All: "All Spots",
  "Eatery & Dining": "Dining",
  "Bars & Lounges": "Nightlife",
  "Historical & Memory": "Historical",
  "Nature & Parks": "Nature",
  "Arts & Culture": "Culture",
};

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="w-full bg-white/60 backdrop-blur-md border-y border-sky-100/70 select-none">
      <div className="flex items-center gap-7 overflow-x-auto no-scrollbar px-6 py-2.5 max-w-md mx-auto">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex flex-col items-center justify-center gap-1.5 min-w-[54px] shrink-0 pb-1.5 pt-0.5 relative transition-all duration-200 cursor-pointer group ${
                isSelected
                  ? "text-[#0284c7] font-bold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              {/* Airbnb Icon */}
              <div
                className={`p-2 rounded-2xl transition-all duration-200 ${
                  isSelected
                    ? "bg-[#e0f2fe] text-[#0284c7] scale-105"
                    : "text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-900"
                }`}
              >
                {CATEGORY_ICONS[cat]}
              </div>

              {/* Category Label (No numbers) */}
              <span className="text-[11px] whitespace-nowrap tracking-tight">
                {CATEGORY_LABELS[cat] || cat}
              </span>

              {/* Bottom active underline */}
              {isSelected && (
                <span className="absolute bottom-0 inset-x-1 h-[2.5px] bg-[#0284c7] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
