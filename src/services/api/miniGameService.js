import miniGamesData from "../mockData/miniGames.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const miniGameService = {
  getMonsterMathProblems: async () => {
    await delay(300);
    return miniGamesData.monsterMath.map((problem) => ({ ...problem }));
  },

  getNumberMazeData: async () => {
    await delay(300);
    const mazes = miniGamesData.numberMaze;
    const randomMaze = mazes[Math.floor(Math.random() * mazes.length)];
    return JSON.parse(JSON.stringify(randomMaze));
  },

  getMathPuzzles: async () => {
    await delay(300);
    const shuffled = [...miniGamesData.mathPuzzles].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5).map((puzzle) => ({ ...puzzle }));
  }
};