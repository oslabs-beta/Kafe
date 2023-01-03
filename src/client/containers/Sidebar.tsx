import React, { useState, useEffect } from 'react';
import { useQuery } from "@apollo/client";
import Menu from '../components/Menu';
import { CLUSTER_SUMMARY } from '../queries/graphQL'; 
// For use with logo and icons; yet to be implemented
import { SvgIcon } from '@mui/material';

//Refactor inline styling
const divStyle = {
    height: "100vh",
    margin: "0px 0px 0px 10px"
};

function Sidebar(){

    let connectStatus = 'Loading';
    const status = useQuery(CLUSTER_SUMMARY);
    console.log('   status is... ', status);
    if(status.data)connectStatus = 'Connected';

    // check session if dashboard remounts

//   useEffect(() => {
//     verifyConnection();
//   }, []); //Run this once at the beginning


return(
    <>
        <div>System Status<br />{connectStatus}</div>
        <div style={divStyle}>
            <Menu />
        </div>
    </>
    );
}

export default Sidebar;