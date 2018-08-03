import * as welcome from 'App/pages/welcome'
import * as adventureList from 'App/pages/adventure.list'
import * as adventureEdit from 'App/pages/adventure.edit'
import * as adventureDetail from 'App/pages/adventure.detail'


export default [{
	path: '/welcome',
	title: 'Welcome',
	view: welcome.view,
}, {
	path: '/adventure-list',
	title: 'Adventures',
	view: adventureList.view,
}, {
	path: '/adventure/new/edit',
	title: 'Adventure',
	view: adventureEdit.view,
}, {
	path: '/adventure/:id',
	title: 'Adventure',
	view: adventureDetail.view,
}, {
	path: '/adventure/:id/edit',
	title: 'Adventure',
	view: adventureEdit.view,
}]