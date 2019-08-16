import Store from './Store';
import Piece from './Piece';
import Request from './LiteRequest';
import Response from './LiteResponse';
import Route from './Route';
import Server from '../Server';

import { MiddlewaresOptions } from '../../types';

class Middleware extends Piece {
	public priority: number;

	public constructor(
		server: Server,
		store: Store,
		file: string[],
		directory: string,
		options: MiddlewaresOptions
	) {
		super(server, store, file, directory, options);

		this.priority = options.priority;
	}

	public async run(request: Request, response: Response, route?: Route | void): Promise<void>;
	public async run(): Promise<void> {
		throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
	}
}

export default Middleware;
