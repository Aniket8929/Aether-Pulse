import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useDragControls } from "framer-motion";

// ============ CONSTANTS ============
const SWIPE_THRESHOLD = 100;
const CARD_BORDER_RADIUS = "1.5rem";

// ============ CATEGORY GRADIENT MAP ============
const categoryGradients = {
  Technology: "from-violet-600 via-purple-600 to-indigo-700",
  Finance: "from-emerald-600 via-teal-600 to-cyan-700",
  Sports: "from-orange-500 via-red-500 to-rose-600",
  Science: "from-cyan-500 via-blue-600 to-violet-700",
  Politics: "from-red-600 via-rose-600 to-pink-700",
  Health: "from-pink-500 via-rose-500 to-red-600",
  India: "from-amber-500 via-orange-500 to-yellow-600",
  World: "from-violet-600 via-purple-600 to-fuchsia-700",
  Markets: "from-emerald-500 via-green-600 to-teal-600",
  Culture: "from-fuchsia-500 via-pink-500 to-rose-600",
  default: "from-slate-700 via-slate-600 to-slate-800"
};

// ============ SWIPE INDICATOR ============
function SwipeIndicator({ x, type }) {
  const opacity = useTransform(
    x,
    type === "right" ? [0, SWIPE_THRESHOLD] : [-SWIPE_THRESHOLD, 0],
    [0, 1]
  );

  const bgColor = type === "right"
    ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/40"
    : "bg-gradient-to-l from-rose-500/20 to-rose-500/40";

  const borderColor = type === "right" ? "border-emerald-400" : "border-rose-400";

  return (
    <motion.div
      className={`absolute top-8 ${type === "right" ? "left-6" : "right-6"} px-5 py-2.5 ${bgColor} ${borderColor} border-2 rounded-2xl backdrop-blur-sm`}
      style={{ opacity }}
    >
      <span className={`font-bold text-sm ${type === "right" ? "text-emerald-300" : "text-rose-300"}`}>
        {type === "right" ? "SAVE" : "SKIP"}
      </span>
    </motion.div>
  );
}

// ============ 3D SWIPEABLE CARD ============
function SwipeableCard({ card, onSwipe, isActive }) {
  const x = useMotionValue(0);
  const dragControls = useDragControls();

  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18]);
  const scale = useTransform(x, [-200, 0, 200], [0.92, 1, 0.92]);

  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (!isActive) return;
    const offsetX = info.offset.x;
    if (offsetX > SWIPE_THRESHOLD) {
      onSwipe("right", card);
    } else if (offsetX < -SWIPE_THRESHOLD) {
      onSwipe("left", card);
    }
  };

  const gradientClass = categoryGradients[card.category] || categoryGradients.default;

  return (
    <motion.div
      className="w-full cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        scale,
      }}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`relative rounded-[1.75rem] overflow-hidden bg-gradient-to-br ${gradientClass}`}
        style={{
          boxShadow: useTransform(
            x,
            [-200, 0, 200],
            [
              "0 25px 50px -12px rgba(239, 68, 68, 0.35)",
              "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              "0 25px 50px -12px rgba(34, 197, 94, 0.35)"
            ]
          )
        }}
      >
        {/* Image container */}
        <div className="relative aspect-[4/3.5]">
          {card.thumbnail ? (
            <img
              src={card.thumbnail}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800/80 to-slate-900" />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Swipe indicators */}
          {isActive && (
            <>
              <SwipeIndicator x={x} type="right" />
              <SwipeIndicator x={x} type="left" />
            </>
          )}

          {/* Category badge */}
          <motion.div
            className="absolute top-5 left-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white/90 text-[11px] font-semibold tracking-wide uppercase">
              {card.category || "General"}
            </span>
          </motion.div>
        </div>

        {/* Content area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
          {/* Headline */}
          <motion.h2
            className="text-white text-2xl font-bold leading-tight tracking-tight mb-3 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {card.title || card.headline}
          </motion.h2>

          {/* Description */}
          {card.description && (
            <motion.p
              className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {card.description}
            </motion.p>
          )}

          {/* Meta info */}
          <motion.div
            className="flex items-center gap-3 text-white/50 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <span className="font-medium text-white/70">
              {card.author || "News Desk"}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>
              {card.pubDate
                ? new Date(card.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : "Just now"
              }
            </span>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}

// ============ ACTION BUTTONS ============
function ActionButtons({ onSwipe, canUndo }) {
  const buttons = [
    {
      id: "left",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: "rose",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      text: "text-rose-400",
      action: () => onSwipe("left"),
    },
    {
      id: "undo",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 0 1 0 10H9m0 0l-3-3m3 3l-3 3" />
        </svg>
      ),
      color: "white",
      bg: "bg-white/5",
      border: "border-white/20",
      text: "text-white/60",
      action: () => onSwipe("undo"),
      disabled: !canUndo,
    },
    {
      id: "right",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: "emerald",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      action: () => onSwipe("right"),
    },
  ];

  return (
    <div className="flex items-center justify-center gap-5">
      {buttons.map((btn) => (
        <motion.button
          key={btn.id}
          onClick={btn.action}
          disabled={btn.disabled}
          whileHover={{ scale: btn.disabled ? 1 : 1.1 }}
          whileTap={{ scale: btn.disabled ? 1 : 0.9 }}
          className={`
            w-14 h-14 rounded-2xl border flex items-center justify-center
            transition-all duration-200 backdrop-blur-sm
            ${btn.bg} ${btn.border} ${btn.text}
            ${btn.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-white/15"}
          `}
        >
          {btn.icon}
        </motion.button>
      ))}
    </div>
  );
}

// ============ EMPTY STATE ============
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full rounded-3xl bg-[#12121c] p-12 text-center border border-white/5"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
        <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">You're all caught up</h3>
      <p className="text-white/40 text-sm mb-6">You've seen all the latest news in this category.</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
      >
        Refresh Feed
      </button>
    </motion.div>
  );
}

// ============ LOADING SKELETON ============
function LoadingSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="rounded-[1.75rem] overflow-hidden bg-[#12121c] animate-pulse">
        <div className="aspect-[4/3.5] bg-gradient-to-br from-slate-800 to-slate-900" />
        <div className="p-6 space-y-4">
          <div className="h-4 w-24 bg-white/5 rounded-full" />
          <div className="space-y-2">
            <div className="h-7 bg-white/5 rounded-lg" />
            <div className="h-7 bg-white/5 rounded-lg w-3/4" />
          </div>
          <div className="h-4 bg-white/5 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

// ============ MAIN SWIPE CARDS ============
export default function SwipeCards({ news = [], isLoading = false }) {
  const [cards, setCards] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (news.length > 0) {
      setCards(news);
      setHistory([]);
    }
  }, [news]);

  const handleSwipe = useCallback((direction, card) => {
    if (direction === "undo") {
      if (history.length === 0) return;
      const last = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setCards(c => [last.card, ...c]);
      return;
    }

    if (card) {
      setHistory(h => [...h, { card, direction }].slice(-5));
      setCards(c => c.slice(1));
    }
  }, [history]);

  if (isLoading) {
    return (
      <div className="py-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="py-4">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-semibold tracking-tight">For You</h2>
        <div className="flex items-center gap-2">
          <motion.span
            key={cards.length}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-white/40 text-xs font-medium"
          >
            {cards.length} remaining
          </motion.span>
        </div>
      </div>

      {/* Cards stack */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={cards[0].id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <SwipeableCard
              card={cards[0]}
              onSwipe={handleSwipe}
              isActive={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ActionButtons
          onSwipe={(dir) => handleSwipe(dir, cards[0])}
          canUndo={history.length > 0}
        />
      </motion.div>

      {/* Hint text */}
      <motion.p
        className="text-center text-white/25 text-xs mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Swipe right to save • Swipe left to skip
      </motion.p>
    </div>
  );
}