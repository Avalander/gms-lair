module.exports = ({ Router, db }) => {
	const api = Router()

	api.get('/adventures', (req, res) =>
		res.json(fakeAdventures)
	)

	return api
}

const fakeAdventures = [{
	title: 'There and back again',
	author: 'Avalander',
	summary: `
		## This is a sample adventure.

		Some things need to be written here.

		> ## Note
		> This be a note.
	`
}]