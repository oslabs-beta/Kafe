import React, { useState } from 'react';
import { useMutation } from "@apollo/client";
import { CREATE_TOPIC } from '../queries/graphQL';

function CreateTopic() {
  const [createTopic, { loading, error, data }] = useMutation(CREATE_TOPIC);

  const onSubmit = (e) => {
    e.preventDefault();

    createTopic({
      variables: {
        name: e.target.name.value
      },
    });
    console.log(data);
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="name">Name:</label>
      <input type="text" name="name" />
      <br />
      <button type="submit">Create topic</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Success!</p>}
    </form>
  );
}


export default CreateTopic;
