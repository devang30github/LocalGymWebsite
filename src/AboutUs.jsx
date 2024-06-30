import React from 'react';
import { Box, Typography } from '@mui/material';

const AboutUs = () => {
  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body1" gutterBottom>
        Welcome to our gym! We are dedicated to providing the best fitness experience with state-of-the-art equipment, professional trainers, and a vibrant community. Join us to achieve your fitness goals.
      </Typography>
    </Box>
  );
};

export default AboutUs;
