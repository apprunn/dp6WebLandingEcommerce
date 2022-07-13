
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
	let productsLength = 0;
	cy.visit('localhost:9010');
	cy.get('[data-cy="productsSection"]')
		.should('exist')
		.should('have.length.gte', 1);
	cy.get('[data-cy="productsSection"]')
		.should('exist')
		.children().then(($prod) => {
			productsLength = $prod.length;

			const random = Math.floor(Math.random() * productsLength);
			cy.get('[data-cy="productsSection"]')
				.should('exist')
				.children()
				.eq(random)
				.click();
		})
});

Cypress.Commands.add('ProductsDetailPage', (productId) => {
	cy.fixture('fenix-dev.json').then(({ token }) => {
		cy.visit(`http://localhost:9010/${productId}/detalle-producto`);
		cy.request({
			method: 'get',
			url: `https://products2.perudatos.com//${productId}`,
			headers: {
				Authorization: token,
			},
		}).as('ProductDetail');
	});
})

Cypress.Commands.add('PublicService', () => {
	cy.fixture('fenix-dev.json').then(({ commerceCode, token }) => {
		cy.request({
			method: 'get',
			url: `https://sales.perudatos.com/com-ecommerce-companies/${commerceCode}/public`,
			headers: {
				Authorization: token,
			},
		}).as('Public');
	});
})

Cypress.Commands.add('ProductsChildren', (productId) => {
	cy.fixture('fenix-dev.json').then(({ token }) => {
		cy.visit(`http://localhost:9010/${productId}/detalle-producto`);
		cy.request({
			method: 'get',
			url: `https://products2.perudatos.com/products-public/${productId}/children`,
			headers: {
				Authorization: token,
			},
		}).as('ProductChildren');
	});
})

Cypress.Commands.add('AddProductWithStock', () => {
	cy.fixture('fenix-dev.json').then(({ products }) => {
		cy.ProductsDetailPage(products.terminado);
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

Cypress.Commands.add('AddProductFinishedWithOutStock', () => {
	cy.fixture('fenix-dev.json').then(({ products }) => {
		cy.ProductsDetailPage(products.noStockFinishedProduct); // sun7 producto sin stock
		cy.get('@ProductDetail').its('body').then((res) => {
			const { stock, typeInfo: { code } } = res;
			expect(code).to.be.eq('productos-terminados');
			expect(stock).to.be.eq(0);
		});
		cy.get('[data-cy="add-to-cart"]')
			.should('exist')
			.click({ force: true });
		cy.get('[data-cy="go-to-cart"]')
			.should('not.exist');
	});
});

Cypress.Commands.add('AddProductCompositeWithOutStock', () => {
	cy.fixture('fenix-dev.json').then(({ products }) => {
		cy.ProductsDetailPage(products.noStockComposedProduct);
		cy.get('@ProductDetail').its('body').then((res) => {
			const { stockComposite, typeInfo: { code } } = res;
			expect(code).to.be.eq('composed');
			expect(stockComposite).to.be.eq(0);
		});
		cy.get('[data-cy="add-to-cart"]')
			.should('exist')
			.click({ force: true });
		cy.get('[data-cy="go-to-cart"]')
			.should('not.exist');
	});
});

Cypress.Commands.add('AddProductVariationWithOutStock', () => {
	cy.fixture('fenix-dev.json').then(({ products }) => {
		cy.ProductsDetailPage(products.noStockVariationProduct);
		cy.get('@ProductDetail').its('body').then((res) => {
			const { stockVirtual, typeInfo: { code } } = res;
			expect(code).to.be.eq('variantes');
			expect(stockVirtual).to.be.eq(0);
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
		cy.ProductsDetailPage(products.service);
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

Cypress.Commands.add('AddProductVariation', () => {
	cy.fixture('fenix-dev.json').then(({ products }) => {
		cy.ProductsDetailPage(products.variacion);
		cy.get('@ProductDetail').its('body').then((res) => {
			const { type, typeInfo } = res;
			expect(type).to.equal(5);
			expect(typeInfo.code).to.equal('variantes');
			cy.get('[data-cy="add-to-cart"]')
				.should('exist')
				.click({ force: true });
			cy.get('[data-cy="go-to-cart"]')
				.should('exist')
				.click();
		});
	})
})

Cypress.Commands.add('AddProductCompuesto', () => {
	cy.fixture('fenix-dev.json').then(({ products }) => {
		cy.ProductsDetailPage(products.compuesto);
		cy.get('@ProductDetail').its('body').then((res) => {
			const { type, typeInfo } = res;
			expect(type).to.equal(6);
			expect(typeInfo.code).to.equal('composed');
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
	cy.fixture('fenix-dev').then(({ delivery }) => {
		cy.get('[data-cy="address-selection"]')
			.should('exist')
			.click({ force: true });
		cy.get('.menuable__content__active')
			.children()
			.children()
			.contains(delivery.name)
			.click();
	})
})

Cypress.Commands.add('SelectWarehouse', () => {
	cy.fixture('fenix-dev').then(({ warehouse }) => {
		cy.get('[data-cy="address-selection"]')
			.should('exist')
			.click({ force: true });
		cy.get('.menuable__content__active')
			.children()
			.children()
			.contains(warehouse.name)
			.click();
	})
})

Cypress.Commands.add('SelectDeliveryHome', () => {
	cy.get('[data-cy="delivery-buttons"]')
		.click({ force: true });
})

Cypress.Commands.add('NewDirection', () => {
	cy.get('[data-cy="address-selection"]')
		.click({ force: true });
	cy.get('.menuable__content__active')
		.should('exist');
	cy.contains('Nueva dirección')
		.click({ force: true });
})

Cypress.Commands.add('SelectWarehousePickUp', () => {
	cy.get('[data-cy="delivery-buttons"]')
		.contains('Recoger en Tienda')
		.click({ force: true });
})

Cypress.Commands.add('CheckIfThereIsProductServices', () => {
	cy.fixture('fenix-dev.json').then(({ token }) => {
		cy.visit('http://localhost:9010');
		cy.request({
			method: 'get',
			url: 'https://products2.perudatos.com/products-public?flagGrouper=1&limit=20&page=1',
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

Cypress.Commands.add('SelectProvinceInNewDirection', (provinceName) => {
	cy.get('[data-cy="province"]')
		.should('exist')
		.click({ force: true });
	cy.get('.menuable__content__active')
		.should('exist');
	cy.contains(provinceName)
		.click();
})

Cypress.Commands.add('SelectCityInNewDirection', (cityName) => {
	cy.get('[data-cy="city"]')
		.should('exist')
		.click({ force: true });
	cy.get('.menuable__content__active')
		.should('exist');
	cy.contains(cityName)
		.click({ force: true });
})

Cypress.Commands.add('SelectParishInNewDirection', (parishName) => {
	cy.get('[data-cy="city"]')
		.should('exist')
		.click({ force: true });
	cy.get('.menuable__content__active')
		.should('exist');
	cy.contains(parishName)
		.click({ force: true });
})

Cypress.Commands.add('AddToCart', () => {
	cy.get('[data-cy="add-to-cart"]')
		.should('exist')
		.click();
})

Cypress.Commands.add('ImgInAddToCartModal', (parentUrl) => {
	cy.get('[data-cy="modal-add-to-cart-img"]')
		.should('exist')
		.then(($img) => {
			expect($img).to.have.attr('src', parentUrl);
		})
})

Cypress.Commands.add('PresentationImage', (selector, parentUrl) => {
	cy.get(selector)
		.eq(0)
		.should('exist')
		.find('img')
		.then(($img) => {
			expect($img).to.have.attr('src', parentUrl);
		});
})

Cypress.Commands.add('PressNiubiz', () => {
	cy.get('[data-cy="niubiz-check"]')
		.should('exist')
		.click({ multiple: true, force: true });
	cy.get('[data-cy="niubiz-btn"]')
		.should('exist')
		.click();
})

Cypress.Commands.add('PressMercadoPago', () => {
	cy.get('[data-cy="mercadopago-btn"]')
		.should('exist')
		.click({ multiple: true, force: true });
})

Cypress.Commands.add('PressYape', (urlImage) => {
	cy.get('[data-cy="yape-qr-container"]')
		.should('exist')
		.should('have.class', 'yape-modal-container')
		.should('not.have.class', 'active');

	cy.get('[data-cy="yape-button"]')
		.should('exist')
		.click();

	cy.get('[data-cy="yape-qr-container"]')
		.should('exist')
		.should('have.class', 'active')
		.children()
		.should('have.length', 2)
		.find('img').then(($el) => {
			expect($el).to.have.attr('src', urlImage);
		});
})

Cypress.Commands.add('YapeInSummary', (urlImage) => {
	cy.wait(1000);
	cy.get('[data-cy="yape-in-summary"]')
		.should('exist')
		.should('have.class', 'yape-logo-message')
		.children()
		.should('have.length', 3);

	cy.get('[data-cy="yape-qr-container"]')
		.should('exist')
		.should('have.class', 'active')
		.children()
		.should('have.length', 2)
		.find('img').then(($el) => {
			expect($el).to.have.attr('src', urlImage);
		});
})

Cypress.Commands.add('NewDirectionDataWithoutUbigeo', ({ alias, direction, ref, apto }) => {
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
})

Cypress.Commands.add('WhoIsResponsible', () => {
	cy.fixture('fenix-dev.json').then(({ responsible }) => {
		// Verificar estilos de los botones
		cy.get('[data-cy="me-responsible"]')
			.should(($btn) => {
				expect($btn).to.have.attr('style', 'background-color: rgb(44, 64, 74); border: 1px solid rgb(44, 64, 74); color: white;');
			});

		cy.get('[data-cy="other-responsible"]')
			.should(($btn) => {
				expect($btn).to.have.attr('style', 'background-color: white; border: 1px solid rgb(44, 64, 74); color: rgb(44, 64, 74);');
			});

		// Verificar que el campo Name tenga el nombre del usuario
		cy.get('[data-cy="responsible-name"]')
			.should(($input) => {
				expect($input).to.have.value(responsible.name);
			});

		// Cambiar a Otro Recogera
		cy.get('[data-cy="other-responsible"]')
			.click();

		// Verificar estilos de los botones
		cy.get('[data-cy="me-responsible"]')
			.should(($btn) => {
				expect($btn).to.have.attr('style', 'background-color: white; border: 1px solid rgb(44, 64, 74); color: rgb(44, 64, 74);');
			});

		cy.get('[data-cy="other-responsible"]')
			.should(($btn) => {
				expect($btn).to.have.attr('style', 'background-color: rgb(44, 64, 74); border: 1px solid rgb(44, 64, 74); color: white;');
			});

		// Verificar que el formulario del responsable este vacio
		cy.get('[data-cy="responsible-name"]')
			.should('contain', '');
		cy.get('[data-cy="responsible-lastname"]')
			.should('contain', '');
		cy.get('[data-cy="responsible-dni"]')
			.should('contain', '');
		cy.get('[data-cy="responsible-phone"]')
			.should('contain', '');

		// Cambiar a Yo Recogere
		cy.get('[data-cy="me-responsible"]')
			.click();

		// Verificar que el campo Name tenga el nombre del usuario
		cy.get('[data-cy="responsible-name"]')
			.should(($input) => {
				expect($input).to.have.value(responsible.name);
			});
		cy.get('[data-cy="responsible-lastname"]')
			.should(($input) => {
				expect($input).to.have.value(responsible.lastname);
			});
	})
})
