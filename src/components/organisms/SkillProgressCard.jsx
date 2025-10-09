import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ProgressRing from "@/components/atoms/ProgressRing";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const SkillProgressCard = ({ skill, level, progress, totalStars, color = "primary" }) => {
  const iconMap = {
    Addition: "Plus",
    Subtraction: "Minus",
    Multiplication: "X",
    Division: "Divide",
    "Word Recognition": "Type",
    "Sentence Building": "List",
    Comprehension: "BookOpen"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${
              color === "primary" ? "bg-primary" : "bg-secondary"
            } text-white rounded-xl p-3`}>
              <ApperIcon name={iconMap[skill] || "Star"} size={24} />
            </div>
            <div>
              <h3 className="text-xl font-display text-gray-800">{skill}</h3>
              <p className="text-sm text-gray-600">Level {level}</p>
            </div>
          </div>
          <Badge variant="accent">
            <ApperIcon name="Star" size={16} className="mr-1" fill="currentColor" />
            {totalStars}
          </Badge>
        </div>

        <div className="flex items-center justify-center py-4">
          <ProgressRing progress={progress} color={color} />
        </div>

        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-sm font-semibold text-gray-700">
            {progress >= 100 ? "Mastered!" : `${100 - progress}% to next level`}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default SkillProgressCard;