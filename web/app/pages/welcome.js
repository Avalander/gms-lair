import { article, div } from '@hyperapp/html'
import { Link } from '@hyperapp/router'
import marked from 'marked'


export const view = () =>
	div({ key: 'welcome' }, [
		article({
			class: 'markdown-content',
			oncreate: el => el.innerHTML = marked(text),
		}),
		div({ class: 'button-container' }, [
			Link({ class: 'btn primary', to: '/adventure-list' }, 'Go to your adventures')
		])
	])

const text = `
# Welcome!

This is a welcome page. Things be written here.
`
