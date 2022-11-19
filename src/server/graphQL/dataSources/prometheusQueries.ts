interface PromQuery {
    name: string,
    query: string,
    type: string,
};

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

export const UNDER_MIN_ISR_COUNT: PromQuery = {
    name: 'Under Min ISR Count',
    query: `sum(kafka_server_replicamanager_underminisrpartitioncount{job="kafka"})`,
    type: 'cluster'
};

//network request rate
export const NETWORK_REQUEST_RATE: PromQuery = {
    name: 'Network Request Rate',
    query: `avg_over_time(kafka_network_requestmetrics_requests_total{job="kafka"}[1m])*100`,
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
    query: `kafka_network_requestmetrics_totaltimems`,
    type: 'broker'
};

//Broker bytes in over time
export const BROKER_BYTES_IN: PromQuery = {
    name: '',
    query: '',
    type: 'broker'
};

//Broker bytes in over time
export const BROKER_BYTES_OUT: PromQuery = {
    name: '',
    query: '',
    type: 'broker'
};