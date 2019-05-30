const WebSocket = require('ws');


const MoleClient = require('mole-rpc/MoleClient');
const MoleServer = require('mole-rpc/MoleServer');

const TransportClientWS = require('mole-rpc-transport-ws/TransportClientWS');
const TransportServerWS = require('mole-rpc-transport-ws/TransportServerWS');
// const { sleep } = require('./utils/utils');

class ConnectionManager {
    constructor({ wsServerPort, logger, rpcAPI }) {
        if (!wsServerPort) throw new Error('"wsServerPort" required');
        if (!logger) throw new Error('"logger" required');

        this._logger = logger;
        this._wsServerPort = wsServerPort;

        this._rpcAPI = Object.assign({}, rpcAPI, {
            register: this._handleRegister.bind(this),
        });

        this._isInit = false;

        this._commandsQueue = [];

        this._listenersPool = [];
        this._debuggersPool = [];
        this._connectionsToMoleClients = new WeakMap();

        this._wsRPCServer = new MoleServer({
            transports: [],
        });
    }

    init() {
        return new Promise(async (resolve) => {
            this._logger.info(`Initializing WS Server at port ${this._wsServerPort}`);

            this._wsServer = new WebSocket.Server({
                port: this._wsServerPort,
            });

            this._initMoleServer();

            this._wsServer.on('connection', async (ws) => {
                this._wsRPCServer.registerTransport(new TransportServerWS({ ws }));

                ws.on('message', (data) => {
                    this._logger.verbose(`Message ${JSON.stringify(data)}`);
                });


                const client = new MoleClient({
                    requestTimeout: 1000,
                    transport: new TransportClientWS({ ws }),
                });

                this._connectionsToMoleClients.set(ws, client);

                this._isInit = true;

                resolve();

                ws.on('close', () => {
                    this._logger.verbose('Client disconnected');

                    this._connectionsToMoleClients.delete(ws);
                });
            });

            await this._wsRPCServer.run();

            this._logger.info('Connection initialized succesfully.');
        });
    }

    send(command) {
        this._logger.info('Queueing command');

        this._commandsQueue.push(command);
    }

    _sendQueuedCommands() {
        if (this._commandsQueue.length > 0) {
            const command = this._commandsQueue[0];

            this._sendCommand(command);
        }
    }

    _handleRegister(type) {
        const moleClient = this._connectionsToMoleClients.get(this._wsRPCServer.currentTransport.ws);

        this._logger.info(`Registering client with type = '${type}'`);

        if (type === 'debugger') {
            this._debuggersPool.push(moleClient);
        } else {
            this._listenersPool.push(moleClient);
        }

        if (this._debuggersPool.length > 0) {
            this._sendInterval = setInterval(() => {
                this._sendQueuedCommands();
            }, 100);
        }

        return {};
    }

    async _sendCommand(command) {
        this._logger.info(`Sending command. Queue length ${this._commandsQueue.length}`);
        this._logger.info(`Sending command ${JSON.stringify(command)}`);

        for (const client of this._listenersPool) {
            client.callMethod(command.method, command.args);
        }

        for (const debuggerClient of this._debuggersPool) {
            const response = await debuggerClient.callMethod('notify', [command, Date.now()]);

            this._logger.info(`Response ${JSON.stringify(response)}`);
        }

        this._commandsQueue.shift();
        // await sleep(100);
    }

    _initMoleServer() {
        this._wsRPCServer.expose(this._rpcAPI);
    }
}

module.exports = ConnectionManager;
