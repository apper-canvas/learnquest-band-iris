import sessionsData from "../mockData/sessions.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let sessionsState = [...sessionsData];

const sessionService = {
  getAll: async () => {
    await delay(200);
    return [...sessionsState];
  },

  getById: async (id) => {
    await delay(200);
    const session = sessionsState.find((s) => s.Id === parseInt(id));
    return session ? { ...session } : null;
  },

  getRecent: async (count = 5) => {
    await delay(200);
    return [...sessionsState]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, count);
  },

  create: async (sessionData) => {
    await delay(300);
    const maxId = sessionsState.length > 0 ? Math.max(...sessionsState.map((s) => s.Id)) : 0;
    const newSession = {
      Id: maxId + 1,
      timestamp: new Date().toISOString(),
      ...sessionData
    };
    sessionsState.push(newSession);
    return { ...newSession };
  }
};

export default sessionService;