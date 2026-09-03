"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { CardDeck } from "@/components/CardDeck";
import { EmptyState } from "@/components/EmptyState";
import { BottomNav } from "@/components/BottomNav";
import { SortFilterModal, SortOption } from "@/components/SortFilterModal";
import { usePlaces } from "@/hooks/usePlaces";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";
import { NigerianState, SpotCategory, Spot } from "@/types";
import { Loader2 } from "lucide-react";

export default function DiscoverPage() {
  const [selectedState, setSelectedState] = useState<NigerianState>("Lagos");
  const [selectedCategory, setSelectedCategory] = useState<SpotCategory>("All");
  const [selectedSort, setSelectedSort] = useState<SortOption>("featured");
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [deckCompleted, setDeckCompleted] = useState(false);
  const [deckKey, setDeckKey] = useState(0);

  const { places, loading } = usePlaces(selectedState, selectedCategory);
  const { savedCount, saveSpot, removeSpot, isSaved } = useSavedPlaces();

  // Reset deck state when state, category, or sort changes
  useEffect(() => {
    setDeckCompleted(false);
    setDeckKey((prev) => prev + 1);
  }, [selectedState, selectedCategory, selectedSort]);

  // Apply sorting logic
  const sortedPlaces = useMemo(() => {
    if (!places) return [];
    const list = [...places];

    if (selectedSort === "rating") {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (selectedSort === "price-asc") {
      const priceWeight: Record<string, number> = {
        Free: 0,
        "₦": 1,
        "₦₦": 2,
        "₦₦₦": 3,
        "₦₦₦₦": 4,
      };
      return list.sort(
        (a, b) => (priceWeight[a.priceRating] || 0) - (priceWeight[b.priceRating] || 0)
      );
    }

    if (selectedSort === "price-desc") {
      const priceWeight: Record<string, number> = {
        Free: 0,
        "₦": 1,
        "₦₦": 2,
        "₦₦₦": 3,
        "₦₦₦₦": 4,
      };
      return list.sort(
        (a, b) => (priceWeight[b.priceRating] || 0) - (priceWeight[a.priceRating] || 0)
      );
    }

    return list;
  }, [places, selectedSort]);

  const handleResetDeck = () => {
    setDeckCompleted(false);
    setDeckKey((prev) => prev + 1);
  };

  const handleAllCardsSwiped = () => {
    setDeckCompleted(true);
  };

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-sky-gradient relative pb-20 select-none">
      {/* Top Header & Sort Button (without duplicate saved bookmark) */}
      <Header
        selectedState={selectedState}
        onOpenSortModal={() => setIsSortModalOpen(true)}
      />

      {/* Airbnb-style Icon Category Filter (Side-by-side without numbers) */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Main Discover Swipe Deck with appropriate padding */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 relative overflow-hidden">
        {loading ? (
          <div className="w-full max-w-md h-[520px] max-h-[72vh] flex flex-col items-center justify-center bg-white/70 backdrop-blur-md rounded-[32px] border border-white/80 shadow-md">
            <Loader2 className="w-8 h-8 text-[#0284c7] animate-spin mb-2.5" />
            <span className="text-xs font-bold text-slate-700">
              Discovering spots in {selectedState}...
            </span>
          </div>
        ) : deckCompleted || sortedPlaces.length === 0 ? (
          <EmptyState
            selectedState={selectedState}
            selectedCategory={selectedCategory}
            onResetDeck={handleResetDeck}
            onSelectState={(state) => setSelectedState(state)}
            onResetCategory={() => setSelectedCategory("All")}
            onOpenSortModal={() => setIsSortModalOpen(true)}
            savedCount={savedCount}
          />
        ) : (
          <CardDeck
            key={`${selectedState}-${selectedCategory}-${selectedSort}-${deckKey}`}
            places={sortedPlaces}
            onSaveSpot={saveSpot}
            onAllCardsSwiped={handleAllCardsSwiped}
            isSaved={isSaved}
            onRemoveSpot={removeSpot}
          />
        )}
      </main>

      {/* Bottom Floating Navigation Dock (The only place for Saved Spots) */}
      <BottomNav savedCount={savedCount} />

      {/* Friendly Sort & Filter Modal */}
      <SortFilterModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        selectedState={selectedState}
        onSelectState={(st) => setSelectedState(st)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        selectedSort={selectedSort}
        onSelectSort={(sort) => setSelectedSort(sort)}
      />
    </div>
  );
}
