import React from "react";
import HomePage from "./components/homepage";

const mockData = {
  topHeadlines: [
    {
      id: 1,
      title:
        "Democrats Overhaul Party’s Primary Calendar, Upending a Political Tradition",
      author: "Ginny Dennis",
      datetime: "Just now",
      image:
        "https://images.unsplash.com/photo-1575320181282-d5b1fcd4a1a9?auto=format&fit=crop&w=1000&q=80", // politician at podium vibe
      summary:
        "Philippines Clash Is Worst Enough to Take on the World. A deeply divided electorate faces a pivotal moment.",
    },
    {
      id: 2,
      title:
        "Furor Over Chinese Spy Balloon Leads to a Diplomatic Crisis",
      author: "Ginny Dennis",
      datetime: "Feb. 5, 2025",
      image:
        "https://images.unsplash.com/photo-1581091215367-5c8a5d6e0f53?auto=format&fit=crop&w=800&q=80", // tech surveillance vibe
      summary:
        "Secretary of State Antony J. Blinken on Friday canceled a weekend trip to Beijing after a high-altitude object was detected over U.S. airspace...",
    },
    {
      id: 3,
      title: "Balloon’s Journey",
      author: "Staff",
      datetime: "Feb. 5, 2025",
      summary:
        "Track the path and timeline of events surrounding the high-altitude balloon.",
    },
    {
      id: 4,
      title:
        "More Airports to Use Greener ‘Glide’ Approach to Landing",
      author: "Ginny Dennis",
      datetime: "Feb. 4, 2025",
      summary:
        "The FAA says new descent profiles will cut fuel burn, emissions and noise for communities under flight paths, starting with 11 new airports.",
    },
  ],

  latestNews: [
    {
      id: "ln1",
      title:
        "Pervez Musharraf, Former Military Ruler of Pakistan, Dies at 79",
      author: "Ginny Dennis",
      datetime: "Feb. 4, 2025",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", // uniforms / officials
    },
    {
      id: "ln2",
      title:
        "Fears mount around ‘catastrophic’ abortion pills case as decision nears",
      author: "Ginny Dennis",
      datetime: "Feb. 4, 2025",
      image:
        "https://images.unsplash.com/photo-1601339672018-066faccdc7ef?auto=format&fit=crop&w=800&q=80", // protest crowd
    },
    {
      id: "ln3",
      title:
        "More Airports to Use Greener ‘Glide’ Approach to Landing",
      author: "Ginny Dennis",
      datetime: "Feb. 4, 2025",
      summary:
        "Eleven more U.S. airports plan to adopt a new way of landing planes that reduces both emissions and noise — all by having incoming planes idle engines and glide in like a paraglider.\n\nThe FAA announced Monday...",
    },
    {
      id: "ln4",
      title:
        "Oil prices slip again as specter of trade war, demand concerns haunt market",
      author: "Ginny Dennis",
      datetime: "Feb. 4, 2025",
      image:
        "https://images.unsplash.com/photo-1581094478731-9237b1b5c24f?auto=format&fit=crop&w=800&q=80", // industrial / oil rig vibe
    },
  ],

  trending: [
    {
      id: "tr1",
      title:
        "U.S. downs suspected Chinese spy balloon over the Atlantic coast",
      author: "Caleb Hotchill",
      datetime: "Feb. 5, 2025",
      image:
        "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=400&q=80", // sky / balloon-ish
      summary:
        'China called the vessel’s downing “an excessive reaction” and said it “seriously violated the spirit of international practice.”',
    },
    {
      id: "tr2",
      title:
        "Mystery Portrait May Be a Raphael, Artificial Intelligence Suggests",
      author: "Allyn Oprisha",
      datetime: "Feb. 5, 2025",
      image:
        "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=400&q=80", // classical art / painting style
      summary:
        "A newly analyzed portrait of the Virgin Mary and Jesus may have been painted by Raphael, researchers using A.I. say.",
    },
    {
      id: "tr3",
      title:
        "NASA and DARPA preview nuclear rocket that could cut Mars travel time",
      author: "Staff",
      datetime: "Feb. 5, 2025",
      image:
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80", // space / planet
      summary:
        "The demo engine could enable faster crewed missions and more flexible deep-space operations, program managers said.",
    },
  ],
};

export default function App() {
  return <HomePage data={mockData} />;
}
