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
			? Future.of(Result.success(value))
			: Future.reject(Result.NotFound('Adventure not found'))
	)

module.exports.makeSaveAdventure = ({ db, idGenerator, findAdventure }) => adventure =>
	(adventure._id
		? findAdventure({ _id: adventure._id })
			.map(({ data }) => adventure)
		: idGenerator('adventures')
			.map(_id => createAdventure(_id, adventure))
	)
	.chain(adventure =>
		Future.both(
			Future.node(done =>
				db.collection('adventures')
					.save(adventure, done)
			),
			Future.of(adventure._id)
		)
	)
	.map(([ _, _id ]) => ({ _id }))
	.map(Result.success)

const createAdventure = (_id, adventure) =>
	Object.assign({}, adventure, { _id })