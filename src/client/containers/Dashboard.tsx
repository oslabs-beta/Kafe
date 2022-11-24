import React from 'react';
import Grid from '@mui/material/Grid';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Sidebar from './Sidebar';

function Dashboard(){
return(
    <>
        <Grid container spacing={2} sx={{ height: '100%' }}>
            <Grid item xs={12} sx={{bgcolor: 'primary.main', height: '17%'}}>
                <Header />
            </Grid>
            <Grid item xs={2} sx={{ bgcolor: 'primary.light'}}>
                <Sidebar />
            </Grid>
            <Grid item xs={10} sx={{ height: '73%' }}>
                <Main />
            </Grid>
            <Grid item xs={12} sx={{ bgcolor: 'primary.main', height: '13%'}}>
                <Footer />
            </Grid>
        </Grid>
    </>
    );
}

export default Dashboard;