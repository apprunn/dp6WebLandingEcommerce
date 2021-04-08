/// <reference types="cypress" />

context('1 PRODUCTO TERMINADO SIN STOCK NO VA AL CARRITO DE COMPRAS', () => {
	it('Producto terminado sin stock no va a carrito de compras', () => {
		cy.AddProductFinishedWithOutStock();
	});
	it('Producto compuesto sin stock no va a carrito de compras', () => {
		cy.AddProductCompositeWithOutStock();
	});
	it('Producto variacion sin stock no va a carrito de compras', () => {
		cy.AddProductVariationWithOutStock();
	});
})
