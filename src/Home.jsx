import React from "react";
import Banner from "./Banner";
import FeaturedClasses from "./FeaturedClasses";
import GymAmenities from "./GymAmenities";
import NavBar from "./NavBar";
import Footer from "./Footer";



function Home(){
  return <>
  <NavBar/>
  <Banner/>
  <FeaturedClasses/>
  <GymAmenities/>
  <Footer/>
  </>
}

export default Home