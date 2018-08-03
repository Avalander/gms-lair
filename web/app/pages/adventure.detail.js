import { article, h1, header, section } from '@hyperapp/html'
import { action } from '@hyperapp/fx'
import { Link } from '@hyperapp/router'

import { fetchJson } from 'App/fx'
import { RemoteData } from 'App/http'
import { Markdown } from 'App/components'


export const state = {
	data: RemoteData.NotAsked(),
}

export const actions = {
	setData: data => state => ({
		...state,
		data,
	}),
	// HTTP
	fetchAdventure: id => [
		action('setData', RemoteData.Pending()),
		fetchJson(
			`/api/adventures/${id}`,
			'onFetchAdventureResponse',
		)
	],
	onFetchAdventureResponse: result =>
		(result.ok
			? action('setData', RemoteData.Success(result.data))
			: action('setData', RemoteData.Failure(result))
		),
}


export const view = (state, actions, match) =>
	article({
		key: 'adventure-detail',
		class: 'content',
		oncreate: () => actions.adventure_detail.fetchAdventure(match.params.id)
	}, state.adventure_detail.data
		.match({
			NotAsked,
			Pending,
			Success,
		})
	)

const NotAsked = () =>
	[]

const Pending = () =>
	[]

const Success = ({ _id, title, summary }) =>
	[
		header([
			h1(title),
		]),
		Markdown(summary),
		section({ class: 'button-container' }, [
			Link({ class: 'btn primary', to: `/adventures/${_id}/edit` },
				'Edit'
			),
		]),
	]
