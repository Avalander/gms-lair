describe('Adventures', () => {
	before(() => cy.createTestUser())
	after(() => cy.deleteTestUser())

	beforeEach(() => cy.login())
	afterEach(() => cy.clearDb('adventures'))

	describe('Adventure List', () => {
		it('Visits the adventure list page', () => {
			cy.visit('/adventures')
			cy.contains('Adventures')
		})

		it('Can create a new adventure', () => {
			cy.visit('/adventures')
			cy.contains('New adventure')
				.click()
			cy.url().should('contain', '/adventures/new/edit')
		})
	})

	describe('Create Adventure', () => {
		it('Visits the create adventure page', () => {
			cy.visit('/adventures/new/edit')
			cy.get('input[placeholder="Title"]')
			cy.get('textarea[placeholder="Summary"]')
		})

		it('Creates a new adventure', () => {
			cy.visit('/adventures/new/edit')
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
			cy.visit('/adventures/new/edit')
			cy.get('input[placeholder="Title"]')
				.type('A test adventure')
			cy.get('textarea[placeholder="Summary"]')
				.type('This is a test adventure.')
			cy.contains('Save').click()

			cy.visit('/adventures')
			cy.contains('A test adventure')
			cy.contains('Created by test')
		})

		it('Goes back on cancel', () => {
			cy.visit('/adventures')
			cy.contains('New adventure').click()
			cy.url().should('contain', '/new/edit')
			cy.contains('Cancel').click()
			cy.url().should('not.contain', '/new/edit')
		})

		it('Fails when title is empty', () => {
			cy.visit('/adventures/new/edit')
			cy.get('textarea[placeholder="Summary"]')
				.type('This is going to be great.')
			cy.contains('Save').click()
			cy.contains(`Missing key 'title'`)
			cy.url().should('contain', '/new/edit')
		})
	})
})