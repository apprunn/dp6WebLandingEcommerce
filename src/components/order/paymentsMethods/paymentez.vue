<template>
	<div>
		<button class="js-paymentez-checkout" @click="openPaymentezModal">
			<img src="https://developers.paymentez.com/wp-content/uploads/2017/10/logo.png" alt="logo de paymentez">
		</button>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import orderStatesEnum from '@/shared/enums/orderStateId';

function openPaymentezModal() {
	this.checkout()
		.then((res) => {
			this.hash = res.data.hash;
			/* eslint-disable new-cap */
			const paymentezCheckout = new window.PaymentezCheckout.modal({
				client_app_code: res.data.clientAppCode,
				client_app_key: res.data.clientAppKey,
				locale: 'es',
				env_mode: res.data.payboxProduction ? 'prod' : 'stg',
				onOpen: () => console.log('open Modal Paymentez'),
				onClose: () => console.log('close Modal Paymentez'),
				onResponse: this.onCreditCardResponse,
			});
			const orderValues = {
				user_id: String(res.data.userId),
				user_email: res.data.userEmail,
				user_phone: res.data.userPhone || '0000000000',
				order_description: res.data.orderDescription,
				order_amount: Number(res.data.orderAmount.toFixed(2)),
				order_vat: Number(res.data.orderVat),
				order_reference: String(res.data.orderReference),
				order_taxable_amount: Number(res.data.taxableAmount),
				order_tax_percentage: res.data.taxPercentage,
			};
			paymentezCheckout.open(orderValues);
		})
		.catch((error) => {
			this.showNotification(
				'Ocurrió un error en el checkout de Paymentez. Recargue e intente de nuevo',
				'error',
			);
			console.log(error);
		});
}

async function checkout() {
	const url = 'payment-gateway/paymentez/checkout';
	const body = {
		orderId: this.getOrderInfo.id,
		commerceCode: process.env.COMMERCE_CODE,
		ipAddress: this.ipAddress,
	};
	return this.$httpSales.post(url, body);
}

async function onCreditCardResponse(response) {
	this.informBackend(response);
	const { transaction: { status } } = response;
	this.$store.dispatch('updateGatewayErrorCode', status === 'success' ? null : status);
	this.$store.dispatch('updateGatewayAuthorizationResponse', response);
	if (status === 'success') {
		await this.getOrderStateIdForCreditCard(orderStatesEnum.confirmed.code);
		this.showNotification('Pago realizado con éxito', 'success');
		this.$router.push({ name: 'buy-summary', params: { orderId: this.getOrderInfo.id } });
	} else if (status === 'failure') {
		this.showNotification('El pago no fue realizado con éxito', 'error');
		await this.getOrderStateIdForCreditCard(orderStatesEnum.canceled.code);
	} else if (status === 'pending') {
		this.showNotification('El pago está en revisión', 'warning');
		await this.getOrderStateIdForCreditCard(orderStatesEnum.requested.code);
		this.$router.push({ name: 'buy-summary' });
	}
}

async function getOrderStateIdForCreditCard(state) {
	await this.$store.dispatch('LOAD_ORDERS_STATUS', this);
	const creditCardState = this.$store.getters.getStates.find(s => s.code === state);
	this.$store.commit('SET_ORDER_STATUS', creditCardState.id);
}

function informBackend(res) {
	const url = 'payment-gateway/validation';
	const body = {
		hash: this.hash,
		gatewayResponse: res,
	};
	this.$httpSales.patch(url, body);
}

function data() {
	return {
		hash: null,
	};
}

export default {
	name: 'paymentez',
	computed: {
		...mapGetters([
			'getOrderInfo',
		]),
	},
	data,
	methods: {
		checkout,
		getOrderStateIdForCreditCard,
		informBackend,
		onCreditCardResponse,
		openPaymentezModal,
	},
	props: {
		type: String,
		required: true,
	},
};
</script>
<style lang="scss" scoped>
	.js-paymentez-checkout {
		align-items: center;
		background-color: #333333;
		display: flex;
		height: 50px;
		overflow: hidden;
		padding: 0 2rem;
	}
</style>