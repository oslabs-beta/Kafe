import React from 'react';
import { Link } from "react-router-dom";
import logo from '../assets/Logo2.png';
import { Button } from '@mui/material'

const linkStyle = {
    textDecoration: "none",
    color: 'black'
  };

function Header(){

return(
    <Link to="/" style={linkStyle}> 
    <Button 
    sx= {{ 
      minHeight: 59, 
      minWidth: 140, 
      marginTop: 5,
      marginLeft: 5,
      marginBottom: 0 }} 
    style= {{backgroundImage:`url(${logo})`}}>
    </Button></Link>
  );
}

export default Header;