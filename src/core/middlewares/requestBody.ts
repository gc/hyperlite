import { Middleware, Store, Request, Server } from '../../';

export default class extends Middleware {
	public constructor(server: Server, store: Store, file: string[], directory: string) {
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
