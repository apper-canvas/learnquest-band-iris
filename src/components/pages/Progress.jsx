import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SkillProgressCard from "@/components/organisms/SkillProgressCard";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import progressService from "@/services/api/progressService";
import sessionService from "@/services/api/sessionService";

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [progressData, sessionsData] = await Promise.all([
        progressService.getCurrentProgress(),
        sessionService.getRecent(3)
      ]);
      setProgress(progressData);
      setSessions(sessionsData);
    } catch (err) {
      setError(err.message || "Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading message="Loading your progress..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const mathSkills = [
    { name: "Addition", level: progress.mathLevel, progress: 75, stars: 42 },
    { name: "Subtraction", level: progress.mathLevel - 1, progress: 60, stars: 38 },
    { name: "Multiplication", level: progress.mathLevel - 1, progress: 45, stars: 28 },
    { name: "Division", level: progress.mathLevel - 2, progress: 30, stars: 18 }
  ];

  const readingSkills = [
    { name: "Word Recognition", level: progress.readingLevel, progress: 80, stars: 35 },
    { name: "Sentence Building", level: progress.readingLevel, progress: 65, stars: 28 },
    { name: "Comprehension", level: progress.readingLevel - 1, progress: 50, stars: 22 }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-accent/20 to-success/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <ApperIcon name="Trophy" size={80} className="text-accent" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-display text-gray-800 mb-3">
                Your Learning Journey
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Look at all the amazing progress you've made!
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge variant="accent">
                  <ApperIcon name="Star" size={20} className="mr-1" fill="currentColor" />
                  {progress.totalStars} Stars
                </Badge>
                <Badge variant="success">
                  <ApperIcon name="Award" size={20} className="mr-1" />
                  {progress.skillsMastered.length} Skills Mastered
                </Badge>
                <Badge variant="info">
                  <ApperIcon name="Flame" size={20} className="mr-1" />
                  {progress.streak} Day Streak
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div>
        <h2 className="text-3xl font-display text-gray-800 mb-6">
          Math Skills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mathSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SkillProgressCard
                skill={skill.name}
                level={skill.level}
                progress={skill.progress}
                totalStars={skill.stars}
                color="primary"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-display text-gray-800 mb-6">
          Reading Skills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {readingSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SkillProgressCard
                skill={skill.name}
                level={skill.level}
                progress={skill.progress}
                totalStars={skill.stars}
                color="secondary"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-display text-gray-800 mb-6">
          Recent Sessions
        </h2>
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <motion.div
              key={session.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lift transition-shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`${
                      session.subject === "math" ? "bg-primary" : "bg-secondary"
                    } text-white rounded-xl p-4`}>
                      <ApperIcon 
                        name={session.subject === "math" ? "Calculator" : "BookOpen"} 
                        size={32} 
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-display capitalize">{session.subject}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(session.timestamp).toLocaleDateString()} at {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="accent">
                      <ApperIcon name="Star" size={16} className="mr-1" fill="currentColor" />
                      {session.starsEarned} stars
                    </Badge>
                    <Badge variant="success">
                      <ApperIcon name="CheckCircle" size={16} className="mr-1" />
                      {session.accuracy}% correct
                    </Badge>
                    <Badge variant="info">
                      <ApperIcon name="Clock" size={16} className="mr-1" />
                      {Math.floor(session.duration / 60)}m
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;