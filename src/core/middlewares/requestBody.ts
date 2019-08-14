import Middleware from '../../lib/Structures/Middleware';
import { Request } from '../../types';
import LiteServer from '../../lib/Server';
import Store from '../../lib/Structures/Store';

export default class extends Middleware {
	public constructor(server: LiteServer, store: Store, file: string[], directory: string) {
		super(server, store, file, directory, { priority: 90 });
	}

	public async run(request: Request): Promise<void> {
		if (request.method !== 'POST') return;

		let body = '';

		for await (const chunk of request) body += chunk;

		const data = JSON.parse(body);
		request.body = data;
	}
}
