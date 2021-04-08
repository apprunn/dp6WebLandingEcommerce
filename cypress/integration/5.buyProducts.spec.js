context('5.COMPRAR TRES PRODUCTOS - ENVIO A DOMICILIO', () => {
	it.only('Producto terminado, producto tipo servicio, variación y compuesto - Sin factura - Pago al recibir', () => {
		let subtotal = 0;
		let discount = 0;
		let shipping = 0;
		let total = 0;
		cy.CheckIfThereIsProductServices();
		cy.AddProductWithStock();
		cy.AddProductService();
		cy.AddProductVariation();
		cy.AddProductCompuesto();
		cy.get('[data-cy="make-order"]')
			.click();
		cy.login();
		cy.get('[data-cy="make-order"]')
			.click();
		cy.SelectDeliveryHome();
		cy.SelectAddress();
		cy.FillResponsibleForm();

		/**
		 * Obtener montos del pedido
		 */
		cy.get('[data-cy="subtotal"]')
			.should((el) => {
				[subtotal] = /[0-9]+/i.exec(el[0].innerText);
			});
		cy.get('[data-cy="discount"]')
			.should((el) => {
				const [result] = /[0-9]+/i.exec(el[0].innerText);
				discount = result || 0;
			});
		cy.get('[data-cy="shipping"]')
			.should((el) => {
				[shipping] = /[0-9]+/i.exec(el[0].innerText) || 0;
			});
		cy.get('[data-cy="total"]')
			.should((el) => {
				[total] = /[0-9]+/i.exec(el[0].innerText) || 0;
			});

		cy.get('[data-cy="go-pay"]')
			.should('exist')
			.click();

		cy.wait(2000);

		cy.get('[data-cy="Tarjeta de crédito o débito"]')
			.click();

		cy.PressMercadoPago();
		// cy.PressNiubiz();

		cy.get('[data-cy="Pago al recibir"]')
			.should('exist')
			.click();

		/**
		 * Compara montos del pedido entre pantallas
		 */
		cy.get('[data-cy="subtotal"]')
			.should((el) => {
				const [result] = /[0-9]+/i.exec(el[0].innerText);
				expect(result).to.be.equal(subtotal);
			});
		cy.get('[data-cy="discount"]')
			.should((el) => {
				const [result] = /[0-9]+/i.exec(el[0].innerText);
				expect(result).to.be.equal(discount);
			});
		cy.get('[data-cy="shipping"]')
			.should((el) => {
				const [result] = /[0-9]+/i.exec(el[0].innerText);
				expect(result).to.be.equal(shipping);
			});
		cy.get('[data-cy="total"]')
			.should((el) => {
				const [result] = /[0-9]+/i.exec(el[0].innerText);
				expect(result).to.be.equal(total);
			});
		
		// cy.wait(1000);
		cy.get('[data-cy="pay"]')
			.should('exist')
			.click();

		cy.get('[data-cy="online-payment-info"]')
			.should('not.exist');
	});
})

context('5.COMPRAR TRES PRODUCTOS - Recojo en tienda', () => {
	it('Producto terminado, producto tipo servicio y tipo variación - Recojo en tienda - Sin factura - Pago al recibir', () => {
		let subtotal = 0;
		let discount = 0;
		let shipping = 0;
		let total = 0;
		cy.CheckIfThereIsProductServices();
		cy.AddProductWithStock();
		cy.AddProductService();
		cy.AddProductVariation();
		cy.get('[data-cy="make-order"]')
			.click();
		cy.login();
		cy.get('[data-cy="make-order"]')
			.click();
		cy.SelectWarehousePickUp();
		cy.SelectWarehouse();
		cy.FillResponsibleForm();

		cy.get('[data-cy="subtotal"]')
			.should((el) => {
				[subtotal] = /[0-9]+/i.exec(el[0].innerText);
			});
		cy.get('[data-cy="discount"]')
			.should((el) => {
				const result = /[0-9]+/i.exec(el[0].innerText);
				discount = result || 0;
			});
		cy.get('[data-cy="shipping"]')
			.should((el) => {
				[shipping] = /[0-9]+/i.exec(el[0].innerText) || 0;
			});
		cy.get('[data-cy="total"]')
			.should((el) => {
				[total] = /[0-9]+/i.exec(el[0].innerText) || 0;
			});

		cy.get('[data-cy="go-pay"]')
			.should('exist')
			.click();

		cy.wait(2000);

		cy.get('[data-cy="Pago al recibir"]')
			.should('exist')
			.click();

		cy.get('[data-cy="pay"]')
			.should('exist')
			.click();

		cy.get('[data-cy="online-payment-info"]')
			.should('not.exist');
	});
})

context('5 PAGO CON YAPE', () => {
	it('Producto terminado, producto tipo servicio y tipo variación - Recojo en tienda - Sin factura', () => {
		let subtotal = 0;
		let discount = 0;
		let shipping = 0;
		let total = 0;
		let yapeData = {};

		cy.PublicService().its('body').then((res) => {
			const { settings: { billeters: { yape } } } = res;
			yapeData = yape;

			cy.CheckIfThereIsProductServices();
			cy.AddProductWithStock();
			cy.AddProductService();
			cy.AddProductVariation();
			cy.get('[data-cy="make-order"]')
				.click();
			cy.login();
			cy.get('[data-cy="make-order"]')
				.click();
			cy.SelectWarehousePickUp();
			cy.SelectWarehouse();
			cy.FillResponsibleForm();

			cy.get('[data-cy="subtotal"]')
				.should((el) => {
					[subtotal] = /[0-9]+/i.exec(el[0].innerText);
				});
			cy.get('[data-cy="discount"]')
				.should((el) => {
					const result = /[0-9]+/i.exec(el[0].innerText);
					discount = result || 0;
				});
			cy.get('[data-cy="shipping"]')
				.should((el) => {
					[shipping] = /[0-9]+/i.exec(el[0].innerText) || 0;
				});
			cy.get('[data-cy="total"]')
				.should((el) => {
					[total] = /[0-9]+/i.exec(el[0].innerText) || 0;
				});

			cy.get('[data-cy="go-pay"]')
				.should('exist')
				.click();

			cy.get('[data-cy="Banca por Internet o Deposito"]')
				.should('exist')
				.click();

			cy.wait(2000);

			cy.PressYape(yapeData.imageQR);

			cy.get('[data-cy="pay"]')
				.should('exist')
				.click();

			cy.YapeInSummary(yapeData.imageQR);

			cy.get('[data-cy="cancel-order"]')
				.click();
		});
	});
})

context('5 BANCA POR INTERNET O DEPOSITO - NO YAPE EN RESUMEN', () => {
	it('Producto terminado, producto tipo servicio y tipo variación - Recojo en tienda - Sin factura', () => {
		let subtotal = 0;
		let discount = 0;
		let shipping = 0;
		let total = 0;

		cy.CheckIfThereIsProductServices();
		cy.AddProductWithStock();
		cy.AddProductService();
		cy.AddProductVariation();
		cy.get('[data-cy="make-order"]')
			.click();
		cy.login();
		cy.get('[data-cy="make-order"]')
			.click();
		cy.SelectWarehousePickUp();
		cy.SelectWarehouse();
		cy.FillResponsibleForm();

		cy.get('[data-cy="subtotal"]')
			.should((el) => {
				[subtotal] = /[0-9]+/i.exec(el[0].innerText);
			});
		cy.get('[data-cy="discount"]')
			.should((el) => {
				const result = /[0-9]+/i.exec(el[0].innerText);
				discount = result || 0;
			});
		cy.get('[data-cy="shipping"]')
			.should((el) => {
				[shipping] = /[0-9]+/i.exec(el[0].innerText) || 0;
			});
		cy.get('[data-cy="total"]')
			.should((el) => {
				[total] = /[0-9]+/i.exec(el[0].innerText) || 0;
			});

		cy.get('[data-cy="go-pay"]')
			.should('exist')
			.click();

		cy.get('[data-cy="Banca por Internet o Deposito"]')
			.should('exist')
			.click();

		cy.wait(2000);

		cy.get('[data-cy="pay"]')
			.should('exist')
			.click();

		cy.get('[data-cy="yape-in-summary"]')
			.should('not.exist');

		cy.get('[data-cy="cancel-order"]')
			.click();
	});
})

context('¿QUIEN RECOJE EL PEDIDO? - OTRA PERSONA O YO', () => {
	it('Producto terminado, producto tipo servicio y tipo variación - Recojo en tienda - Validacion de responsable', () => {
		let subtotal = 0;
		let discount = 0;
		let shipping = 0;
		let total = 0;

		cy.CheckIfThereIsProductServices();
		cy.AddProductWithStock();
		cy.AddProductService();
		cy.AddProductVariation();
		cy.get('[data-cy="make-order"]')
			.click();
		cy.login();
		cy.get('[data-cy="make-order"]')
			.click();
		cy.SelectWarehousePickUp();
		cy.SelectWarehouse();
		cy.WhoIsResponsible();
	});
});
