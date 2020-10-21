<template>
	<div>
		<button @click="clickOnButton" type="button" class="pago-plux-img" :disabled="loading">
		<!-- <button @click="openPagoPlux" type="button" class="pago-plux-img" :disabled="loading"> -->
			<img src="https://quipu-acl.s3.amazonaws.com/icons/logo-pago-plux.png" alt="logo pagoplux">
		</button>
		<div id="ButtonPaybox" ref="pagopluxbtn" style="visibility:hidden"></div>
		<div v-show="false">
			<!-- correo del usuario de la cuenta xchange -->
			<input type="text" id="PayboxRemailPlux" :value="payboxRemail">
			<!-- correo del usuario que está comprando -->
			<input type="text" id="PayboxSendmailPlux" :value="payboxSendmail">
			<!-- Nombre del usuario xchange -->
			<input type="text" id="PayboxRenamePlux" :value="payboxRename">
			<!-- Nombre del usuario que realiza el pedido -->
			<input type="text" id="PayboxSendnamePlux" :value="payboxSendname">
			<!-- sub total base sin impuesto  -->
			<input type="text" id="PayboxBase0" :value="payboxBase0">
			<!-- sub total base con impuesto  -->
			<input type="text" id="PayboxBase12" :value="payboxBase12">
			<!-- descripción  -->
			<input type="text" id="PayboxDescriptionPlux" :value="payboxDescription">
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';

function clickOnButton() {
	this.loading = true;
	this.mountJQ();
	this.loadPagoPluxData()
		.then(() => {
			this.mountData();
			this.mountPagoPlux();
		});
	window.onAuthorize = (response) => {
		this.informBackend(response);
		if (response.status === 'succeeded') {
			this.pagoPluxHandlerSuccess(response);
		} else {
			this.pagoPluxHandlerError(response);
		}
	};
}

function informBackend(res) {
	const url = 'payment-gateway/validation';
	const body = {
		hash: this.hash,
		gatewayResponse: res,
	};
	this.$httpSales.patch(url, body);
}

function openPagoPlux() {
	const btn = this.$refs.pagopluxbtn.children.pay;
	if (btn) {
		btn.click();
	} else {
		this.showNotification(
			'ocurrió un error con la pasarela de pago. Por favor recargue la pantalla',
			'primary',
		);
	}
}

function mountPagoPlux() {
	const that = this;
	const testENV = 'https://sandbox-paybox.pagoplux.com/paybox/index.js';
	const prodENV = 'https://paybox.pagoplux.com/paybox/index.js';
	const url = this.productionEnv ? prodENV : testENV;
	const PagoPluxScript = document.createElement('script');
	PagoPluxScript.setAttribute('src', url);
	PagoPluxScript.onload = () => {
		const loadEvent = new Event('load');
		window.dispatchEvent(loadEvent);
		setTimeout(() => {
			that.openPagoPlux();
			that.loading = false;
		}, 1600);
	};
	const body = document.querySelector('body');
	body.appendChild(PagoPluxScript);
}

function mountJQ() {
	const JQScript = document.createElement('script');
	JQScript.setAttribute('src', 'https://code.jquery.com/jquery-3.4.1.js');
	const body = document.querySelector('body');
	body.appendChild(JQScript);
}

function mountData() {
	const Data = document.createElement('script');
	Data.setAttribute('type', 'text/javascript');
	Data.innerHTML = `var data = {
		PayboxRemail: "#PayboxRemailPlux",
		PayboxSendmail: "#PayboxSendmailPlux",
		PayboxRename: "#PayboxRenamePlux",
		PayboxSendname: "#PayboxSendnamePlux",
		PayboxBase0: "#PayboxBase0",
		PayboxBase12: "#PayboxBase12",
		PayboxDescription: "#PayboxDescriptionPlux",
		PayboxProduction: ${this.productionEnv},
		PayboxLanguage: "es",
	}`;
	const body = document.querySelector('body');
	body.appendChild(Data);
}

async function loadPagoPluxData() {
	const body = {
		orderId: this.getOrderInfo.id,
		commerceCode: process.env.COMMERCE_CODE,
		ipAddress: this.ipAddress,
	};
	const url = 'payment-gateway/pagoplux/checkout';
	const { data: res } = await this.$httpSales.post(url, body);
	this.hash = res.hash;
	this.productionEnv = res.payboxProduction;
	this.payboxRemail = res.payboxRemail;
	this.payboxRename = res.payboxRename;
	this.payboxBase0 = res.payboxBase0;
	this.payboxBase12 = res.payboxBase12;
	this.payboxSendmail = res.payboxSendmail;
	this.payboxSendname = res.payboxSendname;
	this.payboxDescription = res.payboxDescription;
}

function pagoPluxHandlerSuccess() {
	this.showNotification('Transacción exitosa', 'success');
	this.showNotification('Pago realizado con éxito', 'success');
	this.$router.push({ name: 'buy-summary', params: { orderId: this.getOrderInfo.id } });
}

function pagoPluxHandlerError() {
	this.showNotification('Error. La transacción no se completó por un error', 'error');
}

function data() {
	return {
		hash: null,
		loading: false,
		payboxRemail: '',
		payboxRename: '',
		payboxBase0: '',
		payboxBase12: '',
		payboxSendmail: '',
		payboxSendname: '',
		payboxDescription: '',
		productionEnv: null,
	};
}

export default {
	name: 'pagoplux',
	computed: {
		...mapGetters([
			'getOrderInfo',
			'getResponsible',
		]),
	},
	data,
	methods: {
		clickOnButton,
		informBackend,
		loadPagoPluxData,
		mountData,
		mountJQ,
		mountPagoPlux,
		openPagoPlux,
		pagoPluxHandlerError,
		pagoPluxHandlerSuccess,
	},
	props: {
		required: true,
		default: String,
	},
};
</script>
<style lang="scss" scoped>
.xchange-btn {
	visibility: hidden;
	button {
		width: 210px !important;
	}
}

.pago-plux-img {
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
</style>