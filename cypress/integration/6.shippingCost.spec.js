context('6 COSTO DE ENVÍO SOLO PROVINCIA', () => {
	beforeEach(() => {
		cy.AddProductWithStock();
		cy.get('[data-cy="make-order"]').click();
		cy.login();
		cy.get('[data-cy="make-order"]').click();
		cy.SelectDeliveryHome();
		cy.NewDirection();
	})

	it('Ciudad y Parroquia no configurada: Muestro precio de provincia', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			const { newAddress: { alias, apto, direction, ref }, onlyProvince } = shippingCost;

			cy.NewDirectionDataWithoutUbigeo({
				alias, direction, ref, apto,
			});

			cy.SelectProvinceInNewDirection(onlyProvince.provinceName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled', 'disabled');
			})

			cy.SelectCityInNewDirection(onlyProvince.cityName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled', 'disabled');
			})

			cy.SelectParishInNewDirection(onlyProvince.parishName);


			cy.get('[data-cy="shipping"]')
				.should('contain', onlyProvince.cost);

			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.not.have.attr('disabled');
			})
		})
	})
})

context('6 COSTO DE ENVÍO PROVINCIA Y CIUDAD', () => {
	beforeEach(() => {
		cy.AddProductWithStock();
		cy.get('[data-cy="make-order"]').click();
		cy.login();
		cy.get('[data-cy="make-order"]').click();
		cy.SelectDeliveryHome();
		cy.NewDirection();
	})

	it('Parroquia no configurada: Muestro precio de Ciudad', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			const { newAddress: { alias, apto, direction, ref }, provinceAndCity } = shippingCost;

			cy.NewDirectionDataWithoutUbigeo({
				alias, direction, ref, apto,
			});

			cy.SelectProvinceInNewDirection(provinceAndCity.provinceName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled', 'disabled');
			})

			cy.SelectCityInNewDirection(provinceAndCity.cityName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled', 'disabled');
			})

			cy.SelectParishInNewDirection(provinceAndCity.parishName);

			cy.get('[data-cy="shipping"]')
				.should('contain', provinceAndCity.cost);

			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.not.have.attr('disabled');
			})
		})
	})
})

context('6 COSTO DE ENVÍO PROVINCIA, CIUDAD Y DISTRITO', () => {
	beforeEach(() => {
		cy.AddProductWithStock();
		cy.get('[data-cy="make-order"]').click();
		cy.login();
		cy.get('[data-cy="make-order"]').click();
		cy.SelectDeliveryHome();
		cy.NewDirection();
	})

	it('Todo configurado: muestro precio de parroquia', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			const {
				newAddress: { alias, apto, direction, ref },
				provinceAndCityAndParish } = shippingCost;

			cy.NewDirectionDataWithoutUbigeo({
				alias, direction, ref, apto,
			});

			cy.SelectProvinceInNewDirection(provinceAndCityAndParish.provinceName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled');
			})

			cy.SelectCityInNewDirection(provinceAndCityAndParish.cityName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled');
			})

			cy.SelectParishInNewDirection(provinceAndCityAndParish.parishName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.not.have.attr('disabled');
			})

			cy.get('[data-cy="shipping"]')
				.should('contain', provinceAndCityAndParish.cost);
		})
	})
})

context('6 COSTO DE ENVÍO EN DIRECCIÓN EXISTENTE', () => {
	beforeEach(() => {
		cy.AddProductWithStock();
		cy.get('[data-cy="make-order"]').click();
		cy.login();
		cy.get('[data-cy="make-order"]').click();
		cy.SelectDeliveryHome();
		cy.NewDirection();
	})

	it('Verificar costo de envío: DIRECCIÓN EXISTENTE', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			const { fenixData: { name, cost } } = shippingCost;

			cy.get('[data-cy="address-selection"]')
				.should('exist')
				.click({ force: true });
			cy.get('.menuable__content__active')
				.should('exist');
			cy.contains(name)
				.click({ force: true });
			cy.get('[data-cy="shipping"]')
				.should('contain', cost);
		})
	})

})

context('6 COSTO DE ENVÍO NO CONFIGURADO', () => {
	beforeEach(() => {
		cy.AddProductWithStock();
		cy.get('[data-cy="make-order"]').click();
		cy.login();
		cy.get('[data-cy="make-order"]').click();
		cy.SelectDeliveryHome();
		cy.NewDirection();
	})

	it('BOTÓN PAGO: Envío no configurado no lo habilita', () => {
		cy.fixture('fenix-dev.json').then(({ shippingCost }) => {
			const { newAddress: { alias, apto, direction, ref }, noConfig } = shippingCost;

			cy.NewDirectionDataWithoutUbigeo({
				alias, direction, ref, apto,
			});

			cy.SelectProvinceInNewDirection(noConfig.provinceName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled', 'disabled');
			})

			cy.SelectCityInNewDirection(noConfig.cityName);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled', 'disabled');
			})

			cy.SelectParishInNewDirection(noConfig.parishName);
			cy.wait(1000);
			cy.get('[data-cy="go-pay"]').then(($el) => {
				expect($el).to.have.attr('disabled', 'disabled');
			})
		})
	})
})
