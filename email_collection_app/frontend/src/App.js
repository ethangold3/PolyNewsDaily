import React, { useEffect, useState } from "react";
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

// Fetch articles from backend on load instead of using a local simulation

// transform backend payload -> props for <HomePage />
function transformBackendPayloadToPageData(payload) {
  // Support both shapes: { articles } and { articles, groups }
  const articles = payload.articles || [];
  const groups = payload.groups || null;

  // 1. Build categories from group names
  const categories = groups ? Object.keys(groups) : [];

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
        image: article.image_url || pickImageForArticle(article, idx),
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
  const [pageData, setPageData] = useState({ topHeadlines: [], latestNews: [], trending: [] });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const apiBase = process.env.REACT_APP_API_BASE || '';
        const res = await fetch(`${apiBase}/api/articles`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const { pageData: pd, categories: cats } = transformBackendPayloadToPageData(data);
        setPageData(pd);
        setCategories(cats);
      } catch (e) {
        setError(e.message || "Failed to load articles");
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (error) return <div style={{ padding: 16 }}>Error: {error}</div>;

  return <HomePage data={pageData} categories={categories} />;
}
