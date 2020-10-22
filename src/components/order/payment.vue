<template>
	<div>
		<products-buyed/>
		<section class="section-container">
			<div class="section-title">
				<img :src="logo.section" alt="logo del método de pago">
				<h2 class="payment-section-title">método de pago</h2>
			</div>
			<div class="methods-container">
				<app-button
					class="method-item"
					v-for="method in getWaysPayments"
					:key="method.id"
					:max-width="'100%'"
					:data-cy="method.name"
					:action="method.name"
					:active="paymentMethodSelected === method.code"
					:background="globalColors.secondary"
					:border="globalColors.secondary"
					@click="onSelect(method)"
				/>
			</div>
			<component class="component-container"
				:ip="ip"
				:is="paymentMethodSelectedComponent"
				:paymentsTypes="gatewayConfiguration"
			></component>
			<div class="details-collapse component-container" v-if="flagDataFast">
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
		</section>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import appButton from '@/components/shared/buttons/app-button';
import { isEmpty, curry, equality, find } from '@/shared/lib';
import depositPayment from '@/components/order/deposit-payment';
import productsBuyed from '@/components/order/products-buyed';
import recievedPayment from '@/components/order/recieved-payment';
import VisaByCountry from '@/components/order/credit-card-payment';
import { datafast } from '@/shared/enums/gatewayCodes';
import { BUTTON } from '@/shared/enums/paymentStrategy';
import { creditCard, transfer } from '@/shared/enums/wayPayment';

function created() {
	this.getClientIp();
	if (isEmpty(this.getWaysPayments)) {
		this.$store.dispatch('SET_WAY_PAYMENT', this);
		this.$store.dispatch('SET_BANK_ACCOUNTS', this);
	} else {
		const selectThisWayPayment = this.getCreditCard || this.getWaysPayments[0];
		this.onSelect(selectThisWayPayment);
	}
	this.flagDataFast = this.gatewayConfiguration.reduce((acum, item) => {
		const index = item.gateway.findIndex(g => g.code === 'datafast');
		let newAcum = acum;
		if (index > -1) {
			newAcum += 1;
		}
		return newAcum;
	}, 0);
}

/**
 * getClientIp - obtiene el ip del computador del cliente
*/
async function getClientIp() {
	try {
		({ data: this.ip } = await this.$http.get('https://api.ipify.org'));
	} catch (err) {
		this.showNotification(
			'Ocurrio un error con la ip de origen',
			'error',
		);
	}
}

function onSelect(method) {
	this.$store.commit('SET_WAY_PAYMENT', { wayPayment: null, bankAccountId: null });
	this.paymentMethodSelected = method.code;
	this.gatewayConfiguration = method.gatewayConfiguration || [];
	const buttonsGateway = this.gatewayConfiguration.find(gc => gc.code === BUTTON) || {};
	const datafastItem = buttonsGateway.gateway ? buttonsGateway.gateway.find(bg =>
		bg.code === datafast) : null;
	const wayPayment = method.wayPaymentId;
	let bankAccountId = null;
	if (datafastItem) {
		this.datafastAdditionals(datafastItem);
	}
	if (method.code === transfer.code) {
		bankAccountId = isEmpty(this.getBankAccounts) ? null : this.getBankAccounts[0].bankId;
	}
	this.$store.commit('SET_WAY_PAYMENT', { wayPayment, bankAccountId });
}

function paymentMethodSelectedComponent() {
	const opt = {
		CDC: 'VisaByCountry',
		IBD: 'depositPayment',
		PPR: 'recievedPayment',
	};
	return opt[this.paymentMethodSelected];
}

function getWaysPayments() {
	const selectThisWayPayment = this.getCreditCard || this.getWaysPayments[0];
	this.onSelect(selectThisWayPayment);
}

function getCreditCard() {
	const findCurried = curry(find);
	const searchCreditCard = findCurried(equality('code', creditCard.code));
	const findCreditCard = searchCreditCard(this.getWaysPayments);
	return findCreditCard;
}

async function datafastAdditionals({ code }) {
	const params = { commerceCode: this.getCommerceData.code };
	try {
		const { data: datafastResponse } = await this.$httpSales.get(
			`payment-gateway/${code}/additionals`, { params });
		const creditCards = datafastResponse.creditCards ?
			datafastResponse.creditCards.options || [] : [];
		const typesCredit = datafastResponse.typesCredit ?
			datafastResponse.typesCredit.options || [] : [];
		this.datafastData.creditCards = creditCards.filter(cc => cc.active);
		this.datafastData.typesCredit = typesCredit.filter(tc => tc.flagActive);
		if (this.datafastData.creditCards.length > 0) {
			const datafastStringify = JSON.stringify(this.datafastData.creditCards);
			localStorage.setItem('datafast-cards', datafastStringify);
		} else {
			localStorage.removeItem('datafast-cards');
		}
		if (this.datafastData.typesCredit.length > 0) {
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
		flagDataFast: null,
		datafastData: {},
		gatewayConfiguration: [],
		logo: {
			section: '/static/icons/payment.svg',
		},
		ip: '',
		open: false,
		paymentMethodSelected: '',
	};
}

export default {
	name: 'payment',
	components: {
		depositPayment,
		appButton,
		productsBuyed,
		recievedPayment,
		VisaByCountry,
	},
	computed: {
		...mapGetters([
			'getCommerceData',
			'getWaysPayments',
			'getBankAccounts',
			'indeterminate',
		]),
		getCreditCard,
		paymentMethodSelectedComponent,
	},
	created,
	data,
	methods: {
		getClientIp,
		datafastAdditionals,
		onSelect,
		openDetails,
	},
	watch: {
		getWaysPayments,
	},
};
</script>
<style lang="scss" scoped>
	.methods-container {
		align-items: center;
		display: grid;
		grid-gap: 10px;
		grid-auto-flow: row;

		@media (min-width: 768px) {
			grid-auto-flow: column;

		}
	}
	.method-item {
		font-family: font(medium) !important;
		font-size: size(minmedium);
	}

	.component-container {
		margin-top: 15px;
		padding: 0 1rem;
	}

	.payment-section-title {
		font-size: size(large);
		font-family: font(bold);
		margin-left: 12px;
		text-transform: uppercase;
	}

	.section-title {
		align-items: baseline;
		display: flex;
		justify-content: flex-start;
		margin-bottom: 40px;
	}

	.section-container {
		margin-bottom: 30px;

		@media (min-width: 768px) {
			width: 650px;
		}
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
</style>