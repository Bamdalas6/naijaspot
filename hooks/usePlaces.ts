"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Spot, SpotCategory, NigerianState } from "@/types";
import { MOCK_SPOTS } from "@/lib/mockData";
import { createClient } from "@/lib/supabase/client";

export function usePlaces(selectedState: NigerianState, selectedCategory: SpotCategory) {
  // Synchronous memoized filtering from MOCK_SPOTS (0ms filter transitions)
  const localPlaces = useMemo(() => {
    let filtered = MOCK_SPOTS.filter((spot) => spot.state === selectedState);
    if (selectedCategory !== "All") {
      filtered = filtered.filter((spot) => spot.category === selectedCategory);
    }
    return filtered;
  }, [selectedState, selectedCategory]);

  const [remoteData, setRemoteData] = useState<{
    state: NigerianState;
    category: SpotCategory;
    spots: Spot[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setRemoteData(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from("spots").select("*");

      if (selectedState) {
        query = query.eq("state", selectedState);
      }

      if (selectedCategory && selectedCategory !== "All") {
        query = query.eq("category", selectedCategory);
      }

      const { data, error: sbError } = await query;

      if (!sbError && data && data.length > 0) {
        setRemoteData({
          state: selectedState,
          category: selectedCategory,
          spots: data as Spot[],
        });
        setError(null);
      } else {
        setRemoteData(null);
        if (sbError) {
          setError(sbError.message);
        }
      }
    } catch (err: unknown) {
      console.error("Error fetching spots:", err);
      setRemoteData(null);
      setError("Loaded offline curated spots");
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedCategory]);

  useEffect(() => {
    const supabase = createClient();
    if (supabase) {
      fetchPlaces();
    }
  }, [fetchPlaces]);

  // Use remote places if they match active filter criteria;
  // otherwise immediately fall back to synchronous local places with 0ms transition.
  const places =
    remoteData &&
    remoteData.state === selectedState &&
    remoteData.category === selectedCategory
      ? remoteData.spots
      : localPlaces;

  return { places, loading, error, refetch: fetchPlaces };
}
