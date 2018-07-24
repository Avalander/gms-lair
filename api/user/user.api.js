const { toFuture } = require('result')
const { makeValidator } = require('dto-validator')

const validateNewUser = makeValidator(
	[ 'username', 'password', 'token' ]
)


module.exports = ({ Router, createInviteToken, registerUser }) => {
	const api = Router()

	api.post('/user/invite-token', (req, res) =>
		createInviteToken()
			.fork(
				error => {
					console.debug(error),
					res.json(error)
				},
				result => res.json(result)
			)
	)

	api.post('/user/register', (req, res) =>
		toFuture(validateNewUser(req.body))
			.map(({ data }) => data)
			.chain(registerUser)
			.fork(
				error => {
					console.debug(error),
					res.json(error)
				},
				result => res.json(result)
			)
	)

	return api
}