import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { LIST_TOPICS } from '../queries/graphQL';
import { CREATE_TOPIC } from '../queries/graphQL';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from './Card';

function TopicManager() {
    const { loading: loadingListTopics, data: dataListTopics } = useQuery(LIST_TOPICS, { pollInterval: 20 * 1000 });
    const [createTopic, { loading: loadingCreateTopic, error: errorCreateTopic, data: dataCreateTopic }] = useMutation(CREATE_TOPIC);    

  if (loadingListTopics) {
    return <div>Loading...</div>;
  }

  const onSubmit = (e) => {
    e.preventDefault();

    createTopic({
      variables: {
        name: e.target.name.value
      },
    })

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
                <input type="text" name="name" />&nbsp;&nbsp;
                <button type="submit">Create Topic</button>
                {loadingCreateTopic && <p>Loading...</p>}
                {errorCreateTopic && <p>Error: {errorCreateTopic.message}</p>}
                {dataCreateTopic && <p>Topic Created! Refreshing...</p>}
            </form>
        </Paper><br></br>
      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
        <Grid container spacing={3}>
             <Grid>
                    {dataListTopics.topics.map((topic) => (
                        <Card key={topic.name} topic={topic}                           sx={{
                            p: 3,
                            display: "flex",
                            flexDirection: "row",
                        }}/>
                    ))}
              </Grid>
            </Grid>
      </Container>
    </div>
  );
}

export default TopicManager;