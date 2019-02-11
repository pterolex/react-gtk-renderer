
const WebSocket = require('ws');
const chalk = require('chalk');

let generalCommandId = 0;
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

    generalCommandId++;

    commandsPool.shift();
}

const sendQueuedCommands = () => {
    if (commandsPool.length > 0) {
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

const appendGtkChild = (parentId, childId) => {
    const cmd = {
        id: generalCommandId,
        elementId: parentId,
        command: "append_child",
        args: [
            childId
        ]
    }

    enqueueCommand(cmd);
}
const createGtkElement = (id, props) => {
    const cmd = {
        id: generalCommandId,
        elementId: id,
        command: "create_element",
        args: [
            props.type,
            props.label || '',
            0
        ]
    }

    widgets[id] = Object.assign({}, props);

    enqueueCommand(cmd);
}

const updateGtkElement = (elementId, propName, value) => {
    console.log('updateGtkElement', propName, value);
    widgets[elementId] = Object.assign({}, widgets[elementId], { [propName]: value });

    if (typeof value == 'function') {
        return;
    }

    const cmd = {
        id: generalCommandId,
        elementId,
        command: "set_" + propName.toLowerCase(),
        args: [
            value.toString(),
        ]
    }


    enqueueCommand(cmd);
}

connection = initConnection();

module.exports = {
    appendGtkChild,
    createGtkElement,
    updateGtkElement,
};