import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing Here Yet!", 
  message = "Start your learning adventure by choosing a challenge!",
  actionLabel = "Get Started",
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full p-8 mb-6">
        <ApperIcon name="Rocket" size={80} className="text-secondary" />
      </div>
      <h2 className="text-3xl font-display text-gray-800 mb-3">{title}</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">{message}</p>
      {onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          {actionLabel}
          <ApperIcon name="ArrowRight" size={20} className="ml-2" />
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;