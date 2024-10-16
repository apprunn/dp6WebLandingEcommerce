<template>
	<div>
		<div class="conditions">
			<v-checkbox data-cy="niubiz-check" class="check" v-model="checkbox">
			</v-checkbox>
			<span
				>Acepto los
				<button type="button" @click="conditionsAndTermsLink">
					términos y condiciones
				</button></span
			>
		</div>
		<button
			type="button"
			data-cy="niubiz-btn"
			class="niubiz-btn"
			style="padding:1rem"
			:disabled="!checkbox"
			@click="checkout"
		>
			<img :src="img" alt="logo_Niubiz" />
		</button>
		<form id="visa-payment" :action="redirect" method="post"></form>
		<v-dialog max-width="425" v-model="dialog" persistent>
			<open-pay-form
				:is-loading="isLoading"
				:response="response"
				@close="openDialog"
				@save-payment="savePayment"
			/>
		</v-dialog>
	</div>
</template>
<script>
import OpenPayForm from '@/components/order/paymentsMethods/open-pay-form';
import { mapGetters, mapState } from 'vuex';

function orderTotal() {
	return this.getTotalToBuy + this.getShippingCost;
}

async function checkout() {
	try {
		const body = {
			orderId: this.getOrderId,
			commerceCode: process.env.COMMERCE_CODE,
			ipAddress: this.ipAddress,
		};
		const url = 'payment-gateway/openpay/checkout';
		const { data: res } = await this.$httpSales.post(url, body);
		this.hash = res.hash;
		this.currency = res.curency;
		this.amount = res.amount;
		this.response = res;
		this.openDialog();
	} catch (error) {
		this.showNotification('Error. La transacción no se completó.', 'error');
	}
}

function redirect() {
	const orderId = `orderId=${this.getOrderId}`;
	const successUri = 'uri=resumen-de-mi-pedido';
	const errorUri = `errorUri=carrito-de-compras/pago/${this.getOrderId}`;
	return `${this.apiSales}/payment-gateway/validation?${orderId}&${successUri}&${errorUri}`;
}

function conditionsAndTermsLink() {
	const findIt = this.help.find((h) => {
		const name = this.normalize(h.name);
		return name === 'terminos y condiciones';
	});
	const [item] = findIt.section;
	const link = findIt;
	const newItem = item.name.split(' ').join('-');
	const newLink = link.name.split(' ').join('-');
	this.$router.push(`/ayuda/apartado/${newItem}/seccion/${newLink}`);
}

function normalize(str) {
	return str
		.toLowerCase()
		.normalize('NFD')
		.replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
		.normalize();
}

function data() {
	return {
		amount: 0,
		dialog: false,
		apiSales: process.env.SALES_URL,
		companyLogo: process.env.COMPANY_LOGO,
		checkbox: false,
		currency: 'PEN',
		dev: 'https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true',
		expirationTime: null,
		isLoading: false,
		merchantId: '',
		hash: false,
		prod: 'https://static-content.vnforapps.com/v2/js/checkout.js',
		sessionKey: null,
		totalAmount: null,
		response: null,
	};
}

export default {
	name: 'niubiz',
	components: {
		OpenPayForm,
	},
	computed: {
		...mapGetters([
			'getOrderId',
			'getShippingCost',
			'getTotalToBuy',
			'token',
			'getCommerceData',
		]),
		...mapState({
			help: state => state.commerce.helperCenter,
		}),
		orderTotal,
		redirect,
	},
	data,
	methods: {
		checkout,
		conditionsAndTermsLink,
		normalize,
		openDialog() {
			this.dialog = !this.dialog;
		},
		async savePayment(token, deviceSessionId) {
			this.isLoading = true;
			// const successUri = 'uri=resumen-de-mi-pedido';
			// const errorUri = `errorUri=carrito-de-compras/pago/${this.getOrderId}`;
			const orderId = this.getOrderId;
			try {
				const body = {
					hash: this.hash,
					gatewayResponse: {
						amount: this.amount,
						currency: this.currency,
						description: 'Pago por servicio OpenPay',
						method: 'card',
						order_id: this.getOrderId,
						device_session_id: deviceSessionId,
						source_id: token,
					},
				};
				const url = 'payment-gateway/validation';
				// const fullUrl = `${url}?${successUri}&${errorUri}`;
				const response = await this.$httpSales.patch(url, body);
				if (response.data.paymentGateway.status === 'Aprobado') {
					this.$router.push({ name: 'buy-summary', params: { orderId } });
				}
				this.openDialog();
			} catch (error) {
				this.showNotification('Error. La transacción no se completó.', 'error');
			} finally {
				this.isLoading = false;
			}
		},
	},
	props: {
		img: {
			required: true,
			type: String,
		},
		ipAddress: {
			required: true,
			type: String,
		},
	},
};
</script>
<style lang="scss" scoped>
.start-js-btn.modal-opener.default {
	background: url('/static/img/icons/icon-visanet.png') !important;
}

#visa-payment {
	width: 656px;

	@media (max-width: 768px) {
		width: auto;
	}
}

.niubiz-btn {
	border: 1px solid black;
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

.conditions {
	align-items: center;
	display: flex;

	.check {
		margin-right: 1rem;
		max-width: 2rem;
	}

	button {
		color: color(terciary);
		text-decoration: underline;
	}
}
</style>
