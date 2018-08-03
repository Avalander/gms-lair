import * as welcome from 'App/pages/welcome'
import * as adventureList from 'App/pages/adventure.list'
import * as adventureEdit from 'App/pages/adventure.edit'
import * as adventureDetail from 'App/pages/adventure.detail'


export default [{
	path: '/welcome',
	title: 'Welcome',
	view: welcome.view,
}, {
	path: '/adventures',
	title: 'Adventures',
	view: adventureList.view,
}, {
	path: '/adventures/new/edit',
	title: 'Adventure',
	view: adventureEdit.view,
}, {
	path: '/adventures/:id',
	title: 'Adventure',
	view: adventureDetail.view,
}, {
	path: '/adventures/:id/edit',
	title: 'Adventure',
	view: adventureEdit.view,
}]