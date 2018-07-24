const { Result, toFuture } = require('result')
const { makeValidator } = require('dto-validator')

const validateNewUser = makeValidator(
	[ 'username', 'password', 'token' ]
)

const validateLogin = makeValidator(
	[ 'username', 'password' ]
)

const loginUser = res => ({ token, user }) =>
	res.cookie('bearer', token, { httpOnly: true })
		.json(Result.success({ username: user.username }))

const handleError = res => error => {
	console.debug(error)
	res.json(error)
}

const handleSuccess = res => result =>
	res.json(result)


module.exports = ({ Router, createInviteToken, registerUser, signIn }) => {
	const api = Router()

	api.post('/user/invite-token', (req, res) =>
		createInviteToken()
			.fork(
				handleError(res),
				handleSuccess(res)
			)
	)

	api.post('/user/register', (req, res) =>
		toFuture(validateNewUser(req.body))
			.map(({ data }) => data)
			.chain(registerUser)
			.chain(() => signIn(req.body))
			.fork(
				handleError(res),
				loginUser(res)
			)
	)

	api.post('/user/login', (req, res) =>
		toFuture(validateLogin(req.body))
			.map(({ data }) => data)
			.chain(signIn)
			.fork(
				handleError(res),
				loginUser(res)
			)

	)

	return api
}