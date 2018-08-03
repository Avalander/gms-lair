import {
	section,
	span,
	button,
	div,
} from '@hyperapp/html'


export const NotificationList = notifications =>
	section({ key: 'notifications', class: 'alert-container' },
		notifications.map(({ type, message, onClose }) =>
			div({ class: `alert-${type}` }, [
				span(message),
				onClose
					? button({ class: 'close fa fa-times', onclick: onClose })
					: null,
			])
		)
	)

export const makeNotification = ({ type, message, makeOnClose }) => {
	const notification = {
		type,
		message,
	}
	notification.onClose = makeOnClose(notification)
	return notification
}

function noop() {}
