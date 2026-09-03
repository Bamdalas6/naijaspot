export type SpotCategory =
  | "All"
  | "Eatery & Dining"
  | "Bars & Lounges"
  | "Historical & Memory"
  | "Nature & Parks"
  | "Arts & Culture";

export type NigerianState =
  | "Lagos"
  | "Abuja (FCT)"
  | "Oyo"
  | "Rivers"
  | "Enugu"
  | "Cross River"
  | "Ogun"
  | "Edo"
  | "Delta"
  | "Kano"
  | "Kaduna";

export interface Spot {
  id: string;
  name: string;
  category: Exclude<SpotCategory, "All">;
  priceRating: "Free" | "₦" | "₦₦" | "₦₦₦" | "₦₦₦₦";
  priceRange?: string;
  city: string;
  state: NigerianState;
  address: string;
  description: string;
  imageUrl: string;
  rating?: number;
  reviewsCount?: number;
  openingHours?: string;
  distance?: string;
  amenities?: string[];
  featured?: boolean;
  tags?: string[];
  created_at?: string;
}

export interface SavedSpot extends Spot {
  savedAt: string;
}
