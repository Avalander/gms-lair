import { app } from 'hyperapp'
import { div, h1 } from '@hyperapp/html'
import { withFx } from '@hyperapp/fx'

import 'scss/main.scss'


const state = {

}

const actions = {

}

const view = (state, actions) =>
	div([
		h1('Hello world'),
	])

const main = withFx(app) (state, actions, view, document.body)
