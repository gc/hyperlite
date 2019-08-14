import LiteServer from '../../lib/Server';
import Store from '../../lib/Structures/Store';
import { Request, Response } from '../../types';
import Middleware from '../../lib/Structures/Middleware';

export default class extends Middleware {
	public constructor(server: LiteServer, store: Store, file: string[], directory: string) {
		super(server, store, file, directory, { priority: 90 });
	}

	public async run(request: Request, response: Response): Promise<void> {
		/*
		response.setHeader(
			'Access-Control-Allow-Origin',
			origin
		);
		*/
		response.setHeader(
			'Access-Control-Allow-Methods',
			'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT'
		);
		response.setHeader(
			'Access-Control-Allow-Headers',
			'Authorization, User-Agent, Content-Type'
		);
		if (request.method === 'OPTIONS') {
			response.writeHead(200);
			return response.end();
		}
		response.setHeader('Content-Type', 'application/json');
	}
}
