
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
    id: Int!
    port: Int
    host: String
    underreplicatedPartitionsCount: Int
    CPUUsageOverTime: [DataSeries]
    JVMMemoryUsedOverTime: [DataSeries]
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
    leader: Broker
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
    values: [DataPoint]!
  }

  type TopicOffset {
    partition: Int
    offset: String
    high: String
    low: String
  }

  type Query {
    cluster: Cluster
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
    topics(name: [String]): [Topic]
    topic(name: String): Topic
  }

  type Mutation {
    createTopic: Topic
    deleteTopic: Topic
    reassignPartitions: Partition
    deleteTopicRecords: Boolean
  }
`;