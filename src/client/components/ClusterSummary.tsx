import React, { useState, useEffect, useRef, Suspense } from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useQuery } from "@apollo/client";
const RealTimeChart = React.lazy(() => import('../graphs/RealTimeChart'))
import { CLUSTER_SUMMARY, BROKERS_CPU_USAGE, BROKER_JVM_MEMORY_USAGE } from '../queries/graphQL';


const ClusterSummary = () => {
    console.log('Cluster Summary component');
    const [cluster, setCluster] = useState([]);
    const [brokerCount, setBrokerCount] = useState(0);
    const[underreplicatedPartitionsCount, setUnderreplicatedPartitionsCount] = useState(0);
    const [offlinePartitionsCount, setOfflinePartitionsCount] = useState(0);
    const [underMinISRCount, setUnderMinISRCount] = useState(0);
    const [activeControllerCount, setActiveControllerCount] = useState(0);
    const { loading, data, refetch } = useQuery(CLUSTER_SUMMARY, { pollInterval: 60 * 1000 });
   
    useEffect(()=> {
      if (loading) return;
      if (data.cluster) {
        const { brokerCount, activeControllerCount, underreplicatedPartitionsCount, offlinePartitionsCount, underMinISRCount } = data.cluster;
        
        if (brokerCount !== null) setBrokerCount(brokerCount);
        if (underreplicatedPartitionsCount !== null) setUnderreplicatedPartitionsCount(underreplicatedPartitionsCount);
        // if (activeControllerCount !== null) setBrokerCount(activeControllerCount);
        // if (brokerCount) setBrokerCount(brokerCount);
        // if (brokerCount) setBrokerCount(brokerCount);
      }

    },[loading, data]);
    
    return (
        <>
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4}}>
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
                          key = {'CPUUsageRTC'}
                          query={ BROKERS_CPU_USAGE }
                          metric = {'CPUUsageOverTime'}
                          resources = {'brokers'}
                          yLabel={'CPU Usage'}
                          title={'CPU Usage Over Time'}
                          step={'30s'}
                          labelName={'Broker'}
                          labelId={'id'}/>
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
                          key = {'JVMUsageRTC'}
                          query = {BROKER_JVM_MEMORY_USAGE}
                          metric = {'JVMMemoryUsedOverTime'}
                          resources = {'brokers'}
                          yLabel={'Memory Usage'}
                          title = {'Memory Usage Over Time'}
                          step={'30s'}
                          labelName={'Broker'}
                          labelId={'id'}/>
                      </Suspense>
                  </Paper>
                </Grid>
              </Grid>
          </Container>
            
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4}}>
            <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                    }}
                    elevation={8}>
                    <Typography component="p" variant="h6">{`Broker`}</Typography>
                    <Box sx={{p: 2}}>
                        <Typography component="p" variant="body1">
                            {`Follower Average Time (ms):`}
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                        {'Average time in ms it takes replicate partitions to receive new data'}
                        </Typography>
                    </Box>
                    <Box sx={{p: 2}}>
                        <Typography component="p" variant="body1">
                            {`Consumer Average Time (ms):`}
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                            {'Average time in ms it takes consumers to receive new data'}
                        </Typography>
                    </Box>
                    <Box sx={{p: 2}}>
                        <Typography component="p" variant="body1">
                            {`Producer Average Time (ms):}`}
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                            {'Average time in ms it takes producers to send new data to the broker'}
                        </Typography>
                    </Box>
                    <Box sx={{p: 2}}>
                        <Typography component="p" variant="body1">
                            {`Time of data:`}
                        </Typography>
                    </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </>
    )
};

export default ClusterSummary;