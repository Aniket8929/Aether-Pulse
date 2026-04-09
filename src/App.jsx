import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, ChevronRight, Menu, X, Sparkles, LayoutGrid, Rows3, TrendingUp, Clock, Bookmark, Globe, Cpu, Trophy, Atom, Heart, Settings, ExternalLink, Loader2 } from "lucide-react";
import SwipeCards from "./components/SwipeCards";
import Ticker from "./components/Ticker";
import FooterPulse from "./components/footerPulse";
import { Logo } from "./components/Logo";
import { fetchNews } from "./api/news";
import "./index.css";

// ============ ICONS ============
const icons = { Globe, Cpu, Trophy, Atom, Heart, Settings };

// ============ CATEGORIES ============
const CATEGORIES = [
  { name: "For You", icon: "✨" },
  { name: "Technology", icon: "💻" },
  { name: "Finance", icon: "📈" },
  { name: "Sports", icon: "⚽" },
  { name: "Science", icon: "🔬" },
  { name: "Politics", icon: "🏛️" },
  { name: "Health", icon: "💊" },
  { name: "India", icon: "🇮🇳" },
];

// ============ GLASSMORPHIC NAVBAR ============
function Navbar({ onMenuToggle }) {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 glass border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onMenuToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Menu size={18} />
            </motion.button>

            <Logo size="small" />
          </div>

          <div className="hidden sm:flex flex-1 max-w-md mx-6">
            <div className="relative w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl group-hover:border-white/20 transition-colors">
                <Search size={16} className="text-white/40" />
                <input
                  type="text"
                  placeholder="Search news..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                />
                <kbd className="hidden md:flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/30">
                  <span>⌘</span>
                  <span>K</span>
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 p-1 bg-white/5 rounded-lg">
              <button className="p-2 rounded-md bg-white/10 text-white">
                <LayoutGrid size={16} />
              </button>
              <button className="p-2 rounded-md text-white/40 hover:text-white hover:bg-white/5">
                <Rows3 size={16} />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-[#0b0b12]" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

// ============ CATEGORY TABS ============
function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  const scrollRef = useRef(null);

  return (
    <div className="relative ">
      <div
        ref={scrollRef}
        className="flex items-center gap-2 px-4 sm:px-6 py-3 overflow-x-auto scrollbar-hide"
      >
        {categories.map((cat, index) => {
          const isActive = activeCategory === cat.name;
          return (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onCategoryChange(cat.name)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${isActive
                  ? "bg-white text-black shadow-lg shadow-white/20"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                }
              `}
            >
              <span className="flex items-center gap-1.5">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[#0b0b12] to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#0b0b12] to-transparent pointer-events-none" />
    </div>
  );
}

// ============ NEWS CARD (GRID MODE) ============
function NewsCard({ item, index, onRead }) {
  const isLarge = index % 5 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onRead(item)}
      className={`
        group relative rounded-3xl overflow-hidden cursor-pointer
        ${isLarge ? "col-span-2 row-span-2" : ""} ${index % 2 === 0 ? "aspect-[4/3]" : "aspect-square"}
      `}
    >
      <div className="absolute inset-0">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="inline-block w-fit px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-white/80 text-[10px] font-semibold uppercase tracking-wider mb-3"
        >
          {item.category || "News"}
        </motion.span>

        <h3 className={`
          text-white font-bold leading-tight tracking-tight text-balance
          ${isLarge ? "text-2xl md:text-3xl" : "text-base md:text-lg"}
        `}>
          {item.title}
        </h3>

        <div className="flex items-center gap-2 mt-3 text-white/50 text-xs">
          <Clock size={12} />
          <span>{item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Just now"}</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-orange-400 transition-colors"
      >
        <Bookmark size={16} />
      </motion.button>
    </motion.div>
  );
}

// ============ TRENDING SECTION ============
function TrendingSection({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 mt-10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/20">
          <TrendingUp size={16} className="text-orange-400" />
        </div>
        <h2 className="text-white font-bold tracking-tight">Trending Now</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.slice(0, 4).map((item, index) => (
          <motion.a
            key={item.link || index}
            href={item.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-white/10 transition-all duration-200 group"
          >
            <span className="text-2xl font-bold text-white/10 group-hover:text-orange-500/50 transition-colors">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-sm font-medium line-clamp-2 group-hover:text-white transition-colors">
                {item.title}
              </p>
              <span className="text-white/30 text-xs mt-1 inline-block">
                {item.views || "10K views"}
              </span>
            </div>

            <ExternalLink size={14} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all shrink-0" />
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}

// ============ MOBILE NAVIGATION ============
function MobileNav({ isOpen, onClose }) {
  const navItems = [
    { name: "For You", icon: Sparkles, active: true },
    { name: "World", icon: Globe, active: false },
    { name: "Technology", icon: Cpu, active: false },
    { name: "Finance", icon: TrendingUp, active: false },
    { name: "Sports", icon: Trophy, active: false },
    { name: "Science", icon: Atom, active: false },
    { name: "Health", icon: Heart, active: false },
    { name: "Settings", icon: Settings, active: false },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#0b0b12]/95 backdrop-blur-xl border-r border-white/10 z-50"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <Logo size="small" />
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href="#"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${item.active
                      ? "bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-white border border-orange-500/20"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <item.icon size={18} className={item.active ? "text-orange-400" : ""} />
                  {item.name}
                </motion.a>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                  J
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Jerry</p>
                  <p className="text-white/40 text-xs">Premium Member</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============ MODE TOGGLE ============
function ModeToggle({ mode, onModeChange }) {
  return (
    <div className="flex items-center gap-2 px-1 py-1 bg-white/5 rounded-xl">
      <button
        onClick={() => onModeChange("swipe")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          mode === "swipe"
            ? "bg-white text-black"
            : "text-white/50 hover:text-white"
        }`}
      >
        <LayoutGrid size={16} />
        <span className="hidden sm:inline">Swipe</span>
      </button>
      <button
        onClick={() => onModeChange("grid")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          mode === "grid"
            ? "bg-white text-black"
            : "text-white/50 hover:text-white"
        }`}
      >
        <Rows3 size={16} />
        <span className="hidden sm:inline">Grid</span>
      </button>
    </div>
  );
}

// ============ LOADING SKELETON ============
function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      <div className="grid grid-cols-2 gap-3 md:gap-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`rounded-3xl bg-[#12121c] animate-pulse ${
              i % 5 === 0 ? "col-span-2 row-span-2 aspect-square" : i % 2 === 0 ? "aspect-[4/3]" : "aspect-square"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ============ ERROR STATE ============
function ErrorState({ onRetry }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/10 flex items-center justify-center">
        <Globe className="w-10 h-10 text-rose-400/60" />
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">Unable to load news</h3>
      <p className="text-white/40 text-sm mb-6">Please check your connection and try again.</p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
      >
        Retry
      </button>
    </div>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [activeCategory, setActiveCategory] = useState("For You");
  const [newsByCategory, setNewsByCategory] = useState({});
  const [currentNews, setCurrentNews] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newsMode, setNewsMode] = useState("grid");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(false);

  // Fetch news for a specific category
  const loadCategoryNews = useCallback(async (category) => {
    setLoadingCategory(true);
    const result = await fetchNews(category);

    if (result.success) {
      setNewsByCategory(prev => ({
        ...prev,
        [category]: result.items
      }));

      if (category === "For You") {
        setTrending(result.items.slice(0, 8));
      }
    }

    setLoadingCategory(false);
    return result;
  }, []);

  // Initial load and category change handler
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);

      const result = await loadCategoryNews(activeCategory);

      if (!result.success) {
        setError(result.error);
      } else {
        setCurrentNews(newsByCategory[activeCategory] || result.items);
      }

      setLoading(false);
    };

    loadNews();
  }, []);

  // When category changes, load that category's news
  useEffect(() => {
    const loadCategory = async () => {
      // Check if we already have this category's news cached
      if (newsByCategory[activeCategory]) {
        setCurrentNews(newsByCategory[activeCategory]);
        return;
      }

      setLoadingCategory(true);
      const result = await loadCategoryNews(activeCategory);

      if (result.success) {
        setCurrentNews(newsByCategory[activeCategory] || result.items);
      }

      setLoadingCategory(false);
    };

    loadCategory();
  }, [activeCategory, loadCategoryNews, newsByCategory]);

  const handleReadStory = useCallback((item) => {
    if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">
      <Ticker />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="pb-8">
        <Navbar onMenuToggle={() => setMobileNavOpen(true)} />

        <div className="sticky top-16 z-40 bg-[#0b0b12]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-4 sm:px-6 py-2 max-w-7xl mx-auto">
            <CategoryTabs
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <div className="shrink-0 ml-2">
              <ModeToggle mode={newsMode} onModeChange={setNewsMode} />
            </div>
          </div>
        </div>

        <main className="animate-fade-in">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState onRetry={() => loadCategoryNews(activeCategory)} />
          ) : (
            <>
              {loadingCategory && currentNews.length === 0 ? (
                <LoadingSkeleton />
              ) : newsMode === "swipe" ? (
                <SwipeCards news={currentNews} />
              ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
                  <div className="grid grid-cols-2 gap-3 md:gap-5">
                    {currentNews.map((item, index) => (
                      <NewsCard
                        key={item.id || index}
                        item={item}
                        index={index}
                        onRead={handleReadStory}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!loadingCategory && (
                <TrendingSection items={trending} />
              )}
            </>
          )}
        </main>

        <FooterPulse />
      </div>
    </div>
  );
}