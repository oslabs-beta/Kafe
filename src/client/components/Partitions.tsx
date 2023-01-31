import React, { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import { LIST_TOPICS } from '../queries/graphQL';

//  Static list of topics; placeholder for GQL query
const topics = {
  topic1: 8,
  topic2: 4,
  topic3: 6,
  topic4: 10,
};

function Partitions() {
  //  Create variables and setters for dropdown and inc/dec buttons
  const [selectedTopic, setSelectedTopic] = useState('');
  const [partitionCount, setPartitionCount] = useState(0);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  //  Handler for changing topics
  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    setPartitionCount(topics[e.target.value]);
  };

  //  Handlers for inc/dec
  const handleIncrement = () => {
    setPartitionCount(partitionCount + 1);
  };

  const handleDecrement = () => {
    setPartitionCount(partitionCount - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedTopic) {
      setError(true);
      return;
    }

    setError(false);
    setSubmitted(true);
  };

  const { loading, data } = useQuery(LIST_TOPICS);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="topic-select">Existing Topics</label><br />
      <select
        id="topic-select"
        value={selectedTopic}
        onChange={handleTopicChange}
      >
        {data?.topics.map((data) => (
          <option key={data.name} value={data.name}>
            {data.name}
          </option>
        ))}
      </select>
      {error && <p>Please select a topic</p>}
      <div>
      <label htmlFor="partition-count">Partitions:</label><br />
        <button type="button" onClick={handleDecrement}>
          -
        </button>

        <input
          id="partition-count"
          type="number"
          value={partitionCount}
          onChange={(e) => setPartitionCount(parseInt(e.target.value, 10))}
        />
        <button type="button" onClick={handleIncrement}>
          +
        </button>
      </div><br />
      <button type="submit">Update Partitions</button>
      {submitted && (
        <p>
          {selectedTopic} has a new partition count of {partitionCount}.
        </p>
      )}
    </form>
  );
}

export default Partitions;
