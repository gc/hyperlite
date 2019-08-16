import { join, relative, sep } from 'path';

import { isClass, walk } from '../Util';
import LiteServer from '../Server';
import Piece from './Piece';

class Store extends Map {
	public coreDirectories: Set<string>;
	public server: LiteServer;
	public name: string;
	public holds: any;

	public constructor(server: LiteServer, name: string, holds: any) {
		super();

		this.holds = holds;
		this.server = server;
		this.name = name;
		this.coreDirectories = new Set();
	}

	public toString(): string {
		return this.name;
	}

	public get userDirectory(): string {
		return join(this.server.userBaseDirectory, this.name);
	}

	public registerCoreDirectory(directory: string): this {
		this.coreDirectories.add(join(directory, this.name));
		return this;
	}

	public load(directory: string, file: string[]): Piece {
		const loc = join(directory, ...file);

		let piece = null;
		try {
			const Piece = ((req: any) => req.default || req)(require(loc));
			if (!isClass(Piece)) throw new TypeError('The exported structure is not a class.');
			piece = this.set(new Piece(this.server, this, file, directory));
		} catch (error) {
			console.error(error);
		}

		delete require.cache[loc];
		module.children.pop();
		return piece;
	}

	public async loadAll(): Promise<this> {
		this.clear();
		for (const directory of this.coreDirectories) await Store.walk(this, directory);
		await Store.walk(this);
		return this;
	}

	public set(piece: any) {
		if (!(piece instanceof this.holds)) {
			console.error(`Only ${this} may be stored in this Store.`);
			return;
		}
		const existing = this.get(piece.name);
		if (existing) this.delete(existing);
		super.set(piece.name, piece);
		return piece;
	}

	public delete(name: string | Piece): boolean {
		const piece = this.resolve(name);
		if (!piece) return false;
		super.delete(piece.name);
		return true;
	}

	public resolve(name: string | Piece): Piece {
		if (name instanceof this.holds) return name as Piece;
		return this.get(name);
	}

	public static async walk(store: any, directory: any = store.userDirectory): Promise<Piece[]> {
		const files = await walk(directory);

		return Promise.all(
			files.map((file: string) => store.load(directory, relative(directory, file).split(sep)))
		);
	}
}

export default Store;
