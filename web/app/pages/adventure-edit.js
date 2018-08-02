import { a, article, div, input, textarea, button } from '@hyperapp/html'
import { action, http } from '@hyperapp/fx'
import { Link } from '@hyperapp/router'


export const state = {
	title: '',
	summary: '',
	share_with: '',
}

export const actions = {
	updateState: ([ key, value ]) => state => ({
		...state,
		[key]: value,
	})
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
				oninput: ev => action.adventure_edit.updateState([ 'summary', ev.target.value ]),
			})
		]),
		div({ class: 'button-container' }, [
			Link({ class: 'btn', to: '/adventure-list' }, 'Cancel'),
			button({ class: 'btn primary' }, 'Save'),
		])
	])