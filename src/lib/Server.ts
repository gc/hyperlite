import { EventEmitter } from 'events';
import { Server, ServerResponse, createServer, METHODS } from 'http';
import { Server as SecureServer, createServer as createSecureServer } from 'https';
import { parse } from 'url';
import { join } from 'path';

import MiddlewareStore from './Structures/MiddlewareStore';
import Util from './Util';
import RouteStore from './Structures/RouteStore';
import { Request } from '../types';

interface ServerOptions {
	port?: number;
	userBaseDirectory?: string;
	sslOptions?: {
		key: Buffer;
		cert: Buffer;
	};
}

const defaultOptions = {
	port: 3003,
	userBaseDirectory: process.cwd(),
	apiPrefix: ''
};

class LiteServer extends EventEmitter {
	public server: Server | SecureServer;
	public middlewares: MiddlewareStore;
	public routes: RouteStore;
	public apiPrefix: string;
	public userBaseDirectory: string;

	public constructor(options?: ServerOptions) {
		super();
		const { sslOptions, port, userBaseDirectory, apiPrefix } = {
			...defaultOptions,
			...options
		};

		this.server = sslOptions ? createSecureServer(sslOptions) : createServer();
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

	public async handler(request: Request, response: ServerResponse): Promise<void> {
		const info = parse(request.url, true);
		const splitURL = Util.split(info.pathname);
		const route = this.routes.findRoute(request.method, splitURL);
		request.path = info.pathname;
		request.search = info.search;
		request.query = info.query;
		request.params = route && route.execute(splitURL);

		try {
			await this.middlewares.run(request, response, route);
			if (route && METHODS.includes(request.method.toUpperCase())) {
				route[request.method.toLowerCase()](request, response);
			} else {
				response.end(`Route not found ${splitURL}`);
			}
		} catch (err) {
			this.emit('error', err);
			response.end();
		}
	}
}

export default LiteServer;
