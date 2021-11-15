<template>
	<div>
		<button @click="openXchange" type="button" class="xchange-img" :disabled="loading">
			<img src="https://quipu-acl.s3.amazonaws.com/icons/logo_xchange.png" alt="logo xchange">
		</button>
		<div id="ButtonPaybox" class="xchange-btn" ref="xchangebtn" style="visibility:hidden"></div>
		<!-- <div id="ButtonPaybox" class="xchange-btn" ref="xchangebtn" style="visibility:hidden"></div> -->
		<div v-show="false">
			<!-- correo del usuario de la cuenta xchange -->
			<input type="text" id="PayboxRemail" :value="payboxRemail">
			<!-- correo del usuario que está comprando -->
			<input type="text" id="PayboxSendmail" :value="payboxSendmail">
			<!-- Nombre del usuario xchange -->
			<input type="text" id="PayboxRename" :value="payboxRename">
			<!-- Nombre del usuario que realiza el pedido -->
			<input type="text" id="PayboxSendname" :value="payboxSendname">
			<!-- Monto del pedido -->
			<input type="text" id="PayboxAmount" :value="payboxAmount">
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';

async function mounted() {
	await Promise.all([
		this.mountData(),
		this.mountJQ(),
		this.mountXchange(),
		this.loadXchangeData(),
	]);
	const loadEvent = new Event('load');
	window.dispatchEvent(loadEvent);
	setTimeout(() => {
		this.loading = false;
	}, 1500);
	window.onAuthorize = (response) => {
		this.informBackend(response);
		if (response.status === 'succeeded') {
			this.xchangeHandlerSuccess(response);
		} else {
			this.xchangeHandlerError(response);
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

async function openXchange() {
	const btn = this.$refs.xchangebtn.children.pay;
	btn.click();
}

function mountXchange() {
	const Xchange = document.createElement('script');
	Xchange.setAttribute('src', 'https://cdn.xchange.la/paybox/index.js');
	const head = document.querySelector('head');
	head.appendChild(Xchange);
}

function mountJQ() {
	const JQScript = document.createElement('script');
	JQScript.setAttribute('src', 'https://code.jquery.com/jquery-2.2.4.js');
	const body = document.querySelector('body');
	body.appendChild(JQScript);
}

function mountData() {
	const Data = document.createElement('script');
	Data.setAttribute('type', 'text/javascript');
	Data.innerHTML = `var data = {
		PayboxRemail: "#PayboxRemail",
		PayboxSendmail: "#PayboxSendmail",
		PayboxRename: "#PayboxRename",
		PayboxSendname: "#PayboxSendname",
		PayboxAmount: "#PayboxAmount",
		PayboxProduction: false,
		PayboxLanguage: "es",
	}`;
	const body = document.querySelector('body');
	body.appendChild(Data);
}

async function loadXchangeData() {
	const body = {
		orderId: this.getOrderInfo.id,
		commerceCode: process.env.COMMERCE_CODE,
		ipAddress: this.ipAddress,
	};
	const url = 'payment-gateway/xchange/checkout';
	const { data: res } = await this.$httpSales.post(url, body);
	this.hash = res.hash;
	this.payboxAmount = res.total;
	this.payboxRemail = res.email;
	this.payboxRename = res.username;
	this.payboxSendmail = res.responsibleEmail;
	this.payboxSendname = res.responsibleName;
}

function xchangeHandlerSuccess() {
	this.showNotification('Transacción exitosa', 'success');
}

function xchangeHandlerError(error) {
	this.showNotification('Error. La transacción no se completó por un error', 'error');
	console.log(error);
}

function data() {
	return {
		hash: null,
		loading: true,
		payboxAmount: '',
		payboxRemail: '',
		payboxRename: '',
		payboxBase0: '',
		payboxBase12: '',
		payboxSendmail: '',
		payboxSendname: '',
	};
}

export default {
	name: 'xchange',
	computed: {
		...mapGetters([
			'getOrderInfo',
			'getResponsible',
		]),
	},
	data,
	methods: {
		informBackend,
		loadXchangeData,
		mountData,
		mountJQ,
		mountXchange,
		openXchange,
		xchangeHandlerError,
		xchangeHandlerSuccess,
	},
	mounted,
	props: {
		ipAddress: {
			type: String,
			required: true,
		},
	},
};
</script>
<style lang="scss" scoped>
.xchange-btn {

	button {
		width: 210px !important;
	}
}

.xchange-img {
	align-items: center;
	border: 1px solid #3794D5;
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
		cursor: not-allowed;
		opacity: 0.3;
	}
}
</style>
