const mongodb = require('mongodb')


module.exports = (db_url, db_name) => {
	const connection = mongodb.MongoClient.connect(db_url, { useNewUrlParser: true })
	const getDb = () => connection.then(client => client.db(db_name))
	getDb.close = () => connection.then(client => client.close())
	return getDb
}