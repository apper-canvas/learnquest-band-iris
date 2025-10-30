import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { miniGameService } from "@/services/api/miniGameService";

const MathPuzzlesGame = () => {
  const navigate = useNavigate();
  const [puzzles, setPuzzles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [droppedAnswer, setDroppedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    loadPuzzles();
  }, []);

  const loadPuzzles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await miniGameService.getMathPuzzles();
      if (data.length === 0) {
        setError("No puzzles available.");
      } else {
        setPuzzles(data);
      }
    } catch (err) {
      setError(err.message || "Failed to load Math Puzzles");
    } finally {
      setLoading(false);
    }
  };

  const currentPuzzle = puzzles[currentIndex];

  const handleDragStart = (answer) => {
    setDraggedItem(answer);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    setDroppedAnswer(draggedItem);
    const correct = draggedItem === currentPuzzle.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 10);
      toast.success("Perfect! You solved it!");
    } else {
      toast.error("Not quite! Try again!");
    }

    setTimeout(() => {
      if (correct) {
        if (currentIndex < puzzles.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setDroppedAnswer(null);
          setIsCorrect(null);
          setDraggedItem(null);
        } else {
          setGameComplete(true);
        }
      } else {
        setDroppedAnswer(null);
        setIsCorrect(null);
        setDraggedItem(null);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setDroppedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setGameComplete(false);
    setDraggedItem(null);
    loadPuzzles();
  };

  if (loading) return <Loading message="Preparing puzzles..." />;
  if (error) return <Error message={error} onRetry={loadPuzzles} />;
  if (!currentPuzzle) return <Error message="No puzzles available" onRetry={loadPuzzles} />;

  if (gameComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6 py-8"
          >
            <div className="text-8xl mb-4">🎊</div>
            <h2 className="text-4xl font-display text-gray-800">
              All Puzzles Solved!
            </h2>
            <p className="text-xl text-gray-600">
              Amazing work! You completed all the math puzzles!
            </p>
            
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6">
              <p className="text-3xl font-display text-gray-800">
                Final Score: {score}
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
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Puzzle {currentIndex + 1} of {puzzles.length}
              </p>
              <p className="text-2xl font-display text-primary">
                Score: {score}
              </p>
            </div>
            <div className="text-3xl">🧩</div>
          </div>

          {/* Equation Display */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8">
            <div className="flex items-center justify-center gap-4 text-5xl font-display text-gray-800">
              <span>{currentPuzzle.equation.split("=")[0]}</span>
              <span>=</span>
              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`min-w-[120px] h-24 rounded-2xl border-4 border-dashed flex items-center justify-center transition-all ${
                  droppedAnswer
                    ? isCorrect
                      ? "bg-success/20 border-success"
                      : "bg-error/20 border-error"
                    : "bg-white/50 border-purple-300 hover:border-purple-500"
                }`}
              >
                {droppedAnswer ? (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {droppedAnswer}
                  </motion.span>
                ) : (
                  <span className="text-2xl text-gray-400">?</span>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-lg text-gray-600">
              Drag the correct answer to the box above
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {currentPuzzle.options.map((option, index) => (
              <motion.div
                key={index}
                draggable
                onDragStart={() => handleDragStart(option)}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, rotate: 5 }}
                className={`bg-white rounded-2xl p-6 text-center text-3xl font-display border-3 cursor-move shadow-card hover:shadow-lift transition-all ${
                  draggedItem === option
                    ? "border-primary opacity-50"
                    : "border-gray-200"
                }`}
              >
                {option}
              </motion.div>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`${
                  isCorrect
                    ? "bg-success/10 border-success"
                    : "bg-error/10 border-error"
                } border-2 rounded-2xl p-4 text-center`}
              >
                <div className="flex items-center justify-center gap-2">
                  <ApperIcon
                    name={isCorrect ? "CheckCircle" : "XCircle"}
                    size={24}
                    className={isCorrect ? "text-success" : "text-error"}
                  />
                  <p className="text-lg font-display">
                    {isCorrect
                      ? "Correct! Moving to next puzzle..."
                      : "Try again! You can do it!"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
};

export default MathPuzzlesGame;