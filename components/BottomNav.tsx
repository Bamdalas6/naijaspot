"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Compass, Plus, Bookmark, User } from "lucide-react";

interface BottomNavProps {
  savedCount?: number;
  onOpenAddModal?: () => void;
}

export function BottomNav({ savedCount = 0, onOpenAddModal }: BottomNavProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSaved = pathname === "/saved";

  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto w-[92%] max-w-[370px] z-40 pointer-events-auto select-none">
      <div className="bg-white/95 backdrop-blur-xl rounded-full px-5 py-2.5 shadow-2xl shadow-slate-900/10 flex items-center justify-between border border-white/60">
        {/* 1. Discover Flame (matching screenshot pink-orange active icon) */}
        <Link
          href="/"
          className={`relative p-2 rounded-2xl transition-all active:scale-90 ${
            isHome
              ? "text-rose-500"
              : "text-slate-400 hover:text-slate-700"
          }`}
          title="Discover Feed"
        >
          <Flame className={`w-6 h-6 ${isHome ? "fill-rose-500 stroke-rose-500" : "stroke-[1.8]"}`} />
          {isHome && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-rose-500 rounded-full" />
          )}
        </Link>

        {/* 2. Explore / Grid */}
        <Link
          href="/"
          className="p-2 text-slate-400 hover:text-slate-700 transition-all active:scale-90"
          title="Explore Spots"
        >
          <Compass className="w-6 h-6 stroke-[1.8]" />
        </Link>

        {/* 3. Center (+) button (matching screenshot center plus circle) */}
        <button
          onClick={onOpenAddModal}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs active:scale-90 transition-all cursor-pointer"
          title="Filter or Discover"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* 4. Saved Spots Bookmark (matching screenshot bookmark icon) */}
        <Link
          href="/saved"
          className={`relative p-2 rounded-2xl transition-all active:scale-90 ${
            isSaved
              ? "text-[#0284c7]"
              : "text-slate-400 hover:text-slate-700"
          }`}
          title="Saved Spots"
        >
          <Bookmark className={`w-6 h-6 ${isSaved ? "fill-[#0284c7] stroke-[#0284c7]" : "stroke-[1.8]"}`} />
          {savedCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[9px] font-black text-white bg-rose-500 rounded-full border-2 border-white animate-in zoom-in-50">
              {savedCount > 99 ? "99+" : savedCount}
            </span>
          )}
        </Link>

        {/* 5. User Profile Icon */}
        <Link
          href="/saved"
          className="p-2 text-slate-400 hover:text-slate-700 transition-all active:scale-90"
          title="Profile"
        >
          <User className="w-6 h-6 stroke-[1.8]" />
        </Link>
      </div>
    </div>
  );
}
