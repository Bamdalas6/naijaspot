import { Spot } from "@/types";
import allSpotsData from "@/data/spots.json";

export const NIGERIAN_STATES = [
  { id: "Lagos", name: "Lagos", tag: "Centre of Excellence" },
  { id: "Abuja (FCT)", name: "Abuja (FCT)", tag: "Federal Capital" },
  { id: "Oyo", name: "Oyo (Ibadan)", tag: "Pacesetter State" },
  { id: "Rivers", name: "Rivers (Port Harcourt)", tag: "Treasure Base" },
  { id: "Enugu", name: "Enugu", tag: "Coal City State" },
  { id: "Cross River", name: "Cross River (Calabar)", tag: "The People's Paradise" },
  { id: "Ogun", name: "Ogun (Abeokuta)", tag: "Gateway State" },
  { id: "Kano", name: "Kano", tag: "Centre of Commerce" },
  { id: "Kaduna", name: "Kaduna", tag: "Centre of Learning" },
  { id: "Edo", name: "Edo (Benin City)", tag: "Heartbeat of the Nation" },
  { id: "Delta", name: "Delta (Asaba/Warri)", tag: "The Big Heart" },
  { id: "Plateau", name: "Plateau (Jos)", tag: "Home of Peace & Tourism" },
  { id: "Akwa Ibom", name: "Akwa Ibom (Uyo)", tag: "Land of Promise" },
  { id: "Anambra", name: "Anambra (Awka/Onitsha)", tag: "Light of the Nation" },
  { id: "Imo", name: "Imo (Owerri)", tag: "Eastern Heartland" },
  { id: "Abia", name: "Abia (Umuahia/Aba)", tag: "God's Own State" },
  { id: "Osun", name: "Osun (Osogbo)", tag: "State of the Living Spring" },
  { id: "Ondo", name: "Ondo (Akure)", tag: "Sunshine State" },
  { id: "Kwara", name: "Kwara (Ilorin)", tag: "State of Harmony" },
  { id: "Benue", name: "Benue (Makurdi)", tag: "Food Basket of the Nation" },
  { id: "Niger", name: "Niger (Minna)", tag: "Power State" },
  { id: "Nasarawa", name: "Nasarawa (Lafia)", tag: "Home of Solid Minerals" },
  { id: "Kogi", name: "Kogi (Lokoja)", tag: "The Confluence State" },
  { id: "Bayelsa", name: "Bayelsa (Yenagoa)", tag: "Glory of All Lands" },
  { id: "Taraba", name: "Taraba (Jalingo/Mambilla)", tag: "Nature's Gift to the Nation" },
  { id: "Adamawa", name: "Adamawa (Yola)", tag: "Land of Beauty" },
  { id: "Bauchi", name: "Bauchi (Yankari)", tag: "Pearl of Tourism" },
  { id: "Borno", name: "Borno (Maiduguri)", tag: "Home of Peace" },
  { id: "Gombe", name: "Gombe", tag: "Jewel in the Savannah" },
  { id: "Yobe", name: "Yobe (Damaturu)", tag: "Pride of the Sahel" },
  { id: "Jigawa", name: "Jigawa (Dutse)", tag: "The New World" },
  { id: "Katsina", name: "Katsina", tag: "Home of Hospitality" },
  { id: "Kebbi", name: "Kebbi (Birnin Kebbi)", tag: "Land of Equity" },
  { id: "Sokoto", name: "Sokoto", tag: "Seat of the Caliphate" },
  { id: "Zamfara", name: "Zamfara (Gusau)", tag: "Farming is Our Pride" },
  { id: "Ebonyi", name: "Ebonyi (Abakaliki)", tag: "Salt of the Nation" },
  { id: "Ekiti", name: "Ekiti (Ado Ekiti)", tag: "Land of Honour" },
];

export const CATEGORIES = [
  "All",
  "Eatery & Dining",
  "Bars & Lounges",
  "Historical & Memory",
  "Nature & Parks",
  "Arts & Culture",
] as const;

export const MOCK_SPOTS: Spot[] = allSpotsData as Spot[];
