import React from "react";
import HomePage from "./components/homepage";

// pool of stock images to randomly assign if article doesn't have its own image
const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1581091215367-5c8a5d6e0f53?auto=format&fit=crop&w=1000&q=80", // politics podium vibe
  "https://images.unsplash.com/photo-1581091215367-5c8a5d6e0f53?auto=format&fit=crop&w=1000&q=80", // protest crowd
  "https://images.unsplash.com/photo-1581091215367-5c8a5d6e0f53?auto=format&fit=crop&w=1000&q=80", // surveillance / radar tech
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80", // officials / uniforms
  "https://images.unsplash.com/photo-1581091215367-5c8a5d6e0f53?auto=format&fit=crop&w=1000&q=80", // space / planet
  "https://images.unsplash.com/photo-1581094478731-9237b1b5c24f?auto=format&fit=crop&w=1000&q=80", // oil / industry
  "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1000&q=80", // art / museum
];

// helper: give a stable-but-random-ish image per article
function pickImageForArticle(article, idx) {
  // you could hash on article.id, but idx is fine for now
  return STOCK_IMAGES[idx % STOCK_IMAGES.length];
}

// This simulates what you'd get back from your backend / DB:
const backendPayload = {
  articles: [
    {
      id: 4,
      headline: "Israel Commits 84% Probability to Gaza Ground Offensive",
      subheader:
        "Market surge reflects Israeli cabinet's expanded offensive plans and ongoing ground attacks",
      blurb:
        "Prediction market signals 84% chance Israel launches major ground offensive in Gaza this May. Probability jumped 23.5 points in 24 hours, driven by Israeli cabinet approval for offensive expansion and intensified ground assaults in northern Gaza. These military moves aim to seize the entire Gaza Strip, significantly impacting regional stability and conflict dynamics through May 31, 2025.",
      ticker:
        "will-israel-launch-a-major-ground-offensive-in-gaza-in-may",
      score: 7.0,
    },
    {
      id: 7,
      headline: "Trump Disparages Netanyahu Odds Drop to 7.5%",
      subheader:
        "Market reflects tension but no explicit insults yet from Trump",
      blurb:
        "Prediction market prices Trump disparaging Netanyahu before June at just 7.5%. Despite heightened diplomatic friction and Trump sidelining Netanyahu on critical Middle East issues, no public insults have been confirmed...",
      ticker:
        "will-donald-trump-publicly-disparage-benjamin-netanyahu-before-june",
      score: 7.0,
    },
    {
      id: 14,
      headline: "Diddy Faces 71% Odds Guilty Sex Trafficking",
      subheader:
        "Market confidence reflects detailed federal indictments and ongoing prosecution.",
      blurb:
        "Prediction market assigns 71% probability Sean 'Diddy' Combs will be convicted of sex trafficking or related felonies by end of 2025. Charges include racketeering conspiracy, sex trafficking, and interstate transportation for prostitution...",
      ticker: "diddy-found-guilty-of-sex-trafficking",
      score: 7.0,
    },
    {
      id: 20,
      headline:
        "Turkey Leads Pope Leo XIV's First Visit Race—77% Probability",
      subheader:
        "High odds reflect geopolitical and religious diplomacy priorities amid global conflicts",
      blurb:
        "Turkey holds a commanding 77% probability as the first country Pope Leo XIV will visit outside Italy by the end of 2025...",
      ticker: "which-country-will-pope-leo-visit-first",
      score: 7.0,
    },
    {
      id: 24,
      headline: "Dan Edges Simion in Tight Romanian Runoff—36% Likely",
      subheader:
        "Market signals razor-thin victory margin amid complex voter shifts",
      blurb:
        "Dan leads with a 35.5% probability of winning by a 0–6% margin... making this runoff one of Romania’s most unpredictable in years.",
      ticker: "romanian-presidential-election-margin-of-victory",
      score: 7.0,
    },
    {
      id: 31,
      headline:
        "12M+ Votes Expected in Romanian Runoff—Market Shifts",
      subheader:
        "High turnout brackets gain momentum amidst political unrest and tight race",
      blurb:
        "Prediction market assigns 18.5% probability to turnout exceeding 12 million votes in Romanian presidential runoff on May 18, 2025...",
      ticker: "turnout-in-2025-romanian-presindetial-election",
      score: 7.0,
    },
    {
      id: 32,
      headline:
        "Russia-Ukraine Ceasefire, Rihanna Album Lead Before GTA VI",
      subheader:
        "Market sees cultural and geopolitical events shaping next two years before May 2026 release",
      blurb:
        "Prediction market sets 71% probability for both Russia-Ukraine ceasefire and new Rihanna album before GTA VI's May 26, 2026 launch...",
      ticker: "what-will-happen-before-gta-vi",
      score: 7.0,
    },
    {
      id: 37,
      headline:
        "Look Back Surges to 70% Win Chance—Top Film Pick",
      subheader:
        "Market momentum shifts dramatically toward Look Back ahead of Crunchyroll Awards.",
      blurb:
        "Look Back commands a 70.5% probability to win Film of the Year at the Crunchyroll Anime Awards on May 25, 2025...",
      ticker: "crunchyroll-film-of-the-year",
      score: 7.0,
    },
    {
      id: 39,
      headline:
        "Trans Military Removals Pass 58% Probability—June Deadline Looms",
      subheader:
        "Pentagon policy targets 1,000 trans troops for discharge unless exemptions apply",
      blurb:
        "Prediction market sets 58% odds that at least 10 transgender service members will be removed from the U.S. military by June 30, 2025...",
      ticker:
        "us-kicks-trans-members-out-of-military-before-july",
      score: 7.0,
    },
    {
      id: 46,
      headline:
        "Final Destination Bloodlines Tops $48M Weekend—Franchise Record Looms",
      subheader:
        "Market shows 66% chance opening hits $44M-$52M, fueled by strong reviews and nostalgia",
      blurb:
        "Prediction market assigns a 34.5% probability that Final Destination: Bloodlines will earn between $48 million and $52 million domestically during opening weekend...",
      ticker:
        "final-destination-bloodlines-opening-weekend-box-office",
      score: 7.0,
    },
  ],

  groups: {
    "Entertainment & Arts": [32, 37, 46],
    "Global Affairs Gossip": [4, 20, 32, 39],
    "Headline Scandals": [7, 14, 39],
    "Political Pulse": [7, 24, 31],
  },
};

// transform backend payload -> props for <HomePage />
function transformBackendPayloadToPageData(payload) {
  const { articles, groups } = payload;

  // 1. Build categories from group names
  const categories = Object.keys(groups || {});

  // 2. Sort all articles by score DESC (highest first)
  const sorted = [...articles].sort((a, b) => b.score - a.score);

  // 3. Slice buckets
  const topHeadlinesRaw = sorted.slice(0, 4);
  const latestNewsRaw = sorted.slice(4, 8);
  const trendingRaw = sorted.slice(8, 12);

  // 4. Normalize article shape for the UI + add fallback fields
  function normalize(list) {
    return list.map((article, idx) => {
      return {
        id: article.id,
        title: article.headline,
        summary: article.blurb,
        // You didn't give author/datetime, so placeholder:
        author: "PolyNewsDaily Desk",
        datetime: "Just now",
        // Random stock photo for now:
        image: pickImageForArticle(article, idx),
        // we can carry category info later if you want to display it
        category: "",

        // keep subheader around if you ever want to surface it:
        subheader: article.subheader,
        ticker: article.ticker,
        score: article.score,
      };
    });
  }

  const pageData = {
    topHeadlines: normalize(topHeadlinesRaw),
    latestNews: normalize(latestNewsRaw),
    trending: normalize(trendingRaw),
  };

  return { pageData, categories };
}

export default function App() {
  const { pageData, categories } =
    transformBackendPayloadToPageData(backendPayload);

  return <HomePage data={pageData} categories={categories} />;
}
