import * as welcome from 'App/pages/welcome'
import * as adventureList from 'App/pages/adventure-list'
import * as adventureEdit from 'App/pages/adventure-edit'


export default [{
	path: '/welcome',
	title: 'Welcome',
	render: welcome.view,
}, {
	path: '/adventure-list',
	title: 'Adventures',
	render: adventureList.view,
}, {
	path: '/adventure/new/edit',
	title: 'Adventure',
	render: adventureEdit.view,
}]