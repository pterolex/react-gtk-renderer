const WebSocket = require('ws');

const MoleClient = require('mole-rpc/MoleClient');
const MoleServer = require('mole-rpc/MoleServer');

const TransportClientWS = require('mole-rpc-transport-ws/TransportClientWS');
const TransportServerWS = require('mole-rpc-transport-ws/TransportServerWS');

class ConnectionManager {
    constructor({ wsServerPort, logger }) {
        if (!wsServerPort) throw new Error('"wsServerPort" required');
        if (!logger) throw new Error('"logger" required');

        this._logger = logger;
        this._wsServerPort = wsServerPort;

        this._rpcAPI = {
            click: (data) => {
                logger.info(`Received 'click': ${JSON.stringify(data)}`);
            },
        };

        this._isInit = false;

        this._commandsQueue = [];

        this._listenersPool = [];
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

                const client = new MoleClient({
                    requestTimeout: 1000,
                    transport: new TransportClientWS({ ws }),
                });

                this._connectionsToMoleClients.set(ws, client);

                this._listenersPool.push(client);

                this._isInit = true;

                this._sendInterval = setInterval(() => {
                    this._sendQueuedCommands();
                }, 100);

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

    async _sendCommand(command) {
        this._logger.info(`Sending command. Queue length ${this._commandsQueue.length}`);

        for (const client of this._listenersPool) {
            await client.callMethod(command.method, command.args);
        }

        this._commandsQueue.shift();
    }

    _initMoleServer() {
        this._wsRPCServer.expose(this._rpcAPI);
    }
}

module.exports = ConnectionManager;
