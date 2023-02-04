import React from 'react';
import { makeStyles } from '@mui/material/styles';
import { Card, CardActions, CardContent, Button, Paper } from '@mui/material';
import { useMutation } from "@apollo/client";
import { DELETE_TOPIC } from '../queries/graphQL';
import { ALTER_PARTITION_REASSIGNMENTS } from '../queries/graphQL';

// const useStyles = makeStyles({
//   root: {
//     width: '100%',
//     margin: '10px 0',
//   },
// });

const CardComponent = (props) => {
  // const classes = makeStyles();

  const topic = props.topic;

  const [deleteTopic, { loading, error, data }] = useMutation(DELETE_TOPIC);
  const [alterPartitionReassignments] = useMutation(ALTER_PARTITION_REASSIGNMENTS);

  const handleDeleteTopic = (e) => {
    e.preventDefault();

    deleteTopic({
      variables: {
        name: topic,
      },
    });
    console.log(data);
  };

  const handleDeleteMessages = () => {
    // handle delete messages action
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
        <CardContent>
          <p>Choose an action for this topic:</p>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {data && <p>Processed!</p>}
        </CardContent>
        <CardActions>
        <Button size="small" color="secondary" onClick={handleDeleteTopic}>Delete Topic</Button>
          <Button size="small" color="secondary" onClick={handleDeleteMessages}>Delete Messages</Button>
          <Button size="small" onClick={handleReassignPartitions}>Reassign Partitions</Button>
        </CardActions>
      </Card>
    </Paper>
  );
};

export default CardComponent;
