import * as _AbstractSQLCompiler from '@resin/abstract-sql-compiler'

import * as Promise from 'bluebird'
const { ODataParser } = require('@resin/odata-parser')
interface OData2AbstractSQLInstance {
	match: (abstractSQL: ODataQuery, rule: 'Process', args: [SupportedMethod, string[], number]) => {
		tree: _AbstractSQLCompiler.AbstractSqlQuery,
		extraBodyVars: {},
		extraBindVars: any[],
	}
	setClientModel: (abstractSqlModel: _AbstractSQLCompiler.AbstractSqlModel) => void
}
const { OData2AbstractSQL }: {
	OData2AbstractSQL: {
		createInstance: () => OData2AbstractSQLInstance
	}
} = require('@resin/odata-to-abstract-sql')
import * as memoize from 'memoizee'
import memoizeWeak = require('memoizee/weak')
import * as _ from 'lodash'

export { BadRequestError, ParsingError, TranslationError } from './errors'
import { BadRequestError, ParsingError, TranslationError, PermissionError } from './errors'
import * as deepFreeze from 'deep-freeze'
import * as env from '../config-loader/env'
import * as sbvrUtils from './sbvr-utils'

type SupportedMethod = "GET" | "PUT" | "POST" | "PATCH" | "MERGE" | "DELETE" | "OPTIONS"
type ODataQuery = any[]

export interface UnparsedRequest {
	method: string
	url: string
	data: any
	headers?: { [header: string]: string }
	changeSet?: UnparsedRequest[]
	_isChangeSet?: boolean
}

export interface ODataRequest {
	method: SupportedMethod
	url: string
	odataQuery: ODataQuery
	odataBinds: any[]
	values: any[]
	abstractSqlQuery?: _AbstractSQLCompiler.AbstractSqlQuery | _AbstractSQLCompiler.AbstractSqlQuery[]
	sqlQuery?: _AbstractSQLCompiler.SqlResult | _AbstractSQLCompiler.SqlResult[]
	resourceName: string
	vocabulary: string
	_defer?: boolean
	id?: number
	custom?: {
		[ key: string ]: any
	}
}

// Converts a value to its string representation and tries to parse is as an
// OData bind
export const parseId = (b: any) => {
	return ODataParser.matchAll(String(b), 'ExternalKeyBind')
}

export const memoizedParseOdata = (() => {
	const odataParser = ODataParser.createInstance()
	const parseOdata = (url: string) => {
		const odata = odataParser.matchAll(url, 'Process')
		// if we parse a canAccess action rewrite the resource to ensure we
		// do not run the resource hooks
		if (odata.tree.property != null && odata.tree.property.resource == 'canAccess') {
			odata.tree.resource = odata.tree.resource + '#' + odata.tree.property.resource
		}
		return odata
	}

	const _memoizedParseOdata = memoize(parseOdata, {
			primitive: true,
			max: env.cache.parseOData.max
		}
	)
	return (url: string) => {
		if (_.includes(url, '$')) {
			// If we're doing a complex url then skip caching due to # of permutations
			return parseOdata(url)
		} else {
			// Else if it's simple we can easily skip the parsing as we know we'll get a high % hit rate
			// We deep clone to avoid mutations polluting the cache
			return _.cloneDeep(_memoizedParseOdata(url))
		}
	}
})()

const memoizedGetOData2AbstractSQL = memoizeWeak(
	(abstractSqlModel: _AbstractSQLCompiler.AbstractSqlModel) => {
		const odata2AbstractSQL = OData2AbstractSQL.createInstance()
		odata2AbstractSQL.setClientModel(abstractSqlModel)
		return odata2AbstractSQL
	}
)

const memoizedOdata2AbstractSQL = (() => {
	const memoizedOdata2AbstractSQL = memoizeWeak(
		(abstractSqlModel: _AbstractSQLCompiler.AbstractSqlModel, odataQuery: ODataQuery, method: SupportedMethod, bodyKeys: string[], existingBindVarsLength: number) => {
			try {
				const odata2AbstractSQL = memoizedGetOData2AbstractSQL(abstractSqlModel)
				const abstractSql = odata2AbstractSQL.match(odataQuery, 'Process', [method, bodyKeys, existingBindVarsLength])
				// We deep freeze to prevent mutations, which would pollute the cache
				deepFreeze(abstractSql)
				return abstractSql
			} catch (e) {
				if (e instanceof PermissionError) {
					throw e
				}
				console.error('Failed to translate url: ', JSON.stringify(odataQuery, null, '\t'), method, e, e.stack)
				throw new TranslationError('Failed to translate url')
			}
		}, {
			normalizer: (_abstractSqlModel: _AbstractSQLCompiler.AbstractSqlModel, [ odataQuery, method, bodyKeys, existingBindVarsLength ]: [ ODataQuery, SupportedMethod, string[], number ]) => {
				return JSON.stringify(odataQuery) + method + bodyKeys + existingBindVarsLength
			},
			max: env.cache.odataToAbstractSql.max
		}
	)
	return (request: ODataRequest) => {
		const { method, odataQuery, odataBinds, values } = request
		const abstractSqlModel = sbvrUtils.getAbstractSqlModel(request)
		// Sort the body keys to improve cache hits
		const { tree, extraBodyVars, extraBindVars } = memoizedOdata2AbstractSQL(abstractSqlModel, odataQuery, method, _.keys(values).sort(), odataBinds.length)
		_.assign(values, extraBodyVars)
		odataBinds.push(...extraBindVars)
		return tree
	}
})()

export const metadataEndpoints = [ '$metadata', '$serviceroot' ]

const notBadRequestOrParsingError = (e: Error) => {
	return !((e instanceof BadRequestError) || (e instanceof ParsingError))
}

export const parseOData = (b: UnparsedRequest) => {
	return Promise.try<ODataRequest | ODataRequest[]>(() => {
		if (b._isChangeSet && b.changeSet != null) {
			const csReferences = new Map<ODataRequest['id'], ODataRequest>()
			// We sort the CS set once, we must assure that requests which reference
			// other requests in the changeset are placed last. Once they are sorted
			// Map will guarantee retrival of results in insertion order
			const sortedCS = _.sortBy(b.changeSet, (el) => el.url[0] !== '/')
			return Promise.reduce(sortedCS, parseODataChangeset, csReferences)
			.then((csReferences) => Array.from(csReferences.values()) as ODataRequest[])
		} else {
			const { url, apiRoot } = splitApiRoot(b.url)
			const odata = memoizedParseOdata(url)

			return {
				method: b.method as SupportedMethod,
				url,
				vocabulary: apiRoot,
				resourceName: odata.tree.resource,
				odataBinds: odata.binds,
				odataQuery: odata.tree,
				values: b.data,
				custom: {},
				_defer: false,
			}
		}
	}).catch(SyntaxError, () => {
		throw new BadRequestError(`Malformed url: '${b.url}'`)
	}).catch(notBadRequestOrParsingError, (e) => {
		console.error('Failed to parse url: ', b.method, b.url, e, e.stack)
		throw new ParsingError(`Failed to parse url: '${b.url}'`)
	})
}

const parseODataChangeset = (csReferences: Map<ODataRequest['id'], ODataRequest>, b: UnparsedRequest) => {
	const contentId: ODataRequest['id'] = mustExtractHeader(b, 'content-id')

	if (csReferences.has(contentId)) {
		throw new BadRequestError('Content-Id must be unique inside a changeset')
	}

	let defer: boolean
	let odata
	let apiRoot: string
	let url

	if (b.url[0] === '/') {
		({ url, apiRoot } = splitApiRoot(b.url))
		odata = memoizedParseOdata(url)
		defer = false
	} else {
		url = b.url
		odata = memoizedParseOdata(url)
		const { bind } = odata.tree.resource
		const [ , id ] = odata.binds[bind]
		// Use reference to collect information
		const ref = csReferences.get(id)
		if (_.isUndefined(ref)) {
			throw new BadRequestError('Content-Id refers to a non existent resource')
		}
		apiRoot = ref.vocabulary
		// Update resource with actual resourceName
		odata.tree.resource = ref.resourceName
		defer = true
	}

	const parseResult: ODataRequest = {
		method: b.method as SupportedMethod,
		url,
		vocabulary: apiRoot,
		resourceName: odata.tree.resource,
		odataBinds: odata.binds,
		odataQuery: odata.tree,
		values: b.data,
		custom: {},
		id: contentId,
		_defer: defer,
	}
	csReferences.set(contentId, parseResult)
	return csReferences
}

const splitApiRoot = (url: string) => {
	let urlParts = url.split('/')
	const apiRoot = urlParts[1]
	if (apiRoot == null) {
		throw new ParsingError(`No such api root: ${apiRoot}`)
	}
	url = '/' + urlParts.slice(2).join('/')
	return { url: url, apiRoot: apiRoot }
}

const mustExtractHeader = (body: { headers?: { [header: string]: string } }, header: string) => {
	const h: any = _.get(body.headers, [header, 0])
	if (_.isEmpty(h)) {
		throw new BadRequestError(`${header} must be specified`)
	}
	return h
}

export const translateUri = (request: ODataRequest): ODataRequest => {
	if (request.abstractSqlQuery != null) {
		return request
	}
	const isMetadataEndpoint = _.includes(metadataEndpoints, request.resourceName) || request.method === 'OPTIONS'
	if (!isMetadataEndpoint) {
		const abstractSqlQuery = memoizedOdata2AbstractSQL(request)
		request = _.clone(request)
		request.abstractSqlQuery = abstractSqlQuery
		return request
	}
	return request
}
