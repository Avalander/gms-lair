describe('Welcome Page', () => {
	it('Should have link to adventure list', () => {
		cy.createUser()
		cy.login()
		cy.visit('/welcome')
		cy.contains('Go to your adventures')
			.click()
		cy.url()
			.should('contain', '/adventures')
		cy.deleteUser()
	})
})