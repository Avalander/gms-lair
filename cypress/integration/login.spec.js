describe('Login page', () => {
	before(() => {
		cy.exec('node tools.js create_user test test')
	})

	after(() => {
		cy.clearDb('users')
	})

	it('Visits the login page', () => {
		cy.visit('/login.html')
		cy.get('#username').type('test')
		cy.get('#password').type('test')
		cy.get('form').submit()
	})

	it('Redirects after successful login if to is provided', () => {
		cy.visit('/login.html?to=/welcome')
		cy.get('#username').type('test')
		cy.get('#password').type('test')
		cy.get('form').submit()
		cy.contains('Welcome')
	})

	it('Fails when username is empty', () => {
		cy.visit('/login.html')
		cy.get('form').submit()
		cy.contains('Username is empty')
	})

	it('Fails when password is empty', () => {
		cy.visit('/login.html')
		cy.get('#username').type('test')
		cy.get('form').submit()
		cy.contains('Password is empty')
	})

	it('Fails when the username is incorrect', () => {
		cy.visit('/login.html')
		cy.get('#username').type('testa')
		cy.get('#password').type('test')
		cy.get('form').submit()
		cy.contains('User not found')
	})

	it('Fails when the password is incorrect', () => {
		cy.visit('/login.html')
		cy.get('#username').type('test')
		cy.get('#password').type('testa')
		cy.get('form').submit()
		cy.contains('User not found')
	})
})