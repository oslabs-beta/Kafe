import React from 'react';
import Grid from '@mui/material/Grid';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Sidebar from './Sidebar';

function Dashboard(){
return(
    <>
        <Grid container spacing={2} sx={{ minHeight: '100%', borderTop: 8, borderColor: 'white' }}>
            <Grid item xs={12} sx={{bgcolor: 'primary.light', minHeight: '120px', border: 4, borderColor: 'white'}}>
                <Header />
            </Grid>
            <Grid item xs={2} sx={{ bgcolor: 'primary.light', minHeight: '65%', border: 4, borderColor: 'white'}}>
                <Sidebar />
            </Grid>
            <Grid item xs={10} sx={{ height: '85%' }}>
                <Main />
            </Grid>
            {/* <Grid item xs={12} sx={{ bgcolor: 'primary.main', height: '13%'}}>
                <Footer />
            </Grid> */}
        </Grid>
    </>
    );
}

export default Dashboard;