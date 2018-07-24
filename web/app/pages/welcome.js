import { a, article, div } from '@hyperapp/html'
import marked from 'marked'


export const view = () =>
	div([
		article({
			class: 'markdown-content',
			oncreate: el => el.innerHTML = marked(text),
		}),
		div({ class: 'button-container' }, [
			a({ class: 'btn primary', href: '/adventures' }, 'Go to your adventures')
		])
	])

const text = `
# Welcome!

This is a welcome page. Things be written here.
`
