import React from 'react';
import Grid from '@mui/material/Grid';
import Header from './Header';
import Main from './Main';
import Navbar from './Navbar';
import { useTheme } from '@mui/material/styles';
import Brightness3Icon from "@mui/icons-material/Brightness3";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function Dashboard({ toggleTheme }){

    const theme = useTheme();
    const { palette } = theme;

    return(
        <>
            <Grid container spacing={2} sx={{ minHeight: '100%'}}>
                <Grid item md={12} sx={{ minHeight: '120px'}}>
                    <Header />
                    {palette.mode === 'light' ? 
                        <Brightness3Icon onClick={toggleTheme}/> : 
                        <Brightness7Icon onClick={toggleTheme}/>}
                </Grid>
                <Grid item md={12} sx={{ background: 'linear-gradient(to top, #CCE1EB, white)', minHeight: '120px'}}>
                    <Navbar />
                </Grid>
                <Grid item md={12} sx={{ bgcolor: 'primary.light', minHeight: '100vh' }}>
                    <Main />
                </Grid>
            </Grid>
        </>
    );
};

export default Dashboard;