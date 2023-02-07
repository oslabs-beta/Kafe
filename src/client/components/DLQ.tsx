import React, { useState, useEffect, useRef, Suspense } from 'react';
import { GET_DLQ_MESSAGES } from '../queries/graphQL';
import { useQuery } from "@apollo/client";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import EnhancedTable from './EnhancedTable';
const PieChart = React.lazy(() => import('../graphs/PieChart'));
const BarChart = React.lazy(() => import('../graphs/BarChart'));

const DLQ = (props) => {

    const [dlq, setDLQ] = useState([]);
    const [pollInterval, setPollInterval] = useState(60000);
    const [order, setOrder] = useState('desc');
    const [pieChartData, setPieChartData] = useState({});

    const skipRef = useRef(false);

    const { loading, error, data, refetch } = useQuery(GET_DLQ_MESSAGES, {
        pollInterval: (pollInterval || 60000),
        skip: skipRef.current
    });

    const dlqRef = useRef(null)

    useEffect(() => {
        const dlqMessages = JSON.parse(sessionStorage.getItem('DLQMessages'));
        console.log('DLQMessages from localStorage: ', dlqMessages)
        if (dlqMessages?.length){
            dlqMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            dlqRef.current = dlqMessages;
            setDLQ(dlqMessages);
        };

    }, []);


    useEffect(() => {
        if (error || loading) return;
        if (data) {
            // console.log('querydata:', data)
            setDLQ((dlq) => {
                if (order === 'desc') {
                    // console.log('new dlq msg:', data.dlqMessages);
                    dlqRef.current = [...data.dlqMessages, ...dlq];
                    sessionStorage.setItem('DLQMessages', JSON.stringify(dlqRef.current));
                    return [...data.dlqMessages, ...dlq];
                }
                data.dlqMessages.reverse();
                dlqRef.current = [...dlq, ...data.dlqMessages];
                sessionStorage.setItem('DLQMessages', JSON.stringify(dlqRef.current));
                return [...dlq, ...data.dlqMessages];
            });
        };

        return () => {
            sessionStorage.setItem('DLQMessages', JSON.stringify(dlqRef.current));
            console.log('localStorage DLQ:',JSON.stringify(dlqRef.current))
        };
    }, [loading, data]);

    useEffect(() => {
      const newPieChartData = {};
      for (const dlqMessage of dlq) {
        const topic = dlqMessage.value.originalTopic;
        if (newPieChartData[topic]) newPieChartData[topic] += 1;
        else newPieChartData[topic] = 1;
      };
      setPieChartData(newPieChartData);
    }, [dlq]);

    useEffect(() => {
        skipRef.current = false;

        return () => {
            skipRef.current = true;
        }
    }, []);

    const removeMessageHandler = (indices: number[]) => {
        if (!indices.length) return;

        indices.sort((a, b) => b - a);

        setDLQ((dlq) => {
            const newDLQ = [...dlq];
            for (const index of indices) {
                newDLQ.splice(index, 1);
            };
            //delete functionality
            dlqRef.current = newDLQ;

            sessionStorage.setItem('DLQMessages', JSON.stringify(newDLQ));
            return newDLQ;
        });
    };

    const reverseOrderHandler = () => {
        if (!dlq.length) return;

        setDLQ((dlq) => {
            const newDLQ = [...dlq].reverse();
            return newDLQ;
        });
    };

    return (
        <>
            <div>Dead Letter Queue Component</div>
            {dlq.length > 0 && 
            <EnhancedTable 
                            data={dlq}
                            headers={['Time of Error', 'Original Message', 'Original Topic', 'Client Type', 'Error Message']}
                            removeMessageHandler={removeMessageHandler}
                            reverseOrderHandler={reverseOrderHandler}
                            order={order}
                            setOrder={setOrder}/>
            }
            {dlq.length > 0 &&
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4}}> 
                <Grid container spacing={3} sx={{mb: 3}}>
                     <Grid item xs={12} md={6}>
                         <Paper
                           sx={{
                             p: 3,
                             display: "flex",
                             flexDirection: "column",
                           }}
                           elevation={8}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <PieChart
                                   label={'Failed Messages by Original Topic'}
                                   labels={Object.keys(pieChartData)}
                                   data = {Object.values(pieChartData)}/>
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
                          elevation={8}
                          style={{height: '100%'}}
                          >
                           <Suspense fallback = {<div>Loading...</div>}>
                               <BarChart
                                   dlqData = {dlq}
                                   label={'Messages by Topic Over Time'}/>
                           </Suspense>
                       </Paper>
                    </Grid>
                </Grid>
            </Container>}
        </>
    )
};


export default DLQ;