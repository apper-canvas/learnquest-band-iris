import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Timer from "@/components/atoms/Timer";
import ApperIcon from "@/components/ApperIcon";
import ChallengeOption from "@/components/molecules/ChallengeOption";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const ChallengeCard = ({ 
  challenge, 
  onComplete,
  challengeNumber,
  totalChallenges,
  isTimedMode = false,
  timerDuration = 30
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [challengeStartTime, setChallengeStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  
  useEffect(() => {
    setChallengeStartTime(Date.now());
    setTimeLeft(timerDuration);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(false);
  }, [challenge, timerDuration]);
const handleSubmit = () => {
    if (!selectedAnswer) return;
    setIsSubmitted(true);
    const correct = selectedAnswer === challenge.correctAnswer;
    setIsCorrect(correct);
    
    // Calculate completion time for timed mode
    const completionTime = isTimedMode ? Math.max(0, timerDuration - timeLeft) : null;

    setTimeout(() => {
      const stars = correct ? 3 : selectedAnswer ? 1 : 0;
      onComplete(stars, correct, completionTime);
    }, 1500);
  };
  
  const handleTimeUp = () => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    setIsCorrect(false);
    
    setTimeout(() => {
      onComplete(0, false, timerDuration); // Full time elapsed
    }, 1500);
  };

return (
    <Card className="max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${
              challenge.type === "math" ? "bg-primary" : "bg-secondary"
            } text-white rounded-xl px-4 py-2`}>
              <span className="font-display text-sm">{challenge.skill}</span>
            </div>
            <span className="text-sm font-semibold text-gray-500">
              Question {challengeNumber} of {totalChallenges}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {isTimedMode && (
              <Timer
                duration={timerDuration}
                onTimeUp={handleTimeUp}
                isActive={!isSubmitted}
                onTick={(timeRemaining) => setTimeLeft(timeRemaining)}
              />
            )}
            <div className="flex gap-1">
              {[...Array(totalChallenges)].map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx < challengeNumber ? "bg-success" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-display text-gray-800 leading-relaxed">
            {challenge.question}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {challenge.options.map((option, index) => (
            <ChallengeOption
              key={index}
              option={option}
              isSelected={selectedAnswer === option && !isSubmitted}
              isCorrect={isSubmitted && option === challenge.correctAnswer}
              isWrong={isSubmitted && selectedAnswer === option && option !== challenge.correctAnswer}
              onClick={() => !isSubmitted && setSelectedAnswer(option)}
              disabled={isSubmitted}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={!selectedAnswer}
              >
                Submit Answer
                <ApperIcon name="CheckCircle" size={24} className="ml-2" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${
                isCorrect ? "bg-success/10 border-success" : "bg-warning/10 border-warning"
              } border-2 rounded-2xl p-6 text-center`}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <ApperIcon 
                  name={isCorrect ? "CheckCircle" : "Info"} 
                  size={32} 
                  className={isCorrect ? "text-success" : "text-warning"}
                />
                <h3 className="text-2xl font-display">
                  {isCorrect ? "Amazing!" : "Good Try!"}
                </h3>
              </div>
              <p className="text-lg text-gray-700">
                {isCorrect 
                  ? "You got it right! You're a star learner!" 
                  : `The correct answer is: ${challenge.correctAnswer}`
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default ChallengeCard;