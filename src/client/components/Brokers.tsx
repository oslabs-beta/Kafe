import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from "@apollo/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
//We implemented global typography, do we need the below?
import Typography from "@mui/material/Typography";

import RealTimeChart from '../graphs/RealTimeChart';

import { BROKER_ALL_TIME_MS, BROKER_BYTES_IN, BROKER_BYTES_OUT } from '../queries/graphQL';

function Brokers(){
    const [brokerInfo, setBrokerInfo] = useState([]);

    // const timeRef = useRef(new Date(Date.now()));
    const { loading, data, refetch } = useQuery(BROKER_ALL_TIME_MS, { pollInterval: 20 * 1000 });

    useEffect(() => {
        if (loading) return;

        if (data.brokers) setBrokerInfo(data.brokers);
    }, [loading, data]);

    console.log('Brokers component: ', brokerInfo);

    const isLoading = <div>Loading...</div>
    return(
        <>
            <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
                <h2>Brokers</h2>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper
                          sx={{
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                          }}
                          elevation={8}>
                            <RealTimeChart
                                query={ BROKER_BYTES_IN }
                                metric = {'bytesIn'}
                                resources = {'topicsBytesIn'}
                                yLabel={'Bytes In'}
                                title={'Bytes In Over Time'}
                                step={'30s'}
                                labelName={'Topic'}
                                labelId={'topic'}/>
                          </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper
                          sx={{
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                          }}
                          elevation={8}>
                            <RealTimeChart
                                query={ BROKER_BYTES_OUT }
                                metric = {'bytesOut'}
                                resources = {'topicsBytesOut'}
                                yLabel={'Bytes Out'}
                                title={'Bytes Out Over Time'}
                                step={'30s'}
                                labelName={'Topic'}
                                labelId={'topic'}/>
                          </Paper>
                    </Grid>
                </Grid>

                {brokerInfo.length > 0 &&
                <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
                    {[...brokerInfo].sort((a, b) => a.id - b.id).map(broker =>
                        <Grid key={`$Broker${broker.id}MsMetrics`} item xs={12} md={6}>
                            <Paper
                                sx={{
                                  p: 2,
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                                elevation={8}>
                                <Typography component="p" variant="h6">{`Broker ${broker.id}`}</Typography>
                                <Box sx={{p: 2}}>
                                    <Typography component="p" variant="body1">
                                        {`Follower Average Time (ms): ${broker.fetchFollowerTotalTimeMs ? broker.fetchFollowerTotalTimeMs.value : 0}`}
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ flex: 1 }}>
                                    {'Average time in ms it takes replicate partitions to receive new data'}
                                    </Typography>
                                </Box>
                                <Box sx={{p: 2}}>
                                    <Typography component="p" variant="body1">
                                        {`Consumer Average Time (ms): ${broker.fetchConsumerTotalTimeMs ? broker.fetchConsumerTotalTimeMs.value : 0}`}
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ flex: 1 }}>
                                        {'Average time in ms it takes consumers to receive new data'}
                                    </Typography>
                                </Box>
                                <Box sx={{p: 2}}>
                                    <Typography component="p" variant="body1">
                                        {`Producer Average Time (ms): ${broker.produceTotalTimeMs ? broker.produceTotalTimeMs.value : 0}`}
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ flex: 1 }}>
                                        {'Average time in ms it takes producers to send new data to the broker'}
                                    </Typography>
                                </Box>
                                <Box sx={{p: 2}}>
                                    <Typography component="p" variant="body1">
                                        {`Time of data: ${broker.produceTotalTimeMs?.time ? broker.produceTotalTimeMs.time : new Date().toLocaleString()}`}
                                    </Typography>
                                </Box>

                            </Paper>
                        </Grid>)}
                </Grid> }
            </Container>
        </>
    );
}

export default Brokers;