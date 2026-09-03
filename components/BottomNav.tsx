"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Bookmark } from "lucide-react";

interface BottomNavProps {
  savedCount?: number;
}

export function BottomNav({ savedCount = 0 }: BottomNavProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSaved = pathname === "/saved";

  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto w-[210px] z-40 pointer-events-auto select-none">
      <div className="bg-white/95 backdrop-blur-xl rounded-full px-6 py-2.5 shadow-2xl shadow-slate-900/15 flex items-center justify-around border border-white/80">
        {/* 1. Discover Flame - Black Icon */}
        <Link
          href="/"
          className={`relative p-2 rounded-full transition-all active:scale-90 ${
            isHome
              ? "text-black"
              : "text-slate-400 hover:text-black"
          }`}
          title="Discover Feed"
        >
          <Flame
            className={`w-6 h-6 ${
              isHome
                ? "fill-black stroke-black"
                : "stroke-[1.8] stroke-slate-400"
            }`}
          />
          {isHome && (
            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full" />
          )}
        </Link>

        {/* Subtle separator */}
        <div className="w-[1px] h-6 bg-slate-200/80" />

        {/* 2. Saved Spots Bookmark */}
        <Link
          href="/saved"
          className={`relative p-2 rounded-full transition-all active:scale-90 ${
            isSaved
              ? "text-black"
              : "text-slate-400 hover:text-black"
          }`}
          title="Saved Spots"
        >
          <Bookmark
            className={`w-6 h-6 ${
              isSaved
                ? "fill-black stroke-black"
                : "stroke-[1.8] stroke-slate-400"
            }`}
          />
          {savedCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[9px] font-black text-white bg-black rounded-full border-2 border-white animate-in zoom-in-50">
              {savedCount > 99 ? "99+" : savedCount}
            </span>
          )}
          {isSaved && (
            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full" />
          )}
        </Link>
      </div>
    </div>
  );
}
