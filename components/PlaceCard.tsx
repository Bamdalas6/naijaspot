"use client";

import React from "react";
import Image from "next/image";
import { Spot } from "@/types";
import { MapPin, Star, ArrowRight, ExternalLink } from "lucide-react";
import { motion, MotionValue } from "framer-motion";

interface PlaceCardProps {
  spot: Spot;
  isFront?: boolean;
  likeOpacity?: MotionValue<number>;
  nopeOpacity?: MotionValue<number>;
  onOpenDetails?: () => void;
}

export function PlaceCard({
  spot,
  isFront = true,
  likeOpacity,
  nopeOpacity,
  onOpenDetails,
}: PlaceCardProps) {
  const mapsQuery = encodeURIComponent(
    `${spot.name} ${spot.address} ${spot.state} Nigeria`
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="relative w-full h-[520px] max-h-[72vh] bg-white rounded-[32px] p-5 shadow-xl flex flex-col justify-between border border-slate-100/80 select-none overflow-hidden text-slate-900">
      {/* Swipe Feedback Badges */}
      {isFront && likeOpacity && nopeOpacity && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-8 left-8 pointer-events-none z-30 transform -rotate-12 border-4 border-emerald-500 bg-emerald-500 text-white font-extrabold text-lg tracking-wider px-4 py-1.5 rounded-2xl shadow-xl"
          >
            SAVED SPOT ♥
          </motion.div>

          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-8 right-8 pointer-events-none z-30 transform rotate-12 border-4 border-slate-700 bg-slate-900 text-white font-extrabold text-lg tracking-wider px-4 py-1.5 rounded-2xl shadow-xl"
          >
            SKIP ✕
          </motion.div>
        </>
      )}

      {/* Hero Photo with clean floating pill */}
      <div className="relative w-full h-52 rounded-[22px] overflow-hidden shadow-sm bg-slate-100 shrink-0 mb-3.5">
        <Image
          src={spot.imageUrl}
          alt={spot.name}
          fill
          priority={isFront}
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover pointer-events-none"
        />

        {/* Category & Price Floating Tag */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
          <span className="text-[#0284c7]">{spot.category}</span>
          <span className="text-slate-300">•</span>
          <span>{spot.priceRating}</span>
        </div>

        {/* Operating status badge */}
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{spot.openingHours ? spot.openingHours.split("•")[0].trim() : "Open Daily"}</span>
        </div>
      </div>

      {/* Content Section with Comfortable Spacing */}
      <div className="flex-1 flex flex-col justify-between px-1 pb-1">
        <div>
          {/* Title & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug truncate">
              {spot.name}
            </h3>

            {/* Clean Rating pill */}
            <div className="flex items-center gap-1 bg-[#f0f9ff] text-[#0369a1] px-2.5 py-1 rounded-xl shrink-0 font-extrabold text-xs">
              <Star className="w-3.5 h-3.5 fill-[#0284c7] text-[#0284c7]" />
              <span>{spot.rating ? spot.rating.toFixed(1) : "4.8"}</span>
            </div>
          </div>

          {/* Location line */}
          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
            <span className="truncate">{spot.address}</span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
            {spot.description}
          </p>
        </div>

        {/* Key Features Chips */}
        {spot.amenities && spot.amenities.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-hidden pt-2">
            {spot.amenities.slice(0, 2).map((amenity) => (
              <span
                key={amenity}
                className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-[11px] font-medium truncate"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 flex items-center gap-2 border-t border-slate-100 z-10 mt-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails?.();
          }}
          className="flex-1 bg-[#0284c7] hover:bg-[#0369a1] active:scale-98 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-sky-500/20 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>View Details & Hours</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-[#0284c7] border border-slate-200/80 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          title="Open in Google Maps"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
