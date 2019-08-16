import { IncomingMessage, ServerResponse } from 'http';

export interface Request extends IncomingMessage {
	originalUrl: string;
	path: string;
	search: string;
	query: Record<string, string | string[]>;
	params?: Record<string, any>;
	body?: any;
	length?: number;
	method: HTTPMethod;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Response extends ServerResponse {
	status(statusCode: number): this;
}

export interface PieceOptions {
	enabled?: boolean;
	name?: string;
}

export interface MiddlewaresOptions extends PieceOptions {
	priority?: number;
}

export interface RoutesOptions extends PieceOptions {
	route?: string;
}

export interface PieceDefaults {
	[key: string]: RoutesOptions | MiddlewaresOptions;
}

export enum HTTPMethod {
	COPY = 'COPY',
	DELETE = 'DELETE',
	GET = 'GET',
	HEAD = 'HEAD',
	LINK = 'LINK',
	LOCK = 'LOCK',
	MERGE = 'MERGE',
	MOVE = 'MOVE',
	NOTIFY = 'NOTIFY',
	OPTIONS = 'OPTIONS',
	PATCH = 'PATCH',
	POST = 'POST',
	PUT = 'PUT'
}

export interface ParsedPart {
	val: string;
	type: number;
}

export type ParsedRoute = ParsedPart[];
