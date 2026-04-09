import { motion } from "framer-motion";

const TICKER_ITEMS = [
  "Global AI Summit reaches historic accord on safety standards",
  "Markets surge 2.3% on strong tech earnings — Nasdaq hits all-time high",
  "Climate talks: 40 nations pledge net-zero by 2040",
  "SpaceX Starship completes first crewed lunar flyby mission",
  "Champions League: Real Madrid defeat Bayern 3-1 in dramatic semi-final",
];

export default function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600">
      {/* Subtle glow overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex items-center h-11">
        {/* LIVE Badge */}
        <div className="shrink-0 flex items-center gap-2.5 px-4 py-1 bg-black/20 backdrop-blur-sm z-10 h-full">
          <motion.span
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50"
          />
          <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">
            Live
          </span>
        </div>

        {/* Scrolling content */}
        <div className="overflow-hidden flex-1 h-full flex items-center">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 35,
              repeat: Infinity,
            }}
          >
            {doubled.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center text-white text-[12px] font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 mr-5 shrink-0" />
                {item}
                <span className="mx-8 text-white/30">|</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Gradient fade edges */}
      <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-orange-600 to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-orange-600 to-transparent pointer-events-none" />

      {/* Top/bottom subtle lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
    </div>
  );
}