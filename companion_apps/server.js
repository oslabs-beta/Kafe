const express = require('express');
const { Kafka, Partitioners } = require('kafkajs');


const app = express();
const kafka = new Kafka({
    clientId: 'kafe-companion',
    brokers: ['localhost:9091', 'localhost:9092', 'localhost:9093']
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
const consumer = kafka.consumer({ groupId: 'test-group' });

const sendMessages = async () => {
    await producer.connect();
    await producer.send({
        topic: 'test-topic',
        messages: [
            {key: 'key1', value: 'hello world'},
            {key: 'key1', value: 'hello world2'},
            {key: 'key2', value: 'hello world3'},
            {key: 'key1', value: 'hello world4'},
            {key: 'key2', value: 'hello world5'},
            {key: 'key3', value: 'hello world6'},
            {key: 'key3', value: 'partition1'}
        ]
    })
};
const consumeMessages = async () => {
    await consumer.connect();
    await consumer.subscribe({
        topics: [
            'test-topic'
        ],
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async({ topic, partition, message, heartbeat, pause }) => {
            console.log({
                key: message.key.toString(),
                value: message.value.toString(),
                topic,
                partition,
            })
        }
    });

};

sendMessages();
consumeMessages();

const server = app.listen(3333, () => {
    console.log('Listening on port 3333...')
});

server.close();

module.exports = {
    sendMessages,
    consumeMessages,
    app,
    producer,
    consumer
};