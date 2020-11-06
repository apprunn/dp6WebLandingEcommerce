<template>
	<div>
		<button type="button" @click="checkout" class="niubiz-btn" style="padding:1rem">
			<img :src="img" alt="logo_Niubiz">
		</button>
		<form
			id="visa-payment"
			:action="redirect"
			method='post'
		></form>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';

function createScript() {
	if (process.browser && this.merchantId) {
		const visaForm = document.createElement('script');
		const dataSessionToken = this.sessionKey;
		const dataMerchantId = this.merchantId;
		const dataAmount = this.amount;
		const dataCurrency = this.currency;
		const src = this.payboxProduction === 'dev' ? this.dev : this.prod;
		const purchaseNumber = this.getOrderId;
		const logo = this.getCommerceData.urlImage;
		const name = process.env.COMPANY_LOGIN_TITLE;
		const btnColor = process.env.COLOR_PRIMARY;
		visaForm.setAttribute('src', src);
		visaForm.setAttribute('data-sessiontoken', dataSessionToken);
		visaForm.setAttribute('data-channel', 'web');
		visaForm.setAttribute('data-merchantid', dataMerchantId);
		visaForm.setAttribute('data-merchantlogo', logo);
		visaForm.setAttribute('data-merchantname', name);
		visaForm.setAttribute('data-formbuttoncolor', btnColor);
		visaForm.setAttribute('data-purchasenumber', purchaseNumber);
		visaForm.setAttribute('data-amount', dataAmount);
		visaForm.setAttribute('data-currency', dataCurrency);
		visaForm.setAttribute('currency', dataCurrency);
		visaForm.setAttribute('data-expirationminutes', 20);
		visaForm.setAttribute('data-timeouturl', 'timeout.html');
		const Visa = document.getElementById('visa-payment').appendChild(visaForm);
		Visa.onload = () => {
			const visaBtn = document.querySelector('.modal-opener');
			visaBtn.style.visibility = 'hidden';
			visaBtn.click();
		};
	}
}

function orderTotal() {
	return this.getTotalToBuy + this.getShippingCost;
}

async function checkout() {
	const body = {
		orderId: this.getOrderId,
		commerceCode: process.env.COMMERCE_CODE,
		ipAddress: this.ipAddress,
	};
	const url = 'payment-gateway/niubiz/checkout';
	const { data: res } = await this.$httpSales.post(url, body);
	this.merchantId = res.merchantId;
	this.sessionKey = res.sessionKey;
	this.payboxProduction = res.payboxProduction;
	this.currency = res.currency;
	this.amount = res.amount;
	this.createScript();
}

function redirect() {
	const orderId = `orderId=${this.getOrderId}`;
	const successUri = 'uri=resumen-de-mi-pedido';
	const errorUri = `errorUri=carrito-de-compras/pago/${this.getOrderId}`;
	return `${this.apiSales}/payment-gateway/validation?${orderId}&${successUri}&${errorUri}`;
}

function data() {
	return {
		amount: 0,
		apiSales: process.env.SALES_URL,
		companyLogo: process.env.COMPANY_LOGO,
		currency: 'PEN',
		dev: 'https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true',
		expirationTime: null,
		loading: false,
		merchantId: '',
		payboxProduction: false,
		prod: 'https://static-content.vnforapps.com/v2/js/checkout.js',
		sessionKey: null,
		totalAmount: null,
	};
}

export default {
	name: 'niubiz',
	computed: {
		...mapGetters([
			'getOrderId',
			'getShippingCost',
			'getTotalToBuy',
			'token',
			'getCommerceData',
		]),
		orderTotal,
		redirect,
	},
	data,
	methods: {
		checkout,
		createScript,
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
</style>
