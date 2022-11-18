
export const typeDefs = `#graphql
  type Cluster {
    brokers: [Broker]!
    numOfController: Int
    numOfunderReplicatedPartitions: Int
    numOfOfflinePartitions: Int
    underMinISR: Int
  }

  type Broker {
    brokerId: Int!
    brokerPort: Int
    brokerHost: String
    numOfunderReplicatedPartitions: Int
    numOfOfflinePartitions: Int
    networkRequestRate: Int
    producerTotalTimeMs: Data
    consumerTotalTimeMs: Data
    followerTotalTimeMs: Data
    bytesInPerSecOverTime: [Data]
    bytesOutPerSecOverTime: [Data]
  }

  type Topic {
    name: String!
    partitions: [Partition]!
    numOfPartitions: Int
    totalReplicas: Int
    totalIsrs: Int
  }

  type Partition {
    partitionId: Int!
    underReplicatedPartitions: Int
    leader: Broker
  }

  type Data {
    time: String
    metric: Float
  }

  type Query {
    hello: String
  }

  type Mutation {
      createTopic: Topic
      deleteTopic: Topic
      reassignPartition: Partition
  }
`;