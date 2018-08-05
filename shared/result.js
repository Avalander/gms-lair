const Future = require('fluture')

const base = {
	success: data => ({ ok: true, data }),
	error: (code, error) => ({ ok: false, code, error }),
}

const error_codes = {
	Other: 1,
	InvalidData: 2,
	InvalidCredentials: 3,
	NotFound: 4,
}

const Result = Object.keys(error_codes)
	.reduce(
		(Result, key) => Object.assign({},
			Result,
			{
				[key]: message => Result.error(error_codes[key], message)
			}),
		base
	)

const match = fns => result =>
	fns[mapCodeToResult(result.code)](result.data || result.error)

const mapCodeToResult = code =>
	Object.keys(error_codes)
		.find(k => error_codes[k] === code) || 'SUCCESS'

const toFuture = result =>
	(result.ok
		? Future.of(result.data)
		: Future.reject(result)
	)

const toError = code =>
	Object.keys(error_codes)
		.find(k => error_codes[k] === code)

module.exports = {
	Result,
	error_codes,
	toFuture,
	toError,
	match,
}