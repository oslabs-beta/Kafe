import React, {useState, useEffect} from 'react';
import { GET_DLQ_MESSAGES } from '../queries/graphQL';
import { useQuery } from "@apollo/client";

const DLQ = (props) => {

    const [dlq, setDLQ] = useState([]);
    const [newMessages, setNewMessages] = useState([])
    const [pollInterval, setPollInterval] = useState(60000);

    const { loading, error, data, refetch } = useQuery(GET_DLQ_MESSAGES, {
        pollInterval: (pollInterval || 60000)
    });

    useEffect(() => {
        if (error || loading) return;
        if (data) setDLQ((dlq) => [...dlq, ...data.dlqMessages]);
    }, [loading, data]);

    // useEffect(() => {
    //     if (!newMessages.length) return;
    //     console.log('Current DLQ2: ', dlq);
    //     setDLQ((oldDLQ) => [...oldDLQ, ...newMessages]);
    //     setNewMessages([]);
    // }, [newMessages])

    console.log('Data: ', data);
    console.log('Current DLQ: ', dlq);

    return (
        <>
            <div>Dead Letter Queue Component</div>
        </>
    )
};


export default DLQ;