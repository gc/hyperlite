import { ServerResponse, STATUS_CODES } from 'http';

export default class LiteServerResponse extends ServerResponse {
	public status(code: number): this {
		this.statusCode = code;
		return this;
	}

	public json(data: any): void {
		this.end(JSON.stringify(data));
	}

	public error(code: number): void {
		this.status(code).end(STATUS_CODES[code]);
	}
}
