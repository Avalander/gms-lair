import { app } from 'hyperapp'
import { div, main } from '@hyperapp/html'
import { withFx } from '@hyperapp/fx'
import { Route, Switch, location } from '@hyperapp/router'

import { Toolbar } from 'App/components'

import * as adventure from 'App/pages/adventure'

import routes from 'App/routes'
import { makeFetchJson, makeGo } from 'App/fx'

import 'Style/main.scss'


const state = {
	location: location.state,
	adventure_list: adventure.list.state,
	adventure_edit: adventure.edit.state,
	adventure_detail: adventure.detail.state,
}

const actions = {
	location: location.actions,
	adventure_list: adventure.list.actions,
	adventure_edit: adventure.edit.actions,
	adventure_detail: adventure.detail.actions,
}

const view = (state, actions) =>
	div({ key: 'root' }, [
		Toolbar(state),
		main({ key: 'main', class: 'with-fixed-toolbar main' }, [
			Switch({}, [
				...routes.map(({ path, view }) =>
					Route({ path, render: ({ match }) => view(state, actions, match) })
				)
			])
		])
	])

const my_app = withFx({
	fetchJson: makeFetchJson(),
	go: makeGo(),
}) (app) (state, actions, view, document.body)

location.subscribe(my_app.location)
