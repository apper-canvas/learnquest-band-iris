import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ChallengeCard from "@/components/organisms/ChallengeCard";
import ResultsModal from "@/components/organisms/ResultsModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import challengeService from "@/services/api/challengeService";
import progressService from "@/services/api/progressService";
import sessionService from "@/services/api/sessionService";
import achievementService from "@/services/api/achievementService";

const ChallengePage = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [challenges, setChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [bonusStars, setBonusStars] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [sessionStart] = useState(Date.now());
  const [challengeTimes, setChallengeTimes] = useState([]);
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [achievements, setAchievements] = useState([]);
  
  // Check if this is a timed challenge mode
  const isTimedMode = location.pathname.includes('/timed');
const loadChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we should show mode selection first
      if (!isTimedMode && location.pathname === `/challenges/${subject}`) {
        setShowModeSelect(true);
        setLoading(false);
        return;
      }
      
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
  }, [subject, location.pathname]);
const handleChallengeComplete = async (stars, correct, completionTime = null) => {
    let finalStars = stars;
    let timeBonus = 0;
    
    // Calculate time-based bonus for timed mode
    if (isTimedMode && completionTime !== null) {
      timeBonus = achievementService.calculateBonusStars(completionTime, 30);
      finalStars += timeBonus;
      setBonusStars(prev => prev + timeBonus);
      
      // Track completion time
      setChallengeTimes(prev => [...prev, completionTime]);
    }
    
    setTotalStars((prev) => prev + finalStars);
    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
    }

    if (currentIndex < challenges.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 1600);
    } else {
      setTimeout(async () => {
        const finalTotalStars = totalStars + finalStars;
        await progressService.updateStars(finalTotalStars);
        
        const duration = Math.floor((Date.now() - sessionStart) / 1000);
        const accuracy = Math.round(((correctAnswers + (correct ? 1 : 0)) / challenges.length) * 100);
        const averageTime = isTimedMode && challengeTimes.length > 0 
          ? [...challengeTimes, completionTime].reduce((a, b) => a + b, 0) / (challengeTimes.length + 1)
          : null;
        
        await sessionService.create({
          subject,
          challengesCompleted: challenges.length,
          starsEarned: finalTotalStars,
          accuracy,
          duration,
          isTimed: isTimedMode,
          averageTime,
          bonusStars: isTimedMode ? bonusStars + timeBonus : 0
        });

        // Check for new achievements
        if (isTimedMode) {
          const sessionData = {
            averageTime,
            accuracy,
            isTimed: true
          };
          const newAchievements = await achievementService.checkAchievements(sessionData);
          setAchievements(newAchievements);
          
          if (newAchievements.length > 0) {
            const achievementBonus = newAchievements.reduce((total, ach) => total + ach.bonusStars, 0);
            await progressService.updateStars(achievementBonus);
            toast.success(`🏆 Unlocked ${newAchievements.length} achievement${newAchievements.length > 1 ? 's' : ''}!`);
          }
        }

        setShowResults(true);
      }, 1600);
    }
  };

const handlePlayAgain = () => {
    setCurrentIndex(0);
    setTotalStars(0);
    setBonusStars(0);
    setCorrectAnswers(0);
    setShowResults(false);
    setChallengeTimes([]);
    setAchievements([]);
    loadChallenges();
  };
  
  const handleModeSelect = (timed = false) => {
    setShowModeSelect(false);
    if (timed) {
      navigate(`/challenges/${subject}/timed`);
    } else {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading challenges..." />;
  if (error) return <Error message={error} onRetry={loadChallenges} />;

  const currentChallenge = challenges[currentIndex];

return (
    <div className="max-w-4xl mx-auto">
      {showModeSelect && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 py-12"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-display text-gray-800">
              Choose Challenge Mode
            </h2>
            <p className="text-gray-600 text-lg">
              Select how you'd like to practice {subject}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface rounded-2xl p-6 shadow-card cursor-pointer border-2 border-transparent hover:border-primary/20"
              onClick={() => handleModeSelect(false)}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-xl font-display text-gray-800">Regular Mode</h3>
                <p className="text-gray-600">Take your time and learn at your own pace</p>
                <Button variant="outline" className="w-full">
                  Start Regular Challenge
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface rounded-2xl p-6 shadow-card cursor-pointer border-2 border-transparent hover:border-accent/20"
              onClick={() => handleModeSelect(true)}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-xl font-display text-gray-800">Timed Mode</h3>
                <p className="text-gray-600">Race against time for bonus stars and achievements</p>
                <Button variant="primary" className="w-full">
                  Start Timed Challenge
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      <AnimatePresence mode="wait">
        {!showResults && !showModeSelect && currentChallenge && (
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
              isTimedMode={isTimedMode}
              timerDuration={30}
            />
          </motion.div>
        )}
      </AnimatePresence>

{showResults && (
        <ResultsModal
          totalStars={totalStars}
          bonusStars={bonusStars}
          correctAnswers={correctAnswers}
          totalChallenges={challenges.length}
          onPlayAgain={handlePlayAgain}
          subject={subject}
          isTimedMode={isTimedMode}
          averageTime={challengeTimes.length > 0 ? challengeTimes.reduce((a, b) => a + b, 0) / challengeTimes.length : null}
          achievements={achievements}
        />
      )}
    </div>
  );
};

export default ChallengePage;