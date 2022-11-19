
export const typeDefs = `#graphql
  type Cluster {
    brokers: [Broker]!
    controllersCount: Int
    underReplicatedPartitionsCount: Int
    offlinePartitionsCount: Int
    underMinISRCount: Int
  }

  type Broker {
    brokerId: Int!
    brokerPort: Int
    brokerHost: String
    underReplicatedPartitionsCount: Int
    networkRequestRate: Datapoint
    CPUUsageOverTime: [DataPoint]
    JVMMemoryUsedOverTime: [DataPoint]
    producerTotalTimeMs: DataPoint
    consumerTotalTimeMs: DataPoint
    followerTotalTimeMs: DataPoint
    bytesInPerSecOverTime: [DataPoint]
    bytesOutPerSecOverTime: [DataPoint]
    messagesInPerSec: [DataPoint]
  }

  type Topic {
    name: String!
    partitions: [Partition]!
    partitionsCount: Int
    replicasCount: Int
    ISRCount: Int
  }

  type Partition {
    partitionId: Int!
    underReplicatedPartitions: Int
    leader: Broker
    isrs: [Broker]!
  }

  type DataPoint {
    time: String
    value: Float
  }

  type Query {
    brokers(
      start: String, 
      end: String, 
      step: String, 
      ids: [Int]): [Broker]!
    broker(
      start: String
      end: String, 
      step: String, 
      ids: [Int]): Broker
  }

  type Mutation {
    createTopic: Topic
    deleteTopic: Topic
    reassignPartition: Partition
  }
`;