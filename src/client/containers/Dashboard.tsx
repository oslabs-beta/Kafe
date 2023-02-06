import React from 'react';
import Grid from '@mui/material/Grid';

//imported modules
import Header from './Header';
import Main from './Main';
import Navbar from './Navbar';

function Dashboard(){
return(
    <>
        <Grid container spacing={2} sx={{ minHeight: '100%'}}>
            <Grid item md={12} sx={{ minHeight: '120px'}}>
                <Header />
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
}

export default Dashboard;