import React from 'react';
import { useQuery } from '@apollo/client';
import { LIST_TOPICS } from '../queries/graphQL';
import CreateTopic from './CreateTopic';
import DeleteTopic from './DeleteTopic';

import PaperStyles from "./common/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function ListTopics() {
  const { loading, data } = useQuery(LIST_TOPICS, { pollInterval: 20 * 1000 });
  

  console.log('data is: ', data);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h4>Topics</h4>
      <CreateTopic />
      <DeleteTopic />
    </div>
  );
}


export default ListTopics;

// {data.topics.map((el) => (
//         <>
//           <ul>
//             <li>{el.name}, {el.partitionsCount}</li>
//           </ul>
//         </>
//       ))}