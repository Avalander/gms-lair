import { error_codes } from 'Shared/result'


export const fetchJson = (url, action, options, error) =>
	[ 'fetchJson', {
		url,
		action,
		options: {
			credentials: 'same-origin',
			...options,
		},
		error,
	}]

export const postJson = (url, action, data, options, error) =>
	[ 'fetchJson', {
		url,
		action,
		options: {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			body: typeof data === 'string'
				? data
				: JSON.stringify(data),
			...options,
		},
		error,
	}]

export const go = url =>
	[ 'go', {
		url,
	}]

export const makeFetchJson = () => (props, getAction) =>
	fetch(props.url, props.options)
		.then(res => res.json())
		.then(result =>
			!result.ok && result.code === error_codes.INVALID_CREDENTIALS
				? window.location.href = `/login.html?to=${window.location.pathname}`
				: result
		)
		.then(result =>
			getAction(props.action) (result)
		)
		.catch(error =>
			getAction(props.error || props.action) (error)
		)

export const makeGo = () => props =>
	window.history.pushState(null, '', props.url)