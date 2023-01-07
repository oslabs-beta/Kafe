import { gql } from '@apollo/client';

export const CLUSTER_SUMMARY = gql`
  query getClusterInfo {
    cluster {
      brokerCount
      activeControllers {
        id
      }
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

export const BROKER_ALL_TIME_MS = gql`
  query getAllTotalTimeMs {
    brokers {
      id
      host
      port
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

export const BROKER_BYTES_IN = gql`
  query BytesInOverTime ($start: String, $end: String, $step: String, $ids: [Int]) {
    topicsBytesIn: bytesInPerSecOverTime (start: $start, end: $end, step: $step, ids: $ids) {
      topic
      bytesIn: values {
        time
        value
      }
    }
  }
`;

export const LIST_TOPICS = gql`
query Query {
  topics {
    name
    ISRCount
    logSize {
      value
      time
    }
    partitionsCount
    replicasCount
  }
}
`;