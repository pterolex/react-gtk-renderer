
// const WebSocket = require('ws');
// const chalk = require('chalk');
// const fs = require('fs');
const config = require('../../etc/config.js');
const ConnectionManager = require('../ConnectionManager');

const { Logger } = require('../utils/logger');

const logger = new Logger('GtkConnection');

// let generalCommandId = 0;
// let connection;
// const commandsPool = [];
const widgets = {};

// const eventsLogStream = fs.createWriteStream('reactLogs.log');

const connectionManager = new ConnectionManager({
    wsServerPort: config.wssPort,
    logger,
});

connectionManager.init();

// const enqueueCommand = (command) => {
//     console.log('Queueing command');
//     commandsPool.push(command);
// };

// const sendCommand = (command) => {
//     console.log('Sending command', command);

//     connection.send(JSON.stringify(command));

//     eventsLogStream.write(`${JSON.stringify(command, null, 4)}\n\n`);

//     generalCommandId++;

//     commandsPool.shift();
// };

// const sendQueuedCommands = () => {
//     if (commandsPool.length > 0) {
//         const command = commandsPool[0];

//         sendCommand(command);
//     }
// };

// const initConnection = (host, port) => {
//     const ws = new WebSocket('ws://localhost:9001');


//     ws.on('open', () => {
//         console.log(chalk.yellow('Init connection', commandsPool.length));

//         setInterval(() => {
//             sendQueuedCommands();
//         }, 100);
//     });

//     ws.on('message', (dataString) => {
//         console.log('message', dataString);

//         try {
//             const data = JSON.parse(dataString);
//             console.log(data);

//             if (data.event === 'click') {
//                 const elementId = parseInt(data.elementId);

//                 const widget = widgets[elementId];
//                 console.log('widgets', widgets);
//                 console.log('call/onClick', data.elementId, widget);

//                 if (widget && widget.onClick) {
//                     widget.onClick();
//                 }
//             }
//         } catch (e) {
//             console.error('JSON parse error!', e);
//         }
//     });

//     return ws;
// };

const appendGtkChild = (parentId, childId) => {
    const cmd = {
        // id: generalCommandId,
        command: 'append_child',
        args: [
            parentId,
            childId,
        ],
    };

    // enqueueCommand(cmd);
    connectionManager.send(cmd);
};
const createGtkElement = (elementId, props) => {
    const cmd = {
        // id: generalCommandId,
        // elementId: id,
        command: 'create_element',
        args: [
            elementId,
            props.type,
            props.label || '',
            0,
        ],
    };

    widgets[elementId] = Object.assign({}, props);

    // enqueueCommand(cmd);
    connectionManager.send(cmd);
};

const updateGtkElement = (elementId, propName, value) => {
    console.log('updateGtkElement', propName, value);
    widgets[elementId] = Object.assign({}, widgets[elementId], { [propName]: value });

    if (typeof value === 'function') {
        return;
    }

    const cmd = {
        // id: generalCommandId,
        command: `set_${propName.toLowerCase()}`,
        args: [
            elementId,
            value.toString(),
        ],
    };


    // enqueueCommand(cmd);
    connectionManager.send(cmd);
};

// connection = initConnection();

module.exports = {
    appendGtkChild,
    createGtkElement,
    updateGtkElement,
};
