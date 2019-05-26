const config = require('../../etc/config.js');
const ConnectionManager = require('../ConnectionManager');

const { Logger } = require('../utils/logger');

const logger = new Logger('GtkConnection');

const widgets = {};

const connectionManager = new ConnectionManager({
    wsServerPort: config.wssPort,
    logger,
});

connectionManager.init();

const appendGtkChild = (parentId, childId) => {
    const cmd = {
        method: 'append_child',
        args: [
            parentId,
            childId,
        ],
    };

    connectionManager.send(cmd);
};
const createGtkElement = (elementId, props) => {
    const cmd = {
        method: 'create_element',
        args: [
            elementId,
            props.type,
            props.label || '',
            0,
        ],
    };

    widgets[elementId] = Object.assign({}, props);

    connectionManager.send(cmd);
};

const updateGtkElement = (elementId, propName, value) => {
    console.log('updateGtkElement', propName, value);
    widgets[elementId] = Object.assign({}, widgets[elementId], { [propName]: value });

    if (typeof value === 'function') {
        return;
    }

    const cmd = {
        method: `set_${propName.toLowerCase()}`,
        args: [
            elementId,
            value.toString(),
        ],
    };


    connectionManager.send(cmd);
};

module.exports = {
    appendGtkChild,
    createGtkElement,
    updateGtkElement,
};
