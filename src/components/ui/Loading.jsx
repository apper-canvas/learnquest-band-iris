import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading your adventure..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-6"
      >
        <ApperIcon name="Sparkles" size={64} className="text-accent" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-700 text-center"
      >
        {message}
      </motion.p>
      <motion.div
        className="flex gap-2 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-primary rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loading;