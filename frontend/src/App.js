import './App.css';
import Routes from './routes';
import { AppContextProvider } from './context';

function App() {
  return (
    <div className="App">
      <AppContextProvider>
        <Routes />
      </AppContextProvider>
    </div>
  );
}

export default App;
