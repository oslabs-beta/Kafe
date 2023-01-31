import React from 'react';
import Grid from '@mui/material/Grid';
import Header from './Header';
import Main from './Main';
import Sidebar from './Sidebar';

function Dashboard(){
return(
    <>
        <Grid container spacing={2} sx={{ minHeight: '100%', borderTop: 8, borderColor: 'white' }}>
            <Grid item md={12} sx={{bgcolor: 'primary.light', minHeight: '120px', border: 4, borderColor: 'white'}}>
                <Header />
            </Grid>
            <Grid item md={2} sx={{ bgcolor: 'primary.light', minHeight: '65%', border: 4, borderColor: 'white'}}>
                <Sidebar />
            </Grid>
            <Grid item md={10} sx={{ height: '85%' }}>
                <Main />
            </Grid>
        </Grid>
    </>
    );
}

export default Dashboard;