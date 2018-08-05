const bcrypt = require('bcrypt')
const Future = require('fluture')

const { Result } = require('result')


module.exports.makeFindUser = ({ db }) => (username, password) =>
	Future.node(done =>
		db.collection('users')
			.findOne({ username }, done)
	)
	.chain(user =>
		(user && bcrypt.compareSync(password, user.password)
			? Future.of(user)
			: Future.reject(Result.InvalidCredentials('User not found'))
		)
	)

module.exports.makeCreateInviteToken = ({ db }) => () =>
	Future.node(done =>
		db.collection('invite-tokens')
			.insertOne({ token: generateToken() }, null, done)
	)
	.map(({ insertedId }) => Result.success({ insertedId }))

const CHARS = 'abcdefghijklmnopqrstuvwxyz12345667890-'

const randInt = (from, to) =>
	Math.floor(Math.random() * (to - from) + from)

const generateToken = (token='') =>
	(token.length < 64
		? generateToken(token + CHARS[randInt(0, CHARS.length)])
		: token
	)

module.exports.makeRegisterUser = ({ db }) => ({ username, password, token }) =>
	Future.node(done =>
		db.collection('users').findOne({ username }, done)
	)
	.chain(user => user
		? Future.reject(Result.InvalidData('Username already exists.'))
		: Future.of({})
	)
	.chain(() =>
		Future.node(done =>
			db.collection('invite-tokens')
				.findOneAndDelete({ token }, {}, done)
		)
	)
	.chain(({ value }) =>
		Future.both(
			value
				? Future.of(value)
				: Future.reject(Result.InvalidData('Invalid token.')),
			hashPassword(password)
		)
	)
	.chain(([ invite, hash_password ]) =>
		Future.node(done =>
			db.collection('users')
				.insertOne({
					username,
					token: invite.token,
					password: hash_password,
				}, null, done)
		)
	)
	.chain(({ insertedId }) =>
		Future.node(done =>
			db.collection('users')
				.findOne({ _id: insertedId }, done)
		)
	)
	.map(Result.success)

const hashPassword = password =>
	Future.tryP(() => bcrypt.hash(password, 10))
