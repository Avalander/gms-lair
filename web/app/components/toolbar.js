import { header, i, a } from '@hyperapp/html'


export default () =>
	header({ class: 'toolbar fixed' }, [
		i({ class: 'fa fa-bars pointer toolbar-icon' }),
		a({ class: 'brand pointer', href: '/adventures' }, 'GM\'s Lair'),
	])
