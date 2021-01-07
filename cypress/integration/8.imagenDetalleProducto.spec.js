context('8 DETALLE DE PRODUCTO: Imagen', () => {
	it('Producto tipo Terminado', () => {
		let parentUrl = null;
		cy.fixture('fenix-dev').then(({ products }) => {
			cy.ProductsDetailPage(products.terminado)
				.its('body').then((res) => {
					parentUrl = res.urlImage;
					cy.ProductsChildren(products.terminado)
					cy.PresentationImage('[data-cy="presentation-img"]', parentUrl);
					cy.AddToCart();
					cy.ImgInAddToCartModal(parentUrl);
				});
		})
	});

	it('Producto tipo variación', () => {
		let parentUrl = null;
		cy.fixture('fenix-dev').then(({ products }) => {
			cy.ProductsDetailPage(products.variacion);
			cy.ProductsChildren(products.variacion)
				.its('body').then((res) => {
					const [firstProduct] = res;
					const firstImg = firstProduct.images.find(i => i.order === 1);
					parentUrl = firstImg.urlImage;
					cy.PresentationImage('[data-swiper-slide-index="0"]', parentUrl);
					cy.AddToCart();
					cy.ImgInAddToCartModal(parentUrl);
				});
		})
	})
})
