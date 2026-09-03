"use client";

import React from "react";
import Image from "next/image";
import { Spot } from "@/types";
import { MapPin, Heart, Star, X, Info } from "lucide-react";
import { motion, MotionValue } from "framer-motion";

interface PlaceCardProps {
  spot: Spot;
  isFront?: boolean;
  likeOpacity?: MotionValue<number>;
  nopeOpacity?: MotionValue<number>;
  isSaved?: boolean;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  onOpenDetails?: () => void;
}

export function PlaceCard({
  spot,
  isFront = true,
  likeOpacity,
  nopeOpacity,
  isSaved = false,
  onSwipeRight,
  onSwipeLeft,
  onOpenDetails,
}: PlaceCardProps) {
  return (
    <div
      onClick={onOpenDetails}
      className="relative w-full h-full rounded-[30px] overflow-hidden shadow-2xl select-none cursor-pointer group"
    >
      {/* Full-bleed Photo Background */}
      <Image
        src={spot.imageUrl}
        alt={spot.name}
        fill
        priority={isFront}
        sizes="(max-width: 768px) 100vw, 380px"
        className="object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
      />

      {/* Subtle Readability Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none h-24" />

      {/* Swipe Feedback Stamps */}
      {isFront && likeOpacity && nopeOpacity && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-8 left-6 pointer-events-none z-30 transform -rotate-12 border-4 border-emerald-400 bg-emerald-500/80 backdrop-blur-sm text-white font-black text-xl tracking-widest px-4 py-1.5 rounded-2xl shadow-2xl"
          >
            LIKE ♥
          </motion.div>

          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-8 right-6 pointer-events-none z-30 transform rotate-12 border-4 border-rose-500 bg-rose-500/80 backdrop-blur-sm text-white font-black text-xl tracking-widest px-4 py-1.5 rounded-2xl shadow-2xl"
          >
            NOPE ✕
          </motion.div>
        </>
      )}

      {/* Top Badges (Category & Price) */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-20">
        <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold border border-white/20 shadow-sm flex items-center gap-1.5">
          <span>{spot.category}</span>
          <span className="text-white/60">•</span>
          <span className="text-amber-300 font-extrabold">{spot.priceRating}</span>
        </div>

        <div className="flex items-center gap-2">
          {spot.rating && (
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-300 text-xs font-black border border-white/20 shadow-sm">
              <Star className="w-3 h-3 fill-amber-300" />
              <span>{spot.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Info Details Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails?.();
            }}
            className="pointer-events-auto w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all shadow-sm"
            title="View Details"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Overlaid Info & Action Buttons */}
      <div className="absolute bottom-0 inset-x-0 p-5 z-20 flex items-end justify-between gap-2.5 text-white">
        {/* Left text block: Name, Distance */}
        <div className="flex-1 min-w-0 pr-1">
          <h2 className="text-2xl font-black tracking-tight leading-tight mb-1 drop-shadow-md line-clamp-1">
            {spot.name}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium drop-shadow">
            <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="truncate">
              {spot.city}, {spot.state}
              {spot.distance ? ` • ${spot.distance.split("•")[1]?.trim() || spot.distance}` : ""}
            </span>
          </div>
        </div>

        {/* Right action buttons: Skip (X) & Save (Heart) */}
        {isFront && (
          <div className="flex items-center gap-2 shrink-0">
            {/* Skip (X) button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwipeLeft?.();
              }}
              className="w-11 h-11 rounded-full bg-black/45 hover:bg-black/65 active:scale-90 backdrop-blur-md text-white border border-white/30 flex items-center justify-center shadow-lg transition-all cursor-pointer"
              title="Skip"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Like & Save (Heart) button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwipeRight?.();
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90 cursor-pointer ${
                isSaved
                  ? "bg-rose-500 text-white border-2 border-white shadow-rose-500/40"
                  : "bg-white hover:bg-rose-50 text-rose-500 border-2 border-white"
              }`}
              title="Save Spot"
            >
              <Heart className="w-6 h-6 fill-rose-500 stroke-rose-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
