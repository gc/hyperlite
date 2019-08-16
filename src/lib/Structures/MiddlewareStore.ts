import Store from './Store';
import Middleware from './Middleware';
import Request from './LiteRequest';
import Response from './LiteResponse';
import Route from './Route';
import Server from '../Server';

class MiddlewareStore extends Store {
	public sortedMiddlewares: Middleware[];
	public constructor(server: Server) {
		super(server, 'middlewares', Middleware);

		this.sortedMiddlewares = [];
	}

	public clear(): void {
		this.sortedMiddlewares = [];
		return super.clear();
	}

	public set(piece: Middleware): Middleware | void {
		const middleware = super.set(piece);
		if (!middleware) return middleware;
		const index = this.sortedMiddlewares.findIndex(
			(mid: Middleware): boolean => mid.priority >= middleware.priority
		);
		// If a middleware with lower priority wasn't found, push to the end of the array
		if (index === -1) this.sortedMiddlewares.push(middleware);
		else this.sortedMiddlewares.splice(index, 0, middleware);
		return middleware;
	}

	public delete(name: Middleware): boolean {
		const middleware = this.resolve(name);
		if (!middleware) return false;
		this.sortedMiddlewares.splice(this.sortedMiddlewares.indexOf(middleware as Middleware), 1);
		return super.delete(middleware);
	}

	public async run(request: Request, response: Response, route?: Route | void): Promise<void> {
		for (const middleware of this.sortedMiddlewares) {
			if (response.finished) return;
			if (middleware.enabled) await middleware.run(request, response, route);
		}
	}
}

export default MiddlewareStore;
