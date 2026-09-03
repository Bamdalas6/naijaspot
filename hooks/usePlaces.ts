"use client";

import { useState, useEffect, useCallback } from "react";
import { Spot, SpotCategory, NigerianState } from "@/types";
import { MOCK_SPOTS } from "@/lib/mockData";
import { createClient } from "@/lib/supabase/client";

export function usePlaces(selectedState: NigerianState, selectedCategory: SpotCategory) {
  const [places, setPlaces] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      if (supabase) {
        let query = supabase.from("spots").select("*");

        if (selectedState) {
          query = query.eq("state", selectedState);
        }

        if (selectedCategory && selectedCategory !== "All") {
          query = query.eq("category", selectedCategory);
        }

        const { data, error: sbError } = await query;

        if (!sbError && data && data.length > 0) {
          setPlaces(data as Spot[]);
          setLoading(false);
          return;
        }
      }

      // Fallback to rich mock data
      let filtered = MOCK_SPOTS.filter((spot) => spot.state === selectedState);

      if (selectedCategory !== "All") {
        filtered = filtered.filter((spot) => spot.category === selectedCategory);
      }

      setPlaces(filtered);
    } catch (err: unknown) {
      console.error("Error fetching spots:", err);
      // Fallback safely to mock data
      let filtered = MOCK_SPOTS.filter((spot) => spot.state === selectedState);
      if (selectedCategory !== "All") {
        filtered = filtered.filter((spot) => spot.category === selectedCategory);
      }
      setPlaces(filtered);
      setError("Loaded offline curated spots");
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedCategory]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return { places, loading, error, refetch: fetchPlaces };
}
