import React, { useState } from 'react';
import { Card, CardActions, CardContent, Button, Paper, Box, Typography, Container, Modal } from '@mui/material';
import { useMutation } from "@apollo/client";
import { DELETE_TOPIC } from '../queries/graphQL';
import { DELETE_TOPIC_RECORDS } from '../queries/graphQL';
import ReassignPartitions from './ReassignPartitions';
import { useTheme } from '@mui/material/styles';

const CardComponent = ({ topic, refetch, partitions }) => {

  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
 
  const [deleteTopic, { loading: deleteTopicLoading, error: deleteTopicError, data: deleteTopicData }] = useMutation(DELETE_TOPIC);
  const [deleteTopicRecords, { loading: deleteTopicRecordsLoading, error: deleteTopicRecordsError, data: deleteTopicRecordsData }] = useMutation(DELETE_TOPIC_RECORDS);  
  
  const theme = useTheme();
  const { palette } = theme;

  const handleDeleteTopic = async(e) => {
    e.preventDefault();

    await deleteTopic({
      variables: {
        name: topic.name,
      },
    });
    
    await refetch();
  };

  const handleDeleteMessages = () => {
    deleteTopicRecords({
      variables: {
        name: topic.name
      },
    });

    if (!deleteTopicRecordsLoading && !deleteTopicRecordsError) {
      setTimeout(() => {
        setDeleteSuccess(true);
      }, 500);
    
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 2000)
    }
  };

  const btnStyle = {minWidth: 150, 
    margin: "0px",
    textAlign:"right",
    textTransform: 'unset',
    color: 'palette.primary.dark',
  };

  const style = {
    position: 'absolute' as 'absolute',
    background: palette.mode === 'light' ? 'white' : '#121212',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    minHeight: 400,
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  return (
          <Card sx={{margin: 2}}>
          <CardContent>
            <h2>{topic.name}</h2>
            <p style={{ fontSize: '14px', margin: '0' }}>Partition Count: {topic.partitionsCount}</p>
            <p style={{ fontSize: '14px', margin: '0' }}>Replicas Count: {topic.replicasCount}</p>
            <p style={{ fontSize: '14px', margin: '0' }}>ISR Count: {topic.ISRCount}</p>
            {deleteTopicLoading && <p>Loading...</p>}
            {deleteTopicError && <p>Error: {deleteTopicError.message}</p>}
            {deleteTopicData && <p>Topic Deleted! Refreshing...</p>}
            {deleteTopicRecordsLoading && <p>Deleting...</p>}
            {deleteTopicRecordsError && <p>Error: {deleteTopicRecordsError.message}</p>}
            {deleteSuccess && <p>Records Deleted!</p>}
          </CardContent>
          <CardActions>
            <Button 
              size="medium" 
              color="primary" 
              variant='outlined'
              sx={btnStyle}
              onClick={handleDeleteTopic}>Delete Topic</Button>
            <Button 
              size="medium" 
              color="primary"
              variant='outlined'
              sx={btnStyle} 
              onClick={handleDeleteMessages}>Delete All Messages</Button>
            <Button 
              size="medium" 
              color="primary"
              variant='outlined'
              sx={btnStyle} 
              onClick={handleOpen}>Reassign Partitions</Button>
            <Modal 
              open={open}
              onClose={handleClose}>
              <Container sx={style}>
                <Typography component="p" variant="h6">{`Partition Manager for ${topic.name}`}</Typography>
                {partitions?.map((partition, i) => 
                  <Box 
                    key={`${topic}${i}`} 
                    style={{
                      display: "flex",
                      justifyContent: "flex-start"
                      }}>
                    <Typography sx={{mr: 4}}>{`Partition id: ${partition.partitionId}`}</Typography>
                    <Typography sx={{mr: 4}}>{`Replicas: ${partition.replicas.map(replica => replica.id).join(', ')}`}</Typography>
                    <div style={{alignSelf: "flex-end"}}>
                      <ReassignPartitions 
                        topic={topic.name}
                        partition={partition.partitionId}
                        refetch={refetch}
                      />
                    </div>
                    
                  </Box>)}
              </Container>
            </Modal>   
            </CardActions>
          </Card>
  );
};

export default CardComponent;
