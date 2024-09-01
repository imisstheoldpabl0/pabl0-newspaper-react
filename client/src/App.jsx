import './App.css'
// import { BrowserRouter } from 'react-router-dom'
// import Header from './components/Header/Header.jsx';
import Main from './components/Main/Main';
import AdSense from './components/AdSense/AdSense';

function App() {

  return (
    <>
      <div className="app">
        <AdSense />
        <Main />
      </div>
    </>
  );
};

export default App
