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

const NumberMazeGame = () => {
  const navigate = useNavigate();
  const [mazeData, setMazeData] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ row: 0, col: 0 });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [path, setPath] = useState([]);

  useEffect(() => {
    loadMaze();
  }, []);

  const loadMaze = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await miniGameService.getNumberMazeData();
      if (!data) {
        setError("No maze data available.");
      } else {
        setMazeData(data);
        setCurrentPosition(data.startPosition);
        setPath([data.startPosition]);
      }
    } catch (err) {
      setError(err.message || "Failed to load Number Maze");
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = mazeData?.questions[questionIndex];

  const handleAnswer = (selectedAnswer) => {
    const correct = selectedAnswer === currentQuestion.correctAnswer;

    if (correct) {
      const nextPos = currentQuestion.nextPosition;
      setCurrentPosition(nextPos);
      setPath([...path, nextPos]);
      setScore(score + 10);
      toast.success("Correct! Moving forward!");

      if (nextPos.row === mazeData.endPosition.row && nextPos.col === mazeData.endPosition.col) {
        setTimeout(() => {
          setGameComplete(true);
        }, 1000);
        return;
      }

      if (questionIndex < mazeData.questions.length - 1) {
        setTimeout(() => {
          setQuestionIndex(questionIndex + 1);
        }, 1000);
      } else {
        setTimeout(() => {
          setGameComplete(true);
        }, 1000);
      }
    } else {
      toast.error("Wrong answer! Try again!");
    }
  };

  const handleRestart = () => {
    setCurrentPosition(mazeData.startPosition);
    setQuestionIndex(0);
    setScore(0);
    setGameComplete(false);
    setPath([mazeData.startPosition]);
  };

  const renderMazeGrid = () => {
    const gridSize = 5;
    const cells = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const isStart = row === mazeData.startPosition.row && col === mazeData.startPosition.col;
        const isEnd = row === mazeData.endPosition.row && col === mazeData.endPosition.col;
        const isCurrent = row === currentPosition.row && col === currentPosition.col;
        const isInPath = path.some(p => p.row === row && p.col === col);

        cells.push(
          <motion.div
            key={`${row}-${col}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: (row * gridSize + col) * 0.02 }}
            className={`aspect-square rounded-xl border-2 flex items-center justify-center text-3xl ${
              isCurrent
                ? "bg-primary border-primary text-white shadow-lg"
                : isEnd
                ? "bg-success/20 border-success"
                : isStart
                ? "bg-blue-100 border-blue-300"
                : isInPath
                ? "bg-secondary/20 border-secondary/40"
                : "bg-white border-gray-200"
            }`}
          >
            {isCurrent && "🎯"}
            {isEnd && !isCurrent && "🏆"}
            {isStart && !isCurrent && !isInPath && "🚀"}
          </motion.div>
        );
      }
    }

    return cells;
  };

  if (loading) return <Loading message="Generating maze..." />;
  if (error) return <Error message={error} onRetry={loadMaze} />;
  if (!mazeData || !currentQuestion) return <Error message="Maze data not available" onRetry={loadMaze} />;

  if (gameComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6 py-8"
          >
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-4xl font-display text-gray-800">
              Maze Completed!
            </h2>
            <p className="text-xl text-gray-600">
              You successfully navigated through the number maze!
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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Question {questionIndex + 1} of {mazeData.questions.length}
              </p>
              <p className="text-2xl font-display text-primary">
                Score: {score}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Position</p>
              <p className="text-lg font-display text-gray-800">
                ({currentPosition.row}, {currentPosition.col})
              </p>
            </div>
          </div>

          {/* Maze Grid */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
            <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
              {renderMazeGrid()}
            </div>
          </div>

          {/* Question */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 text-center">
            <h2 className="text-3xl font-display text-gray-800">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option)}
                className="p-6 rounded-2xl text-xl font-display bg-white border-3 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span>Start</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>You</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>Goal</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NumberMazeGame;