import React from "react";

///////////////////////////////////////
// Helpers / sample shapes
///////////////////////////////////////

// fallback image if something doesn't have an image
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80";

function formatNowTime() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const suffix = h >= 12 ? "p" : "a";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const mm = m < 10 ? `0${m}` : m.toString();
  return `${hour12}:${mm}${suffix}`;
}

///////////////////////////////////////
// Header
///////////////////////////////////////

function SiteHeader() {
  return (
    <header className="bg-[#0b0f0c] text-white font-sans border-b border-white/10">
      {/* Top Row: Brand + Search */}
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* Brand */}
        <div className="flex-shrink-0">
          <div className="text-white font-extrabold tracking-wider text-xl leading-none uppercase">
            polynewsdaily
          </div>
        </div>

        {/* Search + Auth */}
        <div className="flex-1 flex flex-col lg:max-w-xl w-full">
          {/* Search bar */}
          <div className="flex w-full text-[12px] leading-none text-white/90 font-medium border border-white/20 rounded-sm overflow-hidden">
            <input
              className="flex-1 bg-[#28584c] placeholder:text-white/70 text-white/90 px-3 py-2 outline-none"
              placeholder="Search for headlines"
            />
            <button className="bg-[#8a4f4c] px-3 py-2 uppercase tracking-wide text-[11px] font-semibold text-white whitespace-nowrap">
              Search
            </button>
          </div>

          {/* Sign in / Sign up row (you asked for this under the search bar) */}
          <div className="flex flex-row flex-wrap gap-x-3 gap-y-1 text-[11px] leading-tight uppercase font-semibold tracking-wide text-white/70 mt-2 justify-end lg:justify-end">
            <button className="hover:text-white">Sign in</button>
            <span className="text-white/40">/</span>
            <button className="hover:text-white">Sign up</button>
          </div>
        </div>
      </div>

      {/* Nav Row */}
      <div className="bg-[#1c1c1a] border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          {/* Category nav */}
          <nav className="flex flex-wrap text-[12px] leading-none font-semibold tracking-wide uppercase text-white">
            {[
              "Politics",
              "World",
              "Economy",
              "Science & Tech",
              "Business",
              "Travel",
              "Climate",
              "Lifestyle",
              "Food",
              "Sports",
            ].map((label) => {
              const active = label === "World"; // in your screenshot, "World" tab is green
              return (
                <a
                  key={label}
                  className={[
                    "px-2 py-2 border-r border-white/20 last:border-r-0",
                    active
                      ? "bg-[#2f4f3f] text-white"
                      : "bg-transparent text-white hover:bg-white/10",
                  ].join(" ")}
                  href="#"
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Time / Weather */}
          <div className="text-[12px] leading-none text-white/80 font-medium flex flex-row items-center gap-2 ml-auto">
            <span>{formatNowTime()}</span>
            <span className="text-white/40">⛅</span>
            <span>24°C</span>
          </div>
        </div>
      </div>
    </header>
  );
}

///////////////////////////////////////
// Hero / Top Headlines
///////////////////////////////////////

function HeroSection({ topHeadlines }) {
  const hero = topHeadlines[0];
  const support1 = topHeadlines[1];
  const promoTile = topHeadlines[2];
  const support2 = topHeadlines[3];

  return (
    <section className="bg-[#efefe7] text-[#1a1a1a] border-b border-black/10">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* LEFT: main hero story */}
          <article className="lg:col-span-2 border border-[#d4d4c4] bg-black relative rounded-sm overflow-hidden">
            {/* image */}
            <img
              src={hero?.image || FALLBACK_IMG}
              alt={hero?.title || "headline image"}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/0" />
            {/* text content */}
            <div className="relative p-4 sm:p-6 md:p-8 flex flex-col justify-end min-h-[260px]">
              {/* carousel dots */}
              <div className="absolute top-4 right-4 flex gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      "block w-2 h-2 rounded-full border border-white/70 " +
                      (i === 0 ? "bg-white" : "bg-white/20")
                    }
                  />
                ))}
              </div>

              <h2 className="font-serif text-white font-bold text-xl sm:text-2xl leading-snug max-w-[40rem]">
                {hero?.title ||
                  "Democrats Overhaul Party’s Primary Calendar, Upending a Political Tradition"}
              </h2>

              <div className="mt-4 flex flex-wrap text-[11px] text-white/80 font-sans gap-x-2 gap-y-1">
                <span>By {hero?.author || "Ginny Dennis"}</span>
                <span className="opacity-50">•</span>
                <span>{hero?.datetime || "Just now"}</span>
              </div>
            </div>
          </article>

          {/* RIGHT COLUMN */}
          <aside className="flex flex-col gap-4">
            {/* Spy balloon style block */}
            <div className="bg-[#1a1a1a] text-white border border-[#2a2a2a] rounded-sm overflow-hidden flex flex-col sm:flex-row">
              {/* text half */}
              <div className="p-4 text-[13px] leading-relaxed font-serif text-white/80 sm:w-1/2">
                <p className="whitespace-pre-line">
                  {support1?.summary ||
                    `Secretary of State Antony J. Blinken on Friday canceled a weekend
trip to Beijing after a Chinese spy balloon was sighted above Montana, igniting a frenzy of media coverage...`}
                </p>
              </div>

              {/* image half */}
              <div className="relative sm:w-1/2 min-h-[160px] bg-black">
                <img
                  src={support1?.image || FALLBACK_IMG}
                  alt={support1?.title || "supporting headline"}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/0" />
                <div className="relative p-4 flex flex-col justify-end h-full">
                  <h3 className="font-serif text-white font-semibold text-[15px] leading-snug">
                    {support1?.title ||
                      "Furor Over Chinese Spy Balloon Leads to a Diplomatic Crisis"}
                  </h3>
                </div>
              </div>
            </div>

            {/* bottom row (promo tile + greener airports) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* promo mini tile */}
              <div className="bg-[#2f4157] text-white rounded-sm border border-[#2a3345] flex flex-col justify-between p-4 sm:col-span-1 min-h-[140px]">
                <div className="font-serif font-bold text-[15px] leading-snug whitespace-pre-wrap">
                  {promoTile?.title || "Balloon’s\nJourney"}
                </div>
                <div className="mt-4 text-[11px] text-white/70 font-sans leading-relaxed">
                  {promoTile?.summary ||
                    "Track the path and timeline of the high-altitude balloon."}
                </div>
              </div>

              {/* airports story preview */}
              <div className="bg-[#f8f8f0] border border-[#d4d4c4] rounded-sm p-4 sm:col-span-2 flex flex-col">
                <h3 className="font-serif font-bold text-[16px] leading-snug text-[#1a1a1a]">
                  {support2?.title ||
                    "More Airports to Use Greener ‘Glide’ Approach to Landing"}
                </h3>

                <div className="mt-2 flex flex-wrap text-[11px] leading-none font-sans text-[#6d6d5a] gap-x-2 gap-y-1">
                  <span>By {support2?.author || "Ginny Dennis"}</span>
                  <span className="opacity-50">•</span>
                  <span>{support2?.datetime || "Feb. 4, 2025"}</span>
                </div>

                <div className="mt-3 border-t-2 border-[#2a6d61] pt-3 text-[13px] leading-relaxed font-serif text-[#2a6d61]">
                  {support2?.summary ||
                    "The FAA says new descent profiles will cut fuel burn, emissions and noise for communities under flight paths..."}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

///////////////////////////////////////
// Latest News cards
///////////////////////////////////////

function NewsImageCard({ article }) {
  return (
    <article className="bg-black border border-[#d4d4c4] rounded-sm overflow-hidden relative">
      <div className="relative min-h-[220px]">
        <img
          src={article.image || FALLBACK_IMG}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/0" />
        <div className="relative p-4 flex flex-col justify-end h-full">
          <h3 className="font-serif text-white text-[16px] leading-snug font-semibold">
            {article.title}
          </h3>

          <div className="mt-3 flex flex-wrap text-[11px] text-white/80 font-sans gap-x-2 gap-y-1">
            <span>By {article.author}</span>
            <span className="opacity-50">•</span>
            <span>{article.datetime}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function NewsTextCard({ article }) {
  return (
    <article className="bg-[#f8f8f0] border border-[#d4d4c4] rounded-sm p-4 flex flex-col">
      <h3 className="font-serif text-[20px] leading-snug font-bold text-[#1a1a1a]">
        {article.title}
      </h3>

      <div className="mt-2 flex flex-wrap text-[11px] leading-none font-sans text-[#6d6d5a] gap-x-2 gap-y-1">
        <span>By {article.author}</span>
        <span className="opacity-50">•</span>
        <span>{article.datetime}</span>
      </div>

      <div className="mt-3 border-t-2 border-[#2a6d61] pt-3">
        <p className="font-serif text-[14px] leading-relaxed text-[#2a6d61] whitespace-pre-line">
          {article.summary ||
            "Summary copy goes here. This is the dek/standfirst text in teal, like in the Figma."}
        </p>
      </div>
    </article>
  );
}

///////////////////////////////////////
// Trending Sidebar
///////////////////////////////////////

function TrendingItem({ article }) {
  return (
    <div className="py-4 flex flex-row gap-4">
      {/* thumbnail */}
      <div className="flex-shrink-0 w-[88px] h-[66px] bg-[#1f3f89] overflow-hidden border border-[#d4d4c4]">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-[#2a4f89]" />
        )}
      </div>

      {/* text */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="font-serif text-[15px] font-semibold text-[#1a1a1a] leading-snug">
          {article.title}
        </div>

        {article.summary && (
          <div className="mt-2 text-[13px] font-serif leading-snug text-[#2a6d61] line-clamp-3">
            {article.summary}
          </div>
        )}

        <div className="mt-2 flex flex-wrap justify-between text-[11px] leading-none font-sans text-[#6d6d5a] gap-x-2 gap-y-1">
          <span>By {article.author}</span>
          <span>{article.datetime}</span>
        </div>
      </div>
    </div>
  );
}

function TrendingSidebarWithData({ trending }) {
  return (
    <aside className="bg-[#efefe7] border border-[#d4d4c4] rounded-sm p-4 h-fit self-start">
      <div className="flex items-start justify-between">
        <h2 className="font-serif text-[18px] font-semibold text-[#1a1a1a] leading-tight">
          Trending Headlines
        </h2>
        <button className="bg-[#1a1a1a] text-white text-[11px] leading-none font-sans font-semibold uppercase tracking-wide rounded-sm px-2 py-1 hover:bg-black">
          View All
        </button>
      </div>

      <div className="mt-4 divide-y divide-[#d4d4c4]">
        {trending.map((article) => (
          <TrendingItem key={article.id} article={article} />
        ))}
      </div>
    </aside>
  );
}

///////////////////////////////////////
// Footer
///////////////////////////////////////

function SiteFooter() {
  return (
    <footer className="bg-[#0b0f0c] text-white font-sans text-[11px] leading-relaxed mt-12 border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="font-extrabold tracking-wider text-xl uppercase leading-none text-white">
          polynewsdaily
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-6 text-white/70">
          <div className="flex flex-col gap-2 min-w-[140px]">
            <div className="font-semibold uppercase tracking-wide text-[11px] text-white">
              Sections
            </div>
            <a className="hover:text-white" href="#">
              Politics
            </a>
            <a className="hover:text-white" href="#">
              World
            </a>
            <a className="hover:text-white" href="#">
              Climate
            </a>
            <a className="hover:text-white" href="#">
              Travel
            </a>
          </div>

          <div className="flex flex-col gap-2 min-w-[140px]">
            <div className="font-semibold uppercase tracking-wide text-[11px] text-white">
              Company
            </div>
            <a className="hover:text-white" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-white" href="#">
              Terms of Service
            </a>
            <a className="hover:text-white" href="#">
              Accessibility
            </a>
          </div>

          <div className="flex flex-col gap-2 min-w-[140px]">
            <div className="font-semibold uppercase tracking-wide text-[11px] text-white">
              © {new Date().getFullYear()} polynewsdaily
            </div>
            <div className="text-white/50">
              All rights reserved. Content provided for personal use only.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

///////////////////////////////////////
// Main page component (default export)
// This is what App.js will render.
///////////////////////////////////////

export default function HomePage({ data }) {
  const { topHeadlines, latestNews, trending } = data;

  return (
    <main className="bg-[#efefe7] text-[#1a1a1a] min-h-screen flex flex-col">
      <SiteHeader />
      <HeroSection topHeadlines={topHeadlines} />

      {/* Latest News + Trending */}
      <section className="bg-[#efefe7] text-[#1a1a1a] flex-1">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {/* Section heading */}
          <div className="flex items-end gap-4">
            <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] leading-tight">
              Latest News
            </h2>
            <div className="flex-1 border-b border-[#1a1a1a]" />
          </div>

          {/* Content grid: latest left, trending right */}
          <div className="mt-6 grid lg:grid-cols-[2fr_1fr] gap-6">
            {/* LEFT feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestNews.map((article) => {
                const hasImage = !!article.image;
                return hasImage ? (
                  <NewsImageCard key={article.id} article={article} />
                ) : (
                  <NewsTextCard key={article.id} article={article} />
                );
              })}

              {/* View More button */}
              <div className="md:col-span-2">
                <button className="text-[12px] font-semibold uppercase tracking-wide font-sans bg-[#1f3f34] text-white px-3 py-2 rounded-sm hover:bg-[#2f5a48]">
                  View More
                </button>
              </div>
            </div>

            {/* RIGHT trending sidebar */}
            <TrendingSidebarWithData trending={trending} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
