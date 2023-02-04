import React from 'react';
import { useQuery } from '@apollo/client';
import { LIST_TOPICS } from '../queries/graphQL';
import Card from './Card';

function ListTopics() {
  const { loading, data } = useQuery(LIST_TOPICS, { pollInterval: 20 * 1000 });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>Topics</div>
      {data.topics.map((topic) => (
        <Card key={topic.name} topic={topic} />
      ))}
    </div>
  );
}

export default ListTopics;