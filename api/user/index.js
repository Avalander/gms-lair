const {
	makeCreateInviteToken,
	makeRegisterUser
} = require('./user.store')

const makeUserApi = require('./user.api')


module.exports = ({ Router, db }) => makeUserApi({
	Router,
	createInviteToken: makeCreateInviteToken({ db }),
	registerUser: makeRegisterUser({ db }),
})