import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { BASE_URL, useAppContext } from './Context';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import { TablePaginationActions } from './TablePaginationActions';
import axios from 'axios';
import TableFilters from './TableFilters';
import { CircularProgress } from '@mui/material';

function Row({ event, sport, medal, gameId, playerId }) {
  const [open, setOpen] = React.useState(false);
  const [details, setDetails] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const handleOnOpen = async () => {
    setLoading(true);
    if (!open) {
      try {
        const game = await axios.get(`${BASE_URL}/games/${gameId}`);
        const player = await axios.get(`${BASE_URL}/players/${playerId}`);
        setDetails({ game: game.data, player: player.data });
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
    setOpen(!open);
  };
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={handleOnOpen}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {event}
        </TableCell>
        <TableCell>{sport}</TableCell>
        <TableCell>{medal === 'Gold' ? '🥇' : medal === 'Silver' ? '🥈' : medal === 'Bronze' ? '🥉' : ''}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Typography variant="body1" gutterBottom component="div">
                Player
              </Typography>
              <Table size="small" aria-label="player">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Sex</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell>Age</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{details?.player?.name}</TableCell>
                    <TableCell>{details?.player?.sex}</TableCell>
                    <TableCell>{details?.player?.team}</TableCell>
                    <TableCell>{details?.player?.age}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography sx={{ mt: 2 }} variant="body1" gutterBottom component="div">
                Game
              </Typography>
              <Table size="small" aria-label="game">
                <TableHead>
                  <TableRow>
                    <TableCell>Season</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Games</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{details?.game?.season}</TableCell>
                    <TableCell>{details?.game?.city}</TableCell>
                    <TableCell>{details?.game?.year}</TableCell>
                    <TableCell>{details?.game?.games}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function TableRows() {
  const { events, setFilters } = useAppContext();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const { loading } = useAppContext();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    setFilters((filters) => {
      return { ...filters, limit: rowsPerPage, page };
    });
  }, [setFilters, page, rowsPerPage]);
  return (
    <Paper
      sx={{
        width: '100%',
        p: 2,
        bgcolor: 'background.default',
        border: '1px solid rgba(81, 81, 81, 1)',
      }}
    >
      <TableFilters />
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '40vh' }}>
          <CircularProgress></CircularProgress>
        </Box>
      ) : (
        <TableContainer
          sx={{
            height: '40vh',
            overflow: 'auto',
            '::-webkit-scrollbar': {
              width: '0.4em',
            },
            '::-webkit-scrollbar-thumb': {
              backgroundColor: 'white',
              borderRadius: '20px',
            },
          }}
          component={Paper}
        >
          <Table sx={{ bgcolor: 'background.default' }} aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Sport</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>Medal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events?.rows?.map((row) => (
                <Row key={row.eventId} {...row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TableContainer component={Paper}>
        <Table stickyHeader sx={{ bgcolor: 'background.default' }} aria-label="collapsible table">
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[15, 50, 100]}
                colSpan={3}
                count={events?.count}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
}
