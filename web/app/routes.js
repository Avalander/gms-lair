import * as welcome from 'App/pages/welcome'
import * as adventure from 'App/pages/adventure'
import * as item from 'App/pages/item'


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
}, {
	path: '/adventures/:adventure_id/:type/new/edit',
	view: item.edit.view,
}, {
	path: '/adventures/:adventure_id/:type/:id/edit',
	view: item.edit.view,
}, {
	path: '/adventures/:adventure_id/:type/:id',
	view: item.detail.view,
}]