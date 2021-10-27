const protobuf = require("protobufjs");
const WebSocket = require('ws')


const root = protobuf.loadSync('./YPricingData.proto');

const Yaticker = root.lookupType("yaticker");
const ws = new WebSocket('wss://streamer.finance.yahoo.com');

ws.onopen = function open() {
  console.log('connected');
  ws.send(JSON.stringify({
    subscribe: ['TCS.BO']
  }));
};

ws.onclose = function close() {
  console.log('disconnected');
};

ws.onmessage = function incoming(data) {
  console.log('comming message')
  const ticker = Yaticker.decode(new Buffer(data.data, 'base64')); 
  console.log(ticker.id.split('.')[0])
};