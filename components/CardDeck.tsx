"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationControls,
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

// Active Top Card Component with isolated motion physics
function ActiveSwipeCard({
  spot,
  isSaved,
  onSwipe,
  onOpenDetails,
}: {
  spot: Spot;
  isSaved: boolean;
  onSwipe: (dir: "left" | "right") => void;
  onOpenDetails: () => void;
}) {
  const controls = useAnimationControls();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-16, 16]);
  const likeOpacity = useTransform(x, [20, 90], [0, 1]);
  const nopeOpacity = useTransform(x, [-90, -20], [1, 0]);
  const dragDistanceRef = useRef(0);

  useEffect(() => {
    controls.set({ x: 0, rotate: 0, scale: 1, opacity: 1, y: 0 });
  }, [spot.id, controls]);

  // Trigger button swipe (Heart or X) with smooth exit animation
  const triggerSwipeAnimation = async (direction: "left" | "right") => {
    await controls.start({
      x: direction === "right" ? 520 : -520,
      rotate: direction === "right" ? 18 : -18,
      opacity: 0,
      transition: { duration: 0.24, ease: "easeOut" },
    });
    onSwipe(direction);
  };

  const handleDrag = (_: any, info: PanInfo) => {
    dragDistanceRef.current = Math.abs(info.offset.x);
  };

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const isSwipeRight = info.offset.x > 75 || info.velocity.x > 280;
    const isSwipeLeft = info.offset.x < -75 || info.velocity.x < -280;

    if (isSwipeRight) {
      await controls.start({
        x: 520,
        rotate: 18,
        opacity: 0,
        transition: { duration: 0.22, ease: "easeOut" },
      });
      onSwipe("right");
    } else if (isSwipeLeft) {
      await controls.start({
        x: -520,
        rotate: -18,
        opacity: 0,
        transition: { duration: 0.22, ease: "easeOut" },
      });
      onSwipe("left");
    } else {
      // Spring back to origin smoothly
      controls.start({
        x: 0,
        rotate: 0,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 500, damping: 28 },
      });
    }

    setTimeout(() => {
      dragDistanceRef.current = 0;
    }, 120);
  };

  const handleCardClick = () => {
    // Only open details if user tapped without dragging
    if (dragDistanceRef.current < 8) {
      onOpenDetails();
    }
  };

  return (
    <motion.div
      animate={controls}
      style={{ x, rotate }}
      drag="x"
      dragDirectionLock
      dragElastic={0.85}
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-30 touch-none"
    >
      <PlaceCard
        spot={spot}
        isFront={true}
        likeOpacity={likeOpacity}
        nopeOpacity={nopeOpacity}
        isSaved={isSaved}
        onSwipeRight={() => triggerSwipeAnimation("right")}
        onSwipeLeft={() => triggerSwipeAnimation("left")}
        onOpenDetails={handleCardClick}
      />
    </motion.div>
  );
}

export function CardDeck({
  places,
  onSaveSpot,
  onAllCardsSwiped,
  isSaved,
  onRemoveSpot,
}: CardDeckProps) {
  const [deck, setDeck] = useState<Spot[]>(places);
  const [selectedDetailsSpot, setSelectedDetailsSpot] = useState<Spot | null>(null);

  useEffect(() => {
    setDeck(places);
  }, [places]);

  const currentCard = deck[0];
  const nextCard = deck[1];
  const thirdCard = deck[2];

  const handleSwipeAction = (direction: "left" | "right") => {
    if (!currentCard) return;

    const swipedSpot = currentCard;

    if (direction === "right") {
      onSaveSpot(swipedSpot);
      toast.success("Saved spot! 📍", {
        description: `${swipedSpot.name} • ${swipedSpot.city}`,
        duration: 1800,
        position: "top-center",
      });
    }

    // Advance to next card in stack
    setDeck((prev) => prev.slice(1));

    if (deck.length <= 1) {
      onAllCardsSwiped();
    }
  };

  if (!currentCard) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full max-w-[350px] sm:max-w-[370px] mx-auto relative px-3 select-none my-auto">
        {/* Card Deck Stack Container */}
        <div className="relative w-full h-[450px] max-h-[58vh] flex items-center justify-center">
          {/* 3rd Card in background */}
          {thirdCard && (
            <div
              key={thirdCard.id}
              className="absolute inset-0 w-full h-full transform scale-[0.92] translate-y-3 rotate-[3deg] opacity-40 pointer-events-none rounded-[30px] overflow-hidden shadow-lg transition-all duration-300 z-10 bg-slate-200"
            >
              <PlaceCard spot={thirdCard} isFront={false} />
            </div>
          )}

          {/* 2nd Card in background (springs up when top card exits) */}
          {nextCard && (
            <motion.div
              key={nextCard.id}
              initial={{ scale: 0.94, y: 8, rotate: -3 }}
              animate={{ scale: 0.96, y: 4, rotate: -2 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 w-full h-full pointer-events-none rounded-[30px] overflow-hidden shadow-xl z-20 bg-slate-200"
            >
              <PlaceCard spot={nextCard} isFront={false} />
            </motion.div>
          )}

          {/* Top Active Card */}
          <ActiveSwipeCard
            key={currentCard.id}
            spot={currentCard}
            isSaved={Boolean(isSaved?.(currentCard.id))}
            onSwipe={handleSwipeAction}
            onOpenDetails={() => setSelectedDetailsSpot(currentCard)}
          />
        </div>
      </div>

      {/* Spot Details Modal */}
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
