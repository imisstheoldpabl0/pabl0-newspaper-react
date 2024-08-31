import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Header from './components/Header/Header.jsx';
import Main from './components/Main/Main';
import AdSense from './components/AdSense/AdSense';

function App() {
  const client = import.meta.env.VITE_ADSENSE_CLIENT
  const slot = import.meta.env.VITE_ADSENSE_CLIENT

  return (
    <>
      <div className="app">
        <AdSense/>
        <BrowserRouter>
          <Header />
          <Main />
        </BrowserRouter>
      </div>
    </>
  );
};

export default App
