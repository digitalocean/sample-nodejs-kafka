const fs = require('fs')
const Kafka = require('node-rdkafka');


if (process.env.KAFKA_CA_CERT) {
  fs.writeFileSync('ca-certificate.crt', process.env.KAFKA_CA_CERT, 'utf-8')
}

const CONSUMER_GROUP = 'sample-consumer-group'

const SASL_MECHANISM = 'SCRAM-SHA-256'
const stream = new Kafka.createReadStream({
  'metadata.broker.list': process.env.KAFKA_BROKER,
  'group.id': CONSUMER_GROUP,
  'security.protocol': 'sasl_ssl',
  'sasl.mechanism': SASL_MECHANISM,
  'sasl.username': process.env.KAFKA_USERNAME,
  'sasl.password': process.env.KAFKA_PASSWORD,
  'ssl.ca.location': 'ca-certificate.crt',
}, {}, {'topics': [process.env.KAFKA_TOPIC]});

stream.on('data', (message) => {
  console.log('Message consumed: value = ' + message.value.toString() + ', timestamp = ' + message.timestamp + ', topic = ' + message.topic + ', partition = ' + message.partition + ', offset = ' + message.offset);
});
