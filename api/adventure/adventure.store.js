const Future = require('fluture')

const { Result } = require('result')


module.exports.makeFindAdventures = ({ db }) => username =>
	Future.node(done =>
		db.collection('adventures')
			.find({ author: username })
			.toArray(done)
	)
	.map(Result.success)
