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

function Sidebar(){

return(
    <>
        <div>
        <Button  variant="contained" sx={{minWidth: 180}}><Link to="/" style={linkStyle}>Home</Link></Button>
            <Status />
            <Menu />
        </div>
    </>
    );
}

export default Sidebar;