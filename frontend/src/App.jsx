import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import AboutUs from './AboutUs';
import Services from './Services';
import RegisterForm from './RegisterForm';
import ContactUs from './ContactUs';
import WorkoutGenerator from './WorkoutGenerator';
import AdminDashboard from './AdminDashboard';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './Dashboard';
import AdminLogin from './AdminLogin';
import AdminRoute from './AdminRoute';


const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login />}/>
      <Route path="/home" element={<Home />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/services" element={<Services/>} />
      <Route path="/Contact-us" element={<ContactUs/>} />
      <Route path="/registration" element={<RegisterForm/>} />
      <Route path="/Workout-generator" element={<ProtectedRoute component={WorkoutGenerator} />} />
      <Route path="/Admin-Dashboard" element={<AdminRoute component={AdminDashboard} />} />
      <Route path='/adminlogin' element={<AdminLogin/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>

      </Routes>
    </Router>
  );
};

export default App