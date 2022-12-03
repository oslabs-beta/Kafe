import React from 'react';
import { Link } from "react-router-dom";

const linkStyle = {
    textDecoration: "none",
    color: 'black'
  };

function Header(){

return(
        <Link to="/" style={linkStyle}> <img src= "../assets/Logo.png" alt="Kafe logo not working"></img></Link>
    );
}

export default Header;