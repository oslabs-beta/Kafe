import { Console } from 'console';
import * as adminActions from '../kafkaAdmin/adminActions';
import {
    ACTIVE_CONTROLLER_COUNT,
    UNDER_REPLICATED_PARTITIONS_COUNT,
    OFFLINE_PARTITIONS,
    UNDER_MIN_ISR_COUNT,
    PROCESS_CPU_SECONDS_TOTAL,
    JVM_MEMORY_BYTES_USED,
    TOTAL_TIME_MS,
    BROKER_BYTES_IN,
    BROKER_BYTES_OUT,
    MESSAGES_IN_PER_SEC,
    TOTAL_REPLICAS_COUNT,
    INSYNC_REPLICAS_COUNT,
    TOPIC_LOG_SIZE
    } from './dataSources/prometheusQueries';


const resolvers = {
    // underMinISRCount: Int
    Cluster: {
        underreplicatedPartitionsCount: async(parent, args, {dataSources}): Promise <Number> => {
            try{
                const underReplicatedPartitions = await dataSources.prometheusAPI.instanceQuery(UNDER_REPLICATED_PARTITIONS_COUNT);

                console.log('Underreplicated partitions resolver result: ', underReplicatedPartitions);
                return Number(underReplicatedPartitions[0].value);
            }catch(err) {
                console.log('Error occured during cluster resolver underreplicatedPartitionsCount:', err);
            }
        },

        offlinePartitionsCount: async(parent, args, {dataSources}): Promise <Number> => {
            try{
                const offlinePartitions = await dataSources.prometheusAPI.instanceQuery(OFFLINE_PARTITIONS);

                console.log('Offline partitions resolver result: ', offlinePartitions);
                return Number(offlinePartitions[0].value);
            } catch(err){
                console.log('Error occured during cluster resolver offlinePartitionsCount:', err);
            }
        },

        activeControllersCount: async(parent, args, { dataSources }): Promise<Number> => {
            try {
                const activeControllers = await dataSources.prometheusAPI.instanceQuery(ACTIVE_CONTROLLER_COUNT);

                console.log('Active controllers count resolver result: ', activeControllers);
                const activeControllersCount = Number(activeControllers[0].value);
                return activeControllersCount;
            } catch(err) {
                console.log('Error occured during activeControllersCount resolver: ', err)
            }
        },

        underMinISRCount: async(parent, args, { dataSources }): Promise<Number> => {
            try {
                const underMinISRObject = await dataSources.prometheusAPI.instanceQuery(UNDER_MIN_ISR_COUNT);

                console.log('UnderMinISRCount resolver result: ', underMinISRObject);
                const underMinISRCount = Number(underMinISRObject[0].value);
                return underMinISRCount;
            } catch(err) {
                console.log('Error occured during underMinISRCount resolver: ', err);
            }
        },
    },

    Broker: {
        underreplicatedPartitionsCount: async(parent, args, { dataSources }): Promise<Number> => {
            try {
                const data = await dataSources.prometheusAPI.instanceQuery(UNDER_REPLICATED_PARTITIONS_COUNT, [parent.id]);

                console.log('underreplicatedPartitionsCount resolver result: ', data);
                return Number(data[0].value);
            } catch(err) {
                console.log('Error occurred in underreplicatedPartitiionsCount resolver: ', err);
            };
        },

        CPUUsageOverTime: async(parent, args, { dataSources }): Promise<any> => {
            try {
                const cpuUsage = await dataSources.prometheusAPI.instanceRangeQuery(
                    PROCESS_CPU_SECONDS_TOTAL, 
                    parent.start, 
                    parent.end, 
                    parent.step, 
                    [parent.id]);

                console.log('cpuUsage resolver result: ', cpuUsage);
                return cpuUsage;
            } catch(err){
                console.log('Error occurred in CPUUsageOverTime resolver: ', err)
            }
        },

        JVMMemoryUsedOverTime: async(parent, args, { dataSources }): Promise<any> => {
            try {
                const brokerMemoryUsage = await dataSources.prometheusAPI.instanceRangeQuery(
                    JVM_MEMORY_BYTES_USED,
                    parent.start, 
                    parent.end, 
                    parent.step, 
                    [parent.id]);
                return brokerMemoryUsage;
            } catch(err) {
                console.log('Error occurred in JVMMemoryUsedOverTime resolver: ', err);
            }
        },

        produceTotalTimeMs: async(parent, args, { dataSources }): Promise<any> => {
            try {
                const produceTimeMs = await dataSources.prometheusAPI.totalMsQuery(TOTAL_TIME_MS, 'Produce', [parent.id]);
                return produceTimeMs;
            } catch(err) {
                console.log('Error occurred in produceTotalTimeMs resolver: ', err);
            }
        },

        fetchConsumerTotalTimeMs: async(parent, args, { dataSources }): Promise<any> => {
            try {
                const fetchConsumerTimeMs = await dataSources.prometheusAPI.totalMsQuery(TOTAL_TIME_MS, 'FetchConsumer', [parent.id]);
                return fetchConsumerTimeMs;
            } catch(err) {
                console.log('Error occurred in fetchConsumerTotalTimeMs resolver: ', err);
            }
        },

        fetchFollowerTotalTimeMs: async(parent, args, { dataSources }): Promise<any> => {
            try {
                const fetchFollowerTimeMs = await dataSources.prometheusAPI.totalMsQuery(TOTAL_TIME_MS, 'FetchFollower', [parent.id]);
                return fetchFollowerTimeMs;
            } catch(err) {
                console.log('Error occurred in fetchFollowerTotalTimeMs resolver: ', err);
            }
        },

        bytesInPerSecOverTime: async(parent, args, { dataSources }): Promise<any> => {
            try {
                const brokerBytesInOvertime = await dataSources.prometheusAPI.instanceRangeQuery(
                    BROKER_BYTES_IN, 
                    parent.start, 
                    parent.stop, 
                    parent.step, 
                    [parent.id]);
                return brokerBytesInOvertime;
            } catch(err) {
                console.log('Error occurred in bytesInPerSecOverTime resolver: ', err);
            }
        },

        bytesOutPerSecOverTime: async(parent, args, { dataSources }): Promise<any> => {
            try {
                const brokerBytesOutOvertime = await dataSources.prometheusAPI.instanceRangeQuery(
                    BROKER_BYTES_OUT, 
                    parent.start, 
                    parent.stop, 
                    parent.step, 
                    [parent.id]);
                return brokerBytesOutOvertime;
            } catch(err) {
                console.log('Error occurred in bytesOutPerSecOverTime resolver: ', err);
            }
        },

        messagesInPerSec: async(parent, args, { dataSources }): Promise<any> => {
            try {
                const messagesInPerSec = await dataSources.prometheusAPI.instanceQuery(MESSAGES_IN_PER_SEC, [parent.id]);
                return messagesInPerSec;
            } catch(err) {
                console.log('Error occurred in messagesInPerSec resolver: ', err);
            }
        }
    },
    // replicasCount: Int
    // ISRCount: Int
    // logSize: DataPoint
    Topic: {
        replicasCount: async(parent, args, { dataSources }): Promise<number> => {
            try {
                const replicas = await dataSources.prometheusAPI.topicQuery(TOTAL_REPLICAS_COUNT, parent.name);
                const replicasCount = Number(replicas[0].value);
                return replicasCount;
            } catch(err) {
                console.log('Error occurred in topic replicasCount resolver: ', err)
            }
        },

        ISRCount: async(parent, args, { dataSources }): Promise<number> => {
            try {
                const isr = await dataSources.prometheusAPI.topicQuery(INSYNC_REPLICAS_COUNT, parent.name);
                const isrCount = Number(isr[0].value);
                return isrCount;
            } catch(err) {
                console.log('Error occurred in topic replicasCount resolver: ', err)
            }
        },

        logSize: async(parent, args, { dataSources }): Promise<number> => {
            try {
                const logSize = await dataSources.prometheusAPI.topicQuery(TOPIC_LOG_SIZE, parent.name);

                logSize[0].value = Number((logSize[0].value / 1000000000).toFixed(2))
                return logSize;
            } catch(err) {
                console.log(err);
            }
        },
    },
    
    Query: {
        cluster: async(): Promise<any> => {
            const cluster = await adminActions.getClusterInfo();
            return cluster;
        },

        brokers: async(parent, { start, end, step, ids }): Promise<any> => {
            try {
                const clusterInfo = await adminActions.getClusterInfo();
                let { brokers } = clusterInfo;
                
                if (start) {
                    brokers.map(broker => {
                        broker['start'] =start;
                        broker['end'] = end;
                        broker['end'] = step;
                    })
                };

                if (ids) brokers = brokers.filter(broker => ids.includes(broker.id));
                return brokers;
            } catch(err) {
                console.log(err);
            }
        },

        broker: async(parent, { start, end, step, id }): Promise<any> => {
            try {
                const clusterInfo = await adminActions.getClusterInfo();
                const broker = clusterInfo.brokers.filter(broker => broker.id === id)[0];

                if (!broker) throw new Error('No broker with that found');

                if (start && broker) {
                    broker['start'] = start;
                    broker['end'] = end;
                    broker['step'] = step;
                };

                return broker;
            } catch(err) {
                console.log(err);
            }
        },

        topics: async(): Promise<any> => {
            try {
                const topics = await adminActions.getTopics();
                return topics;
            } catch(err) {
                console.log(err);
            }
        },

        topic: async(parent, { name }): Promise<any> => {
            try {
                const topic = await adminActions.getTopic(name);
                return topic;
            } catch(err) {
                console.log(err);
            }
        },
    },

    Mutation: {
        createTopic: async () => {

        },

        deleteTopic: async () => {

        },

        deleteTopicRecords: async () => {

        },

        reassignPartitions: async() => {

        },

    }
};

export default resolvers;