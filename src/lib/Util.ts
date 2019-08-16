import { promises as fs } from 'fs';
import { extname, join, resolve } from 'path';

import { ParsedPart } from '../types';

const [SLASH, COLON] = [47, 58];

export function parsePart(val: string): ParsedPart {
	const type = Number(val.charCodeAt(0) === COLON);
	if (type) val = val.substring(1);
	return { val, type };
}

export function split(url: string): string[] {
	if (url.length === 1 && url.charCodeAt(0) === SLASH) return [url];
	else if (url.charCodeAt(0) === SLASH) url = url.substring(1);
	return url.split('/');
}

export function isClass(input: any): boolean {
	return (
		typeof input === 'function' &&
		typeof input.prototype === 'object' &&
		input.toString().substring(0, 5) === 'class'
	);
}

export function parse(url: string): ParsedPart[] {
	return split(url).map(parsePart);
}

export async function walk(dir: string, filelist: string[] = []): Promise<string[]> {
	let files: string[] = [];

	try {
		// Try to read pices from store folder
		files = await fs.readdir(dir);
	} catch (err) {
		// If no store folder, make one and return no pieces
		fs.mkdir(dir);
		return [];
	}

	for (const file of files) {
		const path = join(dir, file);
		const stat = await fs.stat(path);

		if (stat.isDirectory()) {
			filelist = await walk(path, filelist);
		} else {
			if (extname(path) !== '.js') continue;
			filelist.push(file);
		}
	}

	return filelist.map((file: string): string => resolve(dir, file));
}
