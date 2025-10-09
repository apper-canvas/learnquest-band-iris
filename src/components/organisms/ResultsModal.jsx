import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import StarDisplay from "@/components/molecules/StarDisplay";
import ApperIcon from "@/components/ApperIcon";
import Confetti from "@/components/atoms/Confetti";

const ResultsModal = ({ 
  totalStars, 
  correctAnswers, 
  totalChallenges, 
  onPlayAgain,
  subject 
}) => {
  const navigate = useNavigate();
  const percentage = Math.round((correctAnswers / totalChallenges) * 100);
  const isPerfect = correctAnswers === totalChallenges;

  const getMessage = () => {
    if (percentage === 100) return "Perfect Score! You're Amazing!";
    if (percentage >= 80) return "Fantastic Job! Keep It Up!";
    if (percentage >= 60) return "Great Work! You're Learning!";
    return "Nice Try! Practice Makes Perfect!";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      {isPerfect && <Confetti />}
      
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lift max-w-md w-full p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="bg-gradient-to-br from-accent to-yellow-400 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="Trophy" size={48} className="text-white" />
        </motion.div>

        <h2 className="text-3xl font-display text-gray-800 mb-2">
          {getMessage()}
        </h2>

        <div className="my-6">
          <StarDisplay count={Math.min(3, Math.ceil(totalStars / totalChallenges))} animated />
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Stars Earned:</span>
            <span className="text-2xl font-display text-accent">{totalStars}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Correct Answers:</span>
            <span className="text-2xl font-display text-success">{correctAnswers}/{totalChallenges}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Accuracy:</span>
            <span className="text-2xl font-display text-info">{percentage}%</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="primary" size="lg" className="w-full" onClick={onPlayAgain}>
            <ApperIcon name="Play" size={24} className="mr-2" />
            Play Again
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={() => navigate("/")}>
            <ApperIcon name="Home" size={24} className="mr-2" />
            Back to Home
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultsModal;