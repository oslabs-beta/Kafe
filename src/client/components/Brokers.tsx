import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from "@apollo/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import RealTimeChart from '../graphs/RealTimeChart';

import { BROKER_ALL_TOTALTIMEMS } from '../queries/graphQL';

function Brokers(){
    const [brokerInfo, setBrokerInfo] = useState([]);
    
    const timeRef = useRef(new Date(Date.now()));
    const { loading, data, refetch } = useQuery(BROKER_ALL_TOTALTIMEMS);

    useEffect(() => {
        if (loading) return;

        if (data.brokers) setBrokerInfo(data.brokers);
    }, [loading]);

    console.log('Brokers component: ', brokerInfo);
    const isLoading = <div>Loading...</div>
    return(
        <>
            <h3>Brokers</h3>
            {brokerInfo.length > 0 &&
                <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
                    {brokerInfo.map(broker => <div>'Hello'</div>)}
                </Grid> }
        </>
    );
}

export default Brokers;