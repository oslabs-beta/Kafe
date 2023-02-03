import React from 'react';
import { makeStyles } from '@mui/material/styles';
import { Card, CardActions, CardContent, Button, Paper } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    width: '100%',
    margin: '10px 0',
  },
});

const TopicActions = () => {
  const classes = useStyles();

  const handleDeleteTopic = () => {
    // handle delete topic action
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
          <Button size="small" color="secondary">Delete Topic</Button>
          <Button size="small" color="secondary">Delete Messages</Button>
          <Button size="small">Reassign Partitions</Button>
        </CardActions>
      </Card>
    </Paper>
  );
};

export default TopicActions;
