const {
	makeFindAdventures,
	makeFindAdventure,
	makeSaveAdventure,
} = require('./adventure.store')

const makeAdventuresApi = require('./adventure.api')


module.exports = ({ Router, db, authenticate, idGenerator }) =>
	makeAdventuresApi({
		Router,
		authenticate,
		findAdventures: makeFindAdventures({ db }),
		saveAdventure: makeSaveAdventure({
			db,
			idGenerator,
			findAdventure: makeFindAdventure({ db }),
		})
	})