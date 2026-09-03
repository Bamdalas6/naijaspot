"use client";

import React from "react";
import Image from "next/image";
import { SavedSpot } from "@/types";
import { MapPin, ExternalLink, Trash2, Star } from "lucide-react";

interface SavedSpotItemProps {
  spot: SavedSpot;
  onRemove: (id: string) => void;
}

export function SavedSpotItem({ spot, onRemove }: SavedSpotItemProps) {
  const mapsQuery = encodeURIComponent(
    `${spot.name} ${spot.address} ${spot.state} Nigeria`
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-100 shadow-md group">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
        <Image
          src={spot.imageUrl}
          alt={spot.name}
          fill
          sizes="80px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute bottom-1 right-1 text-[10px] font-bold text-slate-900 bg-white/95 px-1.5 py-0.5 rounded-md shadow-xs">
          {spot.priceRating}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="text-[11px] font-bold text-[#0284c7] uppercase tracking-wider truncate">
            {spot.category}
          </span>
          {spot.rating && (
            <div className="flex items-center gap-0.5 text-[#0284c7] text-xs font-black shrink-0 bg-[#e8f6ff] px-1.5 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-[#0284c7]" />
              <span>{spot.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <h4 className="text-sm font-bold text-slate-900 tracking-tight truncate leading-snug mb-1">
          {spot.name}
        </h4>

        <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mb-2">
          <MapPin className="w-3 h-3 text-[#38b6ff] shrink-0" />
          <span className="truncate">{spot.city}, {spot.state}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-[#e8f6ff] hover:bg-[#d5eeff] text-[#0284c7] px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>

          <button
            onClick={() => onRemove(spot.id)}
            title="Remove from saved"
            className="flex items-center gap-1 text-slate-400 hover:text-rose-500 p-1 rounded-lg text-[11px] transition-colors ml-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
