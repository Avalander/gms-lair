import { article, div, input, textarea, button } from '@hyperapp/html'
import { action } from '@hyperapp/fx'
import { Link } from '@hyperapp/router'

import { toError } from 'Shared/result'

import { postJson } from 'App/fx'
import { makeNotification, NotificationList } from 'App/components/notifications'


export const state = {
	form: {
		title: '',
		summary: '',
	},
	notifications: [],
}

export const actions = {
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
	save: () => ({ form }) =>
		postJson(
			'/api/adventures',
			'onSaveResponse',
			form,
		),
	onSaveResponse: result =>
		(result.ok
			? action('onSaveSuccess', result)
			: action('onSaveError', result)
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
	onSaveError: ({ error, code }) => state => ({
		...state,
		notifications: [
			makeNotification({
				type: 'error',
				message: `${toError(code)}: ${error}.`,
				makeOnClose,
			}),
		]
	}),
}

const makeOnClose = x =>
	action('adventure_edit.removeNotification', x)

export const view = (state, actions, match) =>
	article({ key: 'adventure-edit', class: 'content' }, [
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