/*import React from 'react'
import './App.css'
import NavBar from './NavBar'
import Home from './Home'
import Footer from './Footer'

function App() {

  return (
    <>
      <NavBar />
      <Home />
      <Footer />
    </>
  )
}

export default App
*/
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import AboutUs from './AboutUs';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </Router>
  );
};

export default App
