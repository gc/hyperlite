import { EventEmitter } from 'events';
import { Server, createServer, STATUS_CODES } from 'http';
import { Server as SecureServer, createServer as createSecureServer } from 'https';
import { join } from 'path';

import MiddlewareStore from './Structures/MiddlewareStore';
import RouteStore from './Structures/RouteStore';
import Request from './Structures/LiteRequest';
import Response from './Structures/LiteResponse';

interface ServerOptions {
	port?: number;
	apiPrefix?: string;
	userBaseDirectory?: string;
	serverOptions?: {
		key?: Buffer;
		cert?: Buffer;
		IncomingMessage?: any;
		ServerResponse?: any;
		Http1IncomingMessage?: any;
		Http1ServerResponse?: any;
	};
}

const defaultOptions: ServerOptions = {
	port: 3003,
	userBaseDirectory: process.cwd(),
	apiPrefix: '',
	serverOptions: {
		key: undefined,
		cert: undefined,
		IncomingMessage: Request,
		ServerResponse: Response,
		Http1IncomingMessage: Request,
		Http1ServerResponse: Response
	}
};

class LiteServer extends EventEmitter {
	public server: Server | SecureServer;
	public middlewares: MiddlewareStore;
	public routes: RouteStore;
	public apiPrefix: string;
	public userBaseDirectory: string;

	public constructor(options?: ServerOptions) {
		super();
		const { port, userBaseDirectory, apiPrefix, serverOptions } = {
			...defaultOptions,
			...options
		};

		this.server = serverOptions.cert
			? createSecureServer(serverOptions)
			: createServer(serverOptions);

		this.server.on('request', this.handler.bind(this));
		this.server.listen(port);
		this.userBaseDirectory = userBaseDirectory;
		this.apiPrefix = apiPrefix;

		this.middlewares = new MiddlewareStore(this);
		this.routes = new RouteStore(this);

		this.middlewares.registerCoreDirectory(join(__dirname, '..', 'core'));

		this.middlewares.loadAll();
		this.routes.loadAll();
	}

	public async handler(request: Request, response: Response): Promise<void> {
		request.init(this);

		try {
			await this.middlewares.run(request, response, request.route);
			await (request.route
				? request.execute(response)
				: this.onError(404, request, response));
		} catch (err) {
			console.error(err);
			this.emit('error', err);
			this.onError(err, request, response);
		}
	}

	onError(error: any, request: Request, response: Response) {
		const code = (response.statusCode = error.code || error.status || error.statusCode || 500);
		response.end((error.length && error) || error.message || STATUS_CODES[code]);
	}
}

export default LiteServer;
