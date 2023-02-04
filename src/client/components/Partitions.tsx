import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALTER_PARTITION_REASSIGNMENTS, LIST_TOPICS } from '../queries/graphQL';

const ReassignPartitions = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [targetPartition, setTargetPartition] = useState(null);
  const [targetReplicas, setTargetReplicas] = useState(null);

  const { data: listData, loading: listLoading, error: listError } = useQuery(LIST_TOPICS);
  const [alterPartitionReassignments, { data: alterData, loading: alterLoading, error: alterError }] = useMutation(
    ALTER_PARTITION_REASSIGNMENTS
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    alterPartitionReassignments({
      variables: { 
        topics: [{ topic: selectedTopic, partitionAssignment: [{ partition: targetPartition, replicas: [{targetReplicas}] }] }]
      },
    });
    console.log("alterData is...", alterData, 'background: #222; color: #bada55');
  };
  

  if (listLoading) return <p>Loading...</p>;
  if (listError) return <p>Error :(</p>;

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
          {listData &&
            listData.topics.map((topic) => (
              <option key={topic.name} value={topic.name}>
                {topic.name}
              </option>
            ))}
        </select>
        <label htmlFor="targetPartition">Target Partition:</label>
        <input
          type="number"
          id="targetPartition"
          value={targetPartition}
          onChange={(e) => setTargetPartition(e.target.value)}
        />
        <label htmlFor="targetReplicas">Target Replicas:</label>
        <input
          type="number"
          id="targetReplicas"
          value={targetReplicas}
          onChange={(e) => setTargetReplicas(e.target.value)}
        />
        <button type="submit">Reassign Partitions</button>
        {alterLoading && <p>Loading...</p>}
        {alterError && <p>Error: {alterError.message}</p>}
        {alterData && <p>Partitions/Replicas Reassigned!</p>}
      </form>
    </div>
  );
};

export default ReassignPartitions;
