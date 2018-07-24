import { toError } from 'result'
import 'scss/main.scss'


const to = new URL(window.location.href).searchParams.get('to') || '/'

const form = {
	username: document.querySelector('#username'),
	password: document.querySelector('#password'),
	errors: document.querySelector('#errors'),
}

const validateUsername = username =>
	username && username.length > 0
const validatePasswordLength = password =>
	password && password.length > 7

document.querySelector('#login').onsubmit = event => {
	event.preventDefault()
	const username = form.username.value
	const password = form.password.value

	const errors = []
	if (!validateUsername(username)) {
		errors.push('Username is empty.')
	}
	if (!validatePasswordLength(password)) {
		errors.push('Password is empty.')
	}

	if (errors.length > 0) {
		form.errors.innerHTML =
			errors
				.map(e => `<div class="alert-error">${e}</div>`)
				.join('')
		return
	}
	form.errors.innerHTML = ''

	fetch(`/api/user/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ username, password }),
	})
	.then(res => res.json())
	.then(result => (
		result.ok
			? window.location.href = to
			: Promise.reject(result)
	))
	.catch(({ code, error }) => form.errors.innerHTML = `
		<div class="alert-error">${toError(code)}: ${error}</div>
	`)
}
