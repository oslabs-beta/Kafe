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
          <Link to="/" style={linkStyle}> <Button sx= {{ minHeight: 50, minWidth: 120, margin: 2, marginTop: 4}} style= {{backgroundImage:`url(${logo})`}}></Button></Link>
    );
}

export default Header;

//<Button style= {{backgroundImage:`url(${logo})`}}></Button>