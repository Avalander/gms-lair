import { article, h4, span, section } from '@hyperapp/html'
import { action, http } from '@hyperapp/fx'
import { Link } from '@hyperapp/router'

import { match } from 'Shared/result'
import { fromList } from '@avalander/fun/src/maybe'

import './adventure-list.scss'


export const state = {
	adventures: [],
}

export const actions = {
	// Fetch data
	load: () => http(
		'/api/adventures',
		'onFetchAdventures',
		{ credentials: 'same-origin' }
	),
	onFetchAdventures: match({
		SUCCESS: data => action('setAdventures', data),
		INVALID_CREDENTIALS: () => window.location.href = '/login.html?to=/adventure-list',
	}),
	// Update state
	setAdventures: adventures => state => ({
		...state,
		adventures,
	}),
}

export const view = (state, actions) =>
	article({ key: 'adventure-list', class: 'content', oncreate: () => actions.adventure_list.load() }, [
		section({ class: 'mb-10' },
			AdventureList(state.adventure_list.adventures)
		),
		section({ class: 'button-container' }, [
			Link({ class: 'btn primary', to: '/adventure/new/edit' }, 'New adventure'),
		]),
	])

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