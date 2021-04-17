import { makeStyles } from '@material-ui/core/styles';
import Pokecard from './Pokecard';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: '2rem'
  },
});

const Pokecards = ({ pokemon }) => {
  const classes = useStyles();

  const renderPokemon = () => pokemon.map(pokemon => <Pokecard pokemon={pokemon} /> );

  return <div className={classes.root}>
    {renderPokemon()}
  </div>;
};

export default Pokecards;