import React from "react";
import ServicesHeading from "./ServicesHeading";
import TrainingPlans from "./TrainingPlans";
import MembershipPlans from "./MembershipPlans";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Services = () => {
  return (
  <>
  <NavBar/>
  <ServicesHeading/>
  <TrainingPlans/>
  <MembershipPlans/>
  <Footer/>
  </>
  );
}

export default Services