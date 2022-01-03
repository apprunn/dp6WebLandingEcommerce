<template>
	<div>
		<section class="section-container">
			<div @click="toogleCollapse('products')" class="contend-title">
				<div class="section-title">
					<img :src="iconProduct.section" alt="logo productos">
					<h2 class="payment-section-title">Productos</h2>
				</div>
				<img height="16" width="18" :style="collapseStepProducts" :src="arrow.section" alt="arrow" class="arrow"/>
			</div>
			<products-buyed v-show="collapseSectionProducts"/>
			<div @click="toogleCollapse('methods')" class="contend-title">
				<div class="section-title">
					<img :src="logo.section" alt="logo del método de pago">
					<h2 class="payment-section-title">método de pago</h2>
				</div>
				<img height="16" width="18" :style="collapseStepMethods" :src="arrow.section" alt="arrow" class="arrow"/>
			</div>
			<div v-show="collapseSectionMethods" class="section-methods">
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
				<component
					class="component-container component-container-ios"
					:ip="ip"
					:is="paymentMethodSelectedComponent"
					:paymentsTypes="gatewayConfiguration"
				></component>
			</div>
		</section>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { isEmpty, curry, equality, find } from '@/shared/lib';
import { creditCard, transfer } from '@/shared/enums/wayPayment';
import appButton from '@/components/shared/buttons/app-button';
import productsBuyed from '@/components/order/products-buyed';
import depositPayment from '@/components/order/deposit-payment';
import recievedPayment from '@/components/order/recieved-payment';
import VisaByCountry from '@/components/order/credit-card-payment';

function created() {
	this.getClientIp();
	if (isEmpty(this.getWaysPayments)) {
		this.$store.dispatch('SET_WAY_PAYMENT', this);
		this.$store.dispatch('SET_BANK_ACCOUNTS', this);
	} else {
		const selectThisWayPayment = this.getCreditCard || this.getWaysPayments[0];
		this.onSelect(selectThisWayPayment);
	}
	this.collapseSectionMethods = true;
	this.collapseSectionProducts = false;
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
	const wayPayment = method.wayPaymentId;
	let bankAccountId = null;
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

function toogleCollapse(section) {
	if (section === 'products') {
		this.collapseSectionProducts = !this.collapseSectionProducts;
	} else if (section === 'methods') {
		this.collapseSectionMethods = !this.collapseSectionMethods;
	}
}

function collapseStepProducts() {
	return `transform: ${this.collapseSectionProducts ? 'rotate(0deg)' : 'rotate(180deg)'};`;
}

function collapseStepMethods() {
	return `transform: ${this.collapseSectionMethods ? 'rotate(0deg)' : 'rotate(180deg)'};`;
}

function data() {
	return {
		flagDataFast: null,
		datafastData: {},
		gatewayConfiguration: [],
		logo: {
			section: '/static/icons/payment.svg',
		},
		arrow: {
			section: '/static/icons/arrow.svg',
		},
		iconProduct: {
			section: '/static/icons/shopping-basket.svg',
		},
		ip: '',
		open: false,
		paymentMethodSelected: '',
		collapseSectionProducts: false,
		collapseSectionMethods: false,
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
		collapseStepProducts,
		collapseStepMethods,
	},
	created,
	data,
	methods: {
		getClientIp,
		onSelect,
		toogleCollapse,
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
		color: color(dark);
		font-size: size(medium);
		font-family: font(bold);
		margin-left: 12px;
		text-transform: uppercase;
	}

	.section-title {
		align-items: baseline;
		display: flex;
		justify-content: flex-start;
	}

	.section-container {
		margin-bottom: 30px;
		@media (min-width: 768px) {
			width: 700px;
			margin-left:-50px;
		}
	}

	.contend-title{
		display: flex;
		justify-content:space-between;
		align-items: center;
		cursor: pointer;
		margin-bottom: 30px;
	}
	.arrow{
		transform: rotate(180deg);
	}
</style>