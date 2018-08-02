const { makeValidator } = require('dto-validator')

const { Result } = require('result')


const handleError = res => error => {
	console.error(error)
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
		res.json(Result.success(fake))
		/*
		findAdventures(req.bearer.user)
			.fork(
				handleError,
				handleSuccess
			)
			*/
	)

	return api
}

const fake = [{
	title: 'Long lost love poem',
	author: 'Avalander',
}, {
	title: 'There and back again',
	author: 'J.R.R. Tolkien',
}, {
	title: 'Behind the forest of Nevermore',
	author: 'Avalander'
}]