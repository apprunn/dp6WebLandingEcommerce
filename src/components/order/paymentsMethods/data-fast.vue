<template>
	<div>
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
		<div class="details-collapse component-container">
			<div class="details-collapse-title payment-sections">
				Tarjetas con las que puedes pagar en DATAFAST
				<button
					class="details-collapse-title-btn"
					type="button"
					@click="openDetails"
				>
					<template v-if="open">OCULTAR</template>
					<template v-else>VER</template>
				</button>
			</div>
			<div v-if="open" class="details-collapse-container">
				<div class="details-collapse-items">
					<div
						class="details-collapse-item"
						v-for="card in datafastData.creditCards"
						:key="card.code"
					>
						<template v-if="card.active">
								<div>
									<img :src="card.urlImage" height="24" />
								</div>
								<div class="name-tarjet">
									{{ card.name }}
								</div>
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import modal from '@/components/shared/modal/modal-component';
import { getDeeper } from '@/shared/lib';
import { datafast } from '@/shared/enums/gatewayCodes';

function created() {
	this.getClientIp();
	const dataFastGateway = this.gateway.find(g => g.code === datafast);
	this.datafastAdditionals(dataFastGateway);
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
	const dataFastScript = document.createElement('script');
	dataFastScript.setAttribute('src', src);
	this.showModal = true;
	setTimeout(() => {
		const el = this.$refs['data-fast'];
		el.appendChild(dataFastScript);
		this.insertForm(response.additionalInformation);
	});
	this.loadingFn();
}

function loadingFn() {
	setTimeout(() => {
		this.loading = false;
	}, 2200);
}

function updateDiferidos(ev) {
	const diferidoTime = this.getDiferidos(ev);

	const select = document.getElementById('diferidos');
	const len = select.length;

	for (let i = len - 1; i >= 0; i -= 1) {
		select.options[i].remove();
	}

	diferidoTime.forEach((item) => {
		const newOption = document.createElement('option');
		newOption.setAttribute('value', item);
		const newOptionContent = document.createTextNode(item);
		newOption.appendChild(newOptionContent);
		select.appendChild(newOption);
	});
}

function insertTiposDeCredito(dtcOptions) {
	const tipocredito = document.createElement('div');
	const imgElement = document.createElement('img');
	tipocredito.setAttribute('class', 'wpwl-wrapper wpwl-wrapper-custom');
	tipocredito.setAttribute('style', 'margin-top: 10px;flex-direction: column;display: flex');
	imgElement.setAttribute('src', 'https://www.datafast.com.ec/images/verified.png');
	imgElement.setAttribute('style', 'display:block;margin:20px 0px 0px auto; width:100%;');
	const divContent = document.createTextNode('Tipo de crédito:');
	tipocredito.appendChild(divContent);
	const newSelect = document.createElement('select');
	newSelect.addEventListener('change', this.updateDiferidos);
	newSelect.setAttribute('style', 'background-color: white;padding: 3.75px 0 3.75px 10px; border: 1px solid #ccc;border-radius: 4px; width: 258px;');
	newSelect.setAttribute('name', 'customParameters[SHOPPER_TIPOCREDITO]');
	dtcOptions.forEach(({ id, name }) => {
		const newOption = document.createElement('option');
		newOption.setAttribute('value', id);
		const newOptionContent = document.createTextNode(name);
		newOption.appendChild(newOptionContent);
		newSelect.appendChild(newOption);
	});
	tipocredito.appendChild(newSelect);
	const formCard = document.querySelector('form.wpwl-form-card').querySelector('.wpwl-wrapper-submit');
	formCard.appendChild(tipocredito);
	formCard.appendChild(imgElement);
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
	newSelect.setAttribute('id', 'diferidos');
	newSelect.setAttribute('style', 'background-color: white;width: 258px;border-radius: 4px;border: 1px solid #ccc;padding: 3.75px 0 3.75px 10px;outline: none;');
	newSelect.setAttribute('name', 'recurring.numberOfInstallments');

	this.defaultDiferidos.forEach((item) => {
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

function getDiferidos(ev) {
	const { target: { value } } = ev;
	const diferidoItem = this.datafastData.typesCredit.find(d => d.id === value);
	if (diferidoItem && diferidoItem.children && diferidoItem.children.options) {
		const { children: { options } } = diferidoItem;
		return options.length ? options.map(o => o.id) : this.defaultDiferidos;
	}
	return this.defaultDiferidos;
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
		this.insertTiposDeCredito(dtc.typesCredit.options);
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

async function datafastAdditionals({ code }) {
	const params = { commerceCode: this.getCommerceData.code };
	const url = `payment-gateway/${code}/additionals`;
	try {
		const { data: datafastResponse } = await this.$httpSales.get(
			url, { params });

		const creditCards = getDeeper('creditCards.options')(datafastResponse) || [];
		const typesCredit = getDeeper('typesCredit.options')(datafastResponse) || [];

		this.datafastData.creditCards = creditCards.filter(cc => cc.active);
		this.datafastData.typesCredit = typesCredit.filter(tc => tc.flagActive);

		if (creditCards.length) {
			const datafastStringify = JSON.stringify(this.datafastData.creditCards);
			localStorage.setItem('datafast-cards', datafastStringify);
		} else {
			localStorage.removeItem('datafast-cards');
		}
		if (typesCredit.length) {
			const datafastStringify = JSON.stringify(this.datafastData.typesCredit);
			localStorage.setItem('datafast-types-credit', datafastStringify);
		} else {
			localStorage.removeItem('datafast-types-credit');
		}
	} catch (err) {
		if (err.status === 500) {
			this.showGenericError();
		}
	}
}

function openDetails() {
	if (this.datafastData.creditCards && this.datafastData.creditCards.length > 0) {
		this.open = !this.open;
	}
}

function data() {
	return {
		clientIp: null,
		datafastData: {},
		defaultDiferidos: [0, 3, 6, 12],
		disabledButtonDataFast: false,
		flagDataFast: null,
		loading: true,
		open: false,
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
		datafastAdditionals,
		getClientIp,
		getDiferidos,
		insertDiferidos,
		insertTiposDeCredito,
		insertForm,
		loadingFn,
		openDetails,
		updateDiferidos,
	},
	props: {
		gateway: {
			default: () => [],
			type: Array,
		},
		img: {
			type: String,
			required: true,
		},
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

	.details-collapse-title {
		align-items: center;
		border-bottom: 1px solid rgb(230, 230, 230);
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		font-family: font(bold);
		font-size: size(medium);
		justify-content: space-between;
		padding-bottom: 3px;

		&-btn {
			border: 1px solid black;
			border-radius: 6px;
			font-family: font(demi);
			font-size: size(minmedium);
			margin-left: 10px;
			padding: 4px 5px 0px;
		}
	}

	.details-collapse-items {
		align-items: flex-start;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		margin-top: 10px;
	}

	.details-collapse-item {
		align-items: center;
		border: 1px solid color(black);
		border-radius: 6px;
		display: flex;
		flex-direction: column;
		font-family: font(bold);
		margin: 5px 8px;
		padding: 10px 15px 5px;
		text-transform: uppercase;
		width: 205px;
	}

	.name-tarjet {
		font-size: 11px;
		margin-top: 5px;
		text-align: center;
	}

	.component-container {
		margin-top: 15px;
		padding: 0 1rem;
	}
</style>