"use client";

import { useState, useEffect, useCallback } from "react";
import { Spot, SavedSpot } from "@/types";
import { createClient } from "@/lib/supabase/client";

const LOCAL_STORAGE_KEY = "naijaspots_saved_places";

export function useSavedPlaces() {
  const [savedSpots, setSavedSpots] = useState<SavedSpot[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved places from localStorage and Supabase on mount
  useEffect(() => {
    const loadSaved = async () => {
      try {
        let initialSpots: SavedSpot[] = [];

        // Check localStorage first
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          try {
            initialSpots = JSON.parse(localData);
          } catch {
            initialSpots = [];
          }
        }

        // Attempt Supabase if available
        const supabase = createClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data, error } = await supabase
              .from("saved_spots")
              .select("*, spot:spots(*)")
              .eq("user_id", session.user.id);

            if (!error && data) {
              const remoteSpots: SavedSpot[] = data.map((item: any) => ({
                ...(item.spot || item),
                savedAt: item.created_at,
              }));

              // Merge local and remote uniquely
              const map = new Map<string, SavedSpot>();
              [...initialSpots, ...remoteSpots].forEach((s) => map.set(s.id, s));
              initialSpots = Array.from(map.values());
            }
          }
        }

        setSavedSpots(initialSpots);
      } catch (e) {
        console.warn("Could not load saved spots:", e);
      } finally {
        setLoading(false);
      }
    };

    loadSaved();

    // Listen for storage changes across tabs/components
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          setSavedSpots(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Save spot
  const saveSpot = useCallback(
    async (spot: Spot) => {
      const now = new Date().toISOString();
      const newSavedItem: SavedSpot = { ...spot, savedAt: now };

      // Optimistic update
      setSavedSpots((prev) => {
        if (prev.some((s) => s.id === spot.id)) return prev;
        const updated = [newSavedItem, ...prev];
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          window.dispatchEvent(new Event("saved-spots-updated"));
        } catch {}
        return updated;
      });

      // Background Supabase sync
      try {
        const supabase = createClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await supabase.from("saved_spots").upsert({
              user_id: session.user.id,
              spot_id: spot.id,
              created_at: now,
            });
          }
        }
      } catch (err) {
        console.warn("Could not sync saved spot to Supabase:", err);
      }
    },
    []
  );

  // Remove spot
  const removeSpot = useCallback(
    async (spotId: string) => {
      // Optimistic update
      setSavedSpots((prev) => {
        const updated = prev.filter((s) => s.id !== spotId);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          window.dispatchEvent(new Event("saved-spots-updated"));
        } catch {}
        return updated;
      });

      // Background Supabase sync
      try {
        const supabase = createClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await supabase
              .from("saved_spots")
              .delete()
              .eq("user_id", session.user.id)
              .eq("spot_id", spotId);
          }
        }
      } catch (err) {
        console.warn("Could not remove saved spot from Supabase:", err);
      }
    },
    []
  );

  const isSaved = useCallback(
    (spotId: string) => savedSpots.some((s) => s.id === spotId),
    [savedSpots]
  );

  return {
    savedSpots,
    savedCount: savedSpots.length,
    loading,
    saveSpot,
    removeSpot,
    isSaved,
  };
}
