
class MercadoPago {
	constructor(context) {
		this.doSubmit = false;
		this.hash = null;
		this.$httpSales = context.$httpSales;
		this.showNotification = context.showNotification;
		this.$router = context.$router;
		this.orderId = context.getOrderInfo.id;
		this.closeModal = context.closeModal;
	}
	init(publicKey, hash) {
		this.hash = hash;
		window.Mercadopago.setPublishableKey(publicKey);
		window.Mercadopago.getIdentificationTypes();
		document.getElementById('cardNumber').addEventListener('change', this.guessPaymentMethod.bind(this));
		this.doSubmit = false;
		document.getElementById('paymentForm').addEventListener('submit', this.getCardToken.bind(this));
	}

	guessPaymentMethod() {
		MercadoPago.cleanCardInfo();
		const cardnumber = document.getElementById('cardNumber').value;
		if (cardnumber.length >= 6) {
			const bin = cardnumber.substring(0, 6);
			window.Mercadopago.getPaymentMethod({ bin }, this.setPaymentMethod.bind(this));
		}
	}

	setPaymentMethod(status, response) {
		if (status === 200) {
			const [paymentMethod] = response;
			document.getElementById('paymentMethodId').value = paymentMethod.id;
			const cardNumberInput = document.getElementById('cardNumber');
			cardNumberInput.style.backgroundImage = `url(${paymentMethod.thumbnail})`;
			cardNumberInput.style.backgroundRepeat = 'no-repeat';
			cardNumberInput.style.backgroundPositionY = 'center';
			cardNumberInput.style.backgroundPositionX = '95%';
			if (paymentMethod.additional_info_needed.includes('issuer_id')) {
				this.getIssuers.call(this, this.paymentMethod.id);
			} else {
				document.getElementById('issuerInput').classList.add('hidden');
				MercadoPago.getInstallments.call(this,
					[paymentMethod.id, document.getElementById('amount').value]);
			}
		} else {
			alert(`payment method info error: ${response}`);
		}
	}

	getIssuers(paymentMethodId) {
		window.Mercadopago.getIssuers(paymentMethodId, MercadoPago.setIssuers.bind(this));
	}

	static setIssuers(status, response) {
		if (status === 200) {
			const issuerSelect = document.getElementById('issuer');
			response.forEach((issuer) => {
				const opt = document.createElement('option');
				opt.text = issuer.name;
				opt.value = issuer.id;
				issuerSelect.appendChild(opt);
			});
			if (issuerSelect.options.length <= 1) {
				document.getElementById('issuerInput').classList.add('hidden');
			} else {
				document.getElementById('issuerInput').classList.remove('hidden');
			}
			MercadoPago.getInstallments(
				document.getElementById('paymentMethodId').value,
				document.getElementById('amount').value,
				issuerSelect.value,
			);
		} else {
			alert(`issuers method info error: ${response}`);
		}
	}

	static getInstallments(paymentMethodId, amount, issuerId) {
		window.Mercadopago.getInstallments({
			payment_method_id: paymentMethodId,
			amount: parseFloat(amount),
			issuer_id: issuerId ? parseInt(issuerId, 10) : undefined,
		}, MercadoPago.setInstallments);
	}

	static setInstallments(status, response) {
		if (status === 200) {
			document.getElementById('installments').options.length = 0;
			response[0].payer_costs.forEach((payerCost) => {
				const opt = document.createElement('option');
				opt.text = payerCost.recommended_message;
				opt.value = payerCost.installments;
				document.getElementById('installments').appendChild(opt);
			});
		} else {
			alert(`installments method info error: ${response}`);
		}
	}

	static cleanCardInfo() {
		document.getElementById('cardNumber').style.backgroundImage = '';
		document.getElementById('issuerInput').classList.add('hidden');
		document.getElementById('issuer').options.length = 0;
		document.getElementById('installments').options.length = 0;
	}

	getCardToken(event) {
		event.preventDefault();
		if (!this.doSubmit) {
			const $form = document.getElementById('paymentForm');
			window.Mercadopago.createToken($form, this.setCardTokenAndPay.bind(this));
		}
	}

	setCardTokenAndPay(status, response) {
		if (status === 200 || status === 201) {
			const form = document.getElementById('paymentForm');
			this.doSubmit = true;
			this.pay.call(this, form, response.id);
		} else {
			const { cause } = response;
			if (cause.find(c => c.code === 'E302')) {
				this.showNotification('Código de seguridad inválido', 'error', null, false, 100000);
			} else if (cause.find(c => c.code === '205')) {
				this.showNotification('Debe introducir un número de tarjeta', 'error', null, false, 100000);
			} else if (cause.find(c => c.code === '208' || c.code === '209')) {
				this.showNotification('Debe introducir un tiempo de expiración', 'error', null, false, 100000);
			} else if (cause.find(c => c.code === '221')) {
				this.showNotification('El titular de la tarjeta es requerido', 'error', null, false, 100000);
			} else if (cause.find(c => c.code === '214')) {
				this.showNotification('El número de documento es requerido', 'error', null, false, 100000);
			} else if (cause.find(c => c.code === '324')) {
				this.showNotification('El número de documento es inválido', 'error', null, false, 100000);
			} else if (cause.find(c => c.code === '325') || cause.find(c => c.code === '326')) {
				this.showNotification('La fecha de vencimiento es inválido', 'error', null, false, 100000);
			} else if (cause.find(c => c.code === 'E302')) {
				this.showNotification('El número de tarjeta es inválido', 'error', null, false, 100000);
			} else {
				this.showNotification('Complete los datos en el formulario', 'error', null, false, 100000);
			}
		}
	}

	async pay(form, token) {
		const transactionAmount = Number(form.transactionAmount.value);
		const description = form.description.value;
		const installments = form.installments.value;
		const paymentMethodId = form.paymentMethodId.value;
		const issuer = form.issuer.value;
		const email = form.email.value;
		const docType = form.docType.value;
		const docNumber = form.docNumber.value;
		const body = {
			hash: this.hash,
			gatewayResponse: {
				action: 'authorize',
				transactionAmount,
				token,
				description,
				installments,
				paymentMethodId,
				issuer,
				email,
				docType,
				docNumber,
				uri: '',
			},
		};
		try {
			await this.$httpSales.post('payment-gateway/validation', body);
			this.$router.push({ name: 'buy-summary', params: { orderId: this.orderId } });
		} catch (err) {
			const message = err.data.paymentGateway ? err.data.paymentGateway.statusDetailsMessage : 'Ups, ocurrió algún problema';
			this.closeModal();
			this.showNotification(message, 'error', null, false, 300000);
		}
	}
}

export default MercadoPago;
