describe('Scenes', () => {
	before(() => cy.createUser())
	after(() => cy.deleteUser())

	beforeEach(() => cy.login())
	afterEach(() => {
		cy.clearDb('adventures')
		cy.clearDb('items')
	})

	describe('Adventure Detail', () => {
		it('Can create a new scene', () => {
			cy.createAdventure()
				.then(({ data }) => {
					// Go to create scene
					cy.visit(`/adventures/${data._id}`)
					cy.contains('New Scene')
						.click()
					// Fill in form
					cy.url()
						.should('contain', `/adventures/${data._id}/scene/new/edit`)
					cy.get('#name')
						.type('Scene 1')
					cy.get('#description')
						.type('The princess takes a bit of the cursed potato.')
					cy.contains('Save')
						.click()
					// Show detail page
					cy.url()
						.should('contain', `/adventures/${data._id}/scene`)
						.and('not.contain', '/edit')
					cy.contains('Scene 1')
					cy.contains('The princess takes a bit of the cursed potato.')
					cy.contains('Edit')
					cy.contains('Back to Adventure')
				})
		})
	})
})