"use client";

import React from "react";
import Image from "next/image";
import { Spot } from "@/types";
import { MapPin, Heart, Star, Info } from "lucide-react";
import { motion, MotionValue } from "framer-motion";

interface PlaceCardProps {
  spot: Spot;
  isFront?: boolean;
  likeOpacity?: MotionValue<number>;
  nopeOpacity?: MotionValue<number>;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onOpenDetails?: () => void;
}

export function PlaceCard({
  spot,
  isFront = true,
  likeOpacity,
  nopeOpacity,
  isSaved = false,
  onToggleSave,
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
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
        <div className="bg-black/35 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold border border-white/20 shadow-sm flex items-center gap-1.5">
          <span>{spot.category}</span>
          <span className="text-white/60">•</span>
          <span className="text-amber-300 font-extrabold">{spot.priceRating}</span>
        </div>

        {spot.rating && (
          <div className="flex items-center gap-1 bg-black/35 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-300 text-xs font-black border border-white/20 shadow-sm">
            <Star className="w-3 h-3 fill-amber-300" />
            <span>{spot.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Bottom Overlaid Information (Matching screenshot: Name, distance, heart) */}
      <div className="absolute bottom-0 inset-x-0 p-5 z-20 flex items-end justify-between gap-3 text-white">
        {/* Left text block: Name, Distance */}
        <div className="flex-1 min-w-0 pr-2">
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

        {/* Right action: Circular Heart button (exactly matching screenshot) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave?.();
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90 shrink-0 cursor-pointer ${
            isSaved
              ? "bg-rose-500 text-white border border-rose-400"
              : "bg-white/25 hover:bg-white/35 backdrop-blur-md text-white border border-white/40"
          }`}
          title={isSaved ? "Saved" : "Save Spot"}
        >
          <Heart className={`w-6 h-6 ${isSaved ? "fill-white" : "stroke-[2.2]"}`} />
        </button>
      </div>
    </div>
  );
}
