import React from 'react';
import Status from '../components/Status';
import Menu from '../components/Menu';
import { Link } from "react-router-dom";

const linkStyle = {
    margin: "1rem",
    textDecoration: "none",
    color: 'white'
  };

function Sidebar(){

return(
    <>
        <div>
        <button><Link to="/" style={linkStyle}>Home</Link></button>
            <Status />
            <Menu />
        </div>
    </>
    );
}

export default Sidebar;