import { motion } from "framer-motion";

export function Logo({ size = 'default' }) {
  const sizes = {
    small: { icon: 18, text: 'text-lg' },
    default: { icon: 22, text: 'text-xl' },
    large: { icon: 26, text: 'text-2xl' }
  };

  const { icon, text } = sizes[size];

  return (
    <motion.div
      className="flex items-center gap-2.5"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Logo Icon - Pulse wave with glow */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl blur-md opacity-40" />
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
          <svg
            width={icon}
            height={icon}
            viewBox="0 0 24 24"
            fill="none"
            className="text-white"
          >
            {/* Pulse wave icon */}
            <path
              d="M3 12h4l3-9 4 18 3-9h4"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Logo Text */}
      <div className="flex items-baseline gap-0.5">
        <span className={`${text} font-bold tracking-tight text-white`}>
          Aether
        </span>
        <span className={`${text} font-bold tracking-tight`} style={{ color: '#ff6b35' }}>
          Pulse
        </span>
      </div>
    </motion.div>
  );
}

// Minimal icon-only logo for compact spaces
export function LogoIcon() {
  return (
    <motion.div
      className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center"
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="absolute inset-0 bg-orange-500 rounded-xl blur-md opacity-30" />
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="text-white relative z-10"
      >
        <path
          d="M3 12h4l3-9 4 18 3-9h4"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

export default Logo;