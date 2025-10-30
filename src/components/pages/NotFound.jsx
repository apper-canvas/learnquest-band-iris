import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
        className="max-w-md w-full"
      >
        <Card className="text-center p-8">
          <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="MapPin" size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl font-display text-gray-800 mb-3">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Looks like you've wandered off the learning path. Let's get you back on track!
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-red-600"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Back to Home
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;