import { join } from 'path';

import Store from './Store';
import { pieceDefaults } from '../constants';
import LiteServer from '../Server';
import { PieceOptions } from '../../types';

class Piece {
	public name: string;
	public enabled: boolean;
	public server: LiteServer;
	public store: Store;
	public file: string[];
	public directory: string;

	public constructor(
		server: LiteServer,
		store: Store,
		file: string[],
		directory: string,
		options?: PieceOptions
	) {
		const defaults = pieceDefaults[store.name];
		if (defaults) options = { ...defaults, ...options };

		this.server = server;
		this.file = file;
		this.name = options.name || file[file.length - 1].slice(0, -3);
		this.enabled = options.enabled;
		this.store = store;
		this.directory = directory;
	}

	public get type(): string {
		return this.store.name.slice(0, -1);
	}

	public get path(): string {
		return join(this.directory, ...this.file);
	}

	public async reload(): Promise<Piece> {
		const piece = this.store.load(this.directory, this.file);
		return piece;
	}

	public unload(): boolean {
		return this.store.delete(this);
	}

	public disable(): Piece {
		this.enabled = false;
		return this;
	}

	public enable(): Piece {
		this.enabled = true;
		return this;
	}

	public toString(): string {
		return this.name;
	}
}

export default Piece;
