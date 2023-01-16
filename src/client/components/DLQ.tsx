import React, {useState, useEffect, useRef} from 'react';
import { GET_DLQ_MESSAGES } from '../queries/graphQL';
import { useQuery } from "@apollo/client";
import EnhancedTable from './EnhancedTable';
import PieChart from '../graphs/PieChart';

const DLQ = (props) => {

    const [dlq, setDLQ] = useState([]);
    const [pollInterval, setPollInterval] = useState(60000);
    const [order, setOrder] = useState('desc');
    const [pieChartData, setPieChartData] = useState({});

    const { loading, error, data, refetch } = useQuery(GET_DLQ_MESSAGES, {
        pollInterval: (pollInterval || 60000)
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
                    // console.log('old dlq msg:', dlq);
                    dlqRef.current = [...data.dlqMessages, ...dlq];
                    return [...data.dlqMessages, ...dlq];
                }
                data.dlqMessages.reverse();
                dlqRef.current = [...dlq, ...data.dlqMessages];
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

    const removeMessageHandler = (indices: number[]) => {
        if (!indices.length) return;
        console.log('selected row/rows:', indices);
        indices.sort((a, b) => b - a);

        setDLQ((dlq) => {
            const newDLQ = [...dlq];
            for (const index of indices) {
                newDLQ.splice(index, 1);
            };
            //delete functionality
            dlqRef.current = newDLQ;
            console.log('newDLQ after splice',newDLQ);
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

    // console.log('Data: ', data);
    // console.log('Current DLQ: ', dlq);
    // console.log('DLQ Parent Component order: ', order);
    return (
        <>
            <div>Dead Letter Queue Component</div>
            {dlq.length > 0 && <EnhancedTable
                            data={dlq}
                            headers={['Time of Error', 'Original Message', 'Original Topic', 'Client Type', 'Error Message']}
                            removeMessageHandler={removeMessageHandler}
                            reverseOrderHandler={reverseOrderHandler}
                            order={order}
                            setOrder={setOrder}/>}
            {dlq.length > 0 && <PieChart
                            label={'# of failed messages'}
                            labels={Object.keys(pieChartData)}
                            data = {Object.values(pieChartData)}
            />}
        </>
    )
};


export default DLQ;