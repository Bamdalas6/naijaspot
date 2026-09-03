"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, ChevronLeft, Search, Plus, Compass } from "lucide-react";
import { NigerianState, SpotCategory } from "@/types";
import { CATEGORIES } from "@/lib/mockData";

interface HeaderProps {
  selectedState?: NigerianState;
  selectedCategory?: SpotCategory;
  onSelectCategory?: (category: SpotCategory) => void;
  onOpenSortModal?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

// Category avatars matching the circular story bubbles in the screenshot
const CATEGORY_AVATARS: Record<string, string> = {
  All: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=150&q=80",
  "Eatery & Dining": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80",
  "Bars & Lounges": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=150&q=80",
  "Historical & Memory": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=150&q=80",
  "Nature & Parks": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80",
  "Arts & Culture": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=150&q=80",
};

const SHORT_NAMES: Record<string, string> = {
  All: "All",
  "Eatery & Dining": "Dining",
  "Bars & Lounges": "Bars",
  "Historical & Memory": "History",
  "Nature & Parks": "Nature",
  "Arts & Culture": "Culture",
};

export function Header({
  selectedState = "Lagos",
  selectedCategory = "All",
  onSelectCategory,
  onOpenSortModal,
  searchQuery = "",
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="w-full px-5 pt-3 pb-2 flex flex-col gap-3 select-none">
      {/* 1. Top Navigation Bar (matching screenshot: < Find a Match, Profile) */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-white/90 border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:text-black transition-all"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </Link>

        <h1 className="text-lg font-black text-slate-900 tracking-tight">
          Find a Spot
        </h1>

        <div className="relative w-10 h-10 rounded-full bg-white p-0.5 shadow-sm border border-slate-200/80 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="User profile"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* 2. Search Bar with Filter Button (matching screenshot pill search) */}
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-2.5 shadow-xs border border-slate-200/70">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={`Search spots in ${selectedState}...`}
          className="flex-1 bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {onOpenSortModal && (
          <button
            onClick={onOpenSortModal}
            className="text-slate-400 hover:text-[#0284c7] transition-colors p-0.5 cursor-pointer"
            title="Filter by State or Sort"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2.2]" />
          </button>
        )}
      </div>

      {/* 3. Circular Stories / Category Avatars (matching screenshot avatars row) */}
      <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1">
        {/* Plus (+) Add icon bubble */}
        <button
          onClick={() => onSelectCategory?.("All")}
          className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
        >
          <div className="w-13 h-13 rounded-full bg-white/90 border border-dashed border-[#0284c7]/60 flex items-center justify-center text-[#0284c7] shadow-xs group-hover:scale-105 transition-all">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-slate-700">All</span>
        </button>

        {/* Category Avatars */}
        {CATEGORIES.filter((c) => c !== "All").map((cat) => {
          const isSelected = selectedCategory === cat;
          const avatarUrl = CATEGORY_AVATARS[cat];

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory?.(cat)}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
            >
              <div
                className={`relative w-13 h-13 rounded-full p-0.5 transition-all duration-200 shadow-xs group-hover:scale-105 ${
                  isSelected
                    ? "ring-2 ring-[#0284c7] ring-offset-2 ring-offset-sky-100"
                    : "border border-slate-200/90"
                }`}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={avatarUrl}
                    alt={cat}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <span
                className={`text-[11px] font-bold tracking-tight ${
                  isSelected ? "text-[#0284c7]" : "text-slate-600"
                }`}
              >
                {SHORT_NAMES[cat] || cat}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
