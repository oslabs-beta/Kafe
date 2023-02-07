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
    
    const [brokerCount, setBrokerCount] = useState(0);
    const [underreplicatedPartitionsCount, setUnderreplicatedPartitionsCount] = useState(0);
    const [offlinePartitionsCount, setOfflinePartitionsCount] = useState(0);
    const [underMinISRCount, setUnderMinISRCount] = useState(0);
    const [activeControllersCount, setActiveControllersCount] = useState(0);
    const { loading, data, refetch } = useQuery(CLUSTER_SUMMARY, { pollInterval: 60 * 1000 });
   
    useEffect(()=> {
      if (loading) return;
      if (data.cluster) {
        const { brokerCount, activeControllersCount, underreplicatedPartitionsCount, offlinePartitionsCount, underMinISRCount } = data.cluster;
        
        if (brokerCount !== null) setBrokerCount(brokerCount);
        if (underreplicatedPartitionsCount !== null) setUnderreplicatedPartitionsCount(underreplicatedPartitionsCount);
        if (activeControllersCount !== null) setActiveControllersCount(activeControllersCount);
        if (underMinISRCount !== null) setUnderMinISRCount(underMinISRCount);
        if (offlinePartitionsCount) setOfflinePartitionsCount(brokerCount);
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
                          yLabel={'CPU Usage (% of Total)'}
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
                          yLabel={'Memory Usage (Bytes/Sec)'}
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
                <Grid item>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                    }}
                    elevation={8}>
                    <Typography component="p" variant="h6" sx={{p: 2}}>Cluster Information</Typography>
                    <Box sx={{p: 2}}>
                        <Typography component="p" variant="body1">
                          Active Controller Count:&nbsp;&nbsp;&nbsp;&nbsp;
                          <span className={activeControllersCount > 1 ? 'bad-metric' : 'good-metric'}>
                            {activeControllersCount}
                          </span>
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                          Should never be greater than 1. If it is, then there was an error during controller election.
                        </Typography>
                    </Box>
                    <Box sx={{p: 2}}>
                        <Typography component="p" variant="body1">
                            Number of Underreplicated Partitions:&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className={underreplicatedPartitionsCount > 0 ? 'bad-metric' : 'good-metric'}>
                              {underreplicatedPartitionsCount}
                            </span>
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                          Number of partitions that do not have enough replicas to match the replication factor. A healthy Kafka cluster should not have any.
                        </Typography>
                    </Box>
                    <Box sx={{p: 2}}>
                        <Typography component="p" variant="body1">
                            Number of Offline Partitions:&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className={offlinePartitionsCount > 0 ? 'bad-metric' : 'good-metric'}>
                              {offlinePartitionsCount}
                            </span>
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                            Number of partitions that are unavailable. Indicates that a broker is offline and there was a server failure/restart.
                        </Typography>
                    </Box>
                    <Box sx={{p: 2}}>
                        <Typography component="p" variant="body1">
                            Number of Partitions that are Under ISR Threshold:&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className={underMinISRCount > 0 ? 'bad-metric' : 'good-metric'}>
                              {underMinISRCount}
                            </span>                        
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                          Number of partitions, where the number of In-Sync Replicas (ISR) is less than the minimum number of in-sync replicas specified. If value greater than 0, cluster is experiencing performance issue or one or more brokers are falling behind.
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