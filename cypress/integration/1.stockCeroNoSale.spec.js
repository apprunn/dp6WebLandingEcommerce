/// <reference types="cypress" />

context('1 PRODUCTO TERMINADO SIN STOCK NO VA AL CARRITO DE COMPRAS', () => {
	it('Producto terminado sin stock no va a carrito de compras', () => {
		cy.AddProductWithOutStock();
	});
})