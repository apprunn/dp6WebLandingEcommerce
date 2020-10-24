<template>
	<div class="summary-container">
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
		<section class="btns-summary-order">
			<app-button
				data-cy="make-order"
				v-if="stepOne"
				action='Hacer pedido'
				class="btn-order"
				:background="globalColors.primary"
				@click="goToMakeOrder"
			/>
			<app-button
				data-cy="go-pay"
				v-else-if="stepTwo"
				action="Pasar a caja"
				class="btn-order"
				:background="globalColors.primary"
				:disabled="invalidOrder"
				@click="makeOrder(false)"
			/>
			<app-button
				data-cy="pay"
				v-else-if="stepThree"
				action="Pagar"
				class="btn-order"
				:disabled="isOnlinePayment"
				:background="globalColors.primary"
				@click="makeOrder(true)"
			/>
		</section>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import appButton from '@/components/shared/buttons/app-button';
import { getDeeper } from '@/shared/lib';
import { creditCard } from '@/shared/enums/wayPayment';

function total() {
	return (this.getTotalToBuy - this.discount) + this.getShippingCost;
}

function makeOrder(flagFinish) {
	this.$store.dispatch('MAKE_ORDER', { flagFinish, context: this });
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
		this.goTo('buy-delivery');
	} else if (window.screen.width < 765) {
		this.showNotification(
			'Debe iniciar sesión para continuar',
			'accent',
		);
	} else {
		this.setLocalData('route-after-login', 'buy-delivery');
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
		]),
		discount,
		isOnlinePayment,
		stepOne,
		stepThree,
		stepTwo,
		total,
	},
	methods: {
		goToMakeOrder,
		makeOrder,
	},
};
</script>
<style lang="scss" scoped>
	.summary-container {
		position: sticky;
		top: 115px;
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

