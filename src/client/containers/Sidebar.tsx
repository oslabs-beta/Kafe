import React from 'react';
import Status from '../components/Status';
import Menu from '../components/Menu';
// For use with logo and icons; yet to be implemented
import { SvgIcon } from '@mui/material';

//Refactor inline styling
const divStyle = {
    height: "100vh",
    margin: "0px 0px 0px 10px"
};

function Sidebar(){

return(
    <>
        <div style={divStyle}>
            <Status />
            <Menu />
        </div>
    </>
    );
}

export default Sidebar;