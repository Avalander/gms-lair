const { makeValidator, asFuture } = require('dto-validator')


const handleError = res => error => {
	console.error(error)
	res.json(error)
}

const handleSuccess = res => result =>
	res.json(result)

const validateAdventure = makeValidator(
	[ 'title', 'author' ],
	[ 'summary', '_id' ]
)

module.exports = ({ Router, authenticate, findAdventures, findAdventure, saveAdventure }) => {
	const api = Router()

	api.get('/adventures', authenticate, (req, res) =>
		findAdventures(req.bearer.user)
			.fork(
				handleError(res),
				handleSuccess(res)
			)
	)

	api.get('/adventures/:id', authenticate, (req, res) =>
		findAdventure({ _id: req.params.id })
			.fork(
				handleError(res),
				handleSuccess(res)
			)
	)

	api.post('/adventures', authenticate, (req, res) =>
		asFuture(validateAdventure(Object.assign({}, req.body, { author: req.bearer.user })))
			.chain(saveAdventure)
			.fork(
				handleError(res),
				handleSuccess(res)
			)
	)

	return api
}
