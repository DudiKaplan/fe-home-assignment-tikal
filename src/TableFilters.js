import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { Button, CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { FilterAltOffOutlined, FilterAltOutlined } from '@mui/icons-material';
import { BASE_URL, useAppContext } from './Context';
import axios from 'axios';

const TableFilters = () => {
  const [season, setSeason] = useState('');
  const [player, setPlayer] = useState('');
  const [lowerAge, setLowerAge] = useState(null);
  const [upperAge, setUpperAge] = useState(null);
  const [city, setCity] = useState('');
  const [cities, setCities] = useState('');
  const [medals, setMedals] = useState([]);
  const [isFiler, setIsFilter] = useState(false);
  const [loading, setLoading] = useState(false);

  const { games, setFilters } = useAppContext();

  const citiesOptions = new Set(games?.map((city) => city.city) || []);

  const handleSeasonChange = (event) => {
    setSeason(event.target.value);
  };

  const handleMedalsChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    if (value.includes('All')) {
      setMedals(['All']);
    } else {
      setMedals(value);
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const options = ['All', 'Bronze', 'Silver', 'Gold'];

  const handleFilterClick = async () => {
    if (!isFiler) {
      setLoading(true);
      let gameIds = [];
      let playerIds = [];
      console.log(player);
      console.log(lowerAge);
      if (city || season) {
        const resGames = await axios.get(
          `${BASE_URL}/games?${city ? `city=${city}&` : ''}${
            season ? (season === 'All' ? 'season.null=false' : `season=${season}`) : ''
          }`
        );
        gameIds = resGames.data.map((game) => game.id);
        if (!gameIds.length) gameIds = ['not found'];
      }
      if (player || lowerAge || upperAge) {
        const resPlayer = await axios.get(
          `${BASE_URL}/players?${player ? `name.contains=${player}&` : ''}${
            lowerAge && upperAge ? `age.gte=${lowerAge}&age.lte=${upperAge}` : ''
          }`
        );
        playerIds = resPlayer.data.map((player) => player.id);
        if (!playerIds.length) playerIds = [-999];
      }
      setFilters((filters) => {
        return { ...filters, page: 0, medals, gameIds, playerIds };
      });
      setLoading(false);
      setIsFilter(true);
    } else {
      setSeason('');
      setPlayer('');
      setMedals([]);
      setCity('');
      setCities('');
      setLowerAge(0);
      setUpperAge(0);
      setFilters((filters) => {
        return { ...filters, page: 0, medals: [], gameIds: [], playerIds: [] };
      });
      setIsFilter(false);
    }
  };

  return (
    <Paper
      sx={{
        width: '100%',
        bgcolor: 'background.default',
        pb: 1,
        gap: 1,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <TextField
        size="small"
        id="outlined-basic"
        label="Player"
        variant="outlined"
        value={player}
        onChange={(e) => setPlayer(e.target.value)}
      />
      <TextField
        size="small"
        id="outlined-basic"
        label="Lower Age"
        variant="outlined"
        type="number"
        value={lowerAge}
        onChange={(e) => setLowerAge(e.target.value)}
      />
      <TextField
        size="small"
        id="outlined-basic"
        label="Upper Age"
        variant="outlined"
        type="number"
        value={upperAge}
        onChange={(e) => setUpperAge(e.target.value)}
      />
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="season-label">Season</InputLabel>
          <Select labelId="season-label" id="season-select" value={season} label="Season" onChange={handleSeasonChange}>
            <MenuItem value={'All'}>All</MenuItem>
            <MenuItem value={'Summer'}>Summer</MenuItem>
            <MenuItem value={'Winter'}>Winter</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 150 }}>
        <FormControl fullWidth size="small">
          <Autocomplete
            size="small"
            value={cities}
            onChange={(event, newValue) => {
              setCities(newValue);
            }}
            inputValue={city}
            onInputChange={(event, newInputValue) => {
              setCity(newInputValue);
            }}
            id="controllable-City"
            options={Array.from(citiesOptions)}
            renderInput={(params) => <TextField {...params} label="City" />}
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="medals-checkbox-label">Medals</InputLabel>
          <Select
            labelId="medals-checkbox-label"
            id="medals-checkbox"
            multiple
            value={medals}
            onChange={handleMedalsChange}
            input={<OutlinedInput label="Medals" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {options.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={medals.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Button
        onClick={handleFilterClick}
        variant="outlined"
        endIcon={isFiler ? <FilterAltOffOutlined /> : <FilterAltOutlined />}
      >
        {loading ? <CircularProgress size={20} /> : <>Filter</>}
      </Button>
    </Paper>
  );
};

export default TableFilters;
