import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { LIST_TOPICS, CREATE_TOPIC} from '../queries/graphQL';
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from './Card';

function TopicManager() {
  const [newTopic, setNewTopic] = useState('');
  const [creatingTopic, setCreatingTopic] = useState(false);
  const [topicData, setTopicData] = useState<any>([]);

  const skipRef = useRef(false);

  let { loading: loadingListTopics, data: dataListTopics, refetch: refetchTopics } = useQuery(LIST_TOPICS, { 
    pollInterval: 60 * 1000,
    skip: skipRef.current,
  });
  const [createTopic, { loading: loadingCreateTopic, error: errorCreateTopic, data: dataCreateTopic }] = useMutation(CREATE_TOPIC);    

  useEffect(() => {
    if (loadingListTopics) return;

    const newTopicData = [];

    dataListTopics.topics.forEach(topic => {
      if (topic.name !== '__consumer_offsets') {
        newTopicData.push(topic);
      };
    });

    setTopicData(newTopicData);

  }, [loadingListTopics, dataListTopics]);

  useEffect(() => {
    skipRef.current = false;

    return () => {
      skipRef.current = true;
    };
  }, [])

  const refetchHandler = async() => {
    const test = await refetchTopics();
    console.log('Refetch Handler data: ', test);

    const newTopics = await refetchTopics();
    dataListTopics = newTopics.data; 
  };

  const onSubmit = async(e) => {
    if (newTopic === '') return;
    e.preventDefault();
    setCreatingTopic(true);

    await createTopic({
      variables: {
        name: newTopic,
      },
    });

    setNewTopic('');

    while (loadingCreateTopic) continue;
    await refetchHandler();
    
    setCreatingTopic(false);
  };

  const handleChangeTopic = (e) => {
    setNewTopic(e.target.value);
  };

  if (loadingListTopics) {
    return <div>Loading...</div>;
  };

   const btnStyle = {
    minWidth: 150, 
    margin: "2px",
    textAlign:"right",
    textTransform: 'unset',
    marginLeft: 6,
    };
  
  return (
    <div>
        <>
          <form
            onSubmit={onSubmit}
            style={{display: "flex", width: "400px", flexWrap: "nowrap", flexDirection: "row"}}>
            <TextField 
              id="topic form" 
              label="Enter new topic name" 
              variant="standard" 
              sx= {{ marginLeft: 5 }}
              value={newTopic}
              onChange={handleChangeTopic}
              />
            <Button variant="contained" sx={btnStyle} type="submit">Create Topic</Button>
          </form>
          
          {loadingCreateTopic && <p>Loading...</p>}
          {errorCreateTopic && <p>Error: {errorCreateTopic.message}</p>}
          {creatingTopic && <p>Topic Created! Refreshing...</p>} 
          </><br></br>

        <Grid container spacing={2} sx={{ minHeight: '100%', margin: 2}}>
              {topicData.map((topic) => (
                  <Grid key={topic.name}>
                    <Card
                      topic={topic}
                      refetch={refetchHandler} 
                      partitions={topic.partitions}/>
                  </Grid>))}
        </Grid>
    </div>
  );
}

export default TopicManager;