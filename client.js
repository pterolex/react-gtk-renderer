const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:9000');

ws.on('open', function open() {
    // ws.send('something');
});

ws.on('message', function incoming(data) {
    console.log(data);
});

const getCommands = () => (
    [
        {
            id: 1,
            elementId: 2,
            command: "create_element",
            args: [
                "button"
            ]
        },
        {
            id: 2,
            elementId: 2,
            command: "set_label",
            args: [
                new Date().toString()
            ]
        },
        // {
        //     id: 1,
        //     elementId: 2,
        //     command: "create_element",
        //     args: [
        //         "button",
        //         "Click me!"
        //     ]
        // },
        // {
        //     id: 2,
        //     elementId: 2,
        //     command: "set_label",
        //     args: [
        //         new Date().toString()
        //     ]
        // },
        {
            id: 5,
            elementId: 5,
            command: "set_label",
            args: [
                new Date().toString()
            ]
        }
    ]
)

let counter = 0;

setInterval(() => {
    console.log('Sending data...');

    const commands = getCommands();
    const command = commands[counter % commands.length];

    ws.send(JSON.stringify(command));

    counter++;
}, 5000);


