import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { LIST_TOPICS, CREATE_TOPIC} from '../queries/graphQL';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from './Card';
import ReassignPartitions from './Partitions';

function TopicManager() {
  const [newTopic, setNewTopic] = useState('');

  const { loading: loadingListTopics, data: dataListTopics, refetch: refetchTopics } = useQuery(LIST_TOPICS, { pollInterval: 60 * 1000 });
  const [createTopic, { loading: loadingCreateTopic, error: errorCreateTopic, data: dataCreateTopic }] = useMutation(CREATE_TOPIC);    


  const onSubmit = (e) => {
    e.preventDefault();

    createTopic({
      variables: {
        name: e.target[0].value,
      },
    });

    setNewTopic('');
    e.target[0].value = '';

    window.location.reload();
  };

  const handleChangeTopic = (e) => {
    setNewTopic(e.target.value);
  };

  if (loadingListTopics) {
    return <div>Loading...</div>;
  };

  return (
    <div>
        <Paper
            sx={{
                p: 3,
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
            }}
            elevation={8}>
            <form onSubmit={onSubmit}>
                <label htmlFor="name">New Topic Name:</label>&nbsp;&nbsp;
                <input type="text" name="name" onChange={handleChangeTopic} value={newTopic}/>&nbsp;&nbsp;
                <button type="submit">Create Topic</button>
                {loadingCreateTopic && <p>Loading...</p>}
                {errorCreateTopic && <p>Error: {errorCreateTopic.message}</p>}
                {dataCreateTopic && <p>Topic Created! Refreshing...</p>}
            </form>
        </Paper><br></br>
      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
        <Grid container spacing={3}>
             <Grid>
                    {dataListTopics?.topics?.filter(topic => topic.name !== '__consumer_offsets').map((topic) => (
                        <Card 
                          key={topic.name} 
                          topic={topic}
                          refetch={refetchTopics} 
                          partitions={topic.partitions}></Card>
                    ))}
              </Grid>
            </Grid>
      </Container>
      <br />
      <br />
    </div>
  );
}

export default TopicManager;