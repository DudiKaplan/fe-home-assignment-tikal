import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

import TableRows from './TableRows';
import { ContextProvider } from './Context';
import BarChartTopFivePlayers from './BarChart';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#282c34',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'unset',
          boxShadow: 'unset',
        },
      },
    },
  },
});

const PaperContainer = styled(Paper)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '4rem',
});

function App() {
  return (
    <ContextProvider>
      <ThemeProvider theme={darkTheme}>
        <PaperContainer>
          <Typography variant="h1">Olympics Games</Typography>
          <TableRows />
          <BarChartTopFivePlayers />
        </PaperContainer>
      </ThemeProvider>
    </ContextProvider>
  );
}

export default App;
