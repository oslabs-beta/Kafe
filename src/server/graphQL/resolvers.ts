import * as adminActions from '../kafkaAdmin/adminActions';
import * as dotenv from 'dotenv';
import { Kafka, logLevel } from 'kafkajs';
import { KafeDLQClient } from 'kafe-dlq';

dotenv.config();

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

const kafka = new Kafka({
    clientId: 'KafeDLQ',
    brokers: process.env.KAFKA_BROKERS.split(','),
    logLevel: logLevel.ERROR
});

const consumerMap = new Map();


const client = new KafeDLQClient(kafka);
// const consumer = client.consumer({ groupId: 'DLQConsumer' });
const consumer = kafka.consumer({ groupId: 'DLQConsumer', maxWaitTimeInMs: 7000 });
// consumer.logger().setLogLevel(logLevel.DEBUG);
var i: any;
for (i = 1; i < 7; i++) {
    consumerMap.set(i, kafka.consumer({ groupId: 'DLQConsumer', maxWaitTimeInMs: 7000}))
};

i = 1;

const resolvers = {
    // underMinISRCount: Int
    Cluster: {
        underreplicatedPartitionsCount: async(parent, args, {dataSources}): Promise <Number> => {
            try{
                const underReplicatedPartitions = await dataSources.prometheusAPI.instanceQuery(UNDER_REPLICATED_PARTITIONS_COUNT);

                console.log('Underreplicated partitions resolver result: ', underReplicatedPartitions);
                return underReplicatedPartitions.length ? Number(underReplicatedPartitions[0].value) : 0;
            }catch(err) {
                console.log('Error occured during cluster resolver underreplicatedPartitionsCount:', err);
            }
        },

        offlinePartitionsCount: async(parent, args, {dataSources}): Promise <Number> => {
            try{
                const offlinePartitions = await dataSources.prometheusAPI.instanceQuery(OFFLINE_PARTITIONS);

                console.log('Offline partitions resolver result: ', offlinePartitions);
                return offlinePartitions.length ? Number(offlinePartitions[0].value) : 0;
            } catch(err){
                console.log('Error occured during cluster resolver offlinePartitionsCount:', err);
            }
        },

        activeControllersCount: async(parent, args, { dataSources }): Promise<Number> => {
            try {
                console.log('what is dataSources: ', dataSources.prometheusAPI);
                const activeControllers = await dataSources.prometheusAPI.instanceQuery(ACTIVE_CONTROLLER_COUNT);

                console.log('Active controllers count resolver result: ', activeControllers);
                const activeControllersCount = activeControllers.length ? Number(activeControllers[0].value) : 0;
                return activeControllersCount;
            } catch(err) {
                console.log('Error occured during activeControllersCount resolver: ', err)
            }
        },

        underMinISRCount: async(parent, args, { dataSources }): Promise<Number> => {
            try {
                const underMinISRObject = await dataSources.prometheusAPI.instanceQuery(UNDER_MIN_ISR_COUNT);

                console.log('UnderMinISRCount resolver result: ', underMinISRObject);
                const underMinISRCount = underMinISRObject.length ? Number(underMinISRObject[0].value) : 0;
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
            const now = new Date();
            try {
                console.log('CPUUsage Over Time: ', parent)
                const cpuUsage = await dataSources.prometheusAPI.instanceRangeQuery(
                    PROCESS_CPU_SECONDS_TOTAL,
                    parent.start ? parent.start : new Date(+now - 60000 * 10),
                    parent.end ? parent.end : now,
                    parent.step ? parent.step : '60s',
                    [parent.id]);

                // console.log('cpuUsage resolver result: ', cpuUsage);
                return cpuUsage[0].values;
            } catch(err){
                console.log('Error occurred in CPUUsageOverTime resolver: ', err)
            }
        },

        JVMMemoryUsedOverTime: async(parent, args, { dataSources }): Promise<any> => {
            const now = new Date();
            try {
                console.log('JVM resolver: ', parent);
                const brokerMemoryUsage = await dataSources.prometheusAPI.instanceRangeQuery(
                    JVM_MEMORY_BYTES_USED,
                    parent.start ? parent.start : new Date(+now - 60000 * 10),
                    parent.end ? parent.end : now,
                    parent.step ? parent.step : '60s',
                    [parent.id]);
                // console.log('JVM resolver returned result: ', brokerMemoryUsage);
                return brokerMemoryUsage[0].values;
            } catch(err) {
                console.log('Error occurred in JVMMemoryUsedOverTime resolver: ', err);
            }
        },

        produceTotalTimeMs: async(parent, args, { dataSources }): Promise<any> => {
            try {
                const produceTimeMs = await dataSources.prometheusAPI.totalMsQuery(TOTAL_TIME_MS, 'Produce', [parent.id]);
                return produceTimeMs[0];
            } catch(err) {
                console.log('Error occurred in produceTotalTimeMs resolver: ', err);
            }
        },

        fetchConsumerTotalTimeMs: async(parent, args, { dataSources }): Promise<any> => {
            try {
                const fetchConsumerTimeMs = await dataSources.prometheusAPI.totalMsQuery(TOTAL_TIME_MS, 'FetchConsumer', [parent.id]);
                return fetchConsumerTimeMs[0];
            } catch(err) {
                console.log('Error occurred in fetchConsumerTotalTimeMs resolver: ', err);
            }
        },

        fetchFollowerTotalTimeMs: async(parent, args, { dataSources }): Promise<any> => {
            try {
                const fetchFollowerTimeMs = await dataSources.prometheusAPI.totalMsQuery(TOTAL_TIME_MS, 'FetchFollower', [parent.id]);
                return fetchFollowerTimeMs[0];
            } catch(err) {
                console.log('Error occurred in fetchFollowerTotalTimeMs resolver: ', err);
            }
        },

        bytesInPerSecOverTime: async(parent, args, { dataSources }): Promise<any> => {
            const now = new Date();
            try {
                const brokerBytesInOverTime = await dataSources.prometheusAPI.instanceRangeQuery(
                    BROKER_BYTES_IN,
                    parent.start ? parent.start : new Date(+now - 60000 * 10),
                    parent.end ? parent.end : now,
                    parent.step ? parent.step : '60s',
                    [parent.id]);

                console.log('bytesInPerSecOverTime Resolver Result', brokerBytesInOverTime);
                return brokerBytesInOverTime;

            } catch(err) {
                console.log('Error occurred in bytesInPerSecOverTime resolver: ', err);
            }
        },

        bytesOutPerSecOverTime: async(parent, args, { dataSources }): Promise<any> => {
            const now = new Date();
            try {
                const brokerBytesOutOverTime = await dataSources.prometheusAPI.instanceRangeQuery(
                    BROKER_BYTES_OUT,
                    parent.start ? parent.start : new Date(+now - 60000 * 10),
                    parent.end ? parent.end : now,
                    parent.step ? parent.step : '60s',
                    [parent.id]);
                return brokerBytesOutOverTime;
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
                return logSize[0];
            } catch(err) {
                console.log(err);
            }
        },
    },

    Partition: {
        replicas: (parent) => {
          return parent.replicas.map(
            replica => (replica = { id: replica })
          );
        },

        isr: (parent) => {
          if (parent.isr.length === 0) return [];
          return parent.isr.map(replica => (replica = { id: replica }));
        },
    },

    Query: {
        cluster: async(parent, { start, end, step }): Promise<any> => {

            const cluster = await adminActions.getClusterInfo();

            if (start) {
                cluster.brokers.map(broker => {
                    broker['start'] = start;
                    broker['end'] = end;
                    broker['step'] = step;
                });
            }
            console.log('Cluster query: ', cluster)
            return cluster;
        },

        brokers: async(parent, { start, end, step, ids }): Promise<any> => {
            try {
                const clusterInfo = await adminActions.getClusterInfo();
                let { brokers } = clusterInfo;

                console.log('Brokers query: ', start, end, step)
                if (start) {
                    brokers.map(broker => {
                        broker['start'] = start;
                        broker['end'] = end;
                        broker['step'] = step;
                    })
                }

                if (ids) brokers = brokers.filter(broker => ids.includes(broker.id));
                return brokers;
            } catch(err) {
                console.log(err);
            }
        },

        broker: async(parent, { start, end, step, id }): Promise<any> => {
            try {
                const clusterInfo = await adminActions.getClusterInfo();
                console.log('Broker resolver: ', start, end);
                const broker = await clusterInfo.brokers.filter(broker => broker.id === id)[0];
                console.log('Broker query: ', broker);

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

        bytesInPerSecOverTime: async(parent, { start, end, step, topics, ids }, { dataSources }) => {

            const now = new Date();
            try {
                const allBytesInPerSec = await dataSources.prometheusAPI.instanceRangeQuery(
                    BROKER_BYTES_IN,
                    start ? start : new Date(+now - 60000 * 10),
                    end ? end : now,
                    step ? step : '60s',
                    ids
                );

                if (topics) {
                    let filteredBytesInPerSec = allBytesInPerSec.filter(data => topics.includes(data.topic));
                    return filteredBytesInPerSec;
                } else {
                    return allBytesInPerSec;
                }
            } catch(err) {
                console.log('Error in bytesInPerSecOverTime query: ', err);
            };
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

        dlq: async(parent, args, context): Promise<any> => {
            const consumer = consumerMap.get(i);
            ++i;
            if (i > 6) i = 1;
            const consumerNumber = i === 1? 6 : i - 1
            // await consumer.disconnect();

            return new Promise((resolve, reject) => {
                const DLQMessages = [];
                consumer.connect()
                console.log(`dlq resolver consumer${consumerNumber} connected...`);
                consumer.subscribe({ topics: ['DeadLetterQueue'], fromBeginning: true })
                consumer.run({
                    eachMessage: async({ topic, partition, message}) => {
                        DLQMessages.push({
                            timestamp: new Date(parseInt(message.timestamp)).toLocaleString('en-US', {
                                timeStyle: "long",
                                dateStyle: "short",
                                hour12: false,
                            }),
                            value: JSON.parse(message.value.toString()),
                        })
                    },
                });
                setTimeout(() => {
                    console.log(`consumer${consumerNumber} disconnecting...`);
                    consumer.disconnect();
                    resolve(DLQMessages);
                    console.log(DLQMessages);
                    return DLQMessages.reverse();
                }, 5000);
            });

            // dlq: async(parent, args, context): Promise<any> => {
            //     const consumer = consumerMap.get(i);
            //     ++i;
            //     if (i > 3) i = 1;
            //     await consumer.disconnect();

            //     return new Promise((resolve, reject) => {

            //         const DLQMessages = [];
            //         consumer.connect()
            //           .then(() => {
            //             console.log(`dlq resolver consumer${i === 1 ? 3 : i - 1} connected...`);
            //             consumer.subscribe({ topics: ['DeadLetterQueue'], fromBeginning: true })
            //           })
            //           .then(() => {
            //             consumer.run({
            //                 eachMessage: async({ topic, partition, message}) => {
            //                     DLQMessages.push({
            //                         timestamp: new Date(parseInt(message.timestamp)).toLocaleString('en-US', {
            //                             timeStyle: "long",
            //                             dateStyle: "short",
            //                             hour12: false,
            //                         }),
            //                         value: JSON.parse(message.value.toString()),
            //                     })
            //                 },
            //             });
            //           })
            //           .catch((err: Error) => {
            //             console.log(err);
            //           })
            //           .finally(() => {
            //               setTimeout(() => {
            //                 console.log(`consumer${i === 1 ? 3 : i - 1} disconnecting...`);
            //                 consumer.disconnect();
            //                 resolve(DLQMessages);
            //                 console.log(DLQMessages);
            //                 return DLQMessages.reverse();
            //               }, 5000);
            //           });
            //     });
            // return new Promise((resolve, reject) => {

            //     const DLQMessages = [];
            //     consumer.connect()
            //       .then(() => {
            //         console.log('dlq resolver consumer connected...');
            //         consumer.subscribe({ topics: ['DeadLetterQueue'], fromBeginning: true })
            //       })
            //       .then(() => {
            //         consumer.run({
            //             eachMessage: ({ topic, partition, message}) => {
            //                 DLQMessages.push({
            //                     timestamp: new Date(parseInt(message.timestamp)).toLocaleString('en-US', {
            //                         timeStyle: "long",
            //                         dateStyle: "short",
            //                         hour12: false,
            //                     }),
            //                     value: JSON.parse(message.value.toString()),
            //                 })
            //             },
            //         });
            //       })
            //       .catch((err: Error) => {
            //         console.log(err);
            //         reject(err);
            //         return err;
            //       })
            //       .finally(() => {
            //           setTimeout(() => {
            //             console.log('consumer disconnecting...');
            //             consumer.disconnect();
            //             resolve(DLQMessages)
            //             return DLQMessages;
            //           }, 5000);
            //       });
            // });
        },
    },
    Mutation: {
        createTopic: async (
            parent,
            {
            name,
            numPartitions = -1,
            replicationFactor = -1,
            configEntries = []
            }
        ) => {
            try {
                console.log('Topic mutation request received: ', name);
                const newTopic = await adminActions.createTopic(
                    name,
                    numPartitions,
                    replicationFactor,
                    configEntries
                );
                return newTopic;
            } catch(err) {
                console.log('Create Topic Resolver Error:', err);
            }
        },

        deleteTopic: async (parent, { name }) => {
            try {
                const deletedTopic = await adminActions.deleteTopics([name]);
                return deletedTopic;
            } catch (err) {
                console.log('Delete Topic Resolver Error:', err);
            }
        },

        deleteTopicRecords: async (parent, { name, partitions }) => {
            try {
                const deletedTopicRecords = await adminActions.deleteAllTopicRecords(name, partitions);
                //offset set to -1 to delete all records
                return true;
            } catch (err) {
                console.log('Delete Topic Records Resolver Error:', err);
            }
        },

        reassignPartitions: async(parent , { topics }) => {
            try {
                console.log('reassignPartitions resolver: ', topics)
                const reassignPartitions = await adminActions.reassignPartitions(topics);

                console.log('reassignPartitions result: ', reassignPartitions);
                return reassignPartitions;
            } catch (err){
                console.log('Reassign Partitions Error:', err)
            }
        },
    }
};

export default resolvers;