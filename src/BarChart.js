import { Box, Skeleton, Typography } from '@mui/material';
import React from 'react';
import { BarChart, Legend, Tooltip, YAxis, CartesianGrid, XAxis, Bar, ResponsiveContainer } from 'recharts';
import { useAppContext } from './Context';

const BarChartTopFivePlayers = () => {
  const { loadAlgorithm, topFiveGames } = useAppContext();

  return (
    <Box sx={{ height: '40vh', p: 1, width: '100%' }}>
      <Typography variant="h5">Top 5 Players (Gold 🥇 medal count)</Typography>

      {loadAlgorithm ? (
        <Skeleton variant="rectangular" width={'100%'} height={'100%'} />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={500} height={300} data={topFiveGames}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis domain={[0, 800]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default BarChartTopFivePlayers;
