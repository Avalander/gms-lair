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

Cypress.Commands.add('createTestUser', () => {
	cy.exec('node tools.js create_user test test')
})

Cypress.Commands.add('deleteTestUser', () => {
	cy.exec('node tools.js delete_user test')
})

Cypress.Commands.add('clearDb', (collection) => {
	cy.exec(`node tools.js reset ${collection}`)
})