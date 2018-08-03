describe('Register page', () => {
	afterEach(() => {
		cy.clearDb('users')
		cy.clearDb('invite-tokens')
	})

	it('Visits the register page', () => {
		cy.visit('/register.html')
		cy.contains('Username')
		cy.contains('Password')
		cy.contains('Repeat password')
	})

	it('Fails without a valid token', () => {
		cy.visit('/register.html?token=asd')
		cy.get('#username').type('test2')
		cy.get('#password').type('test1234')
		cy.get('#repeat-password').type('test1234')
		cy.get('form').submit()
		cy.contains('Invalid token')
	})

	it('Fails when the username already exists', () => {
		cy.createUser('test')
		cy.visit('/register.html?token=asd')
		cy.get('#username').type('test')
		cy.get('#password').type('test1234')
		cy.get('#repeat-password').type('test1234')
		cy.get('form').submit()
		cy.contains('Username already exists')
	})

	it('Fails when the password is shorter than 8 characters', () => {
		cy.visit('/register.html?token=asd')
		cy.get('#username').type('test2')
		cy.get('#password').type('test123')
		cy.get('#repeat-password').type('test123')
		cy.get('form').submit()
		cy.contains('Password should be at least 8 characters long')
	})

	it('Fails when the username is empty', () => {
		cy.visit('/register.html?token=asd')
		cy.get('#password').type('test1234')
		cy.get('#repeat-password').type('test1234')
		cy.get('form').submit()
		cy.contains('Please provide a username')
	})

	it('Succeeds with a valid token', () => {
		cy.exec('node tools.js create_token potato')
		cy.visit('/register.html?token=potato')
		cy.get('#username').type('test2')
		cy.get('#password').type('test1234')
		cy.get('#repeat-password').type('test1234')
		cy.get('form').submit()
		cy.contains('Welcome')
	})

	it('Cannot reuse a token', () => {
		cy.exec('node tools.js create_token potato')
		cy.visit('/register.html?token=potato')
		cy.get('#username').type('test2')
		cy.get('#password').type('test1234')
		cy.get('#repeat-password').type('test1234')
		cy.get('form').submit()
		cy.contains('Welcome')

		cy.visit('/register.html?token=potato')
		cy.get('#username').type('test3')
		cy.get('#password').type('test1234')
		cy.get('#repeat-password').type('test1234')
		cy.get('form').submit()
		cy.contains('Invalid token')
	})
})