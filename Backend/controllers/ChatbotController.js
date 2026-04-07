import Listing from "../model/listModel.js";
import User from "../model/userModel.js";
import Booking from "../model/BookModel.js";
import dotenv from "dotenv";

dotenv.config();

const CATEGORY_ALIASES = {
  farmhouse: ["farmhouse", "farm house", "farm"],
  room: ["room", "rooms"],
  apartment: ["apartment", "flat", "apartments"],
  villa: ["villa", "villas"],
  house: ["house", "home", "homes"],
  cabin: ["cabin", "hut"],
  shop: ["shop", "shops"],
};

const GUEST_CANCEL_WINDOW_MS = 1 * 60 * 60 * 1000;

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const levenshteinDistance = (a = "", b = "") => {
  const aa = a || "";
  const bb = b || "";

  if (aa === bb) return 0;
  if (!aa.length) return bb.length;
  if (!bb.length) return aa.length;

  const dp = Array.from({ length: aa.length + 1 }, () =>
    new Array(bb.length + 1).fill(0)
  );

  for (let i = 0; i <= aa.length; i++) dp[i][0] = i;
  for (let j = 0; j <= bb.length; j++) dp[0][j] = j;

  for (let i = 1; i <= aa.length; i++) {
    for (let j = 1; j <= bb.length; j++) {
      const cost = aa[i - 1] === bb[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[aa.length][bb.length];
};

const resolveCityFromMessage = (message = "", knownCities = []) => {
  if (!Array.isArray(knownCities) || knownCities.length === 0) return undefined;

  const normalizedMessage = normalizeText(message);
  if (!normalizedMessage) return undefined;

  // 1) Exact city substring match in normalized message
  const exactCity = knownCities.find((cityName) => {
    const cityNorm = normalizeText(cityName);
    return cityNorm && normalizedMessage.includes(cityNorm);
  });
  if (exactCity) return exactCity;

  // 2) Try parsing location phrase: "in <city>", "at <city>", "near <city>"
  const locationMatch = normalizedMessage.match(/\b(?:in|at|near|from)\s+([a-z\s]+)/i);
  const rawLocationPhrase = locationMatch?.[1]?.trim() || "";
  const locationPhrase = rawLocationPhrase
    .split(/\b(?:under|below|with|for|and|that|which|who|is|are)\b/i)[0]
    .trim();

  const candidate = locationPhrase || normalizedMessage;
  if (!candidate) return undefined;

  const candidateCompact = candidate.replace(/\s+/g, "");

  let bestCity;
  let bestDistance = Infinity;

  for (const cityName of knownCities) {
    const cityNorm = normalizeText(cityName);
    if (!cityNorm) continue;

    const cityCompact = cityNorm.replace(/\s+/g, "");
    const distance = levenshteinDistance(candidateCompact, cityCompact);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestCity = cityName;
    }
  }

  if (!bestCity) return undefined;

  const bestCityNorm = normalizeText(bestCity).replace(/\s+/g, "");
  const maxAllowedDistance = bestCityNorm.length <= 8 ? 2 : 3;

  return bestDistance <= maxAllowedDistance ? bestCity : undefined;
};

const extractPriceFilters = (message = "") => {
  const lower = message.toLowerCase();

  const maxPatterns = [
    /(?:under|below|less than|upto|up to|<=|se kam)\s*(?:rs\.?|pkr)?\s*-?\s*(\d+)/i,
    /(?:rs\.?|pkr)\s*-?\s*(\d+)\s*(?:or less|or below|se kam|under)/i,
    /max(?:imum)?\s*(?:budget|price|rent)?\s*(?:is|=)?\s*(?:rs\.?|pkr)?\s*-?\s*(\d+)/i,
  ];

  const minPatterns = [
    /(?:above|more than|greater than|>=|se zyada|at least)\s*(?:rs\.?|pkr)?\s*-?\s*(\d+)/i,
    /min(?:imum)?\s*(?:price|rent|budget)?\s*(?:is|=)?\s*(?:rs\.?|pkr)?\s*-?\s*(\d+)/i,
  ];

  let maxPrice;
  let minPrice;

  for (const pattern of maxPatterns) {
    const match = lower.match(pattern);
    if (match?.[1]) {
      maxPrice = Number(match[1]);
      break;
    }
  }

  for (const pattern of minPatterns) {
    const match = lower.match(pattern);
    if (match?.[1]) {
      minPrice = Number(match[1]);
      break;
    }
  }

  return { minPrice, maxPrice };
};

const extractSearchFilters = (message = "", knownCities = [], knownCategories = []) => {
  const lower = message.toLowerCase();

  const city = resolveCityFromMessage(message, knownCities);

  const explicitCategory = knownCategories.find((cat) =>
    lower.includes(String(cat || "").toLowerCase())
  );

  let mappedCategory = explicitCategory;

  if (!mappedCategory) {
    for (const [normalized, aliases] of Object.entries(CATEGORY_ALIASES)) {
      if (aliases.some((alias) => lower.includes(alias))) {
        mappedCategory = normalized;
        break;
      }
    }
  }

  const { minPrice, maxPrice } = extractPriceFilters(message);

  const onlyAvailable =
    lower.includes("available") ||
    lower.includes("not booked") ||
    lower.includes("khali") ||
    lower.includes("vacant");

  const sort =
    lower.includes("cheapest") || lower.includes("low to high")
      ? { rent: 1 }
      : lower.includes("expensive") || lower.includes("high to low")
      ? { rent: -1 }
      : { createdAt: -1 };

  return {
    city,
    category: mappedCategory,
    minPrice,
    maxPrice,
    onlyAvailable,
    sort,
  };
};

const isDataIntent = (message = "", filters = {}) => {
  const lower = message.toLowerCase();

  // Prevent false-positive data intent for help/guidance questions like
  // "how do I list a property"
  const asksHowTo = /(how|kaise|kesy|kese|steps|process|guide)/i.test(lower);
  const asksListingGuidance =
    /(list|listing|add|post|property|room|house|farmhouse)/i.test(lower);

  if (asksHowTo && asksListingGuidance) {
    return false;
  }

  const dataKeywords = [
    "show",
    "list",
    "find",
    "available",
    "rent",
    "price",
    "farmhouse",
    "room",
    "property",
    "properties",
    "under",
    "below",
    "database",
  ];

  const hasKeyword = dataKeywords.some((keyword) => lower.includes(keyword));
  const hasFilter =
    Boolean(filters.city) ||
    Boolean(filters.category) ||
    Boolean(filters.minPrice) ||
    Boolean(filters.maxPrice) ||
    Boolean(filters.onlyAvailable);

  return hasKeyword || hasFilter;
};

const buildListingQuery = (filters = {}) => {
  const query = {};

  if (filters.city) {
    query.city = { $regex: escapeRegex(filters.city), $options: "i" };
  }

  if (filters.category) {
    query.category = { $regex: escapeRegex(filters.category), $options: "i" };
  }

  if (filters.minPrice || filters.maxPrice) {
    query.rent = {};
    if (filters.minPrice) query.rent.$gte = filters.minPrice;
    if (filters.maxPrice) query.rent.$lte = filters.maxPrice;
  }

  if (filters.onlyAvailable) {
    query.isBooked = false;
  }

  return query;
};

const formatListing = (listing) => ({
  id: listing._id,
  title: listing.title,
  city: listing.city,
  landmark: listing.landmark,
  rent: listing.rent,
  category: listing.category,
  rating: listing.ratings,
  images: [listing.image1, listing.image2, listing.image3],
  description: listing.description,
  hostName: listing?.host?.name || "Unknown",
  isBooked: listing.isBooked,
});

const getUserContext = async (userId) => {
  if (!userId) return null;

  const user = await User.findById(userId)
    .select("name email listing booking")
    .populate("listing", "title city category rent isBooked")
    .populate({
      path: "booking",
      select: "status checkIn checkOut totalRent createdAt",
      populate: {
        path: "listing",
        select: "title city category rent",
      },
    });

  if (!user) return null;

  const safeBookings = (user.booking || []).filter((entry) => entry?.listing);

  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    roleHint: (user.listing || []).length > 0 ? "host" : "guest",
    totalListings: (user.listing || []).length,
    totalBookings: safeBookings.length,
    latestBookings: safeBookings.slice(-5).map((booking) => ({
      title: booking.listing.title,
      city: booking.listing.city,
      category: booking.listing.category,
      rent: booking.listing.rent,
      totalRent: booking.totalRent,
      status: booking.status,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    })),
    ownListings: (user.listing || []).slice(0, 10).map((listing) => ({
      title: listing.title,
      city: listing.city,
      category: listing.category,
      rent: listing.rent,
      isBooked: listing.isBooked,
    })),
  };
};

const getMarketSummary = async (filters = {}) => {
  const query = buildListingQuery({
    city: filters.city,
    category: filters.category,
  });

  const listings = await Listing.find(query)
    .select("title city category rent isBooked")
    .sort({ rent: 1 })
    .limit(100);

  if (!listings.length) {
    return {
      totalListings: 0,
      avgRent: null,
      minRent: null,
      maxRent: null,
      availableCount: 0,
      bookedCount: 0,
    };
  }

  const rents = listings.map((item) => item.rent).filter(Boolean);
  const avgRent =
    rents.length > 0
      ? Math.round(rents.reduce((sum, value) => sum + value, 0) / rents.length)
      : null;

  return {
    totalListings: listings.length,
    avgRent,
    minRent: rents.length > 0 ? Math.min(...rents) : null,
    maxRent: rents.length > 0 ? Math.max(...rents) : null,
    availableCount: listings.filter((item) => !item.isBooked).length,
    bookedCount: listings.filter((item) => item.isBooked).length,
  };
};

const getPricingSuggestion = async (filters = {}) => {
  const query = {};

  if (filters.city) {
    query.city = { $regex: escapeRegex(filters.city), $options: "i" };
  }
  if (filters.category) {
    query.category = { $regex: escapeRegex(filters.category), $options: "i" };
  }

  const listings = await Listing.find(query).select("rent city category").limit(300);
  if (!listings.length) return null;

  const rents = listings.map((item) => item.rent).filter(Boolean).sort((a, b) => a - b);
  if (!rents.length) return null;

  const avg = Math.round(rents.reduce((sum, value) => sum + value, 0) / rents.length);
  const q1 = rents[Math.floor(rents.length * 0.25)] || rents[0];
  const q3 = rents[Math.floor(rents.length * 0.75)] || rents[rents.length - 1];

  return {
    sampleSize: rents.length,
    avgRent: avg,
    suggestedMin: q1,
    suggestedMax: q3,
    minRent: rents[0],
    maxRent: rents[rents.length - 1],
    city: filters.city || "all cities",
    category: filters.category || "all categories",
  };
};

const callGemini = async (prompt, apiKey) => {
  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 700,
        },
      }),
    }
  );

  return geminiResponse.json();
};

const isCancellationPolicyIntent = (message = "") => {
  const lower = message.toLowerCase();
  const asksCancel = /(cancel|cancellation|cancle)/i.test(lower);
  const asksTimeWindow =
    /(time|within|deadline|window|hours|days|kitna|kab tak)/i.test(lower);
  const asksPolicy = /(policy|rule)/i.test(lower);

  return asksCancel && (asksTimeWindow || asksPolicy);
};

const getLocalHelpResponse = (message = "", role = "guest") => {
  const lower = String(message).toLowerCase();

  const asksListingHowTo =
    /(how|kaise|kesy|kese|steps|process)/i.test(lower) &&
    /(list|listing|add|post|property|room|house|farmhouse)/i.test(lower);

  const asksCancel = /(cancel|cancellation|cancle)/i.test(lower);
  const asksBooking = /(book|booking|reserve|reservation)/i.test(lower);
  const asksSearch = /(search|find|show|available|under|below|price|rent|farmhouse|room)/i.test(lower);

  if (asksListingHowTo) {
    return {
      message:
        "Property list karne ke liye: (1) Login karo, (2) Host dashboard/My Listing pe jao, (3) Add listing form fill karo — title, description, city, landmark, category, rent, images, (4) Submit karo. Agar chaho to main aapko rent suggest bhi kar sakta hoon city/category ke hisaab se.",
      quickHelp: {
        topic: "listing-how-to",
        role,
      },
    };
  }

  if (asksCancel) {
    return {
      message:
        "Cancellation rule: Guest booking create hone ke 1 hour ke andar cancel kar sakta hai. Host cancellation anytime allowed hai.",
      quickHelp: {
        topic: "cancellation-policy",
        guestCancellationWindowHours: 1,
        hostCanCancelAnytime: true,
      },
    };
  }

  if (asksBooking) {
    return {
      message:
        "Booking ke liye listing open karo, dates select karo, total rent check karo, phir reserve/confirm karo. Main aapko available listings bhi dikha sakta hoon city/category/budget ke hisaab se.",
      quickHelp: {
        topic: "booking-flow",
      },
    };
  }

  if (asksSearch) {
    return {
      message:
        "Aap direct aise pooch sakte ho: 'show different farmhouse', 'rooms under 2000', 'available apartments in Lahore'. Main DB se direct results laa kar dikhata hoon.",
      quickHelp: {
        topic: "search-help",
      },
    };
  }

  return {
    message:
      "AI temporary unavailable hai, lekin main app help de sakta hoon: listing ka process, booking/cancellation rules, aur DB-based property search. Aap apna sawal short mein bhejein.",
    quickHelp: {
      topic: "generic-help",
    },
  };
};

const buildCancellationPolicyReply = async ({ userId, userRole }) => {
  const latestBooking = await Booking.findOne({ guest: userId })
    .sort({ createdAt: -1 })
    .select("createdAt status listing");

  const isHostQuery = String(userRole || "").toLowerCase() === "host";
  if (isHostQuery) {
    return {
      message:
        "Host ke liye cancellation allowed hai anytime. Guest ke liye 1 hour ka window hota hai booking create hone ke baad.",
      policy: {
        guestCancellationWindowHours: 1,
        hostCanCancelAnytime: true,
      },
    };
  }

  if (!latestBooking?.createdAt) {
    return {
      message:
        "Guest policy: booking create hone ke baad 1 hour ke andar cancel kar sakte ho. 1 hour ke baad guest cancel nahi kar sakta.",
      policy: {
        guestCancellationWindowHours: 1,
        hostCanCancelAnytime: true,
      },
    };
  }

  const createdAtMs = new Date(latestBooking.createdAt).getTime();
  const nowMs = Date.now();
  const elapsedMs = Math.max(0, nowMs - createdAtMs);
  const remainingMs = GUEST_CANCEL_WINDOW_MS - elapsedMs;

  if (remainingMs <= 0) {
    const elapsedHours = Math.floor(elapsedMs / (60 * 60 * 1000));
    return {
      message: `Aap guest ke taur par sirf 1 hour ke andar cancel kar sakte ho. Aapki latest booking ka cancellation window expire ho chuka hai (approx ${elapsedHours} hours guzar chuke).`,
      policy: {
        guestCancellationWindowHours: 1,
        hostCanCancelAnytime: true,
        latestBookingWindowExpired: true,
      },
    };
  }

  const remainingHours = Math.floor(remainingMs / (60 * 60 * 1000));
  const remainingMinutes = Math.floor(
    (remainingMs % (60 * 60 * 1000)) / (60 * 1000)
  );

  return {
    message: `Guest cancellation policy: 1 hour ke andar cancel allowed hai. Aapki latest booking ke liye approx ${remainingHours}h ${remainingMinutes}m baqi hain.`,
    policy: {
      guestCancellationWindowHours: 1,
      hostCanCancelAnytime: true,
      latestBookingWindowExpired: false,
      remainingHours,
      remainingMinutes,
    },
  };
};

// ============================================
// CHATBOT CONTROLLER
// ============================================
// Handles all chatbot functionality:
// 1. Process user messages through Gemini API
// 2. Detect location and find nearby listings
// 3. Provide conversational assistance for booking/listing

// ============================================
// FEATURE 1: PROCESS MESSAGE WITH GEMINI API
// ============================================
// Purpose: Send user message to Gemini AI for intelligent responses
// Handles both general questions and property-specific queries
export const processMessage = async (req, res) => {
  try {
    const { message, userRole } = req.body; // userRole: 'guest' or 'host'
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Message cannot be empty" 
      });
    }

    if (isCancellationPolicyIntent(message)) {
      const policyReply = await buildCancellationPolicyReply({
        userId: req.userId,
        userRole,
      });

      return res.status(200).json({
        success: true,
        message: policyReply.message,
        policy: policyReply.policy,
        listings: [],
        count: 0,
        timestamp: new Date(),
      });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "API key not configured",
      });
    }

    const [knownCities, knownCategories, personalizedUserContext] = await Promise.all([
      Listing.distinct("city"),
      Listing.distinct("category"),
      getUserContext(req.userId),
    ]);

    const filters = extractSearchFilters(message, knownCities, knownCategories);
    const queryIntent = isDataIntent(message, filters);
    const listingQuery = buildListingQuery(filters);

    let matchedListings = [];
    if (queryIntent) {
      matchedListings = await Listing.find(listingQuery)
        .populate("host", "name email")
        .sort(filters.sort)
        .limit(15);
    }

    const formattedListings = matchedListings.map(formatListing);
    const marketSummary = await getMarketSummary(filters);

    const pricingQuestion =
      /(rent|price|pricing|rate|kitna|rkho|rakho|charge)/i.test(message) &&
      /(host|my|meri|mery|listing|room|rooms|city)/i.test(message);

    const pricingSuggestion = pricingQuestion
      ? await getPricingSuggestion(filters)
      : null;

    const effectiveRole =
      userRole || personalizedUserContext?.roleHint || "guest";

    const systemPrompt = `
You are Smart Airbnb Assistant for ${effectiveRole} users.

Rules you must follow:
1) Always use provided DATABASE CONTEXT first before asking follow-up questions.
2) If user asks for properties/rooms/farmhouse/price filters, directly provide available options from DB context.
3) Do NOT repeatedly ask city/date/guest count when DB already has matching items.
4) If user asks host pricing guidance, use market stats and provide a clear suggested range.
5) If no exact results exist, suggest nearest alternatives from context.
6) Keep answer natural, friendly, and concise (Urdu-English style allowed).
7) Mention concrete counts/prices/cities from DB when possible.
`;

    console.log('🔹 Calling Gemini API with message:', message);

    const dbPromptContext = {
      extractedFilters: filters,
      marketSummary,
      matchedCount: formattedListings.length,
      matchedListings: formattedListings.slice(0, 10).map((item) => ({
        id: item.id,
        title: item.title,
        city: item.city,
        category: item.category,
        rent: item.rent,
        available: !item.isBooked,
      })),
      userContext: personalizedUserContext,
      pricingSuggestion,
    };

    const fullPrompt = `${systemPrompt}\n\nDATABASE CONTEXT (JSON):\n${JSON.stringify(
      dbPromptContext,
      null,
      2
    )}\n\nUser: ${message}`;

    const geminiData = await callGemini(fullPrompt, GEMINI_API_KEY);
    console.log('🔹 Gemini API Response:', JSON.stringify(geminiData, null, 2));

    // ============================================
    // ✅ IMPROVED RESPONSE PARSING WITH ERROR HANDLING
    // ============================================
    let botResponse = "I can help you with listing, booking, and smart suggestions from our database. Try: 'show farmhouses' or 'rooms under 2000'.";
    
    if (geminiData?.candidates && geminiData.candidates.length > 0) {
      const candidate = geminiData.candidates[0];
      if (candidate?.content?.parts && candidate.content.parts.length > 0) {
        botResponse = candidate.content.parts[0].text || botResponse;
      }
    }

    // Check for API errors - use deterministic local fallback
    if (geminiData?.error) {
      console.error('❌ Gemini API Error:', geminiData.error);

      const localHelp = getLocalHelpResponse(message, effectiveRole);

      return res.status(200).json({
        success: true,
        message: localHelp.message,
        quickHelp: localHelp.quickHelp,
        listings: formattedListings,
        count: formattedListings.length,
        appliedFilters: filters,
        pricingSuggestion,
        timestamp: new Date(),
      });
    }

    if (queryIntent && formattedListings.length === 0) {
      const cityText = filters.city ? ` in ${filters.city}` : "";
      const categoryText = filters.category ? ` for ${filters.category}` : "";
      const maxPriceText = filters.maxPrice ? ` under Rs ${filters.maxPrice}` : "";
      const minPriceText = filters.minPrice ? ` above Rs ${filters.minPrice}` : "";

      botResponse = `I checked the database but no listings found${categoryText}${cityText}${minPriceText}${maxPriceText}. Try a different filter and I’ll fetch it instantly.`;
    }

    console.log('✅ Bot Response:', botResponse);

    res.status(200).json({
      success: true,
      message: botResponse,
      listings: formattedListings,
      count: formattedListings.length,
      appliedFilters: filters,
      pricingSuggestion,
      timestamp: new Date()
    });

  } catch (error) {
    console.error("Chatbot API Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to process your request. Please try again.",
      error: error.message
    });
  }
};

// ============================================
// FEATURE 2: DETECT LOCATION & GET NEARBY LISTINGS
// ============================================
// Purpose: When user says "near me" or mentions a location
// Get listings from that location and present to user
export const getNearbyListings = async (req, res) => {
  try {
    const { latitude, longitude, city } = req.body;

    // ============================================
    // CHECK IF LOCATION PROVIDED
    // ============================================
    if (!city && (!latitude || !longitude)) {
      return res.status(400).json({
        success: false,
        message: "Please provide location (city or coordinates)"
      });
    }

    let searchCity = city;

    // ============================================
    //  FREE REVERSE GEOCODING (NO GOOGLE MAPS BILLING)
    // ============================================
    // If coordinates are sent, convert them to city via OpenStreetMap Nominatim
    if (!city && latitude && longitude) {
      try {
        const reverseGeo = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          {
            headers: {
              "User-Agent": "SmartAirbnbChatbot/1.0",
            },
          }
        );

        const reverseData = await reverseGeo.json();

        searchCity =
          reverseData?.address?.city ||
          reverseData?.address?.town ||
          reverseData?.address?.village ||
          reverseData?.address?.state ||
          "";

        if (!searchCity) {
          return res.status(200).json({
            success: true,
            message:
              "I couldn't determine your city exactly. Please type your city name (e.g., Lahore).",
            listings: [],
          });
        }
      } catch (geoError) {
        console.log("Geolocation error:", geoError.message);
        return res.status(200).json({
          success: true,
          message:
            "Unable to detect exact location right now. Please type your city name.",
          listings: [],
        });
      }
    }

    // ============================================
    // QUERY DATABASE FOR LISTINGS BY CITY
    // ============================================
    const listings = await Listing.find({ 
      city: { $regex: searchCity, $options: 'i' } // Case-insensitive search
    })
      .populate('host', 'name email')
      .limit(5); // Limit to top 5 listings

    if (listings.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No listings found in ${searchCity}. Try another location!`,
        listings: []
      });
    }

    // ============================================
    // FORMAT LISTINGS FOR CHATBOT DISPLAY
    // ============================================
    const formattedListings = listings.map(listing => ({
      id: listing._id,
      title: listing.title,
      city: listing.city,
      landmark: listing.landmark,
      rent: listing.rent,
      category: listing.category,
      rating: listing.ratings,
      images: [listing.image1, listing.image2, listing.image3],
      description: listing.description
    }));

    res.status(200).json({
      success: true,
      message: `Found ${listings.length} listings near ${searchCity}`,
      listings: formattedListings,
      count: listings.length
    });

  } catch (error) {
    console.error("Nearby Listings Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch listings. Please try again.",
      error: error.message
    });
  }
};

// ============================================
// FEATURE 3: SEARCH LISTINGS BY KEYWORDS
// ============================================
// Purpose: Handle queries like "Show me apartments in Lahore"
// Extract location and category from message and search
export const searchListings = async (req, res) => {
  try {
    const { city, category, maxPrice, minPrice, onlyAvailable } = req.body;

    // ============================================
    // BUILD SEARCH QUERY
    // ============================================
    let searchQuery = {};

    if (city) {
      searchQuery.city = { $regex: city, $options: 'i' };
    }

    if (category) {
      searchQuery.category = { $regex: category, $options: 'i' };
    }

    if (maxPrice || minPrice) {
      searchQuery.rent = {};
      if (maxPrice) searchQuery.rent.$lte = maxPrice;
      if (minPrice) searchQuery.rent.$gte = minPrice;
    }

    if (onlyAvailable) {
      searchQuery.isBooked = false;
    }

    // ============================================
    // QUERY DATABASE
    // ============================================
    const listings = await Listing.find(searchQuery)
      .populate('host', 'name email')
      .sort({ rent: 1, createdAt: -1 })
      .limit(10);

    if (listings.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No listings match your search criteria",
        listings: []
      });
    }

    // ============================================
    // FORMAT AND RETURN LISTINGS
    // ============================================
    const formattedListings = listings.map(listing => ({
      id: listing._id,
      title: listing.title,
      city: listing.city,
      landmark: listing.landmark,
      rent: listing.rent,
      category: listing.category,
      rating: listing.ratings,
      images: [listing.image1, listing.image2, listing.image3],
      hostName: listing.host.name,
      isBooked: listing.isBooked
    }));

    res.status(200).json({
      success: true,
      message: `Found ${listings.length} matching listings`,
      listings: formattedListings,
      count: listings.length
    });

  } catch (error) {
    console.error("Search Listings Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to search listings. Please try again.",
      error: error.message
    });
  }
};

// ============================================
// FEATURE 4: GET LISTING DETAILS FOR CHATBOT
// ============================================
// Purpose: Get full details of a specific listing
// for user to review before booking
export const getListingDetails = async (req, res) => {
  try {
    const { listingId } = req.params;

    // ============================================
    // FETCH LISTING FROM DATABASE
    // ============================================
    const listing = await Listing.findById(listingId)
      .populate('host', 'name email phone');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    // ============================================
    // FORMAT RESPONSE FOR CHATBOT
    // ============================================
    const listingDetails = {
      id: listing._id,
      title: listing.title,
      description: listing.description,
      city: listing.city,
      landmark: listing.landmark,
      category: listing.category,
      rent: listing.rent,
      rating: listing.ratings,
      isBooked: listing.isBooked,
      images: [listing.image1, listing.image2, listing.image3],
      hostName: listing.host.name,
      hostEmail: listing.host.email,
      createdAt: listing.createdAt
    };

    res.status(200).json({
      success: true,
      listing: listingDetails
    });

  } catch (error) {
    console.error("Get Listing Details Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch listing details",
      error: error.message
    });
  }
};

// ============================================
// ERROR HANDLING HELPER
// ============================================
const fallbackResponse = {
  success: false,
  message: "Unable to fetch data right now. Please try again.",
  timestamp: new Date()
};

export default {
  processMessage,
  getNearbyListings,
  searchListings,
  getListingDetails,
  fallbackResponse
};
