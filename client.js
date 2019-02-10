const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:9000');

ws.on('open', function open() {
    ws.send('something');
});

ws.on('message', function incoming(data) {
    console.log(data);
});

setInterval(() => {
    console.log('Sending data...');

    ws.send(new Date().toString())
}, 10000);


