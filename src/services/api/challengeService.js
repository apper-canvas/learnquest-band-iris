import challengesData from "../mockData/challenges.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const challengeService = {
  getAll: async () => {
    await delay(300);
    return [...challengesData];
  },

  getById: async (id) => {
    await delay(200);
    const challenge = challengesData.find((c) => c.Id === parseInt(id));
    return challenge ? { ...challenge } : null;
  },

  getByType: async (type) => {
    await delay(300);
    return challengesData.filter((c) => c.type === type).map((c) => ({ ...c }));
  },

  getBySkillAndDifficulty: async (skill, difficulty) => {
    await delay(300);
    return challengesData
      .filter((c) => c.skill === skill && c.difficulty === parseInt(difficulty))
      .map((c) => ({ ...c }));
  },

  getRandomByType: async (type, count = 5) => {
    await delay(300);
    const filtered = challengesData.filter((c) => c.type === type);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((c) => ({ ...c }));
  }
};

export default challengeService;