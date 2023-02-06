import React, { useState } from "react";
import { Card, CardActions, CardContent, Button, Paper, Box, Typography, Container, Modal } from '@mui/material';
import { useMutation } from "@apollo/client";
import { ALTER_PARTITION_REASSIGNMENTS, GET_BROKER_COUNT } from '../queries/graphQL';

const ReassignPartitions = ({ topic, partition, refetch }) => {
    const [targetPartition, setTargetPartition] = useState('');
    const [targetReplicas, setTargetReplicas] = useState('');
    const [alterPartitionReassignments, { data: alterData, loading: alterLoading, error: alterError }] = useMutation(
        ALTER_PARTITION_REASSIGNMENTS
      );
    
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const letters = new Set();
    for (let i = 0; i < alphabet.length; i++) {
      letters.add(alphabet[i]);
    };
      
    const handleSubmit = (e) => {
      e.preventDefault();

      const currentReplicas = e.target[0].value.replaceAll(' ', '').split(',');
      const newReplicas = [];

      currentReplicas.forEach(replica => {
        if (letters.has(replica)) return e.target[0].value = '';
        
        newReplicas.push(Number(replica));
      });
  
      alterPartitionReassignments({
        variables: { 
          topics: [{ topic, partitionAssignment: [{ partition, replicas: newReplicas }] }]
        },
      });

    //   refetch();
      window.location.reload();
    };

      return (
        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="targetReplicas">Target Replicas:</label>
            <input
              type="string"
              id="targetReplicas"
              value={targetReplicas}
              onChange={(e) => setTargetReplicas(e.target.value)}
            />
            <button type="submit" >Reassign</button>
            {alterLoading && <p>Loading...</p>}
            {alterError && <p>Error: {alterError.message}</p>}
            {alterData && <p>Partitions/Replicas Reassigned!</p>}
          </form>
        </div>
  );
};

export default ReassignPartitions;