import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ChallengeCard from "@/components/organisms/ChallengeCard";
import ResultsModal from "@/components/organisms/ResultsModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import challengeService from "@/services/api/challengeService";
import progressService from "@/services/api/progressService";
import sessionService from "@/services/api/sessionService";

const ChallengePage = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  
  const [challenges, setChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [sessionStart] = useState(Date.now());

  const loadChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await challengeService.getRandomByType(subject, 5);
      if (data.length === 0) {
        setError("No challenges available for this subject.");
      } else {
        setChallenges(data);
      }
    } catch (err) {
      setError(err.message || "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [subject]);

  const handleChallengeComplete = async (stars, correct) => {
    setTotalStars((prev) => prev + stars);
    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
    }

    if (currentIndex < challenges.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 1600);
    } else {
      setTimeout(async () => {
        await progressService.updateStars(totalStars + stars);
        
        const duration = Math.floor((Date.now() - sessionStart) / 1000);
        await sessionService.create({
          subject,
          challengesCompleted: challenges.length,
          starsEarned: totalStars + stars,
          accuracy: Math.round(((correctAnswers + (correct ? 1 : 0)) / challenges.length) * 100),
          duration
        });

        setShowResults(true);
      }, 1600);
    }
  };

  const handlePlayAgain = () => {
    setCurrentIndex(0);
    setTotalStars(0);
    setCorrectAnswers(0);
    setShowResults(false);
    loadChallenges();
  };

  if (loading) return <Loading message="Loading challenges..." />;
  if (error) return <Error message={error} onRetry={loadChallenges} />;

  const currentChallenge = challenges[currentIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!showResults && currentChallenge && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <ChallengeCard
              challenge={currentChallenge}
              onComplete={handleChallengeComplete}
              challengeNumber={currentIndex + 1}
              totalChallenges={challenges.length}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showResults && (
        <ResultsModal
          totalStars={totalStars}
          correctAnswers={correctAnswers}
          totalChallenges={challenges.length}
          onPlayAgain={handlePlayAgain}
          subject={subject}
        />
      )}
    </div>
  );
};

export default ChallengePage;