import { app } from 'hyperapp'
import { div, h1, main } from '@hyperapp/html'
import { withFx } from '@hyperapp/fx'
import { Route, Switch, location } from '@hyperapp/router'

import toolbar from 'components/toolbar'

import * as welcome from 'pages/welcome'

import 'scss/main.scss'


const routes = [{
	path: '/welcome',
	render: welcome.view
}]

const state = {
	location: location.state,
}

const actions = {
	location: location.actions,
}

const view = (state, actions) =>
	div([
		toolbar(),
		main({ class: 'with-fixed-toolbar main' }, [
			Switch({}, [
				...routes.map(({ path, render }) =>
					Route({ path, render: () => render(state, actions) })
				)
			])
		])
	])

const my_app = withFx(app) (state, actions, view, document.body)
location.subscribe(my_app.location)
