// import { KafeDLQClient } = require('kafe-dlq');
const { KafeDLQClient } = require('kafe-dlq');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'dlq-companion',
    brokers: ['localhost:9091', 'localhost:9092', 'localhost:9093']
});


const callbackTest = ((message ) => {
  return parseInt(message) > 0;
})

// console.log(dlq);
const client = new KafeDLQClient(kafka, callbackTest);
const testProducer = client.producer();

testProducer.connect()
  .then(() => testProducer.send({
    topic: 'good',
    messages: [{key: '1', value: '1'}, {key: '2', value: '2'}, {key: '3', value: '3'}]
  }))
  .then(() => testProducer.send({
    topic: 'bad',
    messages: [{key: '1', value: '-1'}, {key: '2', value: '-2'}, {key: '3', value: '3'}]
  }))
  .catch((err) => console.log(err));

const testConsumer = client.consumer({groupId: 'dlq-testt'}); 
// testConsumer.connect()
//   .then(() => {
//     console.log('KAFE CONSUMER CONNECTED')
//     testConsumer.subscribe({topics: ['DeadLetterQueue'], fromBeginning: true})
//   })
//   .then(() => {
//     console.log('KAFE CONSUMER EACH BLOCK');
//     testConsumer.run({
//       eachMessage: ({topic, partition, message}) => {
//           console.log('From Kafe consumer: ')
//           console.log(JSON.parse(message.value.toString()));
//       }
//     });
//   })
//   .catch((err) => console.log(err));

// const consumer = kafka.consumer({groupId: 'dlq-test'});

// consumer.connect()
//   .then(() => {
//     console.log('CONSUMER CONNECTED');
//     consumer.subscribe({topics: ['DeadLetterQueue'], fromBeginning: true})
//   })
//   .then(() => {
//     console.log('CONSUMER EACH MESSAGE');
//     consumer.run({
//       eachMessage: ({topic, partition, message}) => {
//         console.log('From original consumer: ');
//         console.log(message.value.toString());
//       }
//     })
//   })
//   .catch((err) => {
//     console.log('Error occurred: ', err);
//   })
