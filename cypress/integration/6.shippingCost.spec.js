context('COSTO DE ENVÍO', () => {
	beforeEach(() => {
		cy.AddProductWithStock();
		cy.get('[data-cy="make-order"]').click();
		cy.login();
		cy.get('[data-cy="make-order"]').click();
		cy.SelectDeliveryHome();
		cy.NewDirection();
	})

	it('Verificar costos de envío: SOLO PROVINCIA', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			const { newAddress: { alias, apto, direction, ref } } = shippingCost;

			cy.get('[data-cy="alias"]')
				.type(alias);
			cy.SelectProvinceInNewDirection(shippingCost.provinceName);
			cy.get('[data-cy="shipping"]')
				.should('contain', shippingCost.provinceCost);
			cy.get('[data-cy="direccion"]')
				.should('exist')
				.focus({ force: true })
				.type(direction);
			cy.get('[data-cy="ref"]')
				.should('exist')
				.focus({ force: true })
				.type(ref);
			cy.get('[data-cy="apto"]')
				.should('exist')
				.focus({ force: true })
				.type(apto);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled', 'disabled');
			})
		})
	})

	it('Verificar costos de envío: PROVINCIA Y CIUDAD', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			const { newAddress: { alias, apto, direction, ref } } = shippingCost;

			cy.get('[data-cy="alias"]')
				.type(alias);
			cy.SelectProvinceInNewDirection(shippingCost.provinceName);
			cy.SelectCityInNewDirection(shippingCost.cityName);
			cy.get('[data-cy="shipping"]')
				.should('contain', shippingCost.cityCost);
			cy.get('[data-cy="direccion"]')
				.should('exist')
				.focus({ force: true })
				.type(direction);
			cy.get('[data-cy="ref"]')
				.should('exist')
				.focus({ force: true })
				.type(ref);
			cy.get('[data-cy="apto"]')
				.should('exist')
				.focus({ force: true })
				.type(apto);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled', 'disabled');
			})
		})
	})

	it('Verificar costos de envío: PROVINCIA, CIUDAD Y PARROQUIA', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			const { newAddress: { alias, apto, direction, ref } } = shippingCost;

			cy.get('[data-cy="alias"]')
				.type(alias);
			cy.get('[data-cy="direccion"]')
				.should('exist')
				.focus({ force: true })
				.type(direction);
			cy.get('[data-cy="ref"]')
				.should('exist')
				.focus({ force: true })
				.type(ref);
			cy.get('[data-cy="apto"]')
				.should('exist')
				.focus({ force: true })
				.type(apto);

			cy.SelectProvinceInNewDirection(shippingCost.provinceName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled');
			})

			cy.SelectCityInNewDirection(shippingCost.cityName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled');
			})

			cy.SelectParishInNewDirection(shippingCost.parishName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.not.have.attr('disabled');
			})

			cy.get('[data-cy="shipping"]')
				.should('contain', shippingCost.parishCost);
		})
	})

	it('Verificar costo de envío: DIRECCIÓN EXISTENTE', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			cy.get('[data-cy="address-selection"]')
				.should('exist')
				.click({ force: true });
			cy.get('.menuable__content__active')
				.should('exist');
			cy.contains(shippingCost.fenixDirection)
				.click({ force: true });
			cy.get('[data-cy="shipping"]')
				.should('contain', shippingCost.fenixDirectionShippingCost);
		})
	})

	it('BOTÓN PAGO: Envío no configurado no lo habilita', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			const { newAddress: { alias, apto, direction, ref } } = shippingCost;

			cy.get('[data-cy="alias"]')
				.type(alias);
			cy.SelectProvinceInNewDirection(shippingCost.errorProvinceName);
			cy.SelectCityInNewDirection(shippingCost.errorCityName);
			cy.SelectParishInNewDirection(shippingCost.errorParishName);
			cy.get('[data-cy="direccion"]')
				.should('exist')
				.focus({ force: true })
				.type(direction);
			cy.get('[data-cy="ref"]')
				.should('exist')
				.focus({ force: true })
				.type(ref);
			cy.get('[data-cy="apto"]')
				.should('exist')
				.focus({ force: true })
				.type(apto);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled', 'disabled');
			})
		})
	})

	it('Verificar costos de envío: PROVINCIA, CIUDAD Y PARROQUIA', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			const { newAddress: { alias, apto, direction, ref } } = shippingCost;

			cy.get('[data-cy="alias"]')
				.type(alias);
			cy.get('[data-cy="direccion"]')
				.should('exist')
				.focus({ force: true })
				.type(direction);
			cy.get('[data-cy="ref"]')
				.should('exist')
				.focus({ force: true })
				.type(ref);
			cy.get('[data-cy="apto"]')
				.should('exist')
				.focus({ force: true })
				.type(apto);

			cy.SelectProvinceInNewDirection(shippingCost.provinceName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled');
			})

			cy.SelectCityInNewDirection(shippingCost.cityName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled');
			})

			cy.SelectParishInNewDirection(shippingCost.noConfigParishName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.not.have.attr('disabled');
			})

			cy.get('[data-cy="shipping"]')
				.should('contain', shippingCost.cityCost);

			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.not.have.attr('disabled');
			})
		})
	})
})