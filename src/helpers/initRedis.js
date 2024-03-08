const redis = require('redis');

const client = redis.createClient();
client.connect()

client.on('connect', () => {
    console.log('Client connected successfully');
});

client.on('ready', () => {
    console.log('Client connected successfully and ready to use');
});

client.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

client.on('end', () => {
    console.log('Client disconnected successfully');
});

module.exports = client;
