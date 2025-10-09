import progressData from "../mockData/progress.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let progressState = [...progressData];

const progressService = {
  getAll: async () => {
    await delay(200);
    return [...progressState];
  },

  getById: async (id) => {
    await delay(200);
    const progress = progressState.find((p) => p.Id === parseInt(id));
    return progress ? { ...progress } : null;
  },

  getCurrentProgress: async () => {
    await delay(200);
    return progressState[0] ? { ...progressState[0] } : null;
  },

  update: async (id, data) => {
    await delay(300);
    const index = progressState.findIndex((p) => p.Id === parseInt(id));
    if (index !== -1) {
      progressState[index] = { ...progressState[index], ...data };
      return { ...progressState[index] };
    }
    return null;
  },

  updateStars: async (starsToAdd) => {
    await delay(300);
    if (progressState[0]) {
      progressState[0].totalStars += starsToAdd;
      progressState[0].lastActive = new Date().toISOString();
      return { ...progressState[0] };
    }
    return null;
  },

  updateLevel: async (subject, newLevel) => {
    await delay(300);
    if (progressState[0]) {
      if (subject === "math") {
        progressState[0].mathLevel = newLevel;
      } else if (subject === "reading") {
        progressState[0].readingLevel = newLevel;
      }
      progressState[0].lastActive = new Date().toISOString();
      return { ...progressState[0] };
    }
    return null;
  },

  addMasteredSkill: async (skill) => {
    await delay(300);
    if (progressState[0]) {
      if (!progressState[0].skillsMastered.includes(skill)) {
        progressState[0].skillsMastered.push(skill);
        progressState[0].lastActive = new Date().toISOString();
      }
      return { ...progressState[0] };
    }
    return null;
},

addBonusStars: async (bonusAmount) => {
    await delay(200);
    if (progressState[0]) {
      progressState[0].totalStars += bonusAmount;
      progressState[0].lastActive = new Date().toISOString();
      return { ...progressState[0] };
    }
    return null;
  },

  getAchievementStats: async () => {
    await delay(200);
    const stored = localStorage.getItem('learnquest_achievement_stats');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      timedChallengesCompleted: 0,
      fastestTime: null,
      totalBonusStarsEarned: 0,
      achievementsUnlocked: 0
    };
  },

  updateAchievementStats: async (newStats) => {
    await delay(200);
    const current = await progressService.getAchievementStats();
    const updated = { ...current, ...newStats };
    localStorage.setItem('learnquest_achievement_stats', JSON.stringify(updated));
    return updated;
  }
};

export default progressService;