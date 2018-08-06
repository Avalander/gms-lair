export default {
	adventure: {
		list: () => '/adventures',
		detail: id => `/adventures/${id}`,
		edit: id => `/adventures/${id}/edit`,
		create: () => '/adventures/new/edit',
	},
	scene: {
		create: adventure_id => `/adventures/${adventure_id}/scene/new/edit`,
		detail: (adventure_id, id) => `/adventures/${adventure_id}/scene/${id}`,
		edit: (adventure_id, id) => `/adventures/${adventure_id}/scene/${id}/edit`,
	},
}