import axios from 'axios';
import { BASE_URL } from './Context';

export const topFivePlayersAlgorithm = async (setLoadAlgorithm, setTopFivePlayers) => {
  try {
    const medalsGoldCount = await axios.get(`${BASE_URL}/events?medal=Gold&__action=count`);
    const totalPages = Math.ceil(medalsGoldCount.data.count / 100);
    const events = await fetchDataInChunks(totalPages, 100);
    const playerGoldMedalsMap = new Map();

    events.forEach((event) => {
      const { playerId, gameId } = event;
      if (!playerGoldMedalsMap.has(playerId)) {
        playerGoldMedalsMap.set(playerId, new Set());
      }

      if (!playerGoldMedalsMap.get(playerId).has(gameId)) {
        playerGoldMedalsMap.get(playerId).add(gameId);
      }
    });

    const playersArray = [...playerGoldMedalsMap.entries()];
    playersArray.sort((a, b) => b[1].size - a[1].size);
    const top5Players = playersArray.slice(0, 5);
    let top5PlayersRes = [];
    for (const [playerId, gamesSet] of top5Players) {
      const playerName = await getPlayerName(playerId);
      top5PlayersRes.push({ name: playerName, value: gamesSet.size });
    }
    setLoadAlgorithm(false);
    setTopFivePlayers(top5PlayersRes);
  } catch (error) {
    setLoadAlgorithm(false);
    setTopFivePlayers([]);
  }
};

const fetchChunk = async (page, pageSize) => {
  try {
    const response = await axios.get(`${BASE_URL}/events?_limit=${pageSize}&page=${page}&medal=Gold`);
    await sleep(1000);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data for page ${page}: ${error.message}`);
  }
};

const fetchDataInChunks = async (totalPages, pageSize) => {
  try {
    const promises = [];
    for (let page = 0; page <= totalPages; page++) {
      promises.push(fetchChunk(page, pageSize));
    }
    const chunks = await Promise.all(promises);

    const allData = chunks.flat();

    return allData;
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

const getPlayerName = async (playerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/players/${playerId}`);
    return response.data.name;
  } catch (error) {
    console.error(`Error fetching player name for ID ${playerId}:`, error.message);
    return null;
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
