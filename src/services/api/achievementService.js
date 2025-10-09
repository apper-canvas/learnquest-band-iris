const achievementsData = [
  {
    Id: 1,
    name: "Speed Demon",
    description: "Complete a timed challenge in under 10 seconds",
    icon: "Zap",
    type: "speed",
    condition: "time_under_10",
    bonusStars: 5,
    unlocked: false
  },
  {
    Id: 2,
    name: "Lightning Fast",
    description: "Complete 3 timed challenges in under 15 seconds each",
    icon: "Bolt",
    type: "speed",
    condition: "streak_under_15",
    bonusStars: 10,
    unlocked: false,
    progress: 0,
    target: 3
  },
  {
    Id: 3,
    name: "Time Master",
    description: "Complete 10 timed challenges with bonus stars",
    icon: "Clock",
    type: "speed",
    condition: "timed_completions",
    bonusStars: 15,
    unlocked: false,
    progress: 0,
    target: 10
  },
  {
    Id: 4,
    name: "Flash Learner",
    description: "Get perfect score in under 20 seconds",
    icon: "Star",
    type: "speed",
    condition: "perfect_under_20",
    bonusStars: 8,
    unlocked: false
  },
  {
    Id: 5,
    name: "Rocket Speed",
    description: "Complete any challenge in under 5 seconds",
    icon: "Rocket",
    type: "speed",
    condition: "time_under_5",
    bonusStars: 12,
    unlocked: false
  }
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Load from localStorage or use default
const loadAchievements = () => {
  const stored = localStorage.getItem('learnquest_achievements');
  if (stored) {
    return JSON.parse(stored);
  }
  return [...achievementsData];
};

// Save to localStorage
const saveAchievements = (achievements) => {
  localStorage.setItem('learnquest_achievements', JSON.stringify(achievements));
};

const achievementService = {
  getAll: async () => {
    await delay(200);
    return loadAchievements();
  },

  getUnlocked: async () => {
    await delay(200);
    const achievements = loadAchievements();
    return achievements.filter(a => a.unlocked);
  },

  checkAchievements: async (sessionData) => {
    await delay(100);
    const achievements = loadAchievements();
    const newlyUnlocked = [];
    
    achievements.forEach(achievement => {
      if (achievement.unlocked) return;
      
      let shouldUnlock = false;
      
      switch (achievement.condition) {
        case "time_under_10":
          if (sessionData.averageTime && sessionData.averageTime < 10) {
            shouldUnlock = true;
          }
          break;
          
        case "time_under_5":
          if (sessionData.averageTime && sessionData.averageTime < 5) {
            shouldUnlock = true;
          }
          break;
          
        case "perfect_under_20":
          if (sessionData.accuracy === 100 && sessionData.averageTime && sessionData.averageTime < 20) {
            shouldUnlock = true;
          }
          break;
          
        case "streak_under_15":
          if (sessionData.averageTime && sessionData.averageTime < 15) {
            achievement.progress = (achievement.progress || 0) + 1;
            if (achievement.progress >= achievement.target) {
              shouldUnlock = true;
            }
          } else {
            achievement.progress = 0; // Reset streak if time exceeded
          }
          break;
          
        case "timed_completions":
          if (sessionData.isTimed) {
            achievement.progress = (achievement.progress || 0) + 1;
            if (achievement.progress >= achievement.target) {
              shouldUnlock = true;
            }
          }
          break;
      }
      
      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        newlyUnlocked.push({ ...achievement });
      }
    });
    
    if (newlyUnlocked.length > 0) {
      saveAchievements(achievements);
    }
    
    return newlyUnlocked;
  },

  calculateBonusStars: (completionTime, maxTime = 30) => {
    if (completionTime >= maxTime) return 0;
    
    const timeRatio = completionTime / maxTime;
    
    // Bonus multipliers based on speed
    if (timeRatio <= 0.25) return 3; // Completed in 25% of time or less
    if (timeRatio <= 0.5) return 2;  // Completed in 50% of time or less
    if (timeRatio <= 0.75) return 1; // Completed in 75% of time or less
    
    return 0;
  }
};

export default achievementService;