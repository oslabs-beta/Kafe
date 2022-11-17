

export const typeDefs = `#graphql
  type Cluster {
    hello: String
  }
    type Broker {
      id: Int!
      port: Int
      host: String
      hello: String
    }

    type Topic {
      name: String!
      partitions: [Partition]!
    }
    type Partition {
      hello: String
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