import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SubjectCard from "@/components/molecules/SubjectCard";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import progressService from "@/services/api/progressService";

const Home = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await progressService.getCurrentProgress();
      setProgress(data);
    } catch (err) {
      setError(err.message || "Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  if (loading) return <Loading message="Loading your adventure..." />;
  if (error) return <Error message={error} onRetry={loadProgress} />;

  const getMathStars = () => {
    return Math.floor(progress.totalStars * 0.55);
  };

  const getReadingStars = () => {
    return Math.floor(progress.totalStars * 0.45);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <ApperIcon name="Sparkles" size={80} className="text-accent" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-display text-gray-800 mb-3">
                Welcome Back, Star Learner!
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Ready for another amazing learning adventure?
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge variant="success">
                  <ApperIcon name="Flame" size={16} className="mr-1" />
                  {progress.streak} Day Streak
                </Badge>
                <Badge variant="accent">
                  <ApperIcon name="Star" size={16} className="mr-1" fill="currentColor" />
                  {progress.totalStars} Total Stars
                </Badge>
                <Badge variant="info">
                  <ApperIcon name="Award" size={16} className="mr-1" />
                  {progress.skillsMastered.length} Skills Mastered
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div>
        <h2 className="text-3xl font-display text-gray-800 mb-6">
          Choose Your Adventure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SubjectCard
              subject="math"
              icon="Calculator"
              color="primary"
              currentLevel={progress.mathLevel}
              totalStars={getMathStars()}
              description="Practice addition, subtraction, multiplication, and division!"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SubjectCard
              subject="reading"
              icon="BookOpen"
              color="secondary"
              currentLevel={progress.readingLevel}
              totalStars={getReadingStars()}
              description="Build vocabulary, sentences, and reading comprehension!"
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-success/10 to-info/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white rounded-full p-4 shadow-card">
              <ApperIcon name="TrendingUp" size={48} className="text-success" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-display text-gray-800 mb-2">
                You're Making Great Progress!
              </h3>
              <p className="text-lg text-gray-600 mb-3">
                Keep up the amazing work! Every challenge helps you learn and grow.
              </p>
              <div className="flex flex-wrap gap-4">
                {progress.skillsMastered.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="success">
                    <ApperIcon name="CheckCircle" size={16} className="mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Home;