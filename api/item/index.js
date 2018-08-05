const {
	makeFindItem,
	makeFindItems,
	makeSaveItem,
} = require('./item.store')

const makeItemApi = require('./item.api')


module.exports = ({ Router, db, authenticate, idGenerator }) => {
	const findItem = makeFindItem({ db })

	return makeItemApi({
		Router,
		authenticate,
		findItem,
		findItems: makeFindItems({ db }),
		saveItem: makeSaveItem({
			db,
			idGenerator,
			findItem,
		}),
	})
}