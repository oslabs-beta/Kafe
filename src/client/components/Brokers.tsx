import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useQuery } from "@apollo/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const RealTimeChart = React.lazy(() => import('../graphs/RealTimeChart'));
import { BROKER_ALL_TIME_MS, BROKER_BYTES_IN, BROKER_BYTES_OUT } from '../queries/graphQL';

function Brokers(){
    const [brokerInfo, setBrokerInfo] = useState([]);
    const { loading, data, refetch } = useQuery(BROKER_ALL_TIME_MS, { pollInterval: 20 * 1000 });

    const loaded = useRef(null);

    useEffect(() => {
        if (loading || loaded.current) return;
        if (data.brokers) setBrokerInfo(data.brokers);

        return () => {
            loaded.current = true;
        };
    }, [loading, data]);

    useEffect(() => {
        loaded.current = false;
    }, []);

    const isLoading = <div>Loading...</div>
    return(
        <>
            <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper
                          sx={{
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                          }}
                          elevation={8}>
                             <Suspense fallback={<div>Loading...</div>}>
                                <RealTimeChart
                                key = {'BytesInRTC'}
                                query={ BROKER_BYTES_IN }
                                metric = {'bytesIn'}
                                resources = {'topicsBytesIn'}
                                yLabel={'Bytes In'}
                                title={'Bytes In Over Time'}
                                step={'30s'}
                                labelName={'Topic'}
                                labelId={'topic'}/>
                             </Suspense>
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
                            <Suspense fallback={<div>Loading...</div>}>
                                <RealTimeChart
                                    key = {'BytesOutRTC'}
                                    query={ BROKER_BYTES_OUT }
                                    metric = {'bytesOut'}
                                    resources = {'topicsBytesOut'}
                                    yLabel={'Bytes Out'}
                                    title={'Bytes Out Over Time'}
                                    step={'30s'}
                                    labelName={'Topic'}
                                    labelId={'topic'}/>
                            </Suspense>
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
                                <Typography component="p" variant="h6" sx={{p: 2}}>{`Broker ${broker.id}`}</Typography>
                                <Box sx={{p: 2}}>
                                    <Typography component="p" variant="body1">
                                        Follower Average Time (ms):&nbsp;&nbsp;&nbsp;&nbsp;
                                        <span className={broker.fetchFollowerTotalTimeMs.value < 500 ? 'good-metric' : 
                                                        broker.fetchFollowerTotalTimeMs.value < 1000 ? 'ok-metric' : 'bad-metric'}>
                                            {broker.fetchFollowerTotalTimeMs.value || 0}
                                        </span>
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ flex: 1 }}>
                                    {'Average time in ms it takes replicate partitions to receive new data'}
                                    </Typography>
                                </Box>
                                <Box sx={{p: 2}}>
                                    <Typography component="p" variant="body1">
                                        Consumer Average Time (ms):&nbsp;&nbsp;&nbsp;&nbsp;
                                        <span className={broker.fetchConsumerTotalTimeMs.value < 500 ? 'good-metric' : 
                                                        broker.fetchConsumerTotalTimeMs.value < 2000 ? 'ok-metric' : 'bad-metric'}>
                                            {broker.fetchConsumerTotalTimeMs.value || 0}
                                        </span>
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ flex: 1 }}>
                                        {'Average time in ms it takes consumers to receive new data'}
                                    </Typography>
                                </Box>
                                <Box sx={{p: 2}}>
                                    <Typography component="p" variant="body1">
                                        Consumer Average Time (ms):&nbsp;&nbsp;&nbsp;&nbsp;
                                        <span className={broker.produceTotalTimeMs.value < 500 ? 'good-metric' : 
                                                        broker.produceTotalTimeMs.value < 1000 ? 'ok-metric' : 'bad-metric'}>
                                            {broker.produceTotalTimeMs.value || 0}
                                        </span>
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