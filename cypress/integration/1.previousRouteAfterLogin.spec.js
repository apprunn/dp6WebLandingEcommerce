/// <reference types="cypress" />

context('REGRESAR A PANTALLA PREVIA AL INICIO DE SESIÓN', () => {
	it('Iniciar sesión desde detalle de producto y regresar', () => {
		cy.visit('localhost:9010');
		let route = null;
		cy.SelectRandomProduct();
		cy.location('pathname').then((pathname) => {
			route = pathname;
			cy.login();
			cy.wait(1500);
			cy.location('pathname').then((path) => {
				expect(path).to.equal(route);
			})
		})
	});
	
	it('Iniciar sesión desde Categoría y regresar', () => {
		cy.visit('localhost:9010');
		let route = null;
		cy.SelectFirstCategory();
		cy.wait(500);
		cy.location('pathname').then((pathname) => {
			route = pathname;
			cy.login();
			cy.wait(1500);
			cy.location('pathname').then((path) => {
				expect(path).to.equal(route);
			})
		})
	});
})