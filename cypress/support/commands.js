Cypress.Commands.add('login', () => {
	cy.request({
		url: '/api/user/login',
		method: 'POST',
		body: {
			username: 'test',
			password: 'test'
		}
	})
	cy.getCookie('bearer')
		.should('have.property', 'value')
	cy.getCookie('bearer')
		.should('have.property', 'httpOnly', true)
})

Cypress.Commands.add('createUser', (username='test', password=username) => {
	cy.exec(`node tools.js create_user ${username} ${password}`)
})

Cypress.Commands.add('deleteUser', (username='test') => {
	cy.exec(`node tools.js delete_user ${username}`)
})

Cypress.Commands.add('clearDb', (collection) => {
	cy.exec(`node tools.js reset ${collection}`)
})

Cypress.Commands.add('createAdventure', (title='Test Adventure', summary='This is a test') => {
	return cy.request({
		url: '/api/adventures',
		method: 'POST',
		body: {
			title,
			summary,
			author: 'test',
		}
	})
	.then(response => response.body)
})