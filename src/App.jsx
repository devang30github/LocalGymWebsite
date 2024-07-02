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
import Services from './Services';
import RegisterForm from './RegisterForm';


const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services/>} />
        <Route path="/registration" element={<RegisterForm/>} />
      </Routes>
    </Router>
  );
};

export default App
