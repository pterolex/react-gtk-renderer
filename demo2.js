/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const config = require('./etc/config.js');

const ConnectionManager = require('./src/ConnectionManager');

const { Logger } = require('./src/utils/logger');

const logger = new Logger('GtkConnrction');

const rpcAPI = {
    click: (data) => {
        logger.info(`Received 'click': ${JSON.stringify(data)}`);

        const elementId = data[0];
        logger.info(`ElementId': ${elementId}`);
    },
};

const connectionManager = new ConnectionManager({
    wsServerPort: config.wssPort,
    logger,
    rpcAPI,
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

    connectionManager.send(cmd);
};

const updateGtkElement = (elementId, propName, value) => {
    console.log('updateGtkElement', propName, value);
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

const ROOT_ID = 0;
const DECREASE_BUTTON = 1;
const COUNTER_LABEL_ID = 2;
const INCREASE_BUTTON = 3;
const LAST_UPDATED_LABEL = 4;
const GRID_ID = 5;

const getCommands = () => (
    [
        {
            method: 'create_element',
            args: [
                DECREASE_BUTTON,
                'button',
                '-',
                ROOT_ID,
            ],
        },
        {
            method: 'create_element',
            args: [
                COUNTER_LABEL_ID,
                'label',
                'Counter = 0',
                ROOT_ID,
            ],
        },
        {
            method: 'create_element',
            args: [
                INCREASE_BUTTON,
                'button',
                '+',
                ROOT_ID,
            ],
        },
        {
            method: 'create_element',
            args: [
                LAST_UPDATED_LABEL,
                'label',
                new Date().toString(),
                ROOT_ID,
            ],
        },
        {
            method: 'create_element',
            args: [
                GRID_ID,
                'grid',
                '',
                ROOT_ID,
            ],
        },
        {
            method: 'append_child',
            args: [
                GRID_ID,
                DECREASE_BUTTON,
            ],
        },
        {
            method: 'append_child',
            args: [
                GRID_ID,
                COUNTER_LABEL_ID,
            ],
        },
        {
            method: 'append_child',
            args: [
                GRID_ID,
                INCREASE_BUTTON,
            ],
        },
        {
            method: 'append_child',
            args: [
                GRID_ID,
                LAST_UPDATED_LABEL,
            ],
        },
        {
            method: 'append_child',
            args: [
                ROOT_ID,
                GRID_ID,
            ],
        },
    ]
);

async function sendInitialCommands() {
    for (const command of getCommands()) {
        await connectionManager.send(command);
    }

    console.log('Queued all initial commands!');
}

sendInitialCommands();
