import { admin } from './admin';
import { 
    ITopicMetadata, 
    SeekEntry,
    AssignerProtocol, 
    GroupDescription,
    ITopicConfig,
    ITopicPartitionConfig,
    PartitionReassignment,
    OngoingTopicReassignment,
    ConfigEntries,
    } from 'kafkajs';

//CLUSTER ADMIN ACTIONS//
export const getClusterInfo = async () => {
    try {
        const data = await admin.describeCluster();

        const brokers = data.brokers.map(broker => {
            return {
                id: broker.nodeId,
                host: broker.host,
                port: broker.port,
            }
        });

        const clusters = {
            activeControllers: brokers.filter(broker => broker.id === data.controller),
            brokerCount: brokers.length,
            brokers
        };

        return clusters;
    } catch(err) {
        console.log(err);
    }
};

//TOPIC ADMIN ACTIONS
export const getTopics = async (): Promise<ITopicMetadata[] | undefined> => {
    try {
        const topics = await admin.listTopics();
        const topicData = await admin.fetchTopicMetadata({ topics });
        
        console.log('getTopics action TopicData Before: ', topicData);
        
        for await (const topic of topicData.topics) {
            topic['partitionsCount'] = topic.partitions.length;
            const topicOffsets = await admin.fetchTopicOffsets(topic.name);
            topic['offsets'] = topicOffsets;
        };

        console.log('getTopics action TopicData After: ', topicData);
        return topicData.topics;
    } catch(err) {
        console.log(err);
    }
};

export const getTopic = async (topicName: String) => {
    try{
        const topics = await getTopics();
        const topic = topics.filter(topic => topic.name === topicName)[0];

        if(!topic) throw new Error(`Topic ${topicName} not found`);
        else{
            topic['partitionsCount'] = topic.partitions.length;
            const topicOffsets = await admin.fetchTopicOffsets(topic.name);
            topic['offsets'] = topicOffsets;
            return topic;
        }
    } catch(err) {
        console.log(err);
    }
}
// { name: string
//   partitions: <array>
// }

export const createTopic = async (name: string, replicationFactor: number, numPartitions: number, configEntries: ConfigEntries[]) => {
    try {
        const newTopicOptions = {
            topic: name,
            replicationFactor,
            numPartitions,
        };

        if (configEntries) newTopicOptions['configEntries'] = configEntries;

        const newTopic = await admin.createTopics({
            topics: [newTopicOptions]
        });

        if (newTopic) {
            const newTopicInfo = await admin.fetchTopicMetadata({ topics: [name] });
            return newTopicInfo.topics[0];
        };
    } catch(err) {
        console.log(err);
    }
};

export const deleteTopics = async (topics: string[]): Promise<void> => {
    await admin.deleteTopics({
        topics
    });
};

export const deleteAllTopicRecords = async (topic: string, partitions: SeekEntry[]): Promise<void> => {
    await admin.deleteTopicRecords({
        topic,
        partitions
    });
};

//add methods for kafka consumers


//PARTITION ADMIN ACTIONS
export const createPartitions = async (topicPartitions: ITopicPartitionConfig[]) => {
    try {
        const newPartition = await admin.createPartitions({
            validateOnly: false,
            timeout: 5000,
            topicPartitions
        });
        return newPartition;
    } catch(err) {
        console.log(err);
    }
};

export const reassignPartitions = async (topics: PartitionReassignment[]): Promise<OngoingTopicReassignment[]> => {
    try {
        const newAssignments = await admin.alterPartitionReassignments({
            topics
        });
        const result = await admin.listPartitionReassignments({});
        return result.topics;
    } catch(err) {
        console.log(err);
        return err;
    }
};

//CONSUMER GROUP ADMIN ACTIONS//
export const getConsumerGroups = async (): Promise<GroupDescription[]> => {
    const data = await admin.listGroups();
    const consumerIds = data.groups.map(group => group.groupId);

    const consumerGroups = await admin.describeGroups(consumerIds);

    const consumerGroupsDecoded: GroupDescription[] = [];
    consumerGroups.groups.forEach(group => {
        group.members.forEach(member => {
            const memberAssignment = AssignerProtocol.MemberMetadata.decode(member.memberAssignment);
            const MemberMetadata = AssignerProtocol.MemberMetadata.decode(member.memberMetadata);
        });
        consumerGroupsDecoded.push(group);
    });

    return consumerGroupsDecoded;
};

export const deleteConsumers = async (consumer: string[]): Promise<void> => {
    try {
        await admin.deleteGroups(consumer)
    } catch(err) {
        console.log('Error: ', err.name);
        console.log('Groups that failed deletion: ', err.groups);
    }
}