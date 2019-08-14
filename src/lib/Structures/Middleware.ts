import Piece from './Piece';
import LiteServer from '../Server';
import Store from './Store';
import { MiddlewaresOptions, Response, Request } from '../../types';
import Route from './Route';

class Middleware extends Piece {
	public priority: number;

	public constructor(
		server: LiteServer,
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
