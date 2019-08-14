import Piece from './Piece';

import Util from '../Util';
import LiteServer from '../Server';
import Store from './Store';
import { RoutesOptions, ParsedRoute } from '../../types';

class Route extends Piece {
	public route: string;
	public parsed: ParsedRoute;
	public directory: string;
	[k: string]: any;

	public constructor(
		server: LiteServer,
		store: Store,
		file: string[],
		directory: string,
		options: RoutesOptions = {}
	) {
		super(server, store, file, directory, options);
		this.route = server.apiPrefix + options.route;
		this.parsed = Util.parse(this.route);
		this.directory = directory;
	}

	public matches(split: string[]): boolean {
		if (split.length !== this.parsed.length) return false;
		for (let i = 0; i < this.parsed.length; i++) {
			if (this.parsed[i].type === 0 && this.parsed[i].val !== split[i]) return false;
		}
		return true;
	}

	public execute(split: string[]): Record<string, any> {
		const params: any = {};
		for (let i = 0; i < this.parsed.length; i++) {
			if (this.parsed[i].type === 1) {
				params[this.parsed[i].val] = split[i];
			}
		}
		return params;
	}
}

export default Route;
