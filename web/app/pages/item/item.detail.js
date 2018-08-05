import { article, h1, header, section } from '@hyperapp/html'
import { action } from '@hyperapp/fx'
import { Link } from '@hyperapp/router'

import { fetchJson } from 'App/fx'
import { RemoteData } from 'App/http'
import { Markdown } from 'App/components'


export const state = {
	data: RemoteData.NotAsked(),
}

export const actions = {
	setData: data => state =>
		({
			...state,
			data,
		}),
	// Network
	fetchItem: ({ id, type, adventure_id }) =>
		[
			action('setData', RemoteData.Pending()),
			fetchJson(
				`/api/adventures/${adventure_id}/${type}/${id}`,
				'onFetchItemResponse',
			),
		],
	onFetchItemResponse: result =>
		(result.ok
			? action('setData', RemoteData.Success(result.data))
			: action('setData', RemoteData.Failure(result))
		),
}

export const view = (state, actions, match) =>
	article({
		key: 'item-detail',
		class: 'content',
		oncreate: () => actions.item_detail.fetchItem(match.params),
	}, state.item_detail.data
		.match({
			NotAsked,
			Pending,
			Success,
			Failure,
		})
	)

const NotAsked = () =>
	[]

const Pending = () =>
	[]

const Failure = ({ code, error }) =>
	[]

const Success = ({ _id, name, description, type, adventure_id }) =>
	[
		header([
			h1(name),
		]),
		Markdown(description),
		section({ class: 'button-container'}, [
			Link({
				class: 'btn primary',
				to: `/adventures/${adventure_id}/${type}/${_id}/edit`,
			}, 'Edit')
		])
	]