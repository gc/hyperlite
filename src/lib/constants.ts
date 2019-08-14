import { MiddlewaresOptions, RoutesOptions, PieceDefaults } from '../types';

const middlewareDefaultOptions: MiddlewaresOptions = {
	enabled: true
};

const routeDefaultOptions: RoutesOptions = {
	enabled: true
};

export const pieceDefaults: PieceDefaults = {
	routes: routeDefaultOptions,
	middlewares: middlewareDefaultOptions
};
