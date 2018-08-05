import { section, div, span, a, textarea } from '@hyperapp/html'
import marked from 'marked'


export const Markdown = raw =>
	section({
		class: 'markdown-content',
		oncreate: el => el.innerHTML = marked(raw)
	})

export const MarkdownEditor = ({ id, placeholder, value, oninput }) =>
	div({ class: 'form-group' }, [
		div([
			span('This field supports Markdown format. '),
			a({ href: 'https://github.com/adam-p/markdown-here/wiki/Markdown-Here-Cheatsheet', target: '_blank' }, 'Learn more'),
		]),
		textarea({
			id,
			placeholder,
			class: 'markdown',
			value,
			oninput,
		})
	])