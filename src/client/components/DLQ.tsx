import React, {useState, useEffect, useRef} from 'react';
import { GET_DLQ_MESSAGES } from '../queries/graphQL';
import { useQuery } from "@apollo/client";
import EnhancedTable from './EnhancedTable';

const DLQ = (props) => {

    const [dlq, setDLQ] = useState([]);
    const [pollInterval, setPollInterval] = useState(60000);

    const { loading, error, data, refetch } = useQuery(GET_DLQ_MESSAGES, {
        pollInterval: (pollInterval || 60000)
    });

    const dlqRef = useRef(null)

    useEffect(() => {
        const dlqMessages = JSON.parse(sessionStorage.getItem('DLQMessages'));
        console.log('DLQMessages from localStorage: ', dlqMessages)
        if (dlqMessages?.length){
            setDLQ(dlqMessages);
            dlqRef.current = dlqMessages;
        };

    }, []);

    useEffect(() => {
        if (error || loading) return;
        if (data) {
            // console.log('querydata:', data)
            setDLQ((dlq) => {
                dlqRef.current = [...data.dlqMessages, ...dlq];
                return [...data.dlqMessages, ...dlq];
            });
        };

        return () => {
            sessionStorage.setItem('DLQMessages', JSON.stringify(dlqRef.current));
            console.log('localStorage DLQ:',JSON.stringify(dlqRef.current))
        };
    }, [loading, data]);

    // console.log('Data: ', data);
    console.log('Current DLQ: ', dlq);

    const removeMessageHandler = (indices: number[]) => {
        if (!indices.length) return;
        
        indices.sort((a, b) => b - a);

        setDLQ((dlq) => {
            for (let i = indices.length; i >= 0; i--) {
                dlq.splice(indices[i], 1);
            };
            dlqRef.current = dlq;
            return dlq;
        });
    };

    const reverseOrderHandler = () => {
        if (!dlq.length) return;

        setDLQ((dlq) => {
            dlq.reverse();
            dlqRef.current = dlq;
            return dlq;
        });
    };

    return (
        <>
            <div>Dead Letter Queue Component</div>
            {dlq.length > 0 && <EnhancedTable
                            data={dlq}
                            headers={['Time of Error', 'Original Message', 'Original Topic', 'Client Type', 'Error Message']}
                            removeMessageHandler={removeMessageHandler}
                            reverseOrderHandler={reverseOrderHandler}
                            />}
        </>
    )
};


export default DLQ;