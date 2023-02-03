import React from 'react';
import { makeStyles } from '@mui/material/styles';
import { Card, CardActions, CardContent, Button, Paper } from '@material-ui/core';
import { useMutation } from "@apollo/client";
import { DELETE_TOPIC } from '../queries/graphQL';

const useStyles = makeStyles({
  root: {
    width: '100%',
    margin: '10px 0',
  },
});

const TopicActions = () => {
  const classes = useStyles();
  const [deleteTopic, { loading, error, data }] = useMutation(DELETE_TOPIC);

  const handleDeleteTopic = (e) => {
    e.preventDefault();

    deleteTopic({
      variables: {
        name: e.target.name.value,
      },
    });
    console.log(data);
  };

  const handleDeleteMessages = () => {
    // handle delete messages action
  };

  const handleReassignPartitions = () => {
    // handle reassign partitions action
  };

  return (
    <Paper className={classes.root}>
      <Card>
        <CardContent>
          <p>Choose an action for this topic:</p>
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

export default TopicActions;
