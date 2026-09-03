# -*- coding: utf-8 -*-
import json
import random

ALL_STATES = [
    ("Lagos", "Centre of Excellence", ["Lekki", "Victoria Island", "Ikoyi", "Ikeja", "Yaba", "Surulere", "Badagry", "Epe"]),
    ("Abuja (FCT)", "Federal Capital", ["Maitama", "Wuse 2", "Garki", "Jabi", "Asokoro", "Guzape", "Gwarinpa", "Mpape"]),
    ("Oyo", "Pacesetter State", ["Bodija, Ibadan", "Dugbe, Ibadan", "Ring Road, Ibadan", "Oyo Town", "Ogbomoso", "Iseyin"]),
    ("Rivers", "Treasure Base", ["Old GRA, Port Harcourt", "New GRA, Port Harcourt", "Peter Odili, Port Harcourt", "Bonny Island"]),
    ("Enugu", "Coal City State", ["Independence Layout", "New Haven", "GRA Enugu", "Nsukka", "Udi", "Oji River"]),
    ("Cross River", "The People's Paradise", ["Calabar Municipality", "Calabar South", "Obudu", "Ikom", "Akamkpa"]),
    ("Ogun", "Gateway State", ["Abeokuta", "Ijebu Ode", "Sagamu", "Ota", "Ilaro"]),
    ("Kano", "Centre of Commerce", ["Nasarawa, Kano", "Fagge, Kano", "Kano City", "Dala", "Bompai"]),
    ("Kaduna", "Centre of Learning", ["Kaduna North", "Barnawa", "Zaria", "Kafanchan", "GRA Kaduna"]),
    ("Edo", "Heartbeat of the Nation", ["Benin City", "GRA Benin", "Uselu", "Auchi", "Ekpoma"]),
    ("Delta", "The Big Heart", ["Asaba", "Warri", "Effurun", "Sapele", "Ughelli"]),
    ("Plateau", "Home of Peace & Tourism", ["Jos North", "Jos South", "Bukuru", "Pankshin", "Rayfield, Jos"]),
    ("Akwa Ibom", "Land of Promise", ["Uyo", "Ikot Ekpene", "Eket", "Oron", "Ibeno"]),
    ("Anambra", "Light of the Nation", ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Ihiala"]),
    ("Imo", "Eastern Heartland", ["Owerri", "New Owerri", "Orlu", "Okigwe", "Oguta"]),
    ("Abia", "God's Own State", ["Umuahia", "Aba", "Ohafia", "Arochukwu", "Bende"]),
    ("Osun", "State of the Living Spring", ["Osogbo", "Ile-Ife", "Ilesa", "Ede", "Ikire"]),
    ("Ondo", "Sunshine State", ["Akure", "Ondo Town", "Owo", "Ikare", "Idanre"]),
    ("Kwara", "State of Harmony", ["GRA Ilorin", "Tanke, Ilorin", "Offa", "Omu-Aran", "Jebba"]),
    ("Benue", "Food Basket of the Nation", ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala"]),
    ("Niger", "Power State", ["Minna", "Suleja", "Bida", "Kontagora", "Gurara"]),
    ("Nasarawa", "Home of Solid Minerals", ["Lafia", "Keffi", "Karu", "Akwanga"]),
    ("Kogi", "The Confluence State", ["Lokoja", "Okene", "Kabba", "Anyigba"]),
    ("Bayelsa", "Glory of All Lands", ["Yenagoa", "Brass", "Ogbia", "Sagbama"]),
    ("Taraba", "Nature's Gift to the Nation", ["Jalingo", "Wukari", "Gembu (Mambilla)", "Bali"]),
    ("Adamawa", "Land of Beauty", ["Yola", "Jimeta", "Mubi", "Numan"]),
    ("Bauchi", "Pearl of Tourism", ["Bauchi City", "Yankari", "Azare", "Misau"]),
    ("Borno", "Home of Peace", ["Maiduguri", "Biu", "Bama", "Monguno"]),
    ("Gombe", "Jewel in the Savannah", ["Gombe City", "Kaltungo", "Dukku"]),
    ("Yobe", "Pride of the Sahel", ["Damaturu", "Potiskum", "Gashua", "Nguru"]),
    ("Jigawa", "The New World", ["Dutse", "Hadejia", "Kazaure", "Gumel"]),
    ("Katsina", "Home of Hospitality", ["Katsina City", "Daura", "Funtua", "Malumfashi"]),
    ("Kebbi", "Land of Equity", ["Birnin Kebbi", "Argungu", "Yauri", "Zuru"]),
    ("Sokoto", "Seat of the Caliphate", ["Sokoto City", "Wamakko", "Gwadabawa"]),
    ("Zamfara", "Farming is Our Pride", ["Gusau", "Kaura Namoda", "Talata Mafara"]),
    ("Ebonyi", "Salt of the Nation", ["Abakaliki", "Afikpo", "Onueke"]),
    ("Ekiti", "Land of Honour", ["Ado Ekiti", "Ikogosi", "Ikole", "Ijero"]),
]

# High quality curated travel & destination images from Unsplash
IMAGE_POOL = [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
]

CATEGORIES_LIST = [
    "Eatery & Dining",
    "Bars & Lounges",
    "Historical & Memory",
    "Nature & Parks",
    "Arts & Culture"
]

SPOT_NAME_TEMPLATES = {
    "Eatery & Dining": [
        ("{city} Seafood & Grill", "₦₦₦", "₦6,000 - ₦20,000 / person", "Exquisite local and continental fusion dining with savory grilled specialties, jollof delicacies, and fresh catch.", ["Fresh Seafood", "Outdoor Dining", "Grill Specials", "Private Dining"]),
        ("Mama Put & Suya Junction", "₦", "₦1,500 - ₦3,500 / meal", "Authentic Nigerian street kitchen renowned for mouth-watering spicy suya, pepper soup, and hot swallow dishes.", ["Authentic Suya", "Spicy Pepper Soup", "Fast Casual", "Local Favourite"]),
        ("The Palm Bistro & Cafe", "₦₦", "₦4,000 - ₦12,000 / person", "Trendy brunch lounge featuring freshly brewed coffee, artisanal pastries, afro-continental breakfast, and chilled vibes.", ["Artisanal Coffee", "Breakfast & Brunch", "Co-Working Friendly", "Free WiFi"]),
        ("Royal Heritage Kitchen", "₦₦", "₦3,500 - ₦10,000", "Indulge in rich native soups, roasted goat meat, freshly pounded yam, and signature Nigerian celebratory platters.", ["Native Soups", "Pounded Yam Feast", "Family Tables", "Warm Service"]),
        ("Skyline Rooftop Restaurant", "₦₦₦₦", "₦15,000 - ₦40,000", "Breathtaking panoramic view dining offering world-class multi-course culinary creations, fine wines, and luxury ambiance.", ["Scenic Vista", "Fine Wines", "Romantic Setup", "Live Acoustic"]),
        ("Chop Life Lounge & Barbecue", "₦₦", "₦5,000 - ₦14,000", "Vibrant weekend dining and barbecue yard with charcoal grilled whole fish, spicy asun, and chilled drinks.", ["Grilled Catfish", "Spicy Asun", "Beer Garden", "Weekend Hangout"])
    ],
    "Bars & Lounges": [
        ("The Velvet Rooftop Lounge", "₦₦₦", "₦8,000 - ₦25,000", "Chic rooftop cocktail haven with resident DJs, craft mixology, moody ambient lighting, and sunset horizon views.", ["Craft Cocktails", "Live DJ Sets", "Sunset Views", "VIP Cabanas"]),
        ("Oasis Waterfront Lounge", "₦₦", "₦4,500 - ₦15,000", "Open-air scenic waterside chillout with relaxed cabanas, chilled brews, finger foods, and acoustic evening music.", ["Waterside Breeze", "Cabanas", "Chilled Drinks", "Late Night Bites"]),
        ("Club Euphoria & Night Bar", "₦₦₦", "₦10,000 - ₦30,000", "High-energy nightlife sanctuary boasting laser lighting, premier sound systems, top Afrobeat tunes, and VIP bottle service.", ["Afrobeat Night", "Bottle Service", "Dance Floor", "Security Verified"]),
        ("The Garden Cigar & Shisha Bar", "₦₦₦", "₦7,000 - ₦22,000", "Sophisticated outdoor garden sanctuary offering premium cigars, smooth shisha blends, and top-shelf whiskeys.", ["Exotic Shisha", "Cigar Lounge", "Lush Garden", "Whiskey Selection"]),
        ("Pulse Sports Lounge & Bar", "₦₦", "₦3,000 - ₦10,000", "Lively social sports pub featuring mega screens for live football matches, spicy chicken wings, and draught beer.", ["Live Football Matches", "Game Screening", "Spicy Wings", "Draft Beer"]),
        ("Breeze Sunset Beach Bar", "₦₦₦", "₦8,000 - ₦26,000", "Foot-in-the-sand coastal lounge with coconut cocktails, wooden daybeds, and reggae afro vibes under the stars.", ["Beach Lounge", "Tropical Cocktails", "Daybeds", "Campfire Nights"])
    ],
    "Historical & Memory": [
        ("Ancient City Heritage Monument", "Free", "Free Entry", "Century-old historical monument standing as a testament to the pre-colonial prowess, folklore, and kingdom architecture.", ["Historical Monument", "Photo Landmark", "Cultural Walk", "Guided Tours"]),
        ("National Colonial Heritage Museum", "₦", "₦500 - ₦1,500", "Curated treasury preserving regional historical artifacts, vintage photographs, royal regalia, and ancient antiquities.", ["Ancient Artifacts", "Royal Regalia", "Educational Tour", "Museum Archive"]),
        ("The Royal Palace Gates & Memorial", "Free", "Free Public Access", "Magnificent traditional royal kingdom courtyard reflecting traditional monarchical royalty, craftsmanship, and festivals.", ["Royal Palace", "Cultural Craft", "Traditional Architecture", "Centuries Old"]),
        ("Freedom & Heroes Cenotaph", "Free", "Free Entry", "Sculpted memorial honoring founding national leaders and historical figures who championed regional progress.", ["Heroes Monument", "Scenic Courtyard", "Public Square", "Heritage"]),
        ("Old European Trading Post & Fortress", "₦", "₦1,000 - ₦2,500", "Historic 19th-century coastal trading post, stone fortifications, and archival relics from early trade eras.", ["19th Century Relics", "Stone Fort", "Historical Guided Walk", "Coastal Memory"]),
        ("Ancient Hilltop Sanctuary & Caves", "₦₦", "₦1,500 - ₦3,500", "Natural fortress and sacred rock shelter with ancient inscriptions where ancestors took shelter during historic conflicts.", ["Sacred Cave", "Ancient Inscriptions", "Summit Trail", "Panoramic Vistas"])
    ],
    "Nature & Parks": [
        ("Cascading Waterfalls & Forest Reserve", "₦₦", "₦1,500 - ₦4,000", "Crystal-clear rushing waterfalls plunging into emerald forest pools, enclosed by dense tropical canopy and mist.", ["Natural Waterfall", "Plunge Pool", "Hiking Trail", "Lush Forestry"]),
        ("Eco Botanical Nature Sanctuary", "₦", "₦1,000 - ₦3,000", "Tranquil botanical reserve featuring indigenous flora, shaded wooden walkways, butterfly gardens, and birdwatching.", ["Botanical Flora", "Birdwatching Trail", "Picnic Groves", "Eco Walkway"]),
        ("Summit Rock Inselberg & Lookout", "Free", "Free Scenic Viewing", "Gigantic monolithic rock formation rising majestically with breathtaking panoramic views of surrounding savannas.", ["Monolithic Rock", "Scenic Sunrise", "Photography Spot", "Trekking"]),
        ("Whispering Palms Lakefront Park", "₦₦", "₦2,500 - ₦6,000", "Idyllic lakefront leisure park with boat cruises, swaying coconut palms, waterfront gazebos, and green lawns.", ["Lake Boardwalk", "Pedal Boating", "Coconut Palms", "Family Friendly"]),
        ("Green Meadows Family Adventure Park", "₦", "₦1,200 - ₦3,500", "Expansive leisure landscape boasting fitness running tracks, children's amusement rides, and open picnic lawns.", ["Playgrounds", "Fitness Trail", "Open Lawns", "Family Amusement"]),
        ("Spring Waters & Wildlife Conservation", "₦₦", "₦2,000 - ₦5,000", "Protected nature reserve housing indigenous wildlife, healing thermal warm and cold springs, and quiet forestry.", ["Warm Spring", "Protected Forest", "Wildlife Sighting", "Pure Serenity"])
    ],
    "Arts & Culture": [
        ("Contemporary African Art Gallery", "Free", "Free Entry", "Modern glass-front exhibition space displaying bold canvases, bronze sculptures, and installations from rising artists.", ["Modern Painting", "Bronze Sculptures", "Free Admission", "Gallery Shop"]),
        ("National Cultural Center & Theatre", "₦₦", "₦2,000 - ₦8,000", "Premier performing arts complex staging Broadway-standard cultural dance dramas, musical concerts, and comedy.", ["Live Theater", "Cultural Dance", "Stage Shows", "Amphitheater"]),
        ("Indigenous Pottery & Craft Village", "Free", "Free Access", "Artisan village where master craftsmen mold traditional clay pottery, weave bright textiles, and carve woodwork.", ["Handmade Crafts", "Live Pottery Making", "Textile Weaving", "Souvenirs"]),
        ("Heritage Music & Folklore Hall", "₦", "₦1,000 - ₦3,500", "Dedicated cultural center celebrating classical Nigerian highlife, juju, fuji, and traditional drumming.", ["Highlife Legends", "Traditional Drumming", "Music Archive", "Interactive Sets"]),
        ("Sculpture Garden & Creative Hub", "Free", "Free Admission", "Open-air park decorated with life-sized figurative sculptures, peaceful reading nooks, and artistic benches.", ["Sculpture Trail", "Creative Reading Nooks", "Outdoor Installation", "Peaceful Vibes"]),
        ("Artisan Textile & Batik Studio", "₦", "₦1,500 - ₦4,000", "Immersive studio showcasing ancient indigo-dyeing, adire patterns, and modern textile art with master classes.", ["Adire Patterns", "Indigo Dyeing", "Interactive Workshops", "Wearable Art"])
    ]
}

def generate_1000_spots():
    spots = []
    spot_counter = 1
    
    # We want ~1050 total spots across 37 regions (28-29 spots per state)
    for state_name, state_tag, cities in ALL_STATES:
        # Generate 28 spots per state = 37 * 28 = 1,036 spots!
        spots_per_state = 28
        
        for i in range(spots_per_state):
            cat = CATEGORIES_LIST[i % len(CATEGORIES_LIST)]
            templates = SPOT_NAME_TEMPLATES[cat]
            template = templates[i % len(templates)]
            
            city = random.choice(cities)
            name_base, price_rating, price_range, desc, amenities = template
            spot_name = name_base.format(city=city)
            
            # Make the name unique if needed
            if i >= len(templates):
                spot_name = f"{spot_name} ({city})"
                
            img_url = IMAGE_POOL[(spot_counter * 7 + i * 3) % len(IMAGE_POOL)]
            rating = round(random.uniform(4.3, 4.9), 1)
            reviews = random.randint(350, 4800)
            
            spots.append({
                "id": f"spot-{spot_counter}",
                "name": spot_name,
                "category": cat,
                "priceRating": price_rating,
                "priceRange": price_range,
                "city": city,
                "state": state_name,
                "address": f"{random.randint(2, 120)} Main Boulevard, {city}, {state_name}",
                "description": desc,
                "imageUrl": img_url,
                "rating": rating,
                "reviewsCount": reviews,
                "openingHours": "Open Daily • 9:00 AM - 9:00 PM" if cat != "Bars & Lounges" else "Daily • 4:00 PM - 2:00 AM",
                "distance": f"{city} • {round(random.uniform(1.2, 8.5), 1)} km away",
                "amenities": amenities,
                "featured": (i % 6 == 0),
                "tags": [cat.split()[0], city.split()[0], state_name.split()[0]]
            })
            spot_counter += 1

    return spots

if __name__ == "__main__":
    all_spots = generate_1000_spots()
    print(f"Generated {len(all_spots)} spots across all 37 Nigerian states/FCT.")
    
    with open("data/spots.json", "w", encoding="utf-8") as f:
        json.dump(all_spots, f, ensure_ascii=False, indent=2)
    print("Saved to data/spots.json")
