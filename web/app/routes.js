import * as welcome from 'App/pages/welcome'
import * as adventure from 'App/pages/adventure'


export default [{
	path: '/welcome',
	title: 'Welcome',
	view: welcome.view,
}, {
	path: '/adventures',
	title: 'Adventures',
	view: adventure.list.view,
}, {
	path: '/adventures/new/edit',
	title: 'Adventure',
	view: adventure.edit.view,
}, {
	path: '/adventures/:id',
	title: 'Adventure',
	view: adventure.detail.view,
}, {
	path: '/adventures/:id/edit',
	title: 'Adventure',
	view: adventure.edit.view,
}]