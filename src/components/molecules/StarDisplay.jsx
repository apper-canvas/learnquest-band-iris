import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StarDisplay = ({ count = 0, maxStars = 3, size = 32, animated = false }) => {
  return (
    <div className="flex gap-2">
      {[...Array(maxStars)].map((_, index) => {
        const filled = index < count;
        return (
          <motion.div
            key={index}
            initial={animated ? { scale: 0, rotate: -180 } : {}}
            animate={animated ? { scale: 1, rotate: 0 } : {}}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
          >
            <ApperIcon
              name="Star"
              size={size}
              className={filled ? "text-accent" : "text-gray-300"}
              fill={filled ? "currentColor" : "none"}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StarDisplay;