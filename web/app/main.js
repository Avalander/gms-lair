import { app } from 'hyperapp'
import { div, h1, main } from '@hyperapp/html'
import { withFx } from '@hyperapp/fx'
import { Route, Switch, location } from '@hyperapp/router'

import toolbar from 'App/components/toolbar'

import * as adventureList from 'App/pages/adventure-list'
import * as adventureEdit from 'App/pages/adventure-edit'

import routes from 'App/routes'

import 'Style/main.scss'


const state = {
	location: location.state,
	adventure_list: adventureList.state,
	adventure_edit: adventureEdit.state,
}

const actions = {
	location: location.actions,
	adventure_list: adventureList.actions,
	adventure_edit: adventureEdit.actions,
}

const view = (state, actions) =>
	div({ key: 'root' }, [
		toolbar(state),
		main({ key: 'main', class: 'with-fixed-toolbar main' }, [
			Switch({}, [
				...routes.map(({ path, render }) =>
					Route({ path, render: () => render(state, actions) })
				)
			])
		])
	])

const my_app = withFx(app) (state, actions, view, document.body)
location.subscribe(my_app.location)
