const { Result } = require('result')
const { makeValidator, asFuture } = require('dto-validator')

const validateNewUser = makeValidator(
	[ 'username', 'password', 'token' ]
)

const validateLogin = makeValidator(
	[ 'username', 'password' ]
)

const loginUser = res => ({ token, user }) =>
	res.cookie('bearer', token, { httpOnly: true, maxAge: 5 * 60 * 60 * 1000 })
		.json(Result.success({ username: user.username }))

const handleError = res => error => {
	console.error(error)
	res.json(error)
}

const handleSuccess = res => result =>
	res.json(result)


module.exports = ({ Router, createInviteToken, registerUser, signIn, authenticate }) => {
	const api = Router()

	api.post('/user/invite-token', authenticate, (req, res) =>
		createInviteToken()
			.fork(
				handleError(res),
				handleSuccess(res)
			)
	)

	api.post('/user/register', (req, res) =>
		asFuture(validateNewUser(req.body))
			.chain(registerUser)
			.chain(() => signIn(req.body))
			.fork(
				handleError(res),
				loginUser(res)
			)
	)

	api.post('/user/login', (req, res) =>
		asFuture(validateLogin(req.body))
			.chain(signIn)
			.fork(
				handleError(res),
				loginUser(res)
			)

	)

	return api
}