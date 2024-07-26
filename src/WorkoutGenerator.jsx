import React, { useState } from 'react';
import WorkoutPlans from './WorkoutPlans';
import NavBar from './NavBar';
import Footer from './Footer'


const WorkoutGenerator = () => {

  return (
    <>
    <NavBar/>
    <WorkoutPlans/>
    <Footer/>
    </>
  );
};


export default WorkoutGenerator;
