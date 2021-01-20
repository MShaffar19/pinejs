export const cache = {
	permissionsLookup: {
		max: 5000,
	},
	parsePermissions: {
		max: 100000,
	},
	parseOData: {
		max: 100000,
	},
	odataToAbstractSql: {
		max: 10000,
	},
	abstractSqlCompiler: {
		max: 10000,
	},
};

export const db = {
	poolSize: 50,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 30000,
	keepAlive: true,
	rollbackTimeout: 30000,
};

export const migrator = {
	lockTimeout: 5 * 60 * 1000,
	// Used to delay the failure on lock taking, to avoid spam taking
	lockFailDelay: 20 * 1000,
};
