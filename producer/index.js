const express = require('express')
const app = express()
const fs = require('fs')
const Kafka = require('node-rdkafka');

const port = process.env.PORT || 3000

if (process.env.KAFKA_CA_CERT) {
  fs.writeFileSync('ca-certificate.crt', process.env.KAFKA_CA_CERT, 'utf-8')
}

const SASL_MECHANISM = 'SCRAM-SHA-256'
const producer = new Kafka.HighLevelProducer({
  'metadata.broker.list': process.env.KAFKA_BROKER,
  'security.protocol': 'sasl_ssl',
  'sasl.mechanism': SASL_MECHANISM,
  'sasl.username': process.env.KAFKA_USERNAME,
  'sasl.password': process.env.KAFKA_PASSWORD,
  'ssl.ca.location': 'ca-certificate.crt',
});

// Connect to the broker manually
producer.connect();

const topic = process.env.KAFKA_TOPIC

app.use(
  express.raw({
    inflate: true,
    limit: '50mb',
    type: () => true, // this matches all content types
  })
);

app.post('/produce', (req, res) => {
  console.log('Got request!', req.method, req.url)
  try {
    producer.produce(
      topic,
      null,
      Object.keys(req.body).length === 0 ? Buffer.from("hello!") : Buffer.from(req.body),
      null,
      Date.now(),
      (err, report) => {
        if (err) {
          console.error('Error occurred when sending message', err);
          res.send(Buffer.from('error while sending message: ' + err.toString()))
        } else {
          res.send(Buffer.from('Message produced at offset ' + report))
        }
      }
    );
  } catch (err) {
    console.error('A problem occurred when sending our message', err);
    res.send(Buffer.from('error while sending message: ' + err.toString()))
  }
})

producer.on('event.error', (err) => {
  console.error('Error from producer', err);
})

// We must either call .poll() manually after sending messages
// or set the producer to poll on an interval (.setPollInterval).
// Without this, we do not get delivery events and the queue
// will eventually fill up.
producer.setPollInterval(100);

producer.on('ready', () => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})
