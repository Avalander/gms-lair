import { article, div, input, button, label } from '@hyperapp/html'
import { action, fxIf } from '@hyperapp/fx'
import { Link } from '@hyperapp/router'

import { toError } from 'Shared/result'

import { postJson, fetchJson, go } from 'App/fx'
import { makeNotification, NotificationList, MarkdownEditor } from 'App/components'


export const state = {
	form: {
		name: '',
		description: '',
		type: '',
		adventure_id: '',
	},
	notifications: [],
}

export const actions = {
	init: ({ id, adventure_id, type }) =>
		fxIf([
			[ true, action('clearForm') ],
			[ true, action('updateForm', [ 'adventure_id', adventure_id ])],
			[ true, action('updateForm', [ 'type', type ])],
			[ id, action('fetchItem', id) ],
		]),
	// Form
	clearForm: () => state =>
		({
			...state,
			form: {},
			notifications: [],
		}),
	updateForm: ([ key, value ]) => state =>
		({
			...state,
			form: {
				...state.form,
				[key]: value,
			},
		}),
	// Notifications
	addNotification: notif => state =>
		({
			...state,
			notifications: [
				...state.notifications,
				notif,
			],
		}),
	removeNotification: notif => state =>
		({
			...state,
			notifications: state.notifications.filter(
				x => x !== notif
			)
		}),
	// Network
	fetchItem: id =>
		fetchJson(
			`/api/items/${id}`,
			'onFetchResponse',
		),
	onFetchResponse: result =>
		(result.ok
			? action('onFetchSuccess', result)
			: action('onFetchError', result)
		),
	onFetchError: ({ code, error }) =>
		action('addNotification', makeNotification({
			type: 'error',
			message: `${toError(code)}: ${error}.`,
			makeOnClose,
		})),
	onFetchSuccess: ({ data }) => state =>
		({
			...state,
			form: data,
		}),
	save: () => ({ form }) =>
		postJson(
			`/api/adventures/${form.adventure_id}/${form.type}`,
			'onSaveResponse',
			form
		),
	onSaveResponse: result =>
		(result.ok
			? action('onSaveSuccess', result)
			: action('onFetchError', result)
		),
	onSaveSuccess: ({ data }) => ({ form }) =>
		go(`/adventures/${form.adventure_id}/${form.type}/${data._id}`)
}

const makeOnClose = x =>
	action('item_edit.removeNotification', x)


export const view = (state, actions, match) =>
	article({
		key: 'item-edit',
		class: 'content',
		oncreate: () => actions.item_edit.init(match.params || {}),
	}, [
		NotificationList(state.item_edit.notifications),
		div({ class: 'form-group' }, [
			label({ class: 'form-label' }, 'Name'),
			input({
				id: 'name',
				type: 'text',
				placeholder: 'Name',
				value: state.item_edit.form.name,
				oninput: ev => actions.item_edit.updateForm([ 'name', ev.target.value ]),
			}),
		]),
		MarkdownEditor({
			id: 'description',
			placeholder: 'Description',
			value: state.item_edit.form.description,
			oninput: ev => actions.item_edit.updateForm([ 'description', ev.target.value ]),
		}),
		div({ class: 'button-container' }, [
			button({
				class: 'btn primary',
				onclick: () => actions.item_edit.save(),
			}, 'Save'),
		]),
	])