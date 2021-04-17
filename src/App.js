import Container from '@material-ui/core/Container';
import Pokeview from './views/Pokeview';
import './App.css';

function App() {
  return (
    <Container maxWidth="md" className="App">
      <Pokeview />
    </Container>
  );
}

export default App;
