const { KafeDLQClient } = require('kafe-dlq');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'dlq-companion',
    brokers: process.env.KAFKA_BROKERS.split(','),
});

//define your callback function logic to validate messages
const callbackTest = ((message ) => {
  return parseInt(message) > 0;
});

const client = new KafeDLQClient(kafka, callbackTest);
const testProducer = client.producer();

testProducer.connect()
  .then(() => testProducer.send({
    topic: 'good',
    messages: [{key: '1', value: '1'}, {key: '2', value: '2'}, {key: '3', value: '3'}]
  }))
  .then(() => testProducer.send({
    topic: 'goodmonkey',
    messages: [{key: '1', value: '-666'}, {key: '2', value: '-666'}, {key: '3', value: '3'}]
  }))
  .catch((err) => console.log(err));


