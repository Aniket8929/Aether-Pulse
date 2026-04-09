// Fallback/static data for when API fails

export const fallbackNews = [
  { id: 1, title: "Breaking: Major tech announcement expected today", thumbnail: null, category: "Technology", pubDate: new Date().toISOString(), link: "#", author: "News Desk", description: "Tech companies are preparing for a significant announcement." },
  { id: 2, title: "Global markets show strong momentum", thumbnail: null, category: "Finance", pubDate: new Date().toISOString(), link: "#", author: "Market Desk", description: "Markets across the world are showing positive momentum." },
];

export const fallbackTrending = [
  { title: "Technology sector reaches new highs", link: "#", views: "45.2K" },
  { title: "Climate summit concludes with agreements", link: "#", views: "32.1K" },
  { title: "Sports championship finals announced", link: "#", views: "28.8K" },
  { title: "Health officials announce new guidelines", link: "#", views: "21.5K" },
];

export const categories = [
  { name: "For You", icon: "✨" },
  { name: "Technology", icon: "💻" },
  { name: "Finance", icon: "📈" },
  { name: "Sports", icon: "⚽" },
  { name: "Science", icon: "🔬" },
  { name: "Health", icon: "💊" },
  { name: "World", icon: "🌍" },
];