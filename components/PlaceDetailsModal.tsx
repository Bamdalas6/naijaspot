"use client";

import React from "react";
import Image from "next/image";
import { Spot } from "@/types";
import {
  X,
  Bookmark,
  MapPin,
  ExternalLink,
  Star,
  Tag,
  Clock,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

interface PlaceDetailsModalProps {
  spot: Spot | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export function PlaceDetailsModal({
  spot,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}: PlaceDetailsModalProps) {
  if (!isOpen || !spot) return null;

  const mapsQuery = encodeURIComponent(
    `${spot.name} ${spot.address} ${spot.state} Nigeria`
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: spot.name,
        text: `Check out ${spot.name} in ${spot.city}, ${spot.state} on NaijaSpots!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-[90vh] max-h-[800px] bg-white rounded-[36px] shadow-2xl flex flex-col justify-between overflow-hidden text-slate-900 border border-slate-100">
        {/* Top Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-extrabold text-slate-900">Verified Spot</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
              title="Share Spot"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleSave}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isSaved
                  ? "bg-[#0284c7] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable Detailed Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4.5 no-scrollbar">
          {/* Banner Photo with Gradient */}
          <div className="relative w-full h-56 rounded-3xl overflow-hidden shadow-sm bg-slate-100">
            <Image
              src={spot.imageUrl}
              alt={spot.name}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover"
            />
            {spot.priceRange && (
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-slate-900 shadow-md">
                {spot.priceRange}
              </div>
            )}
          </div>

          {/* Title, Category & Ratings */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {spot.name}
              </h2>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs text-slate-600 mb-2">
              <span className="font-bold text-[#0284c7] bg-[#e0f2fe] px-2.5 py-0.5 rounded-lg">
                {spot.category}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1 font-extrabold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{spot.rating ? spot.rating.toFixed(1) : "4.8"}</span>
                {spot.reviewsCount && (
                  <span className="text-slate-400 font-medium">({spot.reviewsCount} reviews)</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
              <span>{spot.city}, {spot.state}</span>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#f8fafc] border border-slate-100 p-3 rounded-2xl flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Hours of Visit
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {spot.openingHours || "Open Daily"}
                </span>
              </div>
            </div>

            <div className="bg-[#f8fafc] border border-slate-100 p-3 rounded-2xl flex items-start gap-2.5">
              <Tag className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Price Tier
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {spot.priceRating} ({spot.priceRange || "Affordable"})
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              About this spot
            </span>
            <p className="text-xs text-slate-700 leading-relaxed bg-[#f8fafc] p-3.5 rounded-2xl border border-slate-100">
              {spot.description}
            </p>
          </div>

          {/* Amenities & Highlights */}
          {spot.amenities && spot.amenities.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                What this spot offers
              </span>
              <div className="grid grid-cols-2 gap-2">
                {spot.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100 text-xs font-semibold text-slate-800 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Physical Address */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Location & Address
            </span>
            <div className="flex items-start gap-2.5 text-xs text-slate-800 bg-[#f8fafc] p-3.5 rounded-2xl border border-slate-100">
              <Navigation className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{spot.address}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{spot.city}, {spot.state}, Nigeria</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {spot.tags && spot.tags.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Spot Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {spot.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-xl bg-[#e0f2fe] text-[#0369a1] text-xs font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button Footer */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#0284c7] hover:bg-[#0369a1] active:scale-98 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 text-xs transition-all cursor-pointer"
          >
            <span>Navigate on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
