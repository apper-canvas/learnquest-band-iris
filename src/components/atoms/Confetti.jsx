import { motion } from "framer-motion";

const Confetti = () => {
  const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6BCF7F", "#42A5F5"];
  const particles = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: -20
          }}
          animate={{
            y: [0, window.innerHeight + 20],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 360],
            opacity: [1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;