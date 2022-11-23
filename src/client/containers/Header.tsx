import React from 'react';

const linkStyle = {
    textDecoration: "none",
    color: 'black'
  };

function Header(){

return(
        <a href="/" style={linkStyle}><h1>Kafe</h1></a>
    );
}

export default Header;