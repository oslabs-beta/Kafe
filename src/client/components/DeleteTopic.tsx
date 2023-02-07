import React, { useState } from 'react';
import { useMutation } from "@apollo/client";
import { DELETE_TOPIC } from '../queries/graphQL';

function DeleteTopic() {
  const [deleteTopic, { loading, error, data }] = useMutation(DELETE_TOPIC);

  const onSubmit = (e) => {
    e.preventDefault();

    deleteTopic({
      variables: {
        name: e.target.name.value,
      },
    });
    console.log(data);
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="name">Name:</label>
      <input type="text" name="name" />
      <br />
      <button type="submit">Delete Topic</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Deleted!</p>}
    </form>
  );
}


export default DeleteTopic;
