/// <reference types="cypress" />

context('BOTÓN TIENDAS DISPONIBLES EN DETALLE DE PRODUCTO', () => {
	it('Se muestra para productos Terminados', () => {
		cy.fixture('fenix-dev.json').then(({ products }) => {
			cy.ProductsDetailPage(products.lowStock); // servicio prueba
			cy.get('[data-cy="see-available-warehouse"]')
				.should('exist')
				.click();
			cy.get('.v-dialog__content--active')
				.should('exist')
				.contains('Disponibilidad');
		})
	});

	it('Oculto para productos tipo servicio', () => {
		cy.fixture('fenix-dev.json').then(({ products }) => {
			cy.ProductsDetailPage(products.service); // servicio prueba
			cy.get('[data-cy="see-available-warehouse"]')
				.should('not.exist');
			cy.get('.v-dialog__content--active')
				.should('not.exist');
		})
	});
})