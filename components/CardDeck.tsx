"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const isDraggingRef = useRef(false);

  useEffect(() => {
    setDeck(places);
    setHistory([]);
  }, [places]);

  const currentCard = deck[0];
  const nextCard = deck[1];
  const thirdCard = deck[2];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-14, 14]);
  const likeOpacity = useTransform(x, [20, 90], [0, 1]);
  const nopeOpacity = useTransform(x, [-90, -20], [1, 0]);

  // Reset motion value when current card changes
  useEffect(() => {
    x.set(0);
  }, [currentCard?.id, x]);

  const handleSwipe = (direction: "left" | "right") => {
    if (!currentCard) return;

    const swipedSpot = currentCard;
    setSwipeDirection(direction);

    if (direction === "right") {
      onSaveSpot(swipedSpot);
      toast.success("Saved spot! 📍", {
        description: `${swipedSpot.name} • ${swipedSpot.city}`,
        duration: 1800,
        position: "top-center",
      });
    }

    setHistory((prev) => [{ spot: swipedSpot, action: direction }, ...prev]);
    setDeck((prev) => prev.slice(1));
    x.set(0);

    if (deck.length <= 1) {
      onAllCardsSwiped();
    }
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 65;
    const velocityThreshold = 250;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      handleSwipe("right");
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      handleSwipe("left");
    } else {
      x.set(0);
    }

    setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);
  };

  const handleCardClick = () => {
    if (!isDraggingRef.current && currentCard) {
      setSelectedDetailsSpot(currentCard);
    }
  };

  if (!currentCard) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full max-w-[350px] sm:max-w-[370px] mx-auto relative px-3 select-none my-auto">
        {/* Swipe Deck Container */}
        <div className="relative w-full h-[450px] max-h-[58vh] flex items-center justify-center">
          {/* 3rd Card in background */}
          {thirdCard && (
            <div
              key={thirdCard.id}
              className="absolute inset-0 w-full h-full transform scale-[0.92] translate-y-3 rotate-[3deg] opacity-40 pointer-events-none rounded-[30px] overflow-hidden shadow-lg transition-all duration-300 z-0 bg-slate-200"
            >
              <PlaceCard spot={thirdCard} isFront={false} />
            </div>
          )}

          {/* 2nd Card in background */}
          {nextCard && (
            <div
              key={nextCard.id}
              className="absolute inset-0 w-full h-full transform scale-[0.96] translate-y-1.5 rotate-[-2.5deg] opacity-75 pointer-events-none rounded-[30px] overflow-hidden shadow-xl transition-all duration-300 z-10 bg-slate-200"
            >
              <PlaceCard spot={nextCard} isFront={false} />
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
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{
                x: swipeDirection === "right" ? 500 : -500,
                opacity: 0,
                scale: 0.88,
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
                isSaved={isSaved?.(currentCard.id)}
                onSwipeRight={() => handleSwipe("right")}
                onSwipeLeft={() => handleSwipe("left")}
                onOpenDetails={handleCardClick}
              />
            </motion.div>
          </AnimatePresence>
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
