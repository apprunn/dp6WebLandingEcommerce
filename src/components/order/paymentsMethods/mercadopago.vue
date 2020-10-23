<template>
	<div>
		<button
			type="button"
			class="mercado-pago-btn"
			:disabled="loading"
			@click="clickOnButton"
		>
			<img :src="img" alt="logo pagoplux">
		</button>
		<modal
			id="mercadopago-modal"
			max-width="32rem"
			v-model="showModal"
		>
			<div class="modal">
				<div class="modal-close-btn-container">
					<button
						class="modal-close-btn"
						:style="`border:1px solid ${globalColors.primary};color:${globalColors.primary}`"
						type="button"
						@click="closeModal"
					>
						&times;
					</button>
				</div>
				<form id="paymentForm" ref="paymentForm-vue">
					<h3 class="font-bold">Detalles del comprador</h3>
					<div class="mb-8">
						<div class="mb-2">
							<label class="input-label" for="email">E-mail</label>
							<input class="input-field" id="email" name="email" type="text" value="">
						</div>
						<div class="document-number">
							<div class="mb-2">
								<label class="input-label" for="docType">Tipo</label>
								<select class="input-field" id="docType" name="docType" data-checkout="docType" type="text"></select>
							</div>
							<div class="mb-2">
								<label class="input-label" for="docNumber">Número de documento</label>
								<input class="input-field" id="docNumber" name="docNumber" data-checkout="docNumber" type="text"/>
							</div>
						</div>
					</div>
					<h3 class="font-bold">Detalles de la tarjeta</h3>
					<div>
						<div class="card-owner-expi">
							<div class="mb-2">
								<label class="input-label" for="cardholderName">Titular de la tarjeta</label>
								<input class="input-field" id="cardholderName" data-checkout="cardholderName" type="text">
							</div>
							<div>
								<label class="input-label" for="">Fecha de vencimiento</label>
								<div class="card-expiration">
									<input
										class="input-field"
										type="text"
										placeholder="MM"
										id="cardExpirationMonth"
										data-checkout="cardExpirationMonth"
										onselectstart="return false" onpaste="return false"
										oncopy="return false" oncut="return false"
										ondrag="return false" ondrop="return false" autocomplete=off
									>
									<span class="date-separator">/</span>
									<input
										class="input-field"
										type="text"
										placeholder="YY"
										id="cardExpirationYear"
										data-checkout="cardExpirationYear"
										onselectstart="return false" onpaste="return false"
										oncopy="return false" oncut="return false"
										ondrag="return false" ondrop="return false" autocomplete=off>
								</div>
							</div>
						</div>
						<div class="card-data">
							<div>
								<label class="input-label" for="cardNumber">Número de la tarjeta</label>
								<input
									class="input-field"
									type="text"
									id="cardNumber"
									data-checkout="cardNumber"
									onselectstart="return false" onpaste="return false"
									oncopy="return false" oncut="return false"
									ondrag="return false" ondrop="return false" autocomplete=off>
							</div>
							<div>
								<label class="input-label" for="securityCode">Código de seguridad</label>
								<input
									class="input-field"
									id="securityCode"
									data-checkout="securityCode"
									type="text"
									onselectstart="return false"
									onpaste="return false"
									oncopy="return false"
									oncut="return false"
									ondrag="return false"
									ondrop="return false"
									autocomplete=off
								>
							</div>
						</div>
						<div class="payment-section">
							<div id="issuerInput">
								<label class="input-label" for="issuer">Banco</label>
								<select id="issuer" name="issuer" data-checkout="issuer" class="input-field"></select>
							</div>
							<div>
								<label class="input-label" for="installments">Cuotas</label>
								<select type="text" id="installments" name="installments" class="input-field"></select>
							</div>
							<div>
								<input class="input-field" type="hidden" name="transactionAmount" id="amount" v-model="amount" />
								<input class="input-field" type="hidden" name="paymentMethodId" id="paymentMethodId" />
								<input class="input-field" type="hidden" name="description" id="description" />
								<br>
								<button
									class="pay-btn"
									type="submit"
									:style="`background-color:${globalColors.primary}`"
								>Pagar</button>
								<br>
							</div>
						</div>
					</div>
				</form>
			</div>
		</modal>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import modal from '@/components/shared/modal/modal-component';
import MercadoPago from '@/class/MercadoPago';

function mounted() {
	this.mercadoPago = new MercadoPago(this);
}

function clickOnButton() {
	this.loading = true;
	this.mountMercadoPagoScrip();
}

function closeModal() {
	this.showModal = false;
	this.loading = true;
}

function mountMercadoPagoScrip() {
	const JQScript = document.createElement('script');
	JQScript.setAttribute('src', 'https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js');
	const body = document.querySelector('body');
	body.appendChild(JQScript);
	JQScript.onload = () => {
		this.checkout()
			.then(() => {
				this.showModal = true;
				this.mercadoPago.init(this.publicKey, this.hash);
				this.loading = true;
			});
	};
}

async function checkout() {
	const body = {
		orderId: this.getOrderInfo.id,
		commerceCode: process.env.COMMERCE_CODE,
		ipAddress: this.ipAddress,
	};
	const url = `payment-gateway/${this.code}/checkout`;
	const { data: res } = await this.$httpSales.post(url, body);
	this.hash = res.hash;
	this.publicKey = res.publicKey;
	this.amount = res.amount;
	this.productionEnv = res.payboxProduction;
}

function data() {
	return {
		amount: 0,
		hash: null,
		loading: false,
		mercadoPago: null,
		productionEnv: null,
		publicKey: '',
		showModal: false,
	};
}

export default {
	name: 'mercadopago',
	components: {
		modal,
	},
	computed: {
		...mapGetters([
			'getOrderInfo',
			'getResponsible',
		]),
	},
	data,
	methods: {
		checkout,
		clickOnButton,
		closeModal,
		mountMercadoPagoScrip,
	},
	mounted,
	props: {
		code: {
			required: true,
			default: String,
		},
		img: {
			required: true,
			default: String,
		},
		ipAddress: {
			required: true,
			default: String,
		},
	},
};
</script>
<style lang="scss" scoped>
.mercado-pago-btn {
	align-items: center;
	border: 1px solid #0679FB;
	display: flex;
	height: 50px;
	justify-content: center;
	margin: auto 1rem;
	padding: 0 2rem;
	transition-duration: 250ms;

	&:hover {
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		transform: scale(1.05);
	}
	&[disabled] {
		opacity: 0.3;
		cursor: not-allowed;
	}
}

.modal {
	background-color: white;
	border-radius: 5px;
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	max-height: 40rem;
	overflow: auto;
	padding: 2rem;
	max-width: 32rem;
}

.modal-close-btn-container {
	align-items: center;
	display: flex;
	justify-content: flex-end;

	.modal-close-btn {
		align-items: center;
		border-radius: 50%;
		display: flex;
		font-family: font(bold);
		font-size: size(large);
		height: 2rem;
		justify-content: center;
		width: 2rem;
	}
}
.input-label {
	color: color(dark);
}
.input-field {
	border: 1px solid color(base);
	color: color(dark);
	font-size: size(medium);
	padding: 10px;
	width: 100%;
}

.document-number {
	display: grid;
	grid-gap: 10px;

	@media (min-width: 425px) {
		grid-template-columns: 0.45fr 1fr;
	}
}
.card-data,
.card-owner-expi {
	display: grid;
	grid-gap: 10px;

	@media (min-width: 425px) {
		grid-template-columns: 0.8fr 0.45fr;
	}
}

.card-owner-expi {
	@media (min-width: 425px) {
		grid-template-columns: 0.7fr 0.45fr;
	}
}
.card-expiration {
	align-items: center;
	display: flex;
}
.date-separator {
	margin: 0 10px;
}
.pay-btn {
	color: white;
	height: 4rem;
	width: 100%;
}
.payment-section {
	align-items: flex-end;
	display: grid;
	grid-gap: 10px;

	@media (min-width: 425px) {
		grid-template-columns: 0.45fr 0.45fr 0.6fr;
	}
}
</style>