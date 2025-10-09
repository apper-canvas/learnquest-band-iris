import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressBar = ({ current, total, color = "primary", className }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  const colors = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent",
    success: "bg-success"
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">
          {current} of {total}
        </span>
        <span className="text-sm font-semibold text-gray-700">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;