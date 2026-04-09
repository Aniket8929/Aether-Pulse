import { motion } from "framer-motion";
import { Logo } from "./Logo";

export default function FooterPulse() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Coverage: ["World", "Politics", "Tech", "Markets", "Science", "Culture"],
    Company: ["About", "Careers", "Press", "Contact", "Ethics"],
    Legal: ["Privacy", "Terms", "Cookies", "Accessibility"],
  };

  return (
    <footer className="relative mt-20 border-t border-white/5">
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 md:w-1/2 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 mb-12 sm:mb-16">
          
          {/* BRAND */}
          <div className="lg:col-span-4">
            <div className="mb-5">
              <Logo size="default" />
            </div>

            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
              What happened today — in depth. Premium journalism for the curious mind.
            </p>

            {/* SOCIAL */}
            <div className="flex items-center gap-3 flex-wrap">
              {["Twitter", "LinkedIn", "RSS"].map((label) => (
                <motion.a
                  key={label}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <span className="text-xs">{label[0]}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* LINKS */}
          {Object.entries(footerLinks).map(([title, links], idx) => (
            <motion.div
              key={title}
              className="sm:col-span-1 lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
            >
              <h4 className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                {title}
              </h4>

              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/50 text-sm hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-orange-500/0 group-hover:bg-orange-500/60 transition-all" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6 sm:mb-8" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
          
          {/* COPYRIGHT */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-white/40">
            <span className="text-white/60 font-medium">
              © {currentYear} AetherPulse
            </span>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>

          {/* STATUS */}
          <motion.div
            className="flex items-center gap-2 text-xs text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-500"
            />
            <span>All systems operational</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}