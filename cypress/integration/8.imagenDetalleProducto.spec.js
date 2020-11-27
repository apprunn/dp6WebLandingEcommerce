context('DETALLE DE PRODUCTO: Imagen', () => {
	it('Producto tipo Terminado', () => {
		let parentUrl = null;
		cy.fixture('fenix-dev').then(({ products }) => {
			cy.ProductsDetailPage(products.terminado)
				.its('body').then((res) => {
					parentUrl = res.urlImage;
				});
			cy.ProductsChildren(products.terminado);
			cy.get('[data-cy="presentation-img"]')
				.eq(0)
				.should('exist')
				.find('img')
				.then(($img) => {
					expect($img).to.have.attr('src', parentUrl);
				});
			cy.get('[data-cy="add-to-cart"]')
				.should('exist')
				.click();
			cy.get('[data-cy="modal-add-to-cart-img"]')
				.should('exist')
				.then(($img) => {
					expect($img).to.have.attr('src', parentUrl);
				})
		})
	});

	it('Producto tipo variación', () => {
		let parentUrl = null;
		cy.fixture('fenix-dev').then(({ products }) => {
			cy.ProductsDetailPage(products.variacion)
			cy.ProductsChildren(products.variacion)
				.its('body').then((res) => {
					const [firstProduct] = res;
					const firstImg = firstProduct.images.find(i => i.order === 1);
					parentUrl = firstImg.urlImage;
				});
			cy.get('[data-swiper-slide-index="0"]')
				.should('exist')
				.find('img')
				.then(($img) => {
					expect($img).to.have.attr('src', parentUrl);
				});
			cy.get('[data-cy="add-to-cart"]')
				.should('exist')
				.click();
			cy.get('[data-cy="modal-add-to-cart-img"]')
				.should('exist')
				.then(($img) => {
					expect($img).to.have.attr('src', parentUrl);
				})
		})
	})
})
