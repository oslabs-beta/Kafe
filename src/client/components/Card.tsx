import React from 'react';
import { Card, CardActions, CardContent, Button, Paper } from '@mui/material';
import { useMutation } from "@apollo/client";
import { DELETE_TOPIC } from '../queries/graphQL';
import { DELETE_TOPIC_RECORDS } from '../queries/graphQL';
import { ALTER_PARTITION_REASSIGNMENTS } from '../queries/graphQL';

const CardComponent = (props) => {

  const topic = props.topic;

  const [deleteTopic, { loading: deleteTopicLoading, error: deleteTopicError, data: deleteTopicData }] = useMutation(DELETE_TOPIC);
  const [alterPartitionReassignments, { loading: alterPartitionReassignmentsLoading, error: alterPartitionReassignmentsError, data: alterPartitionReassignmentsData }] = useMutation(ALTER_PARTITION_REASSIGNMENTS);
  const [deleteTopicRecords, { loading: deleteTopicRecordsLoading, error: deleteTopicRecordsError, data: deleteTopicRecordsData }] = useMutation(DELETE_TOPIC_RECORDS);  

  const handleDeleteTopic = (e) => {
    e.preventDefault();

    deleteTopic({
      variables: {
        name: topic.name,
      },
    })
  };

  const handleDeleteMessages = () => {
    deleteTopicRecords({
      variables: {
        name: topic.name, 
      },
    })
  };

  const handleReassignPartitions = () => {
    alterPartitionReassignments({
      variables: {
        topics: [{ topic }],
        timeout: 60000
      }
    });
  };

  return (
    <Paper>
      <Card>
        <Paper
            sx={{
                p: 3,
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
            }}
            elevation={8}>
          <CardContent>
            <h2>{topic.name}</h2>
            <p style={{ fontSize: '12px', margin: '0' }}>Partition Count: {topic.partitionsCount}</p>
            <p style={{ fontSize: '12px', margin: '0' }}>Replicas Count: {topic.replicasCount}</p>
            <p style={{ fontSize: '12px', margin: '0' }}>ISR Count: {topic.ISRCount}</p>
            {deleteTopicLoading && <p>Loading...</p>}
            {deleteTopicError && <p>Error: {deleteTopicError.message}</p>}
            {deleteTopicData && <p>Topic Deleted! Refreshing...</p>}
            {alterPartitionReassignmentsLoading && <p>Loading...</p>}
            {alterPartitionReassignmentsError && <p>Error: {alterPartitionReassignmentsError.message}</p>}
            {alterPartitionReassignmentsData && <p>Partitions Reassigned!</p>}
            {deleteTopicRecordsLoading && <p>Loading...</p>}
            {deleteTopicRecordsError && <p>Error: {deleteTopicRecordsError.message}</p>}
            {deleteTopicRecordsData && <p>Records Deleted!</p>}
          </CardContent>
          <CardActions>
            <Button size="medium" color="primary" onClick={handleDeleteTopic}>Delete Topic</Button>
            <Button size="medium" color="primary" onClick={handleDeleteMessages}>Delete Messages</Button>
            <Button size="medium" color="primary" onClick={handleReassignPartitions}>Reassign Partitions</Button>
          </CardActions>
        </Paper>
      </Card>
    </Paper>
  );
};

export default CardComponent;
