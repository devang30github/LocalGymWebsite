import React from 'react';
import { Box, Typography, Link, Grid } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'black',
        padding: '2rem 2rem',
        marginTop: '2rem',
        
        
      }}
    >
      <Grid container spacing={4} justifyContent="center" textAlign="center">
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Siddhivinayak Gym
          </Typography>
          <Typography variant="body2">
            Near Sambhaji Nagar Ground Dahisar Mumbai 
          </Typography>
          <Typography variant="body2">
            Phone: 9977665544
          </Typography>
          <Typography variant="body2">
            Email: info@fitgenius.com
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Follow Us
          </Typography>
          <Box>
            <Link href="#" color="inherit" sx={{ marginRight: '1rem' }}>
              <FacebookIcon />
            </Link>
            <Link href="#" color="inherit" sx={{ marginRight: '1rem' }}>
              <TwitterIcon />
            </Link>
            <Link href="#" color="inherit" sx={{ marginRight: '1rem' }}>
              <InstagramIcon />
            </Link>
            <Link href="#" color="inherit">
              <YouTubeIcon />
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Home
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              About
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Classes
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Membership
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Contact
            </Link>
          </Typography>
        </Grid>
      </Grid>
      <Box textAlign="center" pt={4} pb={2}>
        <Typography variant="body2" color="white" >
          &copy; 2024 Siddhivinayak Gym. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
