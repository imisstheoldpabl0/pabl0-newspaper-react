import './App.css'
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import AdSense from './components/AdSense/AdSense';

function App() {
  const client = import.meta.env.VITE_ADSENSE_CLIENT
  const slot = import.meta.env.VITE_ADSENSE_CLIENT

  return (
    <>
      <div className="app">
        <AdSense
          client={client}
          slot={slot}
          format="auto"
          responsive="true" />
        <Header />
        <Main />
      </div>
    </>
  );
};

export default App
