import React from 'react';
import { Outlet } from "react-router-dom";

function Main(){

return(
        <>
            <Outlet />
        </>
    );
};

export default Main;