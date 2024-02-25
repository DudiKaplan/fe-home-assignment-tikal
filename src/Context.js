import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';
import { topFivePlayersAlgorithm } from './topFivePlayersAlgorithm';

export const BASE_URL = 'http://fe-home-assignment.infra.tikal.io/api';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ limit: 15, page: 0, medals: [], gameIds: [], playerIds: [] });
  const [events, setEvents] = useState({});
  const [games, setGames] = useState([]);
  const [loadAlgorithm, setLoadAlgorithm] = useState(true);
  const [topFivePlayers, setTopFivePlayers] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const filterQuery = `${
        !!filters.medals.length
          ? filters.medals.includes('All')
            ? '&medal.null=false'
            : `&medal.in=${JSON.stringify(filters.medals)}`
          : ''
      }${!!filters.gameIds.length ? `&gameId.in=${JSON.stringify(filters.gameIds)}` : ''}${
        !!filters.playerIds.length ? `&playerId.in=${JSON.stringify(filters.playerIds)}` : ''
      }`;
      try {
        const resEvents = await axios.get(
          `${BASE_URL}/events?_limit=${filters.limit}&_page=${filters.page}${filterQuery}`
        );
        const resEventsCount = await axios.get(`${BASE_URL}/events?__action=count${filterQuery}`);
        const resGameCount = await axios.get(`${BASE_URL}/games?__action=count`);
        const resGames = await axios.get(`${BASE_URL}/games?_limit=${resGameCount.data.count}&_page=0`);
        setEvents({ rows: resEvents.data, count: resEventsCount.data?.count });
        setGames(resGames.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchInitialData();
  }, [filters]);

  useEffect(() => {
    topFivePlayersAlgorithm(setLoadAlgorithm, setTopFivePlayers);
  }, []);

  return (
    <AppContext.Provider
      value={{
        loading,
        events,
        setFilters,
        games,
        topFivePlayers,
        loadAlgorithm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
