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
		}),

		it('Shows existing scenes', () => {
			cy.createAdventure()
				.then(({ data }) => cy.createScene(data))
				.then(({ _id, name, adventure_id }) => {
					cy.visit(`/adventures/${adventure_id}`)
					cy.contains('Scenes')
					cy.contains(name)
						.should(
							'have.attr',
							'href',
							`/adventures/${adventure_id}/scene/${_id}`
						)
				})
		})
	})

	describe('View scene', () => {
		it('Visits the scene detail page', () => {
			cy.createAdventure()
				.then(({ data }) => cy.createScene(data))
				.then(({ _id, name, adventure_id, description }) => {
					cy.visit(`/adventures/${adventure_id}/scene/${_id}`)
					cy.contains(name)
					cy.contains(description)
					cy.contains('Edit')
						.should(
							'have.attr',
							'href',
							`/adventures/${adventure_id}/scene/${_id}/edit`,
						)
					cy.contains('Back to Adventure')
						.should(
							'have.attr',
							'href',
							`/adventures/${adventure_id}`,
						)
				})
		})
	})

	describe('Edit scene', () => {
		it('Can edit the scene', () => {
			cy.createAdventure()
				.then(({ data }) => cy.createScene(data))
				.then(({ _id, name, adventure_id, description }) => {
					cy.visit(`/adventures/${adventure_id}/scene/${_id}`)
					cy.contains(name)
					cy.contains('Edit')
						.click()
					cy.url()
						.should('contain', `/adventures/${adventure_id}/scene/${_id}/edit`)
					cy.get('#name')
						.should('have.value', name)
						.clear()
						.type('The cursed potato')
					cy.get('#description')
						.should('have.value', description)
						.type(' The owls were rising.')
					cy.contains('Save')
						.click()
					
					cy.url()
						.should('not.contain', '/edit')
						.and('contain', `/adventures/${adventure_id}/scene/${_id}`)
					cy.contains('The cursed potato')
					cy.contains(`${description} The owls were rising.`)
				})
		})
	})
})