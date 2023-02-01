import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useQuery } from "@apollo/client";
import { TREE_DATA } from '../queries/graphQL';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Tree from 'react-d3-tree';
import { RawNodeDatum } from 'react-d3-tree/lib/types/types/common';


//attributes rendered as a list of secondary labels
function KafkaTree() {
  const [treeData, setTreeData] = useState <RawNodeDatum | RawNodeDatum[]>({name: 'Cluster', children: []});
  const { loading, data } = useQuery(TREE_DATA);

  useEffect(()=> {
    if (loading) return;
    if(data) {
      setTreeData(generateTree(data));
    };

  }, [loading, data])

  function generateTree(brokerData) {
    const treeData = { name: 'Cluster', children: [] };
    const { brokerCount }  = brokerData.cluster;

    if (brokerCount === 0) return treeData;
    for (let i = 1; i < brokerCount + 1; i++) {
      treeData.children.push({
        name: `Broker ${i}`,
        attributes: {
          id: i,
        },
        children: [],
      });
    };

    for (const topic of brokerData.topics) {
      if (topic.name === '__consumer_offsets') continue;

      for (const partition of topic.partitions) {
        const { leader } = partition;
        console.log('Partition leader', leader);

        treeData.children[leader - 1].children.push({
          name: `Partition ${partition.partitionId}`,
          attributes: {
            topic: topic.name,
          }
        })
      };
    };

    return treeData;
  };

  return (
    <>
       <Container maxWidth="xl" sx={{ mt: 2, mb: 4 , height: '100vh'}}>
        <Grid container spacing={3} sx={{height: '100%'}}>
          <Tree data = {treeData} orientation = "vertical"/>
        </Grid>
       </Container>
    </>
  );
}

export default KafkaTree;