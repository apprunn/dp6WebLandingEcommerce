/// <reference types="cypress" />

context('VERIFICAR CANTIDAD Y STOCK DISPONIBLE', () => {
	/**
	 * Probar que ningun producto vaya al carrito de compras con cantidad CERO
	 */
	it('La cantidad no puede ser CERO en detalle de producto', () => {
		cy.SelectRandomProduct();
		cy.location('pathname').then((pathname) => {
			const splitted = pathname.split('/');
			const slug = splitted[1];
			cy.visit(`http://localhost:9010/${slug}/detalle-producto`);
			cy.get('[data-cy="less-quantity"]')
				.should('exist')
				.click();
			cy.get('[data-cy="quantity-to-buy"]').should('contain', 1);
		});
	});
	/**
	 * Agrego dos veces el mismo producto. La primera vez con cantidad igual al stock y
	 * la segunda vez con cantidad 2. La cantidad a mostrar en el carrito de compras
	 * debe ser la del stock
	 */
	it.only('Verificar que la cantidad no supere Stock en producto terminado', () => {
		cy.fixture('fenix-dev.json').then(({ products }) => {
			cy.ProductsDetailPage(products.lowStock);
			cy.get('@ProductDetail').its('body').then((res) => {
				const { stockWarehouse, stock } = res;
				const finalStock = stockWarehouse || stock;
				expect(finalStock).to.be.gt(0);
				if (finalStock) {
					for (let i = 0; i <= finalStock + 1; i += 1) {
						cy.get('[data-cy="more-quantity"]')
							.should('exist')
							.click({ force: true });
					}
				}
				cy.get('[data-cy="quantity-to-buy"]').then(($q) => {
					expect($q).to.be.equal(finalStock);
				})
			});
			cy.get('[data-cy="add-to-cart"]')
				.should('exist')
				.click({ force: true });
			cy.get('[data-cy="go-to-cart"]')
				.should('exist')
				.click({ force: true });

			let stockWarehouse = null;
			cy.ProductsDetailPage(products.lowStock);
			cy.get('@ProductDetail').its('body').then((res) => {
				stockWarehouse = res.stockWarehouse || res.stock;
				cy.get('[data-cy="more-quantity"]')
					.should('exist')
					.click()
					.click();
				cy.get('[data-cy="add-to-cart"]')
					.should('exist')
					.click({ force: true });
				cy.get('[data-cy="go-to-cart"]')
					.should('exist')
					.click({ force: true });
				cy.get('[data-cy="product-in-car"]')
					.eq(0)
					.find('[data-cy="quantity-to-buy"]')
					.contains(stockWarehouse);
			});
		});
	});

	/**
	 * Agregar al carrito de compras un producto tipo servicio con
	 * cantidad aleatoria.
	 */
	it('Agregar cualquier cantidad de producto tipo servicio', () => {
		cy.fixture('fenix-dev.json').then(({ products }) => {
			cy.ProductsDetailPage(products.service); // servicio prueba
			cy.get('@ProductDetail').its('body').then((res) => {
				const { type } = res;
				expect(type).to.be.equal(2);
				const random = Math.floor((Math.random() * 10) + 1);
				for (let i = 1; i <= random; i += 1) {
					cy.get('[data-cy="more-quantity"]')
						.should('exist')
						.click();
				}
				cy.get('[data-cy="quantity-to-buy"]').should('contain', random + 1);
				cy.get('[data-cy="add-to-cart"]')
					.should('exist')
					.click({ force: true });
				cy.get('[data-cy="go-to-cart"]')
					.should('exist')
					.click({ force: true });
			});
		});
	});
});
