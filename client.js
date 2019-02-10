const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:9000');

let counter = 0;

const ROOT_ID = 0;
const GRID_ID = 1;
const DECREASE_BUTTON = 2;
const INCREASE_BUTTON = 3;
const LABEL_ID = 4;

const getChangeCounterCommand = (counter) => (
    {
        id: 2,
        elementId: 4,
        command: "set_label",
        args: [
            counter.toString()
        ]
    }
)

const sendCommand = (command) => {
    console.log('Sending command');
    ws.send(JSON.stringify(command));
}

ws.on('open', function open() {
    // ws.send('something');
});

ws.on('message', function incoming(dataString) {
    console.log('message', dataString);

    try {
        const data = JSON.parse(dataString);
        console.log(data);

        const elementId = parseInt(data.elementId);
        const isIncrease = elementId === INCREASE_BUTTON;
        const isDecrease = elementId === DECREASE_BUTTON;

        if (!isIncrease && !isDecrease) {
            return;
        }

        counter += isDecrease ? -1 : +1;
        const command = getChangeCounterCommand(counter);

        sendCommand(command);
    } catch(e) {
        console.error('JSON parse error!', e);
    }
});



const getCommands = () => (
    [
        {
            id: 1,
            elementId: GRID_ID,
            command: "create_element",
            args: [
                "grid",
                ROOT_ID
            ]
        },
        {
            id: 1,
            elementId: DECREASE_BUTTON,
            command: "create_element",
            args: [
                "button",
                GRID_ID,
            ]
        },
        {
            id: 1,
            elementId: LABEL_ID,
            command: "create_element",
            args: [
                "label",
                GRID_ID,
            ]
        },
        {
            id: 1,
            elementId: INCREASE_BUTTON,
            command: "create_element",
            args: [
                "button",
                GRID_ID,
            ]
        },
        {
            id: 5,
            elementId: 5,
            command: "create_element",
            args: [
                "progress",
                GRID_ID,
            ]
        },
        {
            id: 5,
            elementId: 5,
            command: "set_fraction",
            args: [
                0.6
            ]
        },
        {
            id: 2,
            elementId: INCREASE_BUTTON,
            command: "set_label",
            args: [
                "Increase counter"
            ]
        },
        {
            id: 2,
            elementId: DECREASE_BUTTON,
            command: "set_label",
            args: [
                "Decrease counter"
            ]
        },
        {
            id: 3,
            elementId: LABEL_ID,
            command: "set_label",
            args: [
                "0"
            ]
        }
    ]
)

let commandCounter = 0;

setInterval(() => {
    const commands = getCommands();
    const command = commands[commandCounter];

    if (command) {
        sendCommand(command)
    }

    commandCounter++;
}, 10);


