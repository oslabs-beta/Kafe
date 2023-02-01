import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALTER_PARTITION_REASSIGNMENTS, LIST_TOPICS } from '../queries/graphQL';

const ReassignPartitions = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [timeout, setTimeout] = useState(null);

  const { data, loading, error } = useQuery(LIST_TOPICS);
  const [alterPartitionReassignments] = useMutation(
    ALTER_PARTITION_REASSIGNMENTS
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    alterPartitionReassignments({
      variables: { topics: [selectedTopic], timeout },
    });
  };

  console.log(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Reassign Partitions</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic">Topic:</label>
        <select
          id="topic"
          value={selectedTopic || ""}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="">Select a topic...</option>
          {data &&
            data.topics.map((topic) => (
              <option key={topic.name} value={topic.name}>
                {topic.name}
              </option>
            ))}
        </select>
        <label htmlFor="timeout">Timeout:</label>
        <input
          type="number"
          id="timeout"
          value={timeout}
          onChange={(e) => setTimeout(e.target.value)}
        />
        <button type="submit">Reassign Partitions</button>
      </form>
    </div>
  );
};

export default ReassignPartitions;
