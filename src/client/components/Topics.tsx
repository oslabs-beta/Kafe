import React from 'react';
import { useQuery } from '@apollo/client';
// import { LIST_TOPICS } from '../queries/graphQL';

function Topics() {
  // const { loading, data } = useQuery(LIST_TOPICS);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <div>Topics</div>
      {/* <ul>
        {data.listTopics.topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul> */}
    </div>
  );
}

export default Topics;
