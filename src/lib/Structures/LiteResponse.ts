import { ServerResponse } from 'http';

export default class LiteServerResponse extends ServerResponse {
	status(code: number) {
		this.statusCode = code;
		return this;
	}

	json(data: any) {
		return this.end(JSON.stringify(data));
	}
}
