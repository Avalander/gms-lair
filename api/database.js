const mongodb = require('mongodb')
const Future = require('fluture')


module.exports.makeDatabase = (db_url, db_name) => {
	const connection = mongodb.MongoClient.connect(db_url, { useNewUrlParser: true })
	const getDb = () => connection.then(client => client.db(db_name))
	getDb.close = () => connection.then(client => client.close())
	return getDb
}

module.exports.makeIdGenerator = ({ db }) => name =>
	Future.node(done =>
		db.collection('_id-table')
			.findOne({ name }, done)
	)
	.map(id_gen =>
		id_gen
			? id_gen
			: ({ name, next_id: 1 })
	)
	.chain(id_gen =>
		Future.node(done =>
			db.collection('_id-table')
				.save(incNextId(id_gen), done)
		)
		.map(() => id_gen.next_id)
	)

const incNextId = id_gen =>
	Object.assign({}, id_gen, {
		next_id: id_gen.next_id + 1
	})