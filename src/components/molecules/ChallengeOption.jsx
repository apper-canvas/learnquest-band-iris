import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ChallengeOption = ({ 
  option, 
  isSelected, 
  isCorrect, 
  isWrong, 
  onClick, 
  disabled 
}) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full p-5 rounded-2xl text-lg font-semibold transition-all duration-200 border-3",
        !isSelected && !isCorrect && !isWrong && "bg-white border-gray-200 hover:border-primary hover:bg-primary/5",
        isSelected && !isCorrect && !isWrong && "bg-primary/10 border-primary",
        isCorrect && "bg-success/10 border-success text-success",
        isWrong && "bg-error/10 border-error text-error",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      {option}
    </motion.button>
  );
};

export default ChallengeOption;