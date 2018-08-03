const {
	makeFindAdventures,
	makeFindAdventure,
	makeSaveAdventure,
} = require('./adventure.store')

const makeAdventuresApi = require('./adventure.api')


module.exports = ({ Router, db, authenticate, idGenerator }) => {
	const findAdventure = makeFindAdventure({ db })

	return makeAdventuresApi({
		Router,
		authenticate,
		findAdventure,
		findAdventures: makeFindAdventures({ db }),
		saveAdventure: makeSaveAdventure({
			db,
			idGenerator,
			findAdventure,
		})
	})
}