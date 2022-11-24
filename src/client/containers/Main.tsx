import React from 'react';
import { Outlet } from "react-router-dom";
import Visuals from '../components/Visuals';

function Main(){

return(
    <>
        <Outlet />
    </>
    );
}

export default Main;