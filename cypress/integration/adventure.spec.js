import urls from '../support/url'


describe('Adventures', () => {
	before(() => cy.createUser())
	after(() => cy.deleteUser())

	beforeEach(() => cy.login())
	afterEach(() => cy.clearDb('adventures'))

	describe('Adventure List', () => {
		it('Visits the adventure list page', () => {
			cy.visit(urls.adventure.list())
			cy.contains('Adventures')
		})

		it('Can create a new adventure', () => {
			cy.visit(urls.adventure.list())
			cy.contains('New adventure')
				.click()
			cy.url().should('contain', urls.adventure.create())
		})

		it('Can visit an existing adventure', () => {
			cy.createAdventure('The Adventure', 'The best adventure ever')
				.then(({ data }) => {
					cy.visit(urls.adventure.list())
					cy.contains('The Adventure')
						.click()
					cy.url().should('contain', urls.adventure.detail(data._id))
					cy.contains('The Adventure')
					cy.contains('The best adventure ever')
				})
		})

		it('Should be redirected to login when credentials expire.', () => {
			cy.clearCookie('bearer')
			cy.visit(urls.adventure.list())
			cy.url()
				.should('contain', `/login.html?to=/adventures`)
		})
	})

	describe('Create Adventure', () => {
		it('Visits the create adventure page', () => {
			cy.visit(urls.adventure.create())
			cy.get('input[placeholder="Title"]')
			cy.get('textarea[placeholder="Summary"]')
		})

		it('Creates a new adventure', () => {
			cy.visit(urls.adventure.create())
			cy.get('input[placeholder="Title"]')
				.type('A test adventure')
			cy.get('textarea[placeholder="Summary"]')
				.type('This is a test adventure.')
			cy.contains('Save').click()
			cy.url()
				.should('not.contain', '/edit')
			cy.contains('A test adventure')
			cy.contains('This is a test adventure.')
		})

		it('Appears in the adventure list page', () => {
			cy.visit(urls.adventure.create())
			cy.get('input[placeholder="Title"]')
				.type('A test adventure')
			cy.get('textarea[placeholder="Summary"]')
				.type('This is a test adventure.')
			cy.contains('Save').click()

			cy.visit(urls.adventure.list())
			cy.contains('A test adventure')
			cy.contains('Created by test')
		})

		it('Goes back on cancel', () => {
			cy.visit(urls.adventure.list())
			cy.contains('New adventure').click()
			cy.url().should('contain', urls.adventure.create())
			cy.contains('Cancel').click()
			cy.url().should('not.contain', '/new/edit')
		})

		it('Fails when title is empty', () => {
			cy.visit(urls.adventure.create())
			cy.get('textarea[placeholder="Summary"]')
				.type('This is going to be great.')
			cy.contains('Save').click()
			cy.contains(`Missing key 'title'`)
			cy.url().should('contain', '/new/edit')
		})
	})

	describe('View Adventure', () => {
		it('Can edit the adventure', () => {
			cy.createAdventure()
				.then(({ data }) => {
					cy.visit(urls.adventure.detail(data._id))
					cy.contains('Edit')
						.click()
					cy.url()
						.should('contain', urls.adventure.edit(data._id))
				})
		})

		// @TODO: figure out why it fails.
		it.skip('Should be redirected to login when credentials expire.', () => {
			cy.createAdventure()
				.then(({ data }) => {
					cy.clearCookie('bearer')
					cy.visit(url.adventure.detail(data._id))
					cy.url()
						.should('contain', `/login.html?to=/adventures/${data._id}`)
				})
		})
	})

	describe('Edit adventure', () => {
		it('Can edit an existing adventure', () => {
			cy.createAdventure('The Adventure', 'Some text')
				.then(({ data }) => {
					cy.visit(urls.adventure.edit(data._id))
					cy.get('input[placeholder="Title"]')
						.should('have.value', 'The Adventure')
						.clear()
						.type('Potato')
					cy.get('textarea[placeholder="Summary"]')
						.should('have.value', 'Some text')
						.type(' is added here')
					cy.contains('Save')
						.click()
					
					cy.url()
						.should('not.contain', '/edit')
					cy.url()
						.should('contain', data._id)
					cy.contains('Potato')
					cy.contains('Some text is added here')
				})
		})

		it('Should not save changes on cancel', () => {
			cy.createAdventure('This is', 'Spartaaa')
				.then(({ data }) => {
					cy.visit(urls.adventure.detail(data._id))
					cy.contains('Edit')
						.click()
					cy.url()
						.should('contain', '/edit')
					
					cy.get('input[placeholder="Title"]')
						.should('have.value', 'This is')
						.clear()
						.type('Potato')
					cy.get('textarea[placeholder="Summary"]')
						.should('have.value', 'Spartaaa')
						.type(' is added here')
					cy.contains('Cancel')
						.click()
					
					cy.url()
						.should('not.contain', '/edit')
					cy.contains('This is')
					cy.contains('Spartaaa')
				})
		})

		it('Should be redirected to login when credentials expire.', () => {
			cy.createAdventure()
				.then(({ data }) => {
					cy.clearCookie('bearer')
					cy.visit(urls.adventure.edit(data._id))
					cy.url()
						.should('contain', `/login.html?to=/adventures/${data._id}/edit`)
				})
		})
	})
})