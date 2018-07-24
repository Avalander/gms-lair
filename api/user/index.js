const {
	makeCreateInviteToken,
	makeRegisterUser,
	makeFindUser,
} = require('./user.store')

const {
	makeSignIn,
} = require('./user.auth')

const makeUserApi = require('./user.api')


module.exports = ({ SECRET, Router, db, authenticate }) => {
	const findUser = makeFindUser({ db })

	return makeUserApi({
		Router,
		createInviteToken: makeCreateInviteToken({ db }),
		registerUser: makeRegisterUser({ db }),
		signIn: makeSignIn({ SECRET, findUser }),
		authenticate,
	})
}