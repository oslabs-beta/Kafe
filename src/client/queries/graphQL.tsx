import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useQuery } from "@apollo/client";

export const CLUSTER_SUMMARY = gql`
  query getClusterInfo {
    cluster {
      brokerCount
      activeControllers
      activeControllersCount
      underreplicatedPartitionsCount
      offlinePartitionsCount
      underMinISRCount
    }
  }
`;

export const BROKERS_CPU_USAGE = gql`
  query BrokersCPUUsage ($start: String, $end: String, $step: String) {
      brokers (start: $start, end: $end, step: $step) {
          id
          host
          port
          CPUUsageOverTime {
            time
            value
        }
      }
    }
`;

export const BROKER_JVM_MEMORY_USAGE = gql`
  query BrokersJVMMemoryUsage($start: String, $end: String, $step: String) {
    brokers (start: $start, end: $end, step: $step) {
      id
      host
      port
      JVMMemoryUsedOverTime {
        time
        value
      }
    }
  }
`;

export const BROKER_ALL_TOTALTIMEMS = gql`
  query getAllTotalTimeMs {
    brokers {
      id
      produceTotalTimeMs {
        time
        value
      }
      fetchConsumerTotalTimeMs {
        time
        value
      }
      fetchFollowerTotalTimeMs {
        time
        value
      }
    }
  }
`;



// type Query {
//   cluster(
//     start: String,
//     end: String,
//     step: String
//     ): Cluster
//   brokers(
//     start: String,
//     end: String,
//     step: String,
//     ids: [Int]): [Broker]!
//   broker(
//     start: String
//     end: String,
//     step: String,
//     id: Int): Broker
//   topics(name: [String]): [Topic]
//   topic(name: String): Topic
// }

// type Mutation {
//   createTopic: Topic
//   deleteTopic: Topic
//   reassignPartitions: Partition
//   deleteTopicRecords: Boolean
// }

// const tempQuery =   gql`
// query GetCluster {
//   cluster {
//     brokers {
//       id
//       host
//       port
//     }
//   }
// }
// `