const { Result } = require('result')

const exists = obj =>
	obj !== undefined && obj !== null

const hasContent = value =>
	exists(value) && (typeof value === 'string' || Array.isArray(value) ? value.length > 0 : true)

module.exports.makeValidator = (required_keys, optional_keys=[]) => obj => {
	const expected_keys = [ ...required_keys, ...optional_keys ]
	for (let key of required_keys) {
		if (!hasContent(obj[key])) return Result.InvalidData(`Missing key '${key}'.`)
	}
	for (let key of Object.keys(obj)) {
		if (!expected_keys.includes(key)) return Result.InvalidData(`Unexpected key '${key}.'`)
	}
	return Result.success(obj)
}

module.exports.asFuture = result =>
	(result.ok
		? Future.of(result.data)
		: Future.reject(result)
	)
