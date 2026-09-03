"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [deckCompleted, setDeckCompleted] = useState(false);
  const [deckKey, setDeckKey] = useState(0);

  const { places, loading } = usePlaces(selectedState, selectedCategory);
  const { savedCount, saveSpot, removeSpot, isSaved } = useSavedPlaces();

  useEffect(() => {
    setDeckCompleted(false);
    setDeckKey((prev) => prev + 1);
  }, [selectedState, selectedCategory, selectedSort]);

  // Apply search and sorting
  const filteredAndSortedPlaces = useMemo(() => {
    if (!places) return [];
    let list = [...places];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

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
  }, [places, searchQuery, selectedSort]);

  const handleResetDeck = () => {
    setDeckCompleted(false);
    setDeckKey((prev) => prev + 1);
  };

  const handleAllCardsSwiped = () => {
    setDeckCompleted(true);
  };

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-sky-gradient relative pb-20 select-none">
      {/* Top Section: Navigation + Search + Category Story Bubbles */}
      <Header
        selectedState={selectedState}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenSortModal={() => setIsSortModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Main Discover Card Deck (Full-bleed Tinder style matching screenshot) */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden py-1">
        {loading ? (
          <div className="w-full max-w-[340px] h-[450px] max-h-[58vh] flex flex-col items-center justify-center bg-white/70 backdrop-blur-md rounded-[30px] border border-white/80 shadow-md">
            <Loader2 className="w-8 h-8 text-[#0284c7] animate-spin mb-2.5" />
            <span className="text-xs font-bold text-slate-700">
              Finding spots in {selectedState}...
            </span>
          </div>
        ) : deckCompleted || filteredAndSortedPlaces.length === 0 ? (
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
            places={filteredAndSortedPlaces}
            onSaveSpot={saveSpot}
            onAllCardsSwiped={handleAllCardsSwiped}
            isSaved={isSaved}
            onRemoveSpot={removeSpot}
          />
        )}
      </main>

      {/* Floating 2-tab Bottom Navigation Bar */}
      <BottomNav savedCount={savedCount} />

      {/* Filter / State Modal */}
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
