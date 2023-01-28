import React from 'react';
import { useMutation } from "@apollo/client";
import { DELETE_TOPIC_RECORDS } from '../queries/graphQL';

function TopicRecordDelete() {
  const [deleteTopicRecords, { loading, error, data }] = useMutation(DELETE_TOPIC_RECORDS);

  const onSubmit = (e) => {
    e.preventDefault();

    deleteTopicRecords({
      variables: {
        name: e.target.name.value,
      },
    });
    console.log(data);
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="name">Topic Name:</label>
      <input type="text" name="name" />
      <br />
      <button type="submit">HELLO</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Deleting Topic Records!</p>}
    </form>
  );
}


export default TopicRecordDelete;
