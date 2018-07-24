const jwt = require('jsonwebtoken')

const { Result } = require('result')


const TOKEN_DURATION = 1 * 60 * 60

module.exports.makeAuthenticate = ({ SECRET }) => (req, res, next) => {
	const { bearer } = req.cookies
	if (!bearer) {
		res.json(Result.INVALID_CREDENTIALS('Invalid credentials'))
		return
	}
	jwt.verify(bearer, SECRET, (err, decoded) => {
		if (err) {
			res.json(Result.INVALID_CREDENTIALS(err.message || err))
			return
		}
		req.bearer = decoded
		next()
	})
}

module.exports.makeSignIn = ({ SECRET, findUser }) => ({ username, password }) =>
	findUser(username, password)
		.map(user => ({
			token: jwt.sign({ user: user.username }, SECRET, { expiresIn: TOKEN_DURATION }),
			user,
		}))
