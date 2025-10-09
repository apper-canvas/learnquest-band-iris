import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const SubjectCard = ({ subject, icon, color, currentLevel, totalStars, description }) => {
  const navigate = useNavigate();

  const gradients = {
    math: "from-primary to-pink-500",
    reading: "from-secondary to-teal-500"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        variant="interactive" 
        className="cursor-pointer overflow-hidden"
        onClick={() => navigate(`/challenges/${subject}`)}
      >
        <div className={`bg-gradient-to-br ${gradients[subject]} h-32 -m-6 mb-4 flex items-center justify-center`}>
          <ApperIcon name={icon} size={80} className="text-white opacity-90" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display capitalize">{subject}</h3>
            <Badge variant="accent">Level {currentLevel}</Badge>
          </div>
          <p className="text-gray-600">{description}</p>
          <div className="flex items-center gap-2 text-accent">
            <ApperIcon name="Star" size={20} fill="currentColor" />
            <span className="font-semibold">{totalStars} Stars</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SubjectCard;