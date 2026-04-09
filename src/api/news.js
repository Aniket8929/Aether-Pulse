// News API service for fetching and formatting news data

const RSS_API_BASE = "https://api.rss2json.com/v1/api.json?rss_url=";

// Google News RSS feeds - using search queries for categories
const RSS_FEEDS = {
  "For You": "https://news.google.com/rss",
  "Technology": "https://news.google.com/rss/search?q=technology+tech&hl=en-US&gl=US&ceid=US:en",
  "Finance": "https://news.google.com/rss/search?q=stock+market+finance&hl=en-US&gl=US&ceid=US:en",
  "Sports": "https://news.google.com/rss/search?q=sports+football+cricket&hl=en-US&gl=US&ceid=US:en",
  "Science": "https://news.google.com/rss/search?q=science+research&hl=en-US&gl=US&ceid=US:en",
  "Politics": "https://news.google.com/rss/search?q=politics+government&hl=en-US&gl=US&ceid=US:en",
  "Health": "https://news.google.com/rss/search?q=health+medical&hl=en-US&gl=US&ceid=US:en",
  "India": "https://news.google.com/rss/search?q=india+indian&hl=en-US&gl=US&ceid=US:en",
  world: "https://news.google.com/rss/search?q=world+international&hl=en-US&gl=US&ceid=US:en",
};

// Format raw RSS item to our news format
export function formatNewsItem(item, index) {
  let thumbnail = item.thumbnail;

  // Extract image from description if no thumbnail
  if (!thumbnail && item.description) {
    const imgMatch = item.description.match(/<img[^>]+src="([^"]+)"/i);
    if (imgMatch) {
      thumbnail = imgMatch[1];
    }
  }

  // Fallback to enclosure image
  if (!thumbnail && item.enclosure?.link) {
    thumbnail = item.enclosure.link;
  }

  // Determine category from feed or title keywords
  let category = item.categories?.[0] || "General";

  // Try to detect category from title
  const titleLower = (item.title || "").toLowerCase();
  if (titleLower.includes("tech") || titleLower.includes("ai") || titleLower.includes("software")) {
    category = "Technology";
  } else if (titleLower.includes("stock") || titleLower.includes("market") || titleLower.includes("finance") || titleLower.includes("economy")) {
    category = "Finance";
  } else if (titleLower.includes("sport") || titleLower.includes("cricket") || titleLower.includes("football") || titleLower.includes("match")) {
    category = "Sports";
  } else if (titleLower.includes("science") || titleLower.includes("research") || titleLower.includes("study")) {
    category = "Science";
  } else if (titleLower.includes("politics") || titleLower.includes("government") || titleLower.includes("election")) {
    category = "Politics";
  } else if (titleLower.includes("health") || titleLower.includes("medical") || titleLower.includes("disease")) {
    category = "Health";
  } else if (titleLower.includes("india") || titleLower.includes("indian")) {
    category = "India";
  }

  return {
    id: index + 1,
    title: item.title?.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") || "Untitled",
    thumbnail,
    category,
    pubDate: item.pubDate,
    link: item.link,
    author: item.author || "News Desk",
    description: item.description?.replace(/<[^>]*>/g, "").slice(0, 200) || "",
  };
}

// Fetch news from specific category
export async function fetchNews(category = "For You") {
  const feedUrl = RSS_FEEDS[category] || RSS_FEEDS["For You"];
  const apiUrl = `${RSS_API_BASE}${encodeURIComponent(feedUrl)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error("Invalid API response");
    }

    return {
      success: true,
      items: data.items.map((item, index) => formatNewsItem(item, index)),
      feed: data.feed,
    };
  } catch (error) {
    console.error("News fetch error:", error);
    return {
      success: false,
      error: error.message,
      items: [],
      feed: null,
    };
  }
}

// Fetch multiple categories in parallel
export async function fetchAllCategories() {
  const results = {};

  try {
    const promises = Object.entries(RSS_FEEDS).map(async ([key, url]) => {
      const apiUrl = `${RSS_API_BASE}${encodeURIComponent(url)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      return [key, {
        success: data.status === "ok",
        items: data.status === "ok" ? data.items.map((item, index) => formatNewsItem(item, index)) : [],
      }];
    });

    const pairs = await Promise.all(promises);
    pairs.forEach(([key, value]) => {
      results[key] = value;
    });
  } catch (error) {
    console.error("Fetch all categories error:", error);
  }

  return results;
}

// Get trending news (sorted by pubDate)
export async function fetchTrending() {
  const result = await fetchNews("For You");
  if (result.success) {
    return result.items.slice(0, 8);
  }
  return [];
}

// Get relative time string
export function getRelativeTime(dateString) {
  if (!dateString) return "Just now";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}