import { article, h4, span, section } from '@hyperapp/html'
import { action } from '@hyperapp/fx'
import { Link } from '@hyperapp/router'

import { fromList } from '@avalander/fun/src/maybe'

import { match } from 'Shared/result'
import { RemoteData } from 'App/http'
import { fetchJson } from 'App/fx'

import './adventure.list.scss'


export const state = {
	adventures: RemoteData.NotAsked(),
}


export const actions = {
	// Fetch data
	load: () => [
		action('setAdventures', RemoteData.Pending()),
		fetchJson(
			'/api/adventures',
			'onFetchAdventures',
			{ credentials: 'same-origin' }
		),
	],
	onFetchAdventures: match({
		SUCCESS: data => action('setAdventures', RemoteData.Success(data)),
		INVALID_CREDENTIALS: () => window.location.href = '/login.html?to=/adventure-list',
	}),
	// Update state
	setAdventures: adventures => state => ({
		...state,
		adventures,
	}),
}

export const view = (state, actions) =>
	article({ key: 'adventure-list', class: 'content', oncreate: () => actions.adventure_list.load() },
		state.adventure_list.adventures
			.match({
				NotAsked,
				Pending,
				Success,
			}),
	)

const NotAsked = () =>
	[]

const Pending = () =>
	[]

const Success = adventures =>
	[
		section({ class: 'mb-10' },
			AdventureList(adventures)
		),
		section({ class: 'button-container' }, [
			Link({ class: 'btn primary', to: '/adventure/new/edit' }, 'New adventure'),
		]),
	]

const AdventureList = adventures =>
	fromList(adventures)
		.map(x => x.map(AdventureHeader))
		.fold(
			() => section({}, 'There are no adventures yet.'),
			adventures => adventures
		)

const AdventureHeader = ({ _id, title, author }) =>
	Link({ class: 'adventure-header', to: `/adventure/${_id}` }, [
		h4({ class: 'adventure-title'}, title),
		span(`Created by ${author}`),
	])