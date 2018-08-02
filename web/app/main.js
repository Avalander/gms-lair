import { app } from 'hyperapp'
import { div, h1, main } from '@hyperapp/html'
import { withFx } from '@hyperapp/fx'
import { Route, Switch, location } from '@hyperapp/router'

import toolbar from 'App/components/toolbar'

import * as adventureList from 'App/pages/adventure-list'
import * as adventureEdit from 'App/pages/adventure-edit'
import * as adventureDetail from 'App/pages/adventure.detail'

import routes from 'App/routes'

import 'Style/main.scss'


const state = {
	location: location.state,
	adventure_list: adventureList.state,
	adventure_edit: adventureEdit.state,
	adventure_detail: adventureDetail.state,
}

const actions = {
	location: location.actions,
	adventure_list: adventureList.actions,
	adventure_edit: adventureEdit.actions,
	adventure_detail: adventureDetail.actions,
}

const view = (state, actions) =>
	div({ key: 'root' }, [
		toolbar(state),
		main({ key: 'main', class: 'with-fixed-toolbar main' }, [
			Switch({}, [
				...routes.map(({ path, view }) =>
					Route({ path, render: ({ match }) => view(state, actions, match) })
				)
			])
		])
	])

const my_app = withFx(app) (state, actions, view, document.body)
location.subscribe(my_app.location)
