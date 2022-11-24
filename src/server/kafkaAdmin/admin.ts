import { Kafka } from 'kafkajs';
import * as dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
    clientId: 'Kafe',
    brokers: process.env.KAFKA_BROKERS.split(',')
});

const admin = kafka.admin();
const { CONNECT, DISCONNECT } = admin.events;

admin.on(CONNECT, () => console.log('Kafe admin connected...'));

const startKafkaAdmin = async () => {
  return await admin.connect();
}

startKafkaAdmin();

export { admin };