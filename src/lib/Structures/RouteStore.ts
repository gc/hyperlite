import { METHODS } from 'http';

import Store from './Store';
import Route from './Route';
import Piece from './Piece';
import Server from '../Server';

class RouteStore extends Store {
	public registry: Record<string, Map<string, Route>>;
	public constructor(server: Server) {
		super(server, 'routes', Route);

		this.registry = {};

		for (const method of METHODS) this.registry[method] = new Map();
	}

	public findRoute(method: string, splitURL: string[]): null | Route {
		for (const route of this.registry[method].values()) {
			if (route.matches(splitURL)) return route;
		}
		return null;
	}

	public clear(): void {
		for (const method of METHODS) this.registry[method].clear();
		super.clear();
	}

	public set(piece: Piece): Route {
		const route = super.set(piece);
		if (!route) return route;
		for (const method of METHODS) {
			if (method.toLowerCase() in route) this.registry[method].set(route.name, route);
		}

		return route;
	}

	public delete(name: string): boolean {
		const route = this.resolve(name);
		if (!route) return false;
		for (const method of METHODS) this.registry[method].delete(route.name);
		return super.delete(route);
	}
}

export default RouteStore;
