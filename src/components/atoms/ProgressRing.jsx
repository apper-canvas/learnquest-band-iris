import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressRing = ({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8,
  color = "primary",
  className 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  const colors = {
    primary: "#FF6B6B",
    secondary: "#4ECDC4",
    accent: "#FFD93D",
    success: "#6BCF7F"
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-display text-gray-800">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default ProgressRing;