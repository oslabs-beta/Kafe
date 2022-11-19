interface PromQuery {
    name: string,
    query: string,
    type: string,
};
//CLUSTER AND BROKER QUERIES//

//Number of underreplicated partitions. Use instance filter fo broker
export const UNDER_REPLICATED_PARTITIONS_COUNT: PromQuery = {
    name: 'Underreplicated Partitions',
    query: `sum(kafka_server_replicamanager_underreplicatedpartitions{instance=~"filter"})`,
    type: 'cluster'
};

//Number of offline partitions
export const OFFLINE_PARTITIONS: PromQuery = {
    name: 'Offline Partitions',
    query: `sum(kafka_controller_kafkacontroller_offlinepartitionscount)`,
    type: 'cluster'
};

//Check total topics that are under min ISR
export const UNDER_MIN_ISR_COUNT: PromQuery = {
    name: 'Under Min ISR Count',
    query: `sum(kafka_cluster_partition_underminisr{topic!=""})`,
    type: 'cluster'
};

//network request rate
export const NETWORK_REQUEST_RATE: PromQuery = {
    name: 'Network Request Rate',
    query: `avg_over_time(kafka_network_requestmetrics_requests_total{instance=~"filter"}[1m])`,
    type: 'broker'
};

//JVM CPU usage query
export const PROCESS_CPU_SECONDS_TOTAL: PromQuery = {
    name: 'Broker CPU Usage',
    query: `rate(process_cpu_seconds_total{job="kafka"}[1m])*100`,
    type: 'broker'
};

//JVM Memory usage for broker
export const JVM_MEMORY_BYTES_USED: PromQuery = {
    name: 'JVM Memory Usage Over Time',
    query: `(sum(avg_over_time(jvm_memory_bytes_used{area="heap", job!="zookeeper"}[1m]))/sum(avg_over_time(jvm_memory_bytes_committed{area="heap", job!="zookeeper"}[1m])))*100`,
    type: 'broker'
};

//PrometheusAPI will need to add in {request=~"", quantile=~"0.50"}
export const TOTAL_TIME_MS: PromQuery = {
    name: 'Total Time MS',
    query: `kafka_network_requestmetrics_totaltimems{request=~"filter", quantile=~"0.50"}`,
    type: 'broker'
};

//Broker bytes in over time
export const BROKER_BYTES_IN: PromQuery = {
    name: 'Broker Bytes in Over Time',
    query: 'avg_over_time(kafka_server_brokertopicmetrics_bytesoutpersec{topic!="", instance=~"filter"}[1m])',
    type: 'broker'
};

//Broker bytes in over time
export const BROKER_BYTES_OUT: PromQuery = {
    name: 'Broker Bytes in Over Time',
    query: 'avg_over_time(kafka_server_brokertopicmetrics_bytesoutpersec{topic!="", instance=~"filter"}[1m])',
    type: 'broker'
};

//Broker messages in over time
export const MESSAGES_IN_PER_SEC: PromQuery = {
    name: "Message in per Second",
    query:
      'avg_over_time(kafka_server_brokertopicmetrics_messagesinpersec{topic!="", instance=~"filter"}[60s]))',
    type: "broker",
};

//TOPIC QUERIES//

//Get Topic Replica Count
export const TOTAL_REPLICAS_COUNT: PromQuery = {
    name: 'Total Replicas',
    query: 'sum(kafka_cluster_partition_replicascount{topic=~"filter"})by(topic)',
    type: 'topic'
};

export const INSYNC_REPLICAS_COUNT: PromQuery = {
    name: 'Total Replicas',
    query: 'sum(kafka_cluster_partition_insyncreplicascount{topic=~"filter"})by(topic)',
    type: 'topic'
};

export const TOPIC_LOG_SIZE: PromQuery = {
    name: 'Topic Log Size',
    query: 'sum(kafka_log_log_size{topic=~"filter"})by(topic)',
    type: 'topic'
};