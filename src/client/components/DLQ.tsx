import React, {useState, useEffect, useRef} from 'react';
import { GET_DLQ_MESSAGES } from '../queries/graphQL';
import { useQuery } from "@apollo/client";
import EnhancedTable from './EnhancedTable';

const DLQ = (props) => {

    const [dlq, setDLQ] = useState([]);
    const [pollInterval, setPollInterval] = useState(60000);
    const [order, setOrder] = useState('desc');

    const { loading, error, data, refetch } = useQuery(GET_DLQ_MESSAGES, {
        pollInterval: (pollInterval || 60000)
    });

    const dlqRef = useRef(null)

    useEffect(() => {
        const dlqMessages = JSON.parse(sessionStorage.getItem('DLQMessages'));
        console.log('DLQMessages from localStorage: ', dlqMessages)
        if (dlqMessages?.length){
            dlqMessages.sort((a, b) => b.timestamp - a.timestamp);
            setDLQ(dlqMessages);
            dlqRef.current = dlqMessages;
        };

    }, []);

    useEffect(() => {
        if (error || loading) return;
        if (data) {
            // console.log('querydata:', data)
            setDLQ((dlq) => {
                if (order === 'desc') {
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

    const removeMessageHandler = (indices: number[]) => {
        if (!indices.length) return;

        indices.sort((a, b) => b - a);

        setDLQ((dlq) => {
            for (let i = indices.length; i >= 0; i--) {
                dlq.splice(indices[i], 1);
            };
            //delete functionality
            dlqRef.current = dlq;
            return dlq;
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
        </>
    )
};


export default DLQ;