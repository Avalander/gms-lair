const test = require('tape')

const { makeValidator } = require('dto-validator')

const ponyValidator = makeValidator(
	[ 'name', 'type' ],
	[ 'element' ],
)


test('Validator should return error when object is missing a required key.', t => {
	t.plan(1)

	const result = ponyValidator({ name: 'Twilight Sparkle' })
	t.notOk(result.ok, 'Result.ok should be false.')
})

test('Validator should return success when object has all required keys.', t => {
	t.plan(1)

	const result = ponyValidator({ name: 'Twilight Sparkle', type: 'alicorn' })
	t.ok(result.ok, 'Result.ok should be true.')
})

test('Validator should return success when object has expected keys.', t => {
	t.plan(1)

	const result = ponyValidator({ name: 'Twilight Sparkle', type: 'alicorn', element: 'magic' })
	t.ok(result.ok, 'Result.ok should be true.')
})

test('Validator should return error when object has unexpected keys.', t => {
	t.plan(1)

	const result = ponyValidator({ name: 'Twilight Sparkle', type: 'alicorn', element: 'magic', colour: 'purple' })
	t.notOk(result.ok, 'Result.ok should be false.')
})