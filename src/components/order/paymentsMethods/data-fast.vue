<template>
	<div class="data-fast-container">
		<button
			:disabled="disabledButtonDataFast"
			class="data-fast-btn"
			type="button"
			@click="checkout"
		>
			<img :src="img" alt="logo_data_fast">
		</button>
		<button
			class="data-fast-btn-details"
			type="button"
		>
			<img src="/static/icons/information.svg" alt="" height="26" />
			<span class="tooltip">
				Haz clic en el botón para ver las tarjetas con las que puedes pagar en DATAFAST
			</span>
		</button>
		<modal v-model="showModal" max-width="520px" @input="closeModal">
			<div ref="data-fast" class="modal-data-fast" v-if="showModal">
				<h3 v-if="loading">Cargando...</h3>
			</div>
		</modal>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import modal from '@/components/shared/modal/modal-component';

function created() {
	this.getClientIp();
}

async function getClientIp() {
	try {
		({ data: this.clientIp } = await this.$http.get('https://api.ipify.org'));
	} catch (err) {
		this.showNotification(
			'Ocurrio un error con la ip de origen',
			'error',
		);
	}
}

async function checkout() {
	this.disabledButtonDataFast = true;
	const body = {
		orderId: this.getOrderId,
		commerceCode: this.getCommerceData.code,
		ipAddress: this.clientIp,
	};
	const url = 'payment-gateway/datafast/checkout';
	const { data: response } = await this.$httpSales.post(url, body);
	this.createDataFastForm(response);
}

function createDataFastForm(response) {
	const testENV = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${response.id}`;
	const prodENV = `https://oppwa.com/v1/paymentWidgets.js?checkoutId=${response.id}`;
	const src = response.payboxProduction ? prodENV : testENV;
	const datafastTypesCredit = JSON.parse(localStorage.getItem('datafast-types-credit')) || [];
	const dataFastScript = document.createElement('script');
	dataFastScript.setAttribute('src', src);
	this.showModal = true;
	setTimeout(() => {
		const el = this.$refs['data-fast'];
		el.appendChild(dataFastScript);
		this.insertForm(datafastTypesCredit);
	});
	this.loadingFn();
}

function loadingFn() {
	setTimeout(() => {
		this.loading = false;
	}, 2200);
}

function insertTiposDeCredito(dtc) {
	const tipocredito = document.createElement('div');
	tipocredito.setAttribute('class', 'wpwl-wrapper wpwl-wrapper-custom');
	tipocredito.setAttribute('style', 'margin-top: 10px;flex-direction: column;display: flex');
	const divContent = document.createTextNode('Tipo de crédito:');
	tipocredito.appendChild(divContent);
	const newSelect = document.createElement('select');
	newSelect.setAttribute('style', 'background-color: white;padding: 3.75px 0 3.75px 10px; border: 1px solid #ccc;border-radius: 4px; width: 258px;');
	newSelect.setAttribute('name', 'customParameters[SHOPPER_TIPOCREDITO]');
	dtc.forEach(({ id, name }) => {
		const newOption = document.createElement('option');
		newOption.setAttribute('value', id);
		const newOptionContent = document.createTextNode(name);
		newOption.appendChild(newOptionContent);
		newSelect.appendChild(newOption);
	});
	tipocredito.appendChild(newSelect);
	const formCard = document.querySelector('form.wpwl-form-card').querySelector('.wpwl-wrapper-submit');
	formCard.appendChild(tipocredito);
}

function insertDiferidos() {
	const divTitle = document.createElement('div');
	divTitle.setAttribute('class', 'wpwl-label wpwl-label-custom');
	const divContent = document.createTextNode('Diferidos:');
	divTitle.appendChild(divContent);
	const divSelect = document.createElement('div');
	divSelect.setAttribute('class', 'wpwl-wrapper wpwl-wrapper-custom');
	divSelect.setAttribute('style', 'display:inline-block');
	const newSelect = document.createElement('select');
	newSelect.setAttribute('style', 'background-color: white;width: 258px;border-radius: 4px;border: 1px solid #ccc;padding: 3.75px 0 3.75px 10px;outline: none;');
	newSelect.setAttribute('name', 'recurring.numberOfInstallments');
	[0, 3, 6, 12].forEach((item) => {
		const newOption = document.createElement('option');
		newOption.setAttribute('value', item);
		const newOptionContent = document.createTextNode(item);
		newOption.appendChild(newOptionContent);
		newSelect.appendChild(newOption);
	});
	divSelect.appendChild(newSelect);
	const formCard = document.querySelector('form.wpwl-form-card').querySelector('.wpwl-wrapper-submit');
	formCard.appendChild(divTitle);
	formCard.appendChild(divSelect);
}

function insertForm(dtc) {
	const datafastCards = JSON.parse(localStorage.getItem('datafast-cards')) || [];
	const dataBrands = datafastCards.length > 0 ? datafastCards.reduce((a, dfc, i) => {
		let { codeInternal } = dfc;
		if (codeInternal.toLowerCase() === 'mastercard') {
			codeInternal = 'MASTER';
		} else if (codeInternal.toLowerCase() === 'american') {
			codeInternal = 'AMEX';
		}
		if (a.indexOf(codeInternal) === -1) {
			if (datafastCards.length > 1 && (i !== (datafastCards.length - 1))) {
				return a.concat(`${codeInternal} `);
			}
			return a.concat(codeInternal);
		}
		return a;
	}, '') : 'VISA MASTER DINERS AMEX DISCOVER';
	const dataFastForm = document.createElement('form');
	const commerceCode = `commerceCode=${this.getCommerceData.code}`;
	const purchaseNumber = `orderId=${this.getOrderId}`;
	const redirect = 'uri=resumen-de-mi-pedido';
	const url = `${this.baseUrl}?${commerceCode}&${purchaseNumber}&${redirect}`;
	dataFastForm.setAttribute('action', url);
	dataFastForm.setAttribute('method', 'get');
	dataFastForm.setAttribute('data-brands', dataBrands);
	dataFastForm.setAttribute('id', 'datafast-form');
	dataFastForm.setAttribute('class', 'paymentWidgets');
	const el = this.$refs['data-fast'];
	el.appendChild(dataFastForm);
	setTimeout(() => {
		this.insertDiferidos();
		this.insertTiposDeCredito(dtc);
	}, 5000);
}

function baseUrl() {
	return `${process.env.SALES_URL}/payment-gateway/validation`;
}

function closeModal(val) {
	if (!val) {
		this.loading = true;
	}
	this.disabledButtonDataFast = false;
}

function data() {
	return {
		disabledButtonDataFast: false,
		clientIp: null,
		loading: true,
		show: false,
		showModal: false,
	};
}

export default {
	name: 'data-fast',
	components: {
		modal,
	},
	computed: {
		...mapGetters([
			'getCommerceData',
			'getOrderId',
		]),
		baseUrl,
	},
	created,
	data,
	methods: {
		checkout,
		closeModal,
		createDataFastForm,
		getClientIp,
		insertDiferidos,
		insertTiposDeCredito,
		insertForm,
		loadingFn,
	},
	props: {
		img: {
			type: String,
			required: true,
		},
		// ipAddress: {
		// 	type: String,
		// 	required: true,
		// },
	},
};
</script>
<style lang="scss" scoped>
.data-fast-btn {
	align-items: center;
	border: 1px solid #E75A32;
	color: white;
	display: flex;
	font-family: font(bold);
	font-size: size(big);
	height: 50px;
	justify-content: center;
	overflow: hidden;
	padding: 1.5rem 3.7rem;
	transition-duration: 250ms;

	&:hover {
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		transform: scale(1.05);
	}
}

.modal-data-fast {
    align-items: center;
	background-color: white;
    display: flex;
    justify-content: center;
    padding: 30px;
}

.data-fast-btn-details {
	display: inline-flex;
	padding-left: 15px;
	position: relative;
	z-index: 2;

	& > span.tooltip {
		background-color: rgba(37, 37, 37, .6);
		border-radius: 4px;
		color: color(white);
		display: none;
		font-family: font(bold);
		left: -250%;
		line-height: 1;
		padding: 5px;
		position: absolute;
		text-align: center;
		top: -65px;
		width: 220px;
	}

	&:hover > span.tooltip {
		display: initial;
	}
}

.data-fast-container {
	align-items: center;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin: 0 14px;
	position: relative;
}
</style>