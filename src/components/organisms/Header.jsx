import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const Header = ({ totalStars = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-primary via-pink-500 to-secondary text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-2">
                <ApperIcon name="Sparkles" size={32} className="text-accent" />
              </div>
              <h1 className="text-3xl font-display">LearnQuest</h1>
            </motion.button>
          </div>

          <nav className="hidden md:flex items-center gap-6">
<NavItem 
              label="Home" 
              icon="Home" 
              onClick={() => navigate("/")} 
              active={isHome}
            />
            <NavItem 
              label="Math" 
              icon="Calculator" 
              onClick={() => navigate("/challenges/math")} 
              active={location.pathname.includes("/math")}
            />
            <NavItem 
              label="Reading" 
              icon="BookOpen" 
              onClick={() => navigate("/challenges/reading")} 
              active={location.pathname.includes("/reading")}
            />
            <NavItem 
              label="Avatar" 
              icon="User" 
              onClick={() => navigate("/avatar")} 
              active={location.pathname === "/avatar"}
            />
            <NavItem 
              label="Progress" 
              icon="TrendingUp" 
              onClick={() => navigate("/progress")} 
              active={location.pathname === "/progress"}
            />
          </nav>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <ApperIcon name="Star" size={24} fill="currentColor" className="text-accent" />
            <span className="text-xl font-display">{totalStars}</span>
          </motion.div>
        </div>

        <div className="md:hidden pb-4">
<div className="flex items-center justify-around">
            <MobileNavItem label="Home" icon="Home" onClick={() => navigate("/")} active={isHome} />
            <MobileNavItem label="Math" icon="Calculator" onClick={() => navigate("/challenges/math")} active={location.pathname.includes("/math")} />
            <MobileNavItem label="Reading" icon="BookOpen" onClick={() => navigate("/challenges/reading")} active={location.pathname.includes("/reading")} />
            <MobileNavItem label="Avatar" icon="User" onClick={() => navigate("/avatar")} active={location.pathname === "/avatar"} />
            <MobileNavItem label="Progress" icon="TrendingUp" onClick={() => navigate("/progress")} active={location.pathname === "/progress"} />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const NavItem = ({ label, icon, onClick, active }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all",
      active ? "bg-white/30 backdrop-blur-sm" : "hover:bg-white/10"
    )}
  >
    <ApperIcon name={icon} size={20} />
    <span>{label}</span>
  </motion.button>
);

const MobileNavItem = ({ label, icon, onClick, active }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center gap-1"
  >
    <div className={cn(
      "p-2 rounded-xl transition-all",
      active ? "bg-white/30 backdrop-blur-sm" : ""
    )}>
      <ApperIcon name={icon} size={24} />
    </div>
    <span className="text-xs font-semibold">{label}</span>
  </motion.button>
);

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default Header;