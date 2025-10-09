import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Oops! Something went wrong.", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="bg-red-100 rounded-full p-6 mb-6">
        <ApperIcon name="AlertCircle" size={64} className="text-error" />
      </div>
      <h2 className="text-2xl font-display text-gray-800 mb-3">Uh Oh!</h2>
      <p className="text-lg text-gray-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="lg">
          <ApperIcon name="RefreshCw" size={20} className="mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;