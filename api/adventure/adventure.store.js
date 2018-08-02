const Future = require('fluture')

const { Result } = require('result')


module.exports.makeFindAdventures = ({ db }) => username =>
	Future.node(done =>
		db.collection('adventures')
			.find({ author: username })
			.toArray(done)
	)
	.map(Result.success)

module.exports.makeFindAdventure = ({ db }) => filters =>
	Future.node(done =>
		db.collection('adventures')
			.findOne(filters, done)
	)
	.chain(value =>
		value
			? Future.of(value)
			: Future.reject(Result.NOT_FOUND('Adventure not found'))
	)

module.exports.makeSaveAdventure = ({ db, idGenerator, findAdventure }) => adventure =>
	(adventure._id
		? findAdventure({ _id })
		: idGenerator('adventures')
			.map(_id => createAdventure(_id, adventure))
	)
	.map(x => {
		console.log(x)
		return x
	})
	.chain(adventure =>
		Future.node(done =>
			db.collection('adventures')
				.save(adventure, done)
		)
	)
	.map(Result.success)

const createAdventure = (_id, adventure) =>
	Object.assign({}, adventure, { _id })