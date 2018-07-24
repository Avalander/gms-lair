const { makeValidator } = require('dto-validator')


const handleError = res => error => {
	console.debug(error)
	res.json(error)
}

const handleSuccess = res => result =>
	res.json(result)

const validateAdventure = makeValidator(
	[ 'title', 'author' ],
	[ 'summary' ]
)

module.exports = ({ Router, authenticate, findAdventures }) => {
	const api = Router()

	api.get('/adventures', authenticate, (req, res) =>
		findAdventures(req.bearer.user)
			.fork(
				handleError,
				handleSuccess
			)
	)

	return api
}