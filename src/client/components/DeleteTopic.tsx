import React, { useState } from 'react';
import { useMutation } from "@apollo/client";
import { DELETE_TOPIC } from '../queries/graphQL';

function DeleteTopic(props) {
  const [deleteTopic, { loading, error, data }] = useMutation(DELETE_TOPIC);

  const onSubmit = (event) => {
    event.preventDefault();

    deleteTopic({
      variables: {
        name: event.target.name.value,
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
