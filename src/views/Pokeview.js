import { useEffect, useState } from "react";
import superagent from "superagent";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import TextField from "@material-ui/core/TextField";

import Pokecards from "../components/Pokecards";
import { capitalize, chunkArray } from "../utils";

const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";
const POST_URL = "http://localhost:3001/pokemon";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    padding: "2rem 0",
  },
  inputContainer: {
    marginBottom: "2rem",
  },
  textField: {
    margin: "0 0.5rem",
  },
  idBox: {
    margin: "0 0 2rem",
  },
  fetchButton: {
    fontWeight: "600",
  },
}));

const Pokeview = () => {
  const [basePokemon, setBasePokemon] = useState([]);
  const [inputId, setInputId] = useState("");
  const [loading, setLoading] = useState(false);
  const [pokeChips, setPokeChips] = useState([]);
  const [pokemon, setPokemon] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      console.log('ONCE');
      const { body: { results: fetchedPokemon } } = await superagent.get(`${POKE_API_URL}?limit=151`);

      const chunkedPokemon = chunkArray(fetchedPokemon, 20);

      const finalPokemon = [];

      chunkedPokemon.forEach(async chunk => {
        const pokemonWithData = await Promise.all(chunk.map(async ({url}) => {
          const { body: pokeWithData } = await superagent.get(url)
          return pokeWithData;
        }));

        finalPokemon.push(...pokemonWithData);
      })

      finalPokemon.sort((a, b) => a.id - b.id);

      setBasePokemon(finalPokemon);
    })();
  }, []);

  const addAllIds = () => {
    const ids = [];
    for (let i = 1; i < 152; i++) {
      ids.push({ id: i });
    }
    setPokeChips(ids);
  }

  const addId = () => {
    if (inputId === "") {
      return;
    }

    setPokeChips((prevChips) => {
      if (prevChips.find((prevChip) => prevChip.id === inputId)) {
        return prevChips;
      }
      return [...prevChips, { id: inputId }];
    });

    setInputId("");
  };

  const maybeAddIdOnEnter = (e) => {
    console.log('input')
    if (e.keyCode === 13) addId(e);
  }

  const handleIdDelete = (id) => {
    setPokeChips((prevChips) =>
      prevChips.filter((prevChip) => prevChip.id !== id)
    );
  };

  const clearIds = () => {
    setInputId("");
    setPokeChips([]);
  }

  const fetchPokemon = async () => {
    setLoading(true);

    const { body: fetchedPokemon } = await superagent
      .post(POST_URL)
      .send({ ids: pokeChips.map(({ id }) => id) });

    setPokeChips((prevChips) => {
      const chips = prevChips;
      chips.forEach((chip) => {
        fetchedPokemon.forEach((poke) => {
          if (poke.id === chip.id) {
            chip.name = capitalize(poke.name);
          }
        });
      });
      return chips;
    });

    setPokemon(fetchedPokemon);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setInputId(e.target.value);
  };

  const getChipColor = (id) =>
    pokemon.filter((poke) => {
      return id === poke.id;
    }).length > 0
      ? "secondary"
      : "default";

  const renderIdChips = () => {
    const chipsWithOutNames = [];
    const chipsWithNames = pokeChips.filter(chip => {
      if (chip.name) {
        return true;
      } else {
        chipsWithOutNames.push(chip);
        return false;
      }
    }).sort((a, b) => a.id - b.id);

    chipsWithOutNames.sort((a, b) => a.id - b.id);

    return [...chipsWithNames, ...chipsWithOutNames].map(({ id, name }) => (
      <Chip
        color={getChipColor(id)}
        key={id + Math.random()}
        label={name ? name : id}
        onDelete={() => handleIdDelete(id)}
      />
    ));
  }

  return (
    <Box className={classes.root}>
      <div className={classes.inputContainer}>
        <TextField
          className={classes.textField}
          color="secondary"
          error={isNaN(inputId)}
          helperText={isNaN(inputId) ? "ID must be a number" : ""}
          id="outlined-basic"
          label="Pokemon ID"
          onChange={(e) => handleInputChange(e)}
          onKeyUp={(e) => maybeAddIdOnEnter(e)}
          size="small"
          value={inputId}
          variant="outlined"
        />
        <Button variant="contained" disabled={inputId === "" || isNaN(inputId)} onClick={addId}>
          Add ID
        </Button>
        <Button color="secondary" onClick={clearIds}>
          Clear
        </Button>
        <Button color="" onClick={addAllIds}>
          All Pokémon
        </Button>
      </div>
      <Box className={classes.idBox}>
        {renderIdChips()}
      </Box>
      {loading ? <CircularProgress color="secondary" /> : null}
      <Button
        variant="contained"
        color="secondary"
        className={classes.fetchButton}
        disabled={loading}
        startIcon={<CloudDownloadIcon />}
        onClick={fetchPokemon}
      >
        Fetch Pokemon
      </Button>
      <Pokecards pokemon={pokemon} />
    </Box>
  );
};

export default Pokeview;
