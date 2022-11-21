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
                return underReplicatedPartitions;
            }catch(err) {
                console.log('Error occured during cluster resolver underreplicatedPartitionsCount:', err);
            }
        },

        offlinePartitionsCount: async(parent, args, {dataSources}): Promise <Number> => {
            try{
                const offlinePartitions = await dataSources.prometheusAPI.instanceQuery(OFFLINE_PARTITIONS);
                return offlinePartitions;
            } catch(err){
                console.log('Error occured during cluster resolver offlinePartitionsCount:', err);
            }
        },

        underMinISRCount: async(parent, args, {dataSources}): Promise<Number> => {
            return 3
        },
        }

    },

    // bytesInPerSecOverTime: [DataPoint]
    // bytesOutPerSecOverTime: [DataPoint]
    // messagesInPerSec: [DataPoint]
    Broker: {
        underreplicatedPartitionsCount: async(parent, args, { dataSources }): Promise<Number> => {
            try {
                const data = await dataSources.prometheusAPI.instanceQuery(UNDER_REPLICATED_PARTITIONS_COUNT, [parent.id]);
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
                return brokerMemoryUsage
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
    
    Topic: {

    },
    
    Partition: {

    },
    
    Query: {
        cluster: async() => {
            adminActions.getClusterInfo();
        }
    }
};

export default resolvers;