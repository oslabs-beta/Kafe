import React from 'react';
import { useQuery } from '@apollo/client';
import { LIST_TOPICS } from '../queries/graphQL';

function ListTopics() {
  const { loading, data } = useQuery(LIST_TOPICS, { pollInterval: 20 * 1000 });
  

  console.log('data is: ', data);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>Topics</div>
      {data.topics.map((el) => (
        <>
          <ul>
            <li>{el.name}, {el.partitionsCount}</li>
          </ul>
        </>
      ))}
    </div>
  );
}


export default ListTopics;
