"use client";

import React from "react";
import Image from "next/image";
import { SlidersHorizontal, MapPin } from "lucide-react";
import { NigerianState } from "@/types";

interface HeaderProps {
  selectedState?: NigerianState;
  onOpenSortModal?: () => void;
}

export function Header({
  selectedState = "Lagos",
  onOpenSortModal,
}: HeaderProps) {
  return (
    <header className="w-full px-5 pt-4 pb-2.5 flex flex-col gap-2.5 select-none">
      {/* Top row: Profile & Brand & Sort Button */}
      <div className="flex items-center justify-between">
        {/* Profile Avatar & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full bg-white p-0.5 shadow-sm border border-sky-100">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#0284c7] uppercase tracking-wider">
              Discovery
            </span>
            <span className="text-base font-black text-slate-900 tracking-tight">
              NaijaSpots
            </span>
          </div>
        </div>

        {/* Right: Friendly Sort & Filter Button (Saved spot bookmark removed since it is below) */}
        {onOpenSortModal && (
          <button
            onClick={onOpenSortModal}
            className="flex items-center gap-1.5 bg-white text-[#0284c7] hover:bg-sky-50 px-3.5 py-2 rounded-full font-bold text-xs shadow-sm border border-sky-200/80 transition-all active:scale-95 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Sort & Filter</span>
          </button>
        )}
      </div>

      {/* State & Location Pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
          <span>Spots in</span>
          <span className="bg-white/80 border border-sky-200 text-[#0369a1] px-2.5 py-0.5 rounded-full font-bold shadow-xs">
            {selectedState}
          </span>
        </div>
      </div>
    </header>
  );
}
