context('COSTO DE ENVÍO', () => {
	beforeEach(() => {
		cy.AddProductWithStock();
		cy.get('[data-cy="make-order"]').click();
		cy.login();
		cy.get('[data-cy="make-order"]').click();
		cy.SelectDeliveryHome();
	})

	it('Verificar costos de envío: SOLO PROVINCIA', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			cy.SelectProvinceInNewDirection(shippingCost);
			cy.get('[data-cy="shipping"]')
				.should('contain', shippingCost.provinceCost);
		})
	})

	it('Verificar costos de envío: PROVINCIA Y CIUDAD', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			cy.SelectProvinceInNewDirection(shippingCost);
			cy.SelectCityInNewDirection(shippingCost);
			cy.get('[data-cy="shipping"]')
				.should('contain', shippingCost.cityCost);
		})
	})

	it('Verificar costos de envío: PROVINCIA, CIUDAD Y PARROQUIA', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			cy.SelectProvinceInNewDirection(shippingCost);
			cy.SelectCityInNewDirection(shippingCost);
			cy.SelectParishInNewDirection(shippingCost);
			cy.get('[data-cy="shipping"]')
				.should('contain', shippingCost.parishCost);
		})
	})
})