import { article, h1, header, section } from '@hyperapp/html'
import { action, http } from '@hyperapp/fx'
import { Link } from '@hyperapp/router'
import marked from 'marked'

import { fetchJson } from 'App/http'


export const state = {
	data: null,
}

export const actions = {
	// HTTP
	fetchAdventure: id =>
		http(
			`/api/adventures/${id}`,
			'onFetchAdventureResponse',
			fetchJson()
		),
	onFetchAdventureResponse: result =>
		(result.ok
			? action('onFetchAdventureSuccess', result)
			: action('onFetchAdventureError', result)
		),
	onFetchAdventureResponse: ({ data }) => state => ({
		...state,
		data,
	}),
	onFetchAdventureError: ({ code, error }) =>
		console.error(`${code}: ${error}`),
}


export const view = (state, actions, match) =>
	article({
		key: 'adventure-detail',
		class: 'content',
		oncreate: () => actions.adventure_detail.fetchAdventure(match.params.id)
	}, state.adventure_detail.data
		? [
			header([
				h1(state.adventure_detail.data.title),
			]),
			section({
				class: 'markdown-content',
				oncreate: el => el.innerHTML = marked(state.adventure_detail.data.summary)
			}),
			section({ class: 'button-container' }, [
				Link({ class: 'btn primary', to: `/adventure/${state.adventure_detail.data._id}/edit` },
					'Edit'
				),
			]),
		]
		: []
	)
