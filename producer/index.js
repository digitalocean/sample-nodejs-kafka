const express = require('express')
const app = express()
const fs = require('fs')
const Kafka = require('node-rdkafka');

const port = process.env.PORT || 3000

var LoremIpsum = require('lorem-ipsum').LoremIpsum;

var lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const SASL_MECHANISM = 'SCRAM-SHA-256'

fs.writeFileSync('ca-certificate.crt', process.env.KAFKA_CA_CERT, 'utf-8')

const producer = new Kafka.HighLevelProducer({
  'metadata.broker.list': process.env.KAFKA_BROKER,
  'security.protocol': 'sasl_ssl',
  'sasl.mechanism': SASL_MECHANISM,
  'sasl.username': process.env.KAFKA_USERNAME,
  'sasl.password': process.env.KAFKA_PASSWORD,
  'ssl.ca.location': 'ca-certificate.crt',
  'dr_cb': true
});

// Connect to the broker manually
producer.connect();

// // Wait for the ready event before proceeding
// producer.on('ready', () => {
//   try {
//     producer.produce(
//       process.env.KAFKA_TOPIC,
//       null,
//       // Message to send. Must be a buffer
//       Buffer.from('started!'),
//       // for keyed messages, we also specify the key - note that this field is optional
//       'Stormwind',
//       // you can send a timestamp here. If your broker version supports it,
//       // it will get added. Otherwise, we default to 0
//       Date.now(),
//       // you can send an opaque token here, which gets passed along
//       // to your delivery reports
//     );
//   } catch (err) {
//     console.error('A problem occurred when sending our message');
//     console.error(err);
//   }
// });

app.get('/', (req, res) => res.send(lorem.generateParagraphs(7)))
app.get('/kafka-test2', (req, res) => {
  console.log('sending message')
  try {
    producer.produce(
      process.env.KAFKA_TOPIC,
      null,
      // Message to send. Must be a buffer
      Buffer.from(lorem.generateWords(4)),
      // for keyed messages, we also specify the key - note that this field is optional
      'Stormwind',
      // you can send a timestamp here. If your broker version supports it,
      // it will get added. Otherwise, we default to 0
      Date.now(),
      // you can send an opaque token here, which gets passed along
      // to your delivery reports
      (err, report) => {
        if (err) {
          console.error('Error occurred when sending message');
          console.error(err);
        } else {

        }
        console.log('delivery-report: ' + JSON.stringify(report))
      }
    );
    res.send('done!')
  } catch (err) {
    console.error('A problem occurred when sending our message');
    console.error(err);
    res.send('error!')
  }
})

// Any errors we encounter, including connection errors
producer.on('event.error', (err) => {
  console.error('Error from producer');
  console.error(err);
})

// We must either call .poll() manually after sending messages
// or set the producer to poll on an interval (.setPollInterval).
// Without this, we do not get delivery events and the queue
// will eventually fill up.
producer.setPollInterval(100);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
