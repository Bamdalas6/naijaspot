"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import { Spot } from "@/types";
import { PlaceCard } from "./PlaceCard";
import { PlaceDetailsModal } from "./PlaceDetailsModal";
import { ActionButtons } from "./ActionButtons";
import { toast } from "sonner";

interface CardDeckProps {
  places: Spot[];
  onSaveSpot: (spot: Spot) => void;
  onAllCardsSwiped: () => void;
  isSaved?: (id: string) => boolean;
  onRemoveSpot?: (id: string) => void;
}

export function CardDeck({
  places,
  onSaveSpot,
  onAllCardsSwiped,
  isSaved,
  onRemoveSpot,
}: CardDeckProps) {
  const [deck, setDeck] = useState<Spot[]>(places);
  const [history, setHistory] = useState<{ spot: Spot; action: "left" | "right" }[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [selectedDetailsSpot, setSelectedDetailsSpot] = useState<Spot | null>(null);

  useEffect(() => {
    setDeck(places);
    setHistory([]);
  }, [places]);

  const currentCard = deck[0];
  const nextCard = deck[1];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-14, 14]);
  const likeOpacity = useTransform(x, [15, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, -15], [1, 0]);

  const handleSwipe = (direction: "left" | "right") => {
    if (!currentCard) return;

    const swipedSpot = currentCard;
    setSwipeDirection(direction);

    if (direction === "right") {
      onSaveSpot(swipedSpot);
      toast.success("Added to saved spots! 📍", {
        description: `${swipedSpot.name} • ${swipedSpot.city}`,
        duration: 2000,
        position: "top-center",
      });
    }

    setHistory((prev) => [{ spot: swipedSpot, action: direction }, ...prev]);
    setDeck((prev) => prev.slice(1));

    if (deck.length <= 1) {
      onAllCardsSwiped();
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 80;
    const velocityThreshold = 350;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      handleSwipe("right");
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      handleSwipe("left");
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const [lastAction, ...remainingHistory] = history;
    setDeck((prev) => [lastAction.spot, ...prev]);
    setHistory(remainingHistory);
  };

  if (!currentCard) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-between w-full max-w-md mx-auto relative px-5 flex-1 select-none">
        {/* Swipe Deck Container */}
        <div className="relative w-full h-[520px] max-h-[72vh] flex items-center justify-center my-auto">
          {/* Next Card in Stack */}
          {nextCard && (
            <div
              key={nextCard.id}
              className="absolute inset-0 w-full h-full transform scale-[0.96] translate-y-3 opacity-90 pointer-events-none transition-all duration-300 z-10"
            >
              <PlaceCard
                spot={nextCard}
                isFront={false}
              />
            </div>
          )}

          {/* Top Active Card */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentCard.id}
              style={{ x, rotate }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.65}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{
                x: swipeDirection === "right" ? 500 : -500,
                opacity: 0,
                scale: 0.9,
                transition: { duration: 0.22, ease: "easeOut" },
              }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-20 touch-none"
            >
              <PlaceCard
                spot={currentCard}
                isFront={true}
                likeOpacity={likeOpacity}
                nopeOpacity={nopeOpacity}
                onOpenDetails={() => setSelectedDetailsSpot(currentCard)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Control Buttons */}
        <div className="w-full pb-1">
          <ActionButtons
            onSwipeLeft={() => handleSwipe("left")}
            onSwipeRight={() => handleSwipe("right")}
            onUndo={handleUndo}
            canUndo={history.length > 0}
          />
        </div>
      </div>

      {/* Spot Details Full View Modal */}
      <PlaceDetailsModal
        spot={selectedDetailsSpot}
        isOpen={Boolean(selectedDetailsSpot)}
        onClose={() => setSelectedDetailsSpot(null)}
        isSaved={Boolean(selectedDetailsSpot && isSaved?.(selectedDetailsSpot.id))}
        onToggleSave={() => {
          if (selectedDetailsSpot) {
            if (isSaved?.(selectedDetailsSpot.id)) {
              onRemoveSpot?.(selectedDetailsSpot.id);
            } else {
              onSaveSpot(selectedDetailsSpot);
            }
          }
        }}
      />
    </>
  );
}
