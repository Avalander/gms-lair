const Future = require('fluture')

const { Result } = require('result')


module.exports.makeFindItems = ({ db }) => ({ adventure_id }) =>
	Future.node(done =>
		db.collection('items')
			.find({ adventure_id })
			.toArray(done)
	)
	.map(Result.success)

module.exports.makeFindItem = ({ db }) => filters =>
	Future.node(done =>
		db.collection('items')
			.findOne(filters, done)
	)
	.chain(value =>
		value
			? Future.of(Result.success(value))
			: Future.reject(Result.NotFound('Item not found'))
	)

module.exports.makeSaveItem = ({ db, idGenerator, findItem }) => item =>
	(item._id
		? findItem({ _id: item._id })
			.map(_ => item)
		: idGenerator('items')
			.map(_id => createItem(_id, item))
	)
	.chain(item =>
		Future.both(
			Future.of(item._id),
			Future.node(done =>
				db.collection('items')
					.save(item, done)
			)
		)
	)
	.map(([ _id ]) => ({ _id }))
	.map(Result.success)

const createItem = (_id, item) =>
	Object.assign(
		{},
		item,
		{ _id }
	)