import { app } from 'hyperapp'
import { h1 } from '@hyperapp/html'
import { withFx } from '@hyperapp/fx'

import 'scss/main.scss'


const state = {

}

const actions = {

}

const view = (state, actions) =>
	h1('Hello world!')

const main = withFx(app) (state, actions, view, document.body)
