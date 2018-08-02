import { header, i, a } from '@hyperapp/html'

import { fromNullable } from '@avalander/fun/src/maybe'
import routes from 'App/routes'


export default ({ location }) =>
	header({ key: 'toolbar', class: 'toolbar fixed' }, [
		i({ class: 'fa fa-bars pointer toolbar-icon' }),
		a({ class: 'brand pointer cool-title', href: '/adventures' }, getTitle(location)),
	])

const getTitle = ({ pathname }) =>
	fromNullable(routes.find(({ path }) => path === pathname))
		.fold(
			() => `GM's Lair`,
			({ title }) => title
		)
