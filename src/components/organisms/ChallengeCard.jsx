import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Timer from "@/components/atoms/Timer";
import ChallengeOption from "@/components/molecules/ChallengeOption";
import ProgressBar from "@/components/molecules/ProgressBar";

const ChallengeCard = ({ 
  challenge, 
  challengeNumber, 
  totalChallenges, 
  isTimedMode = false,
  timerDuration = 60,
  onComplete 
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(
    isTimedMode ? timerDuration : null
  );
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [challengeStartTime, setChallengeStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  
  // Story-specific state
  const [showStory, setShowStory] = useState(challenge?.type === 'story');
  const [storyProgress, setStoryProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);

  // Initialize challenge state when challenge changes
  useEffect(() => {
    setChallengeStartTime(Date.now());
    setTimeLeft(timerDuration);
    setSelectedAnswer(null);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowFeedback(false);
    
    if (challenge?.type === 'story') {
      setShowStory(true);
      setStoryProgress(0);
      setIsReading(false);
      // Stop any ongoing speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      setShowStory(false);
    }
  }, [challenge, timerDuration]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleReadStory = () => {
    if (!challenge?.story) return;

    if (isReading) {
      // Pause reading
      window.speechSynthesis.pause();
      setIsReading(false);
    } else {
      // Start or resume reading
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        const utterance = new SpeechSynthesisUtterance(challenge.story);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        
        utterance.onboundary = (event) => {
          const progress = (event.charIndex / challenge.story.length) * 100;
          setStoryProgress(Math.min(progress, 100));
        };

        utterance.onend = () => {
          setIsReading(false);
          setStoryProgress(100);
        };

        window.speechSynthesis.speak(utterance);
      }
      setIsReading(true);
    }
  };

  const handleStopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setStoryProgress(0);
  };

  const handleContinueToQuestion = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
setShowStory(false);
  };

  const handleSubmit = () => {
    if (!selectedOption && !selectedAnswer) return;
    
    const answer = selectedOption || selectedAnswer;
    setIsAnswered(true);
    setIsSubmitted(true);
    const correct = answer === challenge.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Calculate completion time for timed mode
    const completionTime = isTimedMode ? Math.max(0, timerDuration - timeLeft) : null;

    setTimeout(() => {
      const stars = correct ? 3 : answer ? 1 : 0;
      onComplete?.(stars, correct, completionTime);
    }, 1500);
  };
  
  const handleTimeUp = () => {
    if (isSubmitted || isAnswered) return;
    
    setIsSubmitted(true);
    setIsAnswered(true);
    setIsCorrect(false);
    setShowFeedback(true);
    
    setTimeout(() => {
      onComplete?.(0, false, timerDuration);
    }, 1500);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 rounded-xl p-3">
              <ApperIcon 
                name={isTimedMode ? "Zap" : challenge?.type === 'story' ? "BookOpen" : "HelpCircle"} 
                size={32} 
                className="text-primary" 
              />
            </div>
            <div>
              <h2 className="text-2xl font-display text-gray-800">
                {isTimedMode ? '⚡ Timed Challenge' : challenge?.type === 'story' ? '📖 Story Time' : 'Challenge'} {challengeNumber} of {totalChallenges}
              </h2>
              <p className="text-gray-600">
                {challenge.skill} - Level {challenge.difficulty}
              </p>
            </div>
          </div>
          {isTimedMode && !showStory && (
            <Timer
              duration={timerDuration}
              onTimeUp={handleTimeUp}
              onTimeUpdate={setTimeRemaining}
            />
          )}
        </div>

        {/* Story Display Phase */}
        {showStory && challenge?.type === 'story' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white rounded-full p-2 shadow-card">
                  <ApperIcon name="BookOpen" size={24} className="text-secondary" />
                </div>
                <h3 className="text-xl font-display text-gray-800">
                  Listen to the Story
                </h3>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-card mb-6">
                <p className="text-lg leading-relaxed text-gray-700">
                  {challenge.story}
                </p>
              </div>

              {/* Audio Controls */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-3">
                  <Button
                    variant={isReading ? "outline" : "primary"}
                    onClick={handleReadStory}
                    className="min-w-[120px]"
                  >
                    <ApperIcon 
                      name={isReading ? "Pause" : "Play"} 
                      size={20} 
                      className="mr-2" 
                    />
                    {isReading ? "Pause" : "Read Aloud"}
                  </Button>
                  
                  {(isReading || storyProgress > 0) && (
                    <Button
                      variant="outline"
                      onClick={handleStopReading}
                    >
                      <ApperIcon name="Square" size={20} className="mr-2" />
                      Stop
                    </Button>
                  )}
                </div>

                {/* Progress Bar */}
                {storyProgress > 0 && (
                  <div className="w-full max-w-md">
                    <ProgressBar 
                      current={storyProgress} 
                      total={100} 
                      color="secondary"
                      showLabel={false}
                    />
                  </div>
                )}

                {/* Continue Button */}
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleContinueToQuestion}
                  className="mt-4"
                >
                  Continue to Question
                  <ApperIcon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Question Phase (for all challenges or after story) */}
        {(!showStory || challenge?.type !== 'story') && (
          <>
            {/* Question */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
              <h3 className="text-2xl md:text-3xl font-display text-gray-800 text-center">
                {challenge.question}
              </h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenge.options.map((option, index) => (
                <ChallengeOption
                  key={index}
                  option={option}
                  isSelected={selectedOption === option}
                  isCorrect={isAnswered && option === challenge.correctAnswer}
                  isIncorrect={isAnswered && selectedOption === option && option !== challenge.correctAnswer}
                  onClick={() => !isAnswered && setSelectedOption(option)}
                  disabled={isAnswered}
                />
              ))}
            </div>
{/* Submit Button */}
            {!isAnswered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!selectedOption}
                >
                  Submit Answer
                </Button>
              </motion.div>
            )}
          </>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`rounded-2xl p-6 ${
                isCorrect
                  ? 'bg-gradient-to-br from-success/20 to-success/10 border-2 border-success'
                  : 'bg-gradient-to-br from-error/20 to-error/10 border-2 border-error'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-3 ${
                    isCorrect ? 'bg-success' : 'bg-error'
                  }`}
                >
                  <ApperIcon
                    name={isCorrect ? 'CheckCircle' : 'XCircle'}
                    size={32}
                    className="text-white"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-display text-gray-800 mb-2">
                    {isCorrect ? '🎉 Correct!' : '❌ Not Quite'}
                  </h4>
                  <p className="text-gray-600">
                    {isCorrect
                      ? `Great job! You earned ${challenge.points} stars!`
                      : `The correct answer was: ${challenge.correctAnswer}`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default ChallengeCard;