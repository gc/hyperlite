import { IncomingMessage } from 'http';
import { parse } from 'url';
import { Socket } from 'net';

import { split } from '../Util';
import { HTTPMethod } from '../../types';
import LiteServer from '../Server';
import Route from './Route';

export default class LiteRequest extends IncomingMessage {
	public originalUrl: string;
	public path: string;
	public search: string;
	public query: Record<string, string | string[]>;
	public params?: Record<string, any>;
	public body?: any;
	public length?: number;
	public method: HTTPMethod;
	public route?: Route;

	constructor(socket: Socket) {
		super(socket);

		this.originalUrl = null;
		this.path = null;
		this.search = null;
		this.query = null;
		this.params = null;
		this.route = null;
		this.body = null;
	}

	execute(response: any) {
		return this.route[this.method.toLowerCase()](this, response);
	}

	init(server: LiteServer) {
		const info = parse(this.url, true);
		this.originalUrl = this.originalUrl || this.url;
		this.path = info.pathname;
		this.search = info.search;
		this.query = info.query;

		const splitURL = split(this.path);
		this.route = server.routes.findRoute(this.method, splitURL);

		if (this.route) this.params = this.route.execute(splitURL);
	}
}
