/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const config = require('./etc/config.js');

const ConnectionManager = require('./src/ConnectionManager');

const { Logger } = require('./src/utils/logger');

const logger = new Logger('GtkConnrction');

let webSocketConnection;

/**
 * Elements
 */

const ROOT_ID = 0;
const DECREASE_BUTTON = 1;
const COUNTER_LABEL_ID = 2;
const INCREASE_BUTTON = 3;
const LAST_UPDATED_LABEL = 4;
const GRID_ID = 5;

/**
 * Bizzzzness logic
 */

let counterValue = 0;

const rpcAPI = {
    click: (data) => {
        logger.info(`Received 'click': ${JSON.stringify(data)}`);

        const elementId = parseInt(data[0], 10);

        logger.info(`ElementId: ${elementId}`);

        if (elementId === DECREASE_BUTTON) {
            counterValue--;
        }

        if (elementId === INCREASE_BUTTON) {
            counterValue++;
        }

        const cmd = {
            method: 'set_label',
            args: [
                COUNTER_LABEL_ID,
                `Counter = ${counterValue}`,
            ],
        };

        return webSocketConnection.send(cmd);
    },
};

webSocketConnection = new ConnectionManager({
    wsServerPort: config.wssPort,
    logger,
    rpcAPI,
});

webSocketConnection.init();


/**
 * IMPORTANT: open debugger after launch
 */

const getInitialCommands = () => (
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
                `Counter = ${counterValue}`,
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
    for (const command of getInitialCommands()) {
        await webSocketConnection.send(command);
    }

    console.log('Queued all initial commands!');
}

sendInitialCommands();
