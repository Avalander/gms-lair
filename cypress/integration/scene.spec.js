import urls from '../support/url'


describe('Scenes', () => {
	before(() => cy.createUser())
	after(() => cy.deleteUser())

	beforeEach(() => cy.login())
	afterEach(() => {
		cy.clearDb('adventures')
		cy.clearDb('items')
	})

	describe('Create scene', () => {
		it('Can create a new scene from the adventure page', () => {
			cy.createAdventure()
				.then(({ data }) => {
					// Go to create scene
					cy.visit(urls.adventure.detail(data._id))
					cy.contains('New Scene')
						.click()
					// Fill in form
					cy.url()
						.should('contain', urls.scene.create(data._id))
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

		it('Fails when name is empty', () => {
			cy.createAdventure()
				.then(({ data }) => data._id)
				.then(adventure_id => {
					cy.visit(urls.scene.create(adventure_id))
					cy.get('#description')
						.type('Some text.')
					cy.contains('Save')
						.click()
					cy.contains(`Missing key 'name'`)
				})
		})

		it('Fails when description is empty', () => {
			cy.createAdventure()
				.then(({ data }) => data._id)
				.then(adventure_id => {
					cy.visit(urls.scene.create(adventure_id))
					cy.get('#name')
						.type('Some text.')
					cy.contains('Save')
						.click()
					cy.contains(`Missing key 'description'`)
				})
		})

		it('Accepts markdown in the description', () => {
			cy.createAdventure()
				.then(({ data }) => cy.createScene(data, 'markdown'))
				.then(({ _id, adventure_id }) => {
					cy.visit(urls.scene.detail(adventure_id, _id))
					cy.get('.markdown-content')
						.contains('h1', 'The title')
					cy.get('.markdown-content')
						.contains('blockquote', 'The blockquote')
				})
		})
	})

	describe('View scene', () => {
		it('Shows existing scenes in the adventure page', () => {
			cy.createAdventure()
				.then(({ data }) => cy.createScene(data))
				.then(({ _id, name, adventure_id }) => {
					cy.visit(urls.adventure.detail(adventure_id))
					cy.contains('Scenes')
					cy.contains(name)
						.should(
							'have.attr',
							'href',
							urls.scene.detail(adventure_id, _id)
						)
				})
		})

		it('Visits the scene detail page', () => {
			cy.createAdventure()
				.then(({ data }) => cy.createScene(data))
				.then(({ _id, name, adventure_id, description }) => {
					cy.visit(urls.scene.detail(adventure_id, _id))
					cy.contains(name)
					cy.contains(description)
					cy.contains('Edit')
						.should(
							'have.attr',
							'href',
							urls.scene.edit(adventure_id, _id),
						)
					cy.contains('Back to Adventure')
						.should(
							'have.attr',
							'href',
							urls.adventure.detail(adventure_id),
						)
				})
		})

		it('Does not show scenes of other adventures', () => {
			cy.createAdventure()
				.then(({ data }) => cy.createScene(data, 'basic'))
				.then(scene => 
					cy.createAdventure()
						.then(({ data }) => cy.createScene(data, 'second'))
						.then(scene_2 => ([ scene, scene_2 ]))
				)
				.then(([ scene_1, scene_2 ]) => {
					cy.visit(urls.adventure.detail(scene_1.adventure_id))
					cy.contains(scene_1.name)
						.should(
							'have.attr',
							'href',
							urls.scene.detail(scene_1.adventure_id, scene_1._id),
						)
					cy.should('not.contain', scene_2.name)
				})
		})
	})

	describe('Edit scene', () => {
		it('Can edit the scene', () => {
			cy.createAdventure()
				.then(({ data }) => cy.createScene(data))
				.then(({ _id, name, adventure_id, description }) => {
					cy.visit(urls.scene.detail(adventure_id, _id))
					cy.contains(name)
					cy.contains('Edit')
						.click()
					cy.url()
						.should('contain', urls.scene.edit(adventure_id, _id))
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
						.and('contain', urls.scene.detail(adventure_id, _id))
					cy.contains('The cursed potato')
					cy.contains(`${description} The owls were rising.`)
				})
		})

		it('Should not save changes on cancel', () => {
			cy.createAdventure()
				.then(({ data }) => cy.createScene(data))
				.then(({ _id, name, description, adventure_id }) => {
					cy.visit(urls.scene.detail(adventure_id, _id))
					cy.contains(name)
					cy.contains('Edit')
						.click()
					cy.url()
						.should('contain', urls.scene.edit(adventure_id, _id))
					cy.get('#name')
						.should('have.value', name)
						.clear()
						.type('The cursed potato')
					cy.get('#description')
						.should('have.value', description)
						.type(' The owls were rising.')
					cy.contains('Cancel')
						.click()
					
					cy.url()
						.should('not.contain', '/edit')
						.and('contain', urls.scene.detail(adventure_id, _id))
					cy.contains(name)
					cy.contains(description)
				})
		})
	})
})