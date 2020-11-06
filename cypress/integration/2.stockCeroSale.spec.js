/// <reference types="cypress" />

context('PRODUCTO TIPO SERVICIO AL CARRITO DE COMPRAS', () => {
	it('Producto servicio sin stock al carrito de compras', () => {
		cy.AddProductService();
	});
})