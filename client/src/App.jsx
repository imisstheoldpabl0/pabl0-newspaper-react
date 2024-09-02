import './App.css'
// import { BrowserRouter } from 'react-router-dom'
// import Header from './components/Header/Header.jsx';
import Main from './components/Main/Main';
import AdSense from './components/AdSense/AdSense';
import Header from './components/Header/Header';
import { BrowserRouter } from 'react-router-dom';

function App() {

  return (
    <>
      <div className="app">
        <BrowserRouter>
          <Header />
          <Main />
        </BrowserRouter>
      </div>
    </>
  );
};

export default App
