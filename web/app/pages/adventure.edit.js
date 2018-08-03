import { article, div, input, textarea, button } from '@hyperapp/html'
import { action } from '@hyperapp/fx'
import { Link, Redirect } from '@hyperapp/router'

import { union } from '@avalander/fun/src/union'

import { toError } from 'Shared/result'

import { postJson, fetchJson } from 'App/fx'
import { makeNotification, NotificationList } from 'App/components/notifications'


const State = union([
	'Loading',
	'Editing',
	'Saved',
])

export const state = {
	form: {
		title: '',
		summary: '',
	},
	notifications: [],
}

export const actions = {
	init: id =>
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
			: action('onError', result)
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
			: action('onError', result)
		),
	onSaveSuccess: ({ data }) => state => ({
		...state,
		notifications: [
			makeNotification({
				type: 'success',
				message: `Adventure '${data._id}' saved.`,
				makeOnClose,
			})
		]
	}),
	onError: ({ error, code }) => state => ({
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
		oncreate: () => actions.adventure_edit.init(match.params.id),
	}, [
		NotificationList(state.adventure_edit.notifications),
		div({ class: 'form-group' }, [
			input({
				type: "text",
				placeholder: "Title",
				value: state.adventure_edit.form.title,
				oninput: ev => actions.adventure_edit.updateForm([ 'title', ev.target.value ]),
			})
		]),
		div({ class: 'form-group' }, [
			textarea({
				placeholder: "Summary",
				value: state.adventure_edit.form.summary,
				oninput: ev => actions.adventure_edit.updateForm([ 'summary', ev.target.value ]),
			})
		]),
		div({ class: 'button-container' }, [
			Link({ class: 'btn', to: '/adventure-list' }, 'Cancel'),
			button({
				class: 'btn primary',
				onclick: () => actions.adventure_edit.save()
			}, 'Save'),
		]),
	])

const Loading = () =>
	[]

const Editing = ({ form, notifications, actions }) =>
	[
		NotificationList(notifications),
		div({ class: 'form-group' }, [
			input({
				type: "text",
				placeholder: "Title",
				value: form.title,
				oninput: ev => actions.updateForm([ 'title', ev.target.value ]),
			})
		]),
		div({ class: 'form-group' }, [
			textarea({
				placeholder: "Summary",
				value: form.summary,
				oninput: ev => actions.updateForm([ 'summary', ev.target.value ]),
			})
		]),
		div({ class: 'button-container' }, [
			Link({ class: 'btn', to: '/adventure-list' }, 'Cancel'),
			button({
				class: 'btn primary',
				onclick: () => actions.save()
			}, 'Save'),
		]),
	]

const Saved = id =>
	[ Redirect({ to: `/adventure/${id}` }) ]

/*
# This be title

This be adventure **description**.

> ## Note
>
> This be _blockquote_.

- This
- be
- a
- list

| col 1 | col 2 |
|-------|:-----:|
| a     | 1     |
| b     | 2     |
*/