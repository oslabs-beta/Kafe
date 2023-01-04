import React, { useState, useEffect } from 'react';
import { Kafka } from 'kafkajs';

const CreatePartitions = () => {
  const [partitions, setPartitions] = useState([]);
  const [topic, setTopic] = useState('');
  const [partitionCount, setPartitionCount] = useState(0);

  const handleChangeTopic = (event) => {
    setTopic(event.target.value);
  };

  const handleChangePartitionCount = (event) => {
    setPartitionCount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['kafka1:9092', 'kafka2:9092']
    });

    const admin = kafka.admin();

    try {
      await admin.connect();
      await admin.createPartitions({
        topic,
        newPartitions: partitionCount
      });
      const updatedPartitions = await admin.fetchTopicMetadata({ topic });
      setPartitions(updatedPartitions[0].partitions);
      await admin.disconnect();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Topic:
        <input type="text" value={topic} onChange={handleChangeTopic} />
      </label>
      <br />
      <label>
        Partition Count:
        <input type="number" value={partitionCount} onChange={handleChangePartitionCount} />
      </label>
      <br />
      <button type="submit">Create Partitions</button>
      <br />
      <br />
      <div>
        Current Partitions:
        <ul>
          {partitions.map((partition) => (
            <li key={partition.id}>{partition.id}</li>
          ))}
        </ul>
      </div>
    </form>
  );
};

export default CreatePartitions;