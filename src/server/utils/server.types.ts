
export interface Cluster {
    brokers: [Broker],
    brokerCount: Number,
    activeControllers: [Broker]
    activeControllersCount?: Number
    underreplicatedPartitionsCount?: Number,
    offlinePartitionsCount?: Number,
    underMinISRCount?: Number,
};

export interface Broker {
    id: Number,
    port: Number,
    host: String,
    start?: String,
    end?: String,
    step?: String,
    underreplicatedPartitionsCount?: Number,
    CPUUsageOverTime?: [DataPoint],
    JVMMemoryUsedOverTime?: [DataPoint],
    produceTotalTimeMs?: DataPoint,
    fetchConsumerTotalTimeMs?: DataPoint,
    fetchFollowerTotalTimeMs?: DataPoint,
    bytesInPerSecOverTime?: [DataPoint],
    bytesOutPerSecOverTime?: [DataPoint],
    messagesInPerSec?: [DataPoint],
};

export interface Topic {
    name: String
    partitions: [Partition]
    partitionsCount?: Number
    replicasCount?: Number,
    ISRCount?: Number,
    logSize?: DataPoint,
    offsets?: [TopicOffset]
};

export interface Partition {
    partitionId: Number,
    leader: Number
    replicas: [Number]
    isr: [Number]
};

export interface DataPoint {
    id?: Number,
    topic?: String,
    instance?: String,
    time: Date,
    value: Number,
};

export interface TopicOffset {
    partition: Number,
    offset: String,
    high: String,
    low: String
}

