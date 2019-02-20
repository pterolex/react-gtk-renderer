const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:9000');

let counter = 0;

const ROOT_ID = 0;
const DECREASE_BUTTON = 1;
const COUNTER_LABEL_ID = 2;
const INCREASE_BUTTON = 3;
const LAST_UPDATED_LABEL = 4;
const GRID_ID = 5;

const getChangeLabelCommand = (elementId, value) => (
    {
        id: 2,
        command: "set_label",
        elementId,
        args: [
            value.toString()
        ]
    }
)

const sendCommand = (command) => {
    console.log('Sending command', command);

    ws.send(JSON.stringify(command));
}

ws.on('message', function incoming(dataString) {
    try {
        const data = JSON.parse(dataString);
        console.log(data);

        const elementId = parseInt(data.elementId);

        // Mega code here:
        const isIncrease = elementId === INCREASE_BUTTON;
        const isDecrease = elementId === DECREASE_BUTTON;

        // No, you don't need any other buttons!
        if (!isIncrease && !isDecrease) {
            return;
        }

        counter += isDecrease ? -1 : +1;
        const counterCommand = getChangeLabelCommand(COUNTER_LABEL_ID, `Counter = ${counter}`);
        const lastUpdateCommand = getChangeLabelCommand(LAST_UPDATED_LABEL, new Date().toString());

        sendCommand(counterCommand);
        sendCommand(lastUpdateCommand);
    } catch(e) {
        console.error('Some random shit happened as always:', e);
    }
});



const getCommands = () => (
    [
        {
            "id": 0,
            "elementId": DECREASE_BUTTON,
            "command": "create_element",
            "args": [
                "button",
                "-",
                0
            ]
        },
        {
            "id": 0,
            "elementId": COUNTER_LABEL_ID,
            "command": "create_element",
            "args": [
                "label",
                "Counter = 0",
                0
            ]
        },
        {
            "id": 0,
            "elementId": INCREASE_BUTTON,
            "command": "create_element",
            "args": [
                "button",
                "+",
                0
            ]
        },
        {
            "id": 0,
            "elementId": LAST_UPDATED_LABEL,
            "command": "create_element",
            "args": [
                "label",
                new Date().toString(),
                0
            ]
        },
        {
            "id": 0,
            "elementId": GRID_ID,
            "command": "create_element",
            "args": [
                "grid",
                "",
                0
            ]
        },
        {
            "id": 0,
            "elementId": GRID_ID,
            "command": "append_child",
            "args": [
                DECREASE_BUTTON
            ]
        },
        {
            "id": 0,
            "elementId": GRID_ID,
            "command": "append_child",
            "args": [
                COUNTER_LABEL_ID
            ]
        },
        {
            "id": 0,
            "elementId": GRID_ID,
            "command": "append_child",
            "args": [
                INCREASE_BUTTON
            ]
        },
        {
            "id": 0,
            "elementId": GRID_ID,
            "command": "append_child",
            "args": [
                LAST_UPDATED_LABEL
            ]
        },
        {
            "id": 0,
            "elementId": ROOT_ID,
            "command": "append_child",
            "args": [
                GRID_ID
            ]
        },


    ]
)

let commandCounter = 0;

setInterval(() => {
    const commands = getCommands();
    const command = commands[commandCounter];

    if (command) {
        sendCommand(command);

        commandCounter++;
    }

}, 10);


