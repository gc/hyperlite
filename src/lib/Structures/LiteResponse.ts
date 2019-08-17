import { ServerResponse } from 'http';

export default class LiteServerResponse extends ServerResponse {
	public status(code: number): this {
		this.statusCode = code;
		return this;
	}

	public json(data: any): void {
		return this.end(JSON.stringify(data));
	}
}
