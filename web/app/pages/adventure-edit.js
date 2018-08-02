import { article, div, input, textarea, button } from '@hyperapp/html'
import { action, http } from '@hyperapp/fx'
import { Link } from '@hyperapp/router'

import { postJson } from 'App/http'


export const state = {
	title: '',
	summary: '',
}

export const actions = {
	updateState: ([ key, value ]) => state => ({
		...state,
		[key]: value,
	}),
	// HTTP
	save: () => state =>
		http(
			'/api/adventures',
			'onSaveResponse',
			postJson(state)
		),
	onSaveResponse: result => console.log(result),
}

export const view = (state, actions) =>
	article({ key: 'adventure-edit', class: 'content' }, [
		div({ class: 'form-group' }, [
			input({
				type: "text",
				placeholder: "Title",
				value: state.adventure_edit.title,
				oninput: ev => actions.adventure_edit.updateState([ 'title', ev.target.value ]),
			})
		]),
		div({ class: 'form-group' }, [
			textarea({
				placeholder: "Summary",
				value: state.adventure_edit.summary,
				oninput: ev => actions.adventure_edit.updateState([ 'summary', ev.target.value ]),
			})
		]),
		div({ class: 'button-container' }, [
			Link({ class: 'btn', to: '/adventure-list' }, 'Cancel'),
			button({
				class: 'btn primary',
				onclick: () => actions.adventure_edit.save()
			}, 'Save'),
		])
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