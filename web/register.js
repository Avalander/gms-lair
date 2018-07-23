import { toError } from 'result'
import 'scss/main.scss'


const token = new URL(window.location.href).searchParams.get('token')

const form = {
	username: document.querySelector('#username'),
	password: document.querySelector('#password'),
	repeat_password: document.querySelector('#repeat-password'),
	errors: document.querySelector('#errors'),
}

const validateUsername = username =>
	username && username.length > 0
const validatePasswordLength = password =>
	password && password.length > 7
const validatePasswordRepeat = (password, repeat) =>
	password === repeat
	
document.querySelector('#register').onsubmit = event => {
	event.preventDefault()
	const username = form.username.value
	const password = form.password.value
	const repeat = form.repeat_password.value

	const errors = []
	if (!validateUsername(username)) {
		errors.push('Please provide a username.')
	}
	if (!validatePasswordLength(password)) {
		errors.push('Password should be at least 8 characters long.')
	}
	if (!validatePasswordRepeat(password, repeat)) {
		errors.push('Passwords don\'t match.')
	}

	if (errors.length > 0) {
		form.errors.innerHTML =
			errors
				.map(e => `<div class="alert-error">${e}</div>`)
				.join('')
		return
	}
	form.errors.innerHTML = ''

	fetch(`/api/user/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ username, password, token }),
	})
	.then(res => res.json())
	.then(result => (
		result.ok
			? window.location.href = '/welcome'
			: Promise.reject(result)
	))
	.catch(({ code, error }) => form.errors.innerHTML = `
		<div class="alert-error">${toError(code)}: ${error}</div>
	`)
}
