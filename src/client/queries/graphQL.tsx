import { gql } from '@apollo/client';

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

export const BROKER_BYTES_OUT = gql`
  query BytesOutOverTime ($start: String, $end: String, $step: String, $ids: [Int]) {
    topicsBytesOut: bytesOutPerSecOverTime (start: $start, end: $end, step: $step, ids: $ids) {
      topic
      bytesOut: values {
        time
        value
      }
    }
  }
`;

export const GET_DLQ_MESSAGES = gql`
  query getDLQMessages {
    dlqMessages: dlq {
      timestamp
      value {
        originalMessage
        originalTopic
        clientType
        err
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
    partitions {
      partitionId
      replicas {
        id
      }
    }
  }
}
`;

export const CREATE_TOPIC = gql`
mutation Mutation($name: String, $numPartitions: Int, $replicationFactor: Int) {
  createTopic(name: $name, numPartitions: $numPartitions, replicationFactor: $replicationFactor) {
    name
  }
}
`;

export const DELETE_TOPIC = gql`
mutation DeleteTopic($name: String) {
  deleteTopic(name: $name) {
    name
  }
}
`;

export const DELETE_TOPIC_RECORDS = gql`
mutation Mutation($topic: String) {
  deleteTopicRecords(topic: $topic)
}
`;
