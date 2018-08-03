import { div } from '@hyperapp/html'
import { Link } from '@hyperapp/router'

import { Markdown } from 'App/components'


export const view = () =>
	div({ key: 'welcome' }, [
		Markdown(text),
		div({ class: 'button-container' }, [
			Link({ class: 'btn primary', to: '/adventure-list' }, 'Go to your adventures')
		])
	])

const text = `
# Welcome!

This is a welcome page. Things be written here.
`
