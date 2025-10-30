import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Timer from "@/components/atoms/Timer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { miniGameService } from "@/services/api/miniGameService";

const MonsterMathGame = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [monsterHp, setMonsterHp] = useState(100);
  const [playerScore, setPlayerScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await miniGameService.getMonsterMathProblems();
      if (data.length === 0) {
        setError("No problems available for Monster Math.");
      } else {
        setProblems(data);
      }
    } catch (err) {
      setError(err.message || "Failed to load Monster Math problems");
    } finally {
      setLoading(false);
    }
  };

  const currentProblem = problems[currentIndex];

  const handleSubmit = () => {
    if (!selectedAnswer || isSubmitted) return;
    
    setIsSubmitted(true);
    const correct = selectedAnswer === currentProblem.correctAnswer;

    if (correct) {
      const damage = 20;
      const newHp = Math.max(0, monsterHp - damage);
      setMonsterHp(newHp);
      setPlayerScore(playerScore + 10);
      toast.success("Hit! Monster takes damage!");

      if (newHp === 0) {
        setTimeout(() => {
          setGameOver(true);
          setIsVictory(true);
        }, 1500);
        return;
      }
    } else {
      toast.error("Miss! Monster still standing!");
    }

    setTimeout(() => {
      if (currentIndex < problems.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setIsSubmitted(false);
        setShowHint(false);
      } else {
        setGameOver(true);
        setIsVictory(monsterHp === 0);
      }
    }, 1500);
  };

  const handleTimeUp = () => {
    if (isSubmitted) return;
    toast.error("Time's up! Moving to next problem!");
    
    setTimeout(() => {
      if (currentIndex < problems.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setIsSubmitted(false);
        setShowHint(false);
      } else {
        setGameOver(true);
        setIsVictory(false);
      }
    }, 1000);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setMonsterHp(100);
    setPlayerScore(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setShowHint(false);
    setGameOver(false);
    setIsVictory(false);
    loadProblems();
  };

  if (loading) return <Loading message="Summoning the monster..." />;
  if (error) return <Error message={error} onRetry={loadProblems} />;
  if (!currentProblem) return <Error message="No problems available" onRetry={loadProblems} />;

  if (gameOver) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6 py-8"
          >
            <div className="text-8xl mb-4">
              {isVictory ? "🏆" : "💀"}
            </div>
            <h2 className="text-4xl font-display text-gray-800">
              {isVictory ? "Victory!" : "Game Over"}
            </h2>
            <p className="text-xl text-gray-600">
              {isVictory 
                ? "You defeated the monster! You're a math hero!" 
                : "The monster survived! Try again to defeat it!"}
            </p>
            
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6">
              <p className="text-3xl font-display text-gray-800">
                Final Score: {playerScore}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="primary" onClick={handleRestart}>
                <ApperIcon name="RotateCcw" size={20} className="mr-2" />
                Play Again
              </Button>
              <Button variant="outline" onClick={() => navigate("/mini-games")}>
                <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
                Back to Games
              </Button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="space-y-6">
          {/* Header with Stats */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500">
                Problem {currentIndex + 1} of {problems.length}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-display text-primary">
                  Score: {playerScore}
                </span>
              </div>
            </div>
            <Timer
              duration={30}
              onTimeUp={handleTimeUp}
              isActive={!isSubmitted}
            />
          </div>

          {/* Monster HP Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🐲</span>
                <span className="font-display text-lg text-gray-800">Monster HP</span>
              </div>
              <span className="text-2xl font-display text-error">{monsterHp}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: `${monsterHp}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-error to-warning h-full rounded-full"
              />
            </div>
          </div>

          {/* Problem Display */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
            <h2 className="text-4xl font-display text-gray-800 mb-4">
              {currentProblem.problem}
            </h2>
            {showHint && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-gray-600"
              >
                💡 Hint: {currentProblem.hint}
              </motion.p>
            )}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4">
            {currentProblem.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={!isSubmitted ? { scale: 1.02 } : {}}
                whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                onClick={() => !isSubmitted && setSelectedAnswer(option)}
                disabled={isSubmitted}
                className={`p-6 rounded-2xl text-2xl font-display border-3 transition-all ${
                  selectedAnswer === option && !isSubmitted
                    ? "bg-primary/10 border-primary"
                    : isSubmitted && option === currentProblem.correctAnswer
                    ? "bg-success/10 border-success"
                    : isSubmitted && selectedAnswer === option
                    ? "bg-error/10 border-error"
                    : "bg-white border-gray-200 hover:border-primary"
                } ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowHint(true)}
              disabled={showHint || isSubmitted}
              className="flex-1"
            >
              <ApperIcon name="Lightbulb" size={20} className="mr-2" />
              Show Hint
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!selectedAnswer || isSubmitted}
              className="flex-1"
            >
              Attack!
              <ApperIcon name="Zap" size={20} className="ml-2" />
            </Button>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${
                  selectedAnswer === currentProblem.correctAnswer
                    ? "bg-success/10 border-success"
                    : "bg-error/10 border-error"
                } border-2 rounded-2xl p-4 text-center`}
              >
                <p className="text-lg font-display">
                  {selectedAnswer === currentProblem.correctAnswer
                    ? "🎯 Direct hit! The monster is weakening!"
                    : `❌ Miss! The correct answer was ${currentProblem.correctAnswer}`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
};

export default MonsterMathGame;