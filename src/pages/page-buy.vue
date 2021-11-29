<template>
	<div class="buy-container">
		<section class="rejected-transaction" v-if="isNiubiz">
			<h4>La transacción <span>{{transactionId}}</span> fue rechazada</h4>
			<h5>Nro pedido: <span>{{getOrderInfo.id}}</span></h5>
			<h5>fecha: <span>{{getOrderInfo.createdAt | formatDate}}</span></h5>
			<h4>Razón: <span>{{ getOrderInfo.additionalInformation.paymentGateway.status }}</span> </h4>
		</section>
		<div
			v-if="stepThree"
			:style="`border-bottom: 3px solid ${globalColors.primary});`"
			class="summary"
		>
			<summary-in-payment
				:delivery="{}"
				:billing="{}"
			/>
		</div>
		<div class="buy-layout">
			<section class="big">
				<div v-if="stepOneAndTwo" class="mb-5">
					<div class="section-title" v-if="stepTwo">
						<img :src="logo.section" alt="logo del método de pago">
						<h2 class="payment-section-title">PRODUCTOS </h2>
					</div>
					<product-in-car
						:show-unity="showUnity"
						data-cy="product-in-car"
						v-for="(product, indexProduct) in getProductToBuy"
						:key="indexProduct"
						:product="product"
					/>
					<div class="footter-products-buy">
						<app-button
							max-width="225px"
							action="Continuar comprando"
							class="continue-buying"
							:background="globalColors.secondary"
							@click="goTo('page-home')"
						/>
						<div class="total-product" :style="`color: ${globalColors.subtitle}`">
							<span>Total de productos: </span>
							<div class="amount-total-products" :style="`background-color: ${globalColors.title}`">
								<output>{{getTotalQuantityProducts}}</output>
							</div>
						</div>
					</div>
				</div>
				<router-view></router-view>
			</section>
			<section class="small">
				<summary-order/>
			</section>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getDeeper } from '@/shared/lib';
import { niubiz } from '@/shared/enums/gatewayCodes';
import appButton from '@/components/shared/buttons/app-button';
import productInCar from '@/components/products/product-in-car';
import summaryOrder from '@/components/order/summary-order';
import summaryInPayment from '@/components/order/summary-in-payment';

function created() {
	const ecommerceLocal = this.getLocalStorage('ecommerce::ecommerce-data');
	const localOrder = this.getLocalStorage('ecommerce-order');
	const company = this.getCommerceData.company ? ecommerceLocal.company : ecommerceLocal.company;
	this.showUnity = company.settings ? company.settings.flagShowBaseUnit : false;
	this.$store.dispatch('UPDATE_ORDER_FROM_LOCAL_STORAGE', localOrder);
}

async function mounted() {
	const { orderId: id } = this.$route.params;
	if (id) {
		await this.$store.dispatch('GET_ORDER_INFO', { context: this, id });
	}
}

function stepOneAndTwo() {
	const step = getDeeper('meta.step')(this.$route);
	return step !== 3;
}

function stepThree() {
	return getDeeper('meta.step')(this.$route) === 3;
}

function stepTwo() {
	return getDeeper('meta.step')(this.$route) === 2;
}

function getProductToBuyHandler(newProducts) {
	if (newProducts && newProducts.length === 0) {
		this.goTo('page-home');
	}
}

function transactionId() {
	const transactionNumber = getDeeper('additionalInformation.gatewayTransactionId');
	return transactionNumber(this.getOrderInfo);
}

function isNiubiz() {
	const codeNiubiz = getDeeper('additionalInformation.gatewayCode')(this.getOrderInfo);
	return codeNiubiz === niubiz;
}

function data() {
	return {
		showUnity: false,
		logo: {
			section: '/static/icons/shopping-basket.svg',
		},
	};
}

export default {
	name: 'page-buy',
	components: {
		appButton,
		productInCar,
		summaryOrder,
		summaryInPayment,
	},
	computed: {
		...mapGetters([
			'getCommerceData',
			'getProductToBuy',
			'getTotalQuantityProducts',
			'getOrderInfo',
		]),
		isNiubiz,
		stepOneAndTwo,
		stepThree,
		stepTwo,
		transactionId,
	},
	created,
	data,
	methods: {
		getProductToBuyHandler,
	},
	mounted,
	watch: {
		getProductToBuy: {
			deep: true,
			handler: getProductToBuyHandler,
		},
	},
};
</script>
<style lang="scss" scoped>
	.buy-container {
		display: grid;
		grid-template-rows: 1fr;
		margin: 0 auto;
		max-width: 1000px;
		padding: 40px 0;
		width: 100%;
	}

	.buy-layout {
		align-items: flex-start;
		display: flex;
		flex-wrap: wrap;
		height: 100%;
		padding: 0 10px;

		@media (max-width: 875px) {
			height: auto;
		}
	}

	.big {
		flex: 1 0 60%;
		height: max-content;
		margin-bottom: 20px;

		@media (min-width: 750px) {
			margin-right: 10px;
		}
	}

	.small {
		flex: 0 0 20%;
		height: auto;
		margin: 0 auto;
		position: sticky;
		top: 8rem;
	}

	.footter-products-buy {
		align-items: center;
		display: flex;
		justify-content: space-between;
	}

	.total-product {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		font-family: font(demi);

		@media (max-width: 600px) {
			justify-content: flex-end;
		}
	}

	.amount-total-products {
		align-items: center;
		border-radius: 5px;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.18);
		color: white;
		display: flex;
		height: 38px;
		justify-content: center;
		margin-left: 5px;
		width: 102px;

		output {
			font-family: font(demi);
			font-size: size(large);
			font-weight: bold;
		}
	}

	.continue-buying {
		width: 200px;

		@media (max-width: 600px) {
			width: 190px !important;
		}
	}

	.summary {
		margin-bottom: 30px;
		padding: 30px 0;
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

	.rejected-transaction {
		background-color: rgba(237, 100, 100, 0.15);
		border: 1px solid color(error);
		color: color(error);
		margin: 0 3rem;
		padding: 1rem;
	}
</style>
