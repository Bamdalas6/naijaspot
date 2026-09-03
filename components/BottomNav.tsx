"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Bookmark } from "lucide-react";

interface BottomNavProps {
  savedCount?: number;
}

export function BottomNav({ savedCount = 0 }: BottomNavProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSaved = pathname === "/saved";

  return (
    <div className="fixed bottom-5 inset-x-0 mx-auto w-[90%] max-w-[320px] z-40 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-xl rounded-full p-1.5 shadow-2xl shadow-sky-950/20 flex items-center justify-around border border-white/60">
        {/* Discover Feed */}
        <Link
          href="/"
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full transition-all active:scale-95 ${
            isHome
              ? "bg-[#38b6ff] text-white font-bold shadow-md shadow-[#38b6ff]/30"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Compass className="w-4 h-4 stroke-[2.5]" />
          <span className="text-xs font-bold">Discover</span>
        </Link>

        {/* Saved Spots */}
        <Link
          href="/saved"
          className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full transition-all active:scale-95 ${
            isSaved
              ? "bg-[#38b6ff] text-white font-bold shadow-md shadow-[#38b6ff]/30"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Bookmark className={`w-4 h-4 stroke-[2.5] ${isSaved ? "fill-white" : ""}`} />
          <span className="text-xs font-bold">Saved</span>
          {savedCount > 0 && (
            <span
              className={`min-w-[17px] h-[17px] px-1 text-[9px] font-black rounded-full flex items-center justify-center ${
                isSaved
                  ? "bg-white text-[#0284c7]"
                  : "bg-[#38b6ff] text-white"
              }`}
            >
              {savedCount > 99 ? "99+" : savedCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
