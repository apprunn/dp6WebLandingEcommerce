context('DETALLE DE PRODUCTO: Tipo variación', () => {
	it('Características seleccionadas', () => {
		cy.fixture('fenix-dev').then(({ products }) => {
			cy.ProductsDetailPage(products.variacion);
			cy.get('[data-cy="features-container"]')
				.should('exist')
				.children()
				.should('have.length.gte', 1)
				.eq(0)
				.find('button')
				.then(($btns) => {
					expect($btns[0]).to.have.css('color', 'rgb(255, 255, 255)');
					expect($btns[1]).to.have.css('background-color', 'rgb(255, 255, 255)');
				});
		})
	})

	it('Seleccionar segunda característica', () => {
		cy.fixture('fenix-dev').then(({ products }) => {
			cy.ProductsDetailPage(products.variacion);
			cy.get('[data-cy="features-container"]')
				.should('exist')
				.children()
				.should('have.length.gte', 0)
				.eq(0)
				.find('button')
				.eq(1)
				.should('have.css', 'background-color', 'rgb(255, 255, 255)')
				.click();

			cy.get('[data-cy="features-container"]')
				.should('exist')
				.children()
				.should('have.length.gte', 0)
				.eq(0)
				.find('button')
				.eq(1)
				.should('have.css', 'color', 'rgb(255, 255, 255)')
				.click();

			cy.get('[data-cy="features-container"]')
				.should('exist')
				.children()
				.should('have.length.gte', 0)
				.eq(0)
				.find('button')
				.eq(0)
				.should('have.css', 'background-color', 'rgb(255, 255, 255)');
		})
	})
})

context('DETALLE DE PRODUCTO: Tipo Terminado', () => {
	it('Características seleccionadas', () => {
		cy.fixture('fenix-dev').then(({ products }) => {
			cy.ProductsDetailPage(products.terminado);

			cy.get('[data-cy="product-name"]')
				.should('contain', 'mango');

			cy.get('[data-cy="product-description"]')
				.should('contain', 'Mango Dulce');

			cy.get('[data-cy="features-container"]')
				.should('exist')
				.children()
				.should('have.length.gte', 0)
				.eq(0)
				.find('button')
				.then(($btns) => {
					expect($btns[0]).to.have.css('color', 'rgb(255, 255, 255)');
					expect($btns[1]).to.have.css('background-color', 'rgb(255, 255, 255)');
				});
		})
	})

	it('Seleccionar segunda característica', () => {
		cy.fixture('fenix-dev').then(({ products }) => {
			cy.ProductsDetailPage(products.terminado);

			cy.get('[data-cy="features-container"]')
				.should('exist')
				.children()
				.should('have.length.gte', 0)
				.eq(0)
				.find('button')
				.eq(1)
				.should('have.css', 'background-color', 'rgb(255, 255, 255)')
				.click();

			cy.get('[data-cy="features-container"]')
				.should('exist')
				.children()
				.should('have.length.gte', 0)
				.eq(0)
				.find('button')
				.eq(1)
				.should('have.css', 'color', 'rgb(255, 255, 255)')
				.click();

			cy.get('[data-cy="features-container"]')
				.should('exist')
				.children()
				.should('have.length.gte', 0)
				.eq(0)
				.find('button')
				.eq(0)
				.should('have.css', 'background-color', 'rgb(255, 255, 255)');

			cy.get('[data-cy="product-name"]')
				.should('contain', 'MANGO');

			cy.get('[data-cy="product-description"]')
				.should('contain', 'TOYOTA, 2000, F150');
		})
	})
})
