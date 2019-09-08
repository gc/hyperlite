import { Middleware, Store, Request, Server } from '../../';

export default class extends Middleware {
	public constructor(server: Server, store: Store, file: string[], directory: string) {
		super(server, store, file, directory, { priority: 20 });
	}

	public async run(request: Request): Promise<void> {
		let body = '';
		let data: any;

		for await (const chunk of request) body += chunk;
		try {
			data = JSON.parse(body);
		} catch (err) {}

		if (data) request.body = data;
	}
}
