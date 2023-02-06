import React from 'react';
import { Link } from "react-router-dom";
import { Button } from '@mui/material'
import logo from '../assets/Logo2.png';

const linkStyle = {
  textDecoration: "none",
  color: 'black'
};

function Header(){

  return(
    <Link to="/overview" style={linkStyle}> 
      <Button 
        sx= {{ 
          minHeight: 59, 
          minWidth: 140, 
          marginTop: 5,
          marginLeft: 5,
          marginBottom: 0 }} 
        style= {{backgroundImage:`url(${logo})`}}>
      </Button>
    </Link>
  );
};

export default Header;