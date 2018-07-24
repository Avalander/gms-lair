const {
	makeCreateInviteToken,
	makeRegisterUser,
	makeFindUser,
} = require('./user.store')

const {
	makeAuthenticate,
	makeSignIn,
} = require('./user.auth')

const makeUserApi = require('./user.api')


module.exports = ({ SECRET, Router, db }) => {
	const findUser = makeFindUser({ db })

	return makeUserApi({
		Router,
		createInviteToken: makeCreateInviteToken({ db }),
		registerUser: makeRegisterUser({ db }),
		signIn: makeSignIn({ SECRET, findUser }),
	})
}