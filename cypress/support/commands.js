// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('login', () => {
	cy.fixture('fenix-dev.json').then(({ email, password }) => {
		cy.get('[data-cy="loginBtn"]')
			.should('exist')
			.find('.icon-desktop')
			.click({ force: true, multiple: true });
		cy.get('[data-cy="appButtonLogin"]')
			.should('exist')
			.click({ force: true });
		cy.get('[data-cy="inputEmail"]')
			.should('exist')
			.type(email);
		cy.get('[data-cy="inputPassword"]')
			.should('exist')
			.type(password);
		cy.get('[data-cy="loginBtnAction"]')
			.should('exist')
			.click();
	});
});

Cypress.Commands.add('SelectRandomProduct', () => {
	cy.visit('localhost:9010');
	cy.get('[data-cy="productsSection"]')
		.should('exist')
		.its('length')
		.should('be.gt', 0);
	const random = Math.floor(Math.random() * 10);
	cy.get('[data-cy="productsSection"]')
		.should('exist')
		.children()
		.eq(random)
		.click();
});

Cypress.Commands.add('ProductsDetailPage', (productId) => {
	cy.fixture('fenix-dev.json').then(({ token }) => {
		cy.visit(`http://localhost:9010/${productId}/detalle-producto`);
		cy.request({
			method: 'get',
			url: `https://products2.perudatos.com/products-public/${productId}`,
			headers: {
				Authorization: token,
			},
		}).as('ProductDetail');
	});
})

Cypress.Commands.add('AddProductWithStock', () => {
	cy.fixture('fenix-dev.json').then(({ products }) => {
		cy.ProductsDetailPage(products.terminado); // mango
		cy.get('@ProductDetail').its('body').then(() => {
			cy.get('[data-cy="add-to-cart"]')
				.should('exist')
				.click({ force: true });
			cy.get('[data-cy="go-to-cart"]')
				.should('exist')
				.click();
		});
	});
});

Cypress.Commands.add('AddProductWithOutStock', () => {
	cy.fixture('fenix-dev.json').then(({ products }) => {
		cy.ProductsDetailPage(products.noStock); // sun7 producto sin stock
		cy.get('@ProductDetail').its('body').then((res) => {
			const { stockWarehouse } = res;
			expect(stockWarehouse).to.be.eq(0);
		});
		cy.get('[data-cy="add-to-cart"]')
			.should('exist')
			.click({ force: true });
		cy.get('[data-cy="go-to-cart"]')
			.should('not.exist');
	});
});

Cypress.Commands.add('AddProductService', () => {
	cy.fixture('fenix-dev.json').then(({ products }) => {
		cy.ProductsDetailPage(products.service); // servicio prueba
		cy.get('@ProductDetail').its('body').then((res) => {
			const { type, typeInfo } = res;
			expect(type).to.equal(2);
			expect(typeInfo.code).to.equal('servicios');
			cy.get('[data-cy="add-to-cart"]')
				.should('exist')
				.click({ force: true });
			cy.get('[data-cy="go-to-cart"]')
				.should('exist')
				.click();
		});
	})
})

Cypress.Commands.add('FillResponsibleForm', () => {
	cy.fixture('fenix-dev.json').then(({ responsible }) => {
		const { name, lastname, phone, email, dni } = responsible;
		cy.get('[data-cy="responsible-name"]').clear().type(name);
		cy.get('[data-cy="responsible-lastname"]').clear().type(lastname);
		cy.get('[data-cy="responsible-dni"]').clear().type(dni);
		cy.get('[data-cy="responsible-phone"]').clear().type(phone);
		cy.get('[data-cy="responsible-email"]').clear().type(email);
	});
})

Cypress.Commands.add('SelectAddress', () => {
	cy.get('[data-cy="address-selection"]')
		.should('exist')
		.click({ force: true });
	cy.get('.menuable__content__active')
		.children()
		.children()
		.contains('papa')
		.click();
})

Cypress.Commands.add('SelectDeliveryHome', () => {
	cy.get('[data-cy="delivery-buttons"]')
		.contains('Envío a Domicilio')
		.click({ force: true });
})

Cypress.Commands.add('CheckIfThereIsProductServices', () => {
	cy.fixture('fenix-dev.json').then(({ token }) => {
		cy.visit('http://localhost:9010');
		cy.request({
			method: 'get',
			url: 'https://products2.perudatos.com/products-public?flagGrouper=2',
			headers: {
				Authorization: token,
			},
		}).as('Products');
		cy.get('@Products').its('body').then((res) => {
			res.forEach((p) => {
				if (p.type === 2) {
					expect(p.typeInfo.code).to.equal('servicios');
				}
			});
		})
	});	
});

Cypress.Commands.add('SelectFirstCategory', () => {
	cy.get('[data-cy="categories-home"]')
		.should('exist')
		.children()
		.children()
		.eq(0)
		.children()
		.eq(0)
		.click();
})
