import React from 'react';
import { Link } from "react-router-dom";
import logo from '../assets/Logo.png';
import { Button } from '@mui/material'

const linkStyle = {
    textDecoration: "none",
    color: 'black'
  };

function Header(){

return(
        <Link to="/" style={linkStyle}> <Button style= {{backgroundImage:`url(${logo})`}}></Button></Link>
    );
}

export default Header;