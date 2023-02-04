
export const typeDefs = `#graphql
  type Cluster {
    brokers: [Broker]!
    brokerCount: Int
    activeControllers: [Broker]
    activeControllersCount: Int
    underreplicatedPartitionsCount: Int
    offlinePartitionsCount: Int
    underMinISRCount: Int
  }

  type Broker {
    id: Int
    port: Int
    host: String
    underreplicatedPartitionsCount: Int
    CPUUsageOverTime: [DataPoint]
    JVMMemoryUsedOverTime: [DataPoint]
    produceTotalTimeMs: DataPoint
    fetchConsumerTotalTimeMs: DataPoint
    fetchFollowerTotalTimeMs: DataPoint
    bytesInPerSecOverTime: [DataSeries]
    bytesOutPerSecOverTime: [DataSeries]
    messagesInPerSec: [DataPoint]
  }

  type Topic {
    name: String!
    partitions: [Partition]!
    partitionsCount: Int
    replicasCount: Int
    ISRCount: Int
    logSize: DataPoint,
    offsets: [TopicOffset]
  }

  type Partition {
    partitionId: Int!
    leader: Int
    replicas: [Broker]!
    isr: [Broker]!
  }

  type DataPoint {
    time: String
    value: Float
  }

  type DataSeries {
    instance: String
    id: Int
    topic: String
    values: [DataPoint]!
  }

  type TopicOffset {
    partition: Int
    offset: String
    low: String
    high: String
  }

  type DLQMessage {
    timestamp: String
    value: DLQMessageValue
  }

  type DLQMessageValue {
    originalTopic: String
    originalMessage: String
    clientType: String
    err: String
  }


  type Query {
    cluster(
      start: String,
      end: String,
      step: String
      ): Cluster
    brokers(
      start: String,
      end: String,
      step: String,
      ids: [Int]): [Broker]!
    broker(
      start: String
      end: String,
      step: String,
      id: Int): Broker
    bytesInPerSecOverTime(
      start: String
      end: String
      step: String
      topics: [String]
      ids: [Int]
    ): [DataSeries]
    bytesOutPerSecOverTime(
      start: String
      end: String
      step: String
      topics: [String]
      ids: [Int]
    ): [DataSeries]
    topics: [Topic]
    topic(name: String): Topic
    dlq: [DLQMessage]
  }

  type OngoingTopicReassignment {
    name: String
    partitions: [OngoingPartitionReassignment]
  }

  type OngoingPartitionReassignment {
    partition: Int,
    replicas: [Int],
    addingReplicas: [Int]
    removingReplicas: [Int]
  }

  input ConfigEntry {
    name: String!
    value: String!
  }

  input PartitionReplicas {
    partition: Int,
    replicas: [Int]
  }

  input PartitionReassignment {
    topic: String!,
    partitionAssignment: [PartitionReplicas]
  }

  input partitionOffset {
    partition: Int,
    offset: Int
  }

  type Mutation {
    createTopic (name: String, numPartitions: Int, replicationFactor: Int, configEntries: [ConfigEntry]): Topic
    deleteTopic (name: String): Topic
    reassignPartitions(topics: [PartitionReassignment]): [OngoingTopicReassignment]
    deleteTopicRecords(topic: String, partitions: [partitionOffset] ): Boolean
  }
`;


