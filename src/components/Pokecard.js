import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import BugIcon from '@material-ui/icons/EmojiNature';
import FolderIcon from "@material-ui/icons/Folder";
import ElectricIcon from '@material-ui/icons/FlashOn';
import FireIcon from '@material-ui/icons/Whatshot';
import GrassIcon from '@material-ui/icons/Eco';
import IceIcon from '@material-ui/icons/AcUnit';
import NormalIcon from '@material-ui/icons/FitnessCenter';
import FlyingIcon from '@material-ui/icons/Loop';
import { capitalize, colorNameToHex, getContrastYIQ } from '../utils';

const useStyles = makeStyles({
  root: {
    border: "8px solid #eded00",
    marginBottom: "1rem",
    maxWidth: 350,
  },
  media: {
    backgroundSize: "contain",
    borderRadius: "5px 5px 0 0",
    height: 175,
    padding: "0.75rem",
  },
  content: {
    height: '375px'
  }
});

const Pokecard = ({ pokemon }) => {
  const classes = useStyles();

  if (pokemon.name === "notfound") {
    return null;
  }

  const textColor = getContrastYIQ( colorNameToHex(pokemon.color) );

  const getMoveIcon = (type) => {
    switch (type) {
      case 'bug':
        return <BugIcon  htmlColor={textColor} />
      case 'electric':
        return <ElectricIcon  htmlColor={textColor} />
      case 'fire':
        return <FireIcon  htmlColor={textColor} />
      case 'grass':
        return <GrassIcon  htmlColor={textColor} />
      case 'ice':
        return <IceIcon  htmlColor={textColor} />
      case 'normal':
        return <NormalIcon  htmlColor={textColor} />
      case 'flying':
        return <FlyingIcon  htmlColor={textColor} />
      default:
        return <FolderIcon  htmlColor={textColor} />
    }
  }

  const renderMoves = () => {
    return pokemon.moves?.map(({ description, name, type}) => (
      <ListItem dense={true} disableGutters key={name} key={name}>
        <ListItemIcon>
          {getMoveIcon(type)}
        </ListItemIcon>
        <ListItemText
          primary={capitalize(name)}
          secondary={description}
          style={{ color: textColor }}
        />
      </ListItem>
    ));
  };

  return (
    <Card className={classes.root} style={{ color: textColor }}>
        <CardMedia
          className={classes.media}
          image={pokemon.sprite}
          style={{ border: `8px solid ${pokemon.color}` }}
          title={`Pokemon named ${pokemon.name}`}
        />
        <CardContent className={classes.content} style={{ backgroundColor: pokemon.color }}>
          <Typography gutterBottom variant="h5" component="h2">
            {capitalize(pokemon.name)}
          </Typography>
          <Typography variant="body2" component="p">
            {pokemon.description}
          </Typography>
          <div>
            <List dense={true}>{renderMoves()}</List>
          </div>
        </CardContent>
    </Card>
  );
};

export default Pokecard;
