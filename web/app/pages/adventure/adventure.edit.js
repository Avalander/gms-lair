import { article, div, input, button } from '@hyperapp/html'
import { action } from '@hyperapp/fx'
import { Link } from '@hyperapp/router'

import { toError } from 'Shared/result'

import { postJson, fetchJson, go } from 'App/fx'
import { makeNotification, NotificationList, MarkdownEditor } from 'App/components'


export const state = {
	form: {
		title: '',
		summary: '',
	},
	notifications: [],
}

export const actions = {
	init: ({ id }) =>
		(id
			? [ action('clearForm'),
				action('fetchAdventure', id) ]
			: [ action('clearForm') ]
		),
	clearForm: () => state => ({
		...state,
		form: {},
		notifications: [],
	}),
	updateForm: ([ key, value ]) => state => ({
		...state,
		form: {
			...state.form,
			[key]: value,
		},
	}),
	removeNotification: notification => state => ({
		...state,
		notifications: state.notifications.filter(x =>
			x !== notification
		),
	}),
	// HTTP
	fetchAdventure: id =>
		fetchJson(
			`/api/adventures/${id}`,
			'onFetchResponse',
		),
	onFetchResponse: result =>
		(result.ok
			? action('onFetchSuccess', result)
			: action('onApiError', result)
		),
	onFetchSuccess: ({ data }) => state => ({
		...state,
		form: data,
	}),
	save: () => ({ form }) =>
		postJson(
			'/api/adventures',
			'onSaveResponse',
			form,
		),
	onSaveResponse: result =>
		(result.ok
			? action('onSaveSuccess', result)
			: action('onApiError', result)
		),
	onSaveSuccess: ({ data }) =>
		go(`/adventures/${data._id}`),
	onApiError: ({ error, code }) => state => ({
		...state,
		notifications: [
			makeNotification({
				type: 'error',
				message: `${toError(code)}: ${error || 'Something went wrong'}.`,
				makeOnClose,
			}),
		]
	}),
}

const makeOnClose = x =>
	action('adventure_edit.removeNotification', x)

export const view = (state, actions, match) =>
	article({
		key: 'adventure-edit',
		class: 'content',
		oncreate: () => actions.adventure_edit.init(match.params || {}),
	}, [
		NotificationList(state.adventure_edit.notifications),
		div({ class: 'form-group' }, [
			input({
				id: 'title',
				type: 'text',
				placeholder: 'Title',
				value: state.adventure_edit.form.title,
				oninput: ev => actions.adventure_edit.updateForm([ 'title', ev.target.value ]),
			})
		]),
		MarkdownEditor({
			id: 'summary',
			placeholder: 'Summary',
			value: state.adventure_edit.form.summary,
			oninput: ev => actions.adventure_edit.updateForm([ 'summary', ev.target.value ]),
		}),
		div({ class: 'button-container' }, [
			Link({ class: 'btn', to: state.location.previous }, 'Cancel'),
			button({
				class: 'btn primary',
				onclick: () => actions.adventure_edit.save()
			}, 'Save'),
		]),
	])
