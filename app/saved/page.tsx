"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SavedSpotItem } from "@/components/SavedSpotItem";
import { BottomNav } from "@/components/BottomNav";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";
import { SpotCategory } from "@/types";
import { NIGERIAN_STATES, CATEGORIES } from "@/lib/mockData";
import { ArrowLeft, Bookmark, Filter, Compass } from "lucide-react";
import { toast } from "sonner";

export default function SavedSpotsPage() {
  const { savedSpots, savedCount, removeSpot, loading } = useSavedPlaces();
  const [filterState, setFilterState] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<SpotCategory>("All");

  const filteredSpots = useMemo(() => {
    return savedSpots.filter((spot) => {
      const matchState = filterState === "All" || spot.state === filterState;
      const matchCategory =
        filterCategory === "All" || spot.category === filterCategory;
      return matchState && matchCategory;
    });
  }, [savedSpots, filterState, filterCategory]);

  const handleRemove = (id: string, name: string) => {
    removeSpot(id);
    toast.info("Removed from saved spots", {
      description: name,
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-sky-gradient pb-24 text-slate-900">
      {/* Top Header / Back */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-white/80 border border-sky-100 shadow-sm flex items-center justify-center text-slate-700 hover:text-[#0284c7] transition-all"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </Link>

        <div className="flex items-center gap-1.5">
          <Bookmark className="w-5 h-5 fill-[#0284c7] text-[#0284c7]" />
          <h1 className="text-base font-extrabold text-slate-900">
            Saved Spots ({savedCount})
          </h1>
        </div>

        <div className="w-10 h-10" />
      </div>

      {/* Filter Row */}
      {savedSpots.length > 0 && (
        <div className="px-5 py-2 flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-xs text-slate-700 shadow-sm border border-sky-100">
            <Filter className="w-3.5 h-3.5 text-[#0284c7]" />
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="All">All States</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-xs text-slate-700 shadow-sm border border-sky-100">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as SpotCategory)}
              className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Spots List */}
      <div className="flex-1 px-5 py-2 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600 text-xs font-bold">
            Loading your spots...
          </div>
        ) : savedSpots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[32px] shadow-xl p-8 mt-4 border border-sky-100">
            <div className="w-16 h-16 rounded-full bg-[#e8f6ff] text-[#0284c7] flex items-center justify-center mb-3">
              <Bookmark className="w-7 h-7 fill-[#0284c7]" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              No saved spots yet
            </h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-6">
              When you discover a spot you like, swipe right or tap the heart to save it here!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-6 py-3 rounded-2xl shadow-md shadow-sky-500/25 text-xs transition-all active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Spots</span>
            </Link>
          </div>
        ) : filteredSpots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[32px] shadow-xl p-8 mt-4 border border-sky-100">
            <p className="text-xs text-slate-500 mb-3">
              No spots match your current filters.
            </p>
            <button
              onClick={() => {
                setFilterState("All");
                setFilterCategory("All");
              }}
              className="text-xs text-[#0284c7] hover:underline font-bold cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredSpots.map((spot) => (
              <SavedSpotItem
                key={spot.id}
                spot={spot}
                onRemove={(id) => handleRemove(id, spot.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Nav */}
      <BottomNav savedCount={savedCount} />
    </div>
  );
}
