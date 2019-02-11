
const WebSocket = require('ws');
const chalk = require('chalk');

let generalCommandId = 0;
let generalWidgetId = 1;
let connection;
const commandsPool = [];
const widgets = {};

const enqueueCommand = (command) => {
    console.log('Queueing command');
    commandsPool.push(command)
}

const sendCommand = (command) => {
    console.log('Sending command', command);

    connection.send(JSON.stringify(command));

    commandsPool.shift();
}

const sendQueuedCommands = () => {
    if (commandsPool.length > 0) {
        console.log(chalk.green('sendQueuedCommands'), commandsPool);
        const command = commandsPool[0];

        sendCommand(command);
    }
}

const initConnection = (host, port) => {

    const ws = new WebSocket('ws://localhost:9000');


    ws.on('open', function open() {
        console.log(chalk.yellow('Init connection', commandsPool.length));

        setInterval(() => {
            sendQueuedCommands();
        }, 100);
    });

    ws.on('message', function incoming(dataString) {
        console.log('message', dataString);

        try {
            const data = JSON.parse(dataString);
            console.log(data);

            if (data.event === 'click') {
                const elementId = parseInt(data.elementId);

                const widget = widgets[elementId];
                console.log('widgets', widgets);
                console.log('call/onClick', data.elementId, widget);

                if (widget && widget.onClick) {
                    widget.onClick();
                }
             }
        } catch (e) {
            console.error('JSON parse error!', e);
        }
    });

    return ws;
}

const createGtkElement = (props) => {
    const cmd = {
        id: 1,
        elementId: generalWidgetId,
        command: "create_element",
        args: [
            props.type,
            props.label || '',
            0
        ]
    }

    widgets[generalWidgetId] = Object.assign({}, props);

    generalWidgetId++;

    enqueueCommand(cmd);
}

const updateGtkElement = (...args) => {
    console.log('updateGtkElement', args);
}

connection = initConnection();

module.exports = {
    createGtkElement,
    updateGtkElement,
};