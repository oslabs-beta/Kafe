import React from 'react';
import Status from '../components/Status';
import Menu from '../components/Menu';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

const linkStyle = {
    margin: "5px",
    padding: "0px 0px 20px 0px",
    textDecoration: "none",
    color: 'white',
    height: '5px',
  };

const divStyle = {
    height: "100vh",
    margin: "0px 0px 0px 10px"
};

const buttonStyle = {
    height: "50px"
};

function Sidebar(){

return(
    <>
        <div style={divStyle}>
        <Button  variant="contained" sx={{minWidth: 180, height: "35px"}}><Link to="/" style={linkStyle}>Home</Link></Button>
            <Status />
            <Menu />
        </div>
    </>
    );
}

export default Sidebar;