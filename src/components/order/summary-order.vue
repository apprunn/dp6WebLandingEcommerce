<template>
	<div class="summary-container summary-section">
		<section class="summary-order">
			<div class="summary-header text-xs-center">
				<p class="summary-title">Resumen de Compra</p>
			</div>
			<div class="summary-amounts">
				<p class="summary-amount-container separate">
					<span>Subtotal</span>
					<span data-cy="subtotal" class="summary-amount">{{getCurrencySymbol}}. {{getTotalToBuy | currencyFormat}}</span>
				</p>
				<p class="summary-amount-container separate">
					<span>Descuento</span>
					<span data-cy="discount" class="summary-amount">{{getCurrencySymbol}}. {{discount | currencyFormat}}</span>
				</p>
				<p class="summary-amount-container separate">
					<span>Envío</span>
					<span data-cy="shipping" class="summary-amount">{{getCurrencySymbol}}. {{getShippingCost | currencyFormat}}</span>
				</p>
				<p class="summary-amount-container total">
					<span>Total</span>
					<span data-cy="total" class="summary-total">{{getCurrencySymbol}}. {{total | currencyFormat}}</span>
				</p>
			</div>
		</section>
		<section class="btns-summary-order" :style="styleBtnMobile">
			<app-button
				data-cy="make-order"
				v-if="stepOne"
				:action="`Hacer pedido ${getCurrencySymbol}. ${listenerPriceOrder}`"
				class="btn-order"
				:background="globalColors.primary"
				@click="goToMakeOrder"
			/>
			<app-button 
				data-cy="go-pay"
				v-else-if="stepTwo"
				:action=" `Pasar a Caja`"
				class="btn-order "
				:background="globalColors.primary"
				:disabled="invalidOrder || isToogleBtn ? true : false"
				@click="makeOrder(false)"
				:spinner="isToogleBtn"
			/>
			<app-button
				data-cy="pay"
				v-else-if="stepThree"
				:action=" `Terminar Compra ${getCurrencySymbol}. ${listenerPriceOrder}`"
				class="btn-order"
				:disabled="isOnlinePayment || isToogleBtn ? true : false"
				:background="globalColors.primary"
				@click="makeOrder(true)"
				:spinner="isToogleBtn"
			/>
		</section>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import appButton from '@/components/shared/buttons/app-button';
import { getDeeper, compose, setNewProperty } from '@/shared/lib';
import { creditCard } from '@/shared/enums/wayPayment';


function total() {
	const totalBuyWithShipp = (this.getTotalToBuy - this.discount) + this.getShippingCost;
	this.$store.commit('SET_TOTAL_BUY_SHIPP', totalBuyWithShipp);
	return Number(totalBuyWithShipp.toFixed(2));
}

function makeOrder(flagFinish) {
	this.$store.dispatch('MAKE_ORDER', { flagFinish, context: this });
	const body = this.buildPayloadPhones();
	if (body) {
		this.$store.dispatch('UPDATE_USER_DATA', { context: this, body });
		localStorage.removeItem('ecommerce::phonesList::user');
	}
}

function buildPayloadPhones() {
	const phoneList = this.getLocalStorage('ecommerce::phonesList::user');
	if (phoneList) {
		return compose(
			setNewProperty('phone', phoneList.phone),
			setNewProperty('phoneNumbers', phoneList.phoneNumbers),
		)({});
	}
	return null;
}

function stepThree() {
	return getDeeper('meta.step')(this.$route) === 3;
}

function stepOne() {
	return getDeeper('meta.step')(this.$route) === 1;
}

function stepTwo() {
	return getDeeper('meta.step')(this.$route) === 2;
}

function goToMakeOrder() {
	if (this.token) {
		this.$store.commit('SET_IS_COLLAPSE_PRODUCT', false);
		this.$emit('close-collapse');
		this.goTo('buy-delivery');
		setTimeout(() => {
			this.scrollTo('main-container-delivery', 800, false);
		}, 900);
	} else if (window.innerWidth < 765) {
		this.setLocalData('route-after-login', '/carrito-de-compras');
		this.goTo('login');
	} else {
		this.$store.commit('toogleLoginModal');
	}
}

function discount() {
	const percentage = this.user.discount || 0;
	const amount = this.getTotalToBuy * (Number(percentage) / 100);
	return Number(amount.toFixed(2));
}

function isOnlinePayment() {
	if (this.getWaypaymentsByCommerce && this.getWaypaymentsByCommerce.length > 0) {
		const selectedId = this.getWayPayment.wayPayment;
		const paymentSelected = this.getWaypaymentsByCommerce.find(w => w.wayPaymentId === selectedId);
		const isOnline = creditCard.code === paymentSelected.code;
		return isOnline;
	}
	return false;
}

function listenerPriceOrder() {
	const newVal = this.total ? Number(this.total.toFixed(2)) : 0;
	if (!newVal) {
		return '0.00';
	}
	const [integer, decimals] = String(newVal).split('.');
	if (!decimals) {
		return `${integer}.00`;
	}
	const newDecimals = decimals.length === 1 && decimals < 10 ? `${decimals}0` : decimals;
	return `${integer}.${newDecimals}`;
}

function styleBtnMobile() {
	return {
		'--bg-mobile-color': this.globalColors.primary,
	};
}

export default {
	name: 'summary-order',
	components: {
		appButton,
	},
	computed: {
		...mapGetters([
			'getBillingData',
			'getCurrencySymbol',
			'getCustomerAddress',
			'getCustomerAddressId',
			'getDeliveryAddress',
			'getFlagBill',
			'getFlagPickUp',
			'getFlagStatusOrder',
			'getOrderDetails',
			'getOrderId',
			'getOrderInfo',
			'getOrderStateId',
			'getOrderStatus',
			'getProductsToBuy',
			'getResponsible',
			'getShippingCost',
			'getTotalToBuy',
			'getWayPayment',
			'getWaypaymentsByCommerce',
			'invalidOrder',
			'token',
			'user',
			'isToogleBtn',
		]),
		discount,
		isOnlinePayment,
		stepOne,
		stepThree,
		stepTwo,
		total,
		listenerPriceOrder,
		styleBtnMobile,
	},
	methods: {
		goToMakeOrder,
		makeOrder,
		buildPayloadPhones,
	},
};
</script>
<style lang="scss" scoped>
	.btns-summary-order {
		@media (max-width:669px){
			background-color: var(--bg-mobile-color);
			border-radius: 10px;
			position:fixed;
			bottom: 0;
			left: 0;
			z-index: 11;
			width:94%;
			margin-left: 3%;
			margin-right: 3%;
			margin-bottom: 2px;
		}
	}
	.summary-container {
		position: relative;
		top: 0;
		margin: 0 auto;
		max-width: 400px;
	}

	.summary-order {
		background-color: white;
		border-radius: 20px;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.18);
		margin-bottom: 10px;
		padding: 8px;
		width: 260px;
	}

	.summary-header {
		border-bottom: 1px solid color(border);
		color: color(dark);
		font-family: font(demi);
		font-size: size(medium);
		font-weight: bold;
		padding: 25px 50px 17px;
	}

	.summary-title {
		margin: 0 auto;
		white-space: nowrap;	
	}

	.summary-amounts {
		color: color(dark);
		font-family: font(demi);
		font-size: size(medium);
		padding: 30px 32px 16px;
	}

	.summary-amount-container {
		align-items: center;
		display: flex;
		justify-content: space-between;
		padding: 8px 5px;
	}

	.total {
		margin-bottom: 0;
	}

	.separate {
		border-bottom: 1px solid color(border);
	}

	.shipping {
		padding-bottom: 12px;
	}

	.shipping-cost {
		align-items: center;
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.summary-amount {
		color: color(base);
		font-family: font(medium);
		font-size: size(medium);
	}

	.summay-total {
		font-family: font(bold);
	}
</style>

