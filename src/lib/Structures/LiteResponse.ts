import { ServerResponse, STATUS_CODES } from 'http';

export default class LiteServerResponse extends ServerResponse {
	public status(code: number): this {
		this.statusCode = code;
		return this;
	}

	public setHeader(headerName: string, headerValue: string) {
		this.setHeader('Content-Type', 'application/json');
		return this;
	}

	public json(data: any): void {
		this.status(200)
			.setHeader('Content-Type', 'application/json')
			.end(JSON.stringify(data));
	}

	public error(code: number): void {
		return this.status(code).end(STATUS_CODES[code]);
	}
}
