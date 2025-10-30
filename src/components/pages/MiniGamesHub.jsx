import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const MiniGamesHub = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: "monster-math",
      title: "Monster Math",
      description: "Solve equations to defeat monsters and save the kingdom!",
      icon: "🐲",
      color: "from-red-400 to-orange-400",
      path: "/mini-games/monster-math"
    },
    {
      id: "number-maze",
      title: "Number Maze",
      description: "Follow the correct path by answering math questions correctly!",
      icon: "🌟",
      color: "from-blue-400 to-cyan-400",
      path: "/mini-games/number-maze"
    },
    {
      id: "math-puzzles",
      title: "Math Puzzles",
      description: "Drag and drop the correct answers to complete the puzzles!",
      icon: "🧩",
      color: "from-purple-400 to-pink-400",
      path: "/mini-games/math-puzzles"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 mb-12"
      >
        <h1 className="text-5xl font-display text-gray-800">
          🎮 Math Mini-Games
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose a game and have fun while learning math!
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lift transition-shadow duration-300">
              <div className="space-y-6">
                <div className={`bg-gradient-to-br ${game.color} rounded-2xl p-8 text-center`}>
                  <span className="text-7xl">{game.icon}</span>
                </div>
                
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-display text-gray-800">
                    {game.title}
                  </h2>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate(game.path)}
                >
                  Play Now
                  <ApperIcon name="Play" size={20} className="ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-12"
      >
        <Button
          variant="outline"
          onClick={() => navigate("/challenges/math")}
        >
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back to Challenges
        </Button>
      </motion.div>
    </div>
  );
};

export default MiniGamesHub;