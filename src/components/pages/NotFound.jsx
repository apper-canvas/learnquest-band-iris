import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <Card className="text-center p-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="bg-primary/10 rounded-full p-8">
              <ApperIcon name="AlertCircle" size={80} className="text-primary" />
            </div>
          </motion.div>

          <h1 className="text-6xl font-display text-gray-800 mb-4">404</h1>
          <h2 className="text-3xl font-display text-gray-700 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Looks like you've wandered off the learning path! Don't worry, let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-red-600"
            >
              <ApperIcon name="Home" size={20} className="mr-2" />
              Go Home
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
            >
              <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
              Go Back
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Quick links to get you started:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => navigate("/challenges/math")}
                variant="outline"
                size="sm"
              >
                <ApperIcon name="Calculator" size={16} className="mr-2" />
                Math Challenges
              </Button>
              <Button
                onClick={() => navigate("/challenges/reading")}
                variant="outline"
                size="sm"
              >
                <ApperIcon name="BookOpen" size={16} className="mr-2" />
                Reading Challenges
              </Button>
              <Button
                onClick={() => navigate("/progress")}
                variant="outline"
                size="sm"
              >
                <ApperIcon name="TrendingUp" size={16} className="mr-2" />
                View Progress
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;