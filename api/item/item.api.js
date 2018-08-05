const { makeValidator, asFuture } = require('dto-validator')


const handleError = res => error => {
	console.error(error)
	res.json(error)
}

const handleSuccess = res => result =>
	res.json(result)

const validateItem = makeValidator(
	[ 'name', 'description', 'type', 'adventure_id' ],
	[ '_id' ]
)

module.exports = ({ Router, authenticate, findItems, findItem, saveItem }) => {
	const api = Router()

	api.get('/adventures/:id/:type', authenticate, (req, res) =>
		findItems(req.params.type, req.params.id)
			.fork(
				handleError(res),
				handleSuccess(res)
			)
	)

	api.post('/adventures/:adventure_id/:type', authenticate, (req, res) =>
		asFuture(validateItem(Object.assign(
			{},
			req.params,
			req.body
		)))
		.chain(saveItem)
		.fork(
			handleError(res),
			handleSuccess(res)
		)
	)

	api.get('/adventures/:adventure_id/:item_id', authenticate, (req, res) =>
		findItem({ _id: req.params.item_id })
			.fork(
				handleError(res),
				handleSuccess(res)
			)
	)

	api.get('/adventures/:adventure_id/:type/:item_id', authenticate, (req, res) =>
		findItems(req.params.type, req.params.adventure_id, req.params.item_id)
			.fork(
				handleError(res),
				handleSuccess(res)
			)
	)

	return api
}