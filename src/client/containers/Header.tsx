import React from 'react';
import { Link } from "react-router-dom";

const linkStyle = {
    textDecoration: "none",
    color: 'black'
  };

function Header(){

return(
        <Link to="/" style={linkStyle}><h1>Kafe</h1></Link>
    );
}

export default Header;