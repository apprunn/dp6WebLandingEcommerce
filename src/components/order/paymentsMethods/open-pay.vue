<template>
	<div>
		<button
			type="button"
			data-cy="niubiz-btn"
			class="niubiz-btn"
			style="padding:1rem"
			@click="checkout"
		>
			<img :src="img" alt="logo_Niubiz">
		</button>
		<form
			id="visa-payment"
			:action="redirect"
			method='post'
		></form>
		<v-dialog max-width="425" v-model="dialog" persistent>
			<open-pay-form/>
		</v-dialog>
	</div>
</template>
<script>
import OpenPayForm from '@/components/order/paymentsMethods/open-pay-form';
import { mapGetters, mapState } from 'vuex';

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
	console.log('checkout');
	this.dialog = !this.dialog;
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
	return str.toLowerCase().normalize('NFD')
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
		createScript,
		normalize,
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
