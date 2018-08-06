import { article, h1, header, section, h2, div } from '@hyperapp/html'
import { action } from '@hyperapp/fx'
import { Link } from '@hyperapp/router'

import { fetchJson } from 'App/fx'
import { RemoteData } from 'App/http'
import { Markdown } from 'App/components'


export const state = {
	data: RemoteData.NotAsked(),
	items: RemoteData.NotAsked(),
}

export const actions = {
	setData: data => state =>
		({
			...state,
			data,
		}),
	setItems: items => state =>
		({
			...state,
			items,
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
			? [ action('setData', RemoteData.Success(result.data)),
				action('fetchItems', result.data._id) ]
			: action('setData', RemoteData.Failure(result))
		),
	fetchItems: id =>
		fetchJson(
			`/api/adventures/${id}/items`,
			'onFetchItemsResponse',
		),
	onFetchItemsResponse: result =>
		(result.ok
			? action('setItems', RemoteData.Success(result.data))
			: action('setItems', RemoteData.Failure(result))
		),
}


export const view = (state, actions, match) =>
	article({
		key: 'adventure-detail',
		class: 'content',
		oncreate: () => actions.adventure_detail.fetchAdventure(match.params.id)
	}, [
		...state.adventure_detail.data
			.match({
				NotAsked,
				Pending,
				Success: Success(state.adventure_detail.items),
			}),
	])

const NotAsked = () =>
	[]

const Pending = () =>
	[]

const Success = items => ({ _id, title, summary }) =>
	[
		header([
			h1(title),
		]),
		Markdown(summary),
		section(
			items.match({
				NotAsked,
				Pending,
				Success: Items.Success(_id)
			})
		),
		section({ class: 'button-container' }, [
			Link({
				class: 'btn',
				to: '/adventures'
			}, 'Back to list'),
			Link({
				class: 'btn primary',
				to: `/adventures/${_id}/edit`
			}, 'Edit'),
		]),
	]

const Items = {}
Items.Success = adventure_id => items =>
	[
		ItemList(adventure_id, 'scene', items.filter(({ type }) => type === 'scene')),
	]

const ItemList = (adventure_id, type, items) =>
	section({ class: 'semi-panel flex-column' }, [
		header([
			h2(toTitle(type)),
		]),
		...items.map(
			({ name, _id, adventure_id, type }) =>
				Link({
					to: `/adventures/${adventure_id}/${type}/${_id}`, 
				}, name)
		),
		div({ class: 'button-container' }, [
			Link({
				class: 'btn',
				to: `/adventures/${adventure_id}/${type}/new/edit`
			}, 'New Scene')
		]),
	])

const toTitle = ([ head, ...rest ]) =>
	[
		head.toUpperCase(),
		...rest,
		's',
	].join('')
