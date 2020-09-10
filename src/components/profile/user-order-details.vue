<template>
	<div class="details-main-container">
		<section class="nav">
			<left-component @click="goTo" class="go-back"/>
			<p
				:style="`color: ${globalColors.primary};`"
				class="order-head">
				<span class="order-state">
					{{getValue('orderState.name', getOrderInfo)}}
				</span> - <span>nro orden </span>
				<span>{{getValue('number', getOrderInfo)}}</span>
			</p>
		</section>
		<section class="header">
			<div class="order-info">
				<div>
					<span class="label">Precio Total: </span><span class="order-info-data">{{getValue('total', getOrderInfo)}}</span>
				</div>
				<div>
					<span class="label">Fecha de la Orden: </span><span class="order-info-data">{{getValue('createdAt', getOrderInfo)}}</span>
				</div>
				<div>
					<span class="label">Estado pago: </span><span class="order-info-data">{{getValue('paymentStateName', getOrderInfo)}}</span>
				</div>
			</div>
			<div class="order-payment" v-if="!rating">
				<div class="order-payment-wrapper">
					<div class="mb-2 delivery-address">
						<div v-if="isPaymentLink" class="payment-link-data">
							<div class="link-container" v-if="pendingPayment">
								<span>Paga ahora en {{gatewayName}}: </span>
								<div class="link-wrapper">
									<a
										:href="paymentLink"
										class="order-info-data"
										:style="`color:${globalColors.primary}`"
										target="_blank"
										ref="link"
									>{{paymentLink}}</a>
								</div>
								<button class="copy-button" type="button" @click="copyLink">copiar</button>
							</div>
							<div>
								ID de transacción: <span class="label">{{transactionPaymentLinkId}}</span>
							</div>
						</div>
						<div v-if="isPaymentez && !isPaymentLink" class="payment-link-data">
							<div class="link-container">
								Id transacción: <span class="label">{{paymentezData.id}}</span>
							</div>
							<div>
								Código de transacción: <span class="label">{{paymentezData.code}}</span>
							</div>
						</div>
						<section>
							<span v-if="flagPickUp === 1" class="label">
								Direccion de envio: 
								<span class="order-info-data">{{getValue('customerAddress.addressLine1', getOrderInfo)}}</span>
							</span>
							<span v-else class="label">
								Direccion de recojo: 
								<span class="order-info-data">{{getValue('warehouseName', getOrderInfo)}}</span>
							</span>
						</section>
					</div>
					<app-button
						v-if="!flagAddVoucher && isDeposit"
						class="payment-btn mx-2"
						action="Añadir datos del deposito"
						max-width="276px"
						:background="globalColors.primary"
						:img="'/static/icons/hand.svg'"
						@click="addPaymentInfo"
					/>
				</div>
				<load-payment v-if="flagAddVoucher && isDeposit"/>
			</div>
		</section>
		<transition-group name="go-right" tag="div" class="relative rating-container">
			<section v-if="rating" class="absolute w-100" :key="1">
				<product-rating :product="currentProduct"/>
				<form-opinion @cancel-opinion="rating = !rating"/>
			</section>
			<section class="table w-100" v-else :key="2">
				<responsive-table
					align-left
					:columns="columns"
					:rows="details"
				>
					<template slot-scope="{ row }">
						<td class="row-product">
							<div class="product-info-container">
								<img :src="row.productImage" alt="imagen del producto" class="product-img"/>
								<div class="text-xs-left">
									<h4 class="product-name">{{row.productName}}</h4>
									<span class="product-description">{{row.description}}</span>
								</div>
							</div>
						</td>
						<td class="product-unit-price">{{row.salePrice}}</td>
						<td class="product-quantity">{{row.quantity}}</td>
						<td class="product-sub">{{row.total}}</td>
						<td v-if="orderStatusIsGiven">
							<button
								type="button"
								class="rating-button"
								:style="`color:${globalColors.primary};border-color:${globalColors.primary}`"
								@click="onRating(row)"
							>Califica</button>
						</td>
					</template>
				</responsive-table>
			</section>
		</transition-group>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import appButton from '@/components/shared/buttons/app-button';
import leftComponent from '@/components/shared/icons/left-component';
import loadPayment from '@/components/profile/load-payment';
import responsiveTable from '@/components/shared/table/respondive-table';
import { getDeeper, isEmpty } from '@/shared/lib';
import formOpinion from '@/components/products/form-opinion';
import productRating from '@/components/profile/product-rating';
import helper from '@/shared/helper';
import { deposit } from '@/shared/enums/wayPayment';
import * as gatewayCodes from '@/shared/enums/gatewayCodes';

async function created() {
	({ id: this.orderId } = this.$route.params);
	await this.$store.dispatch('LOAD_ORDER_DETAILS', { context: this, orderId: this.orderId });
	if (!isEmpty(this.getOrderInfo)) {
		const { additionalInfo, sessionGateway, additionalInformation } = this.getOrderInfo;
		this.$store.commit('UPDATE_FLAG_ADD_VOUCHER', !isEmpty(additionalInfo));
		this.additionalInformation = additionalInformation;
		this.sessionGateway = sessionGateway;
	}
	this.updateColumns();
}

function isPaymentLink() {
	return !isEmpty(this.getValue('data.url', this.sessionGateway));
}

function paymentLink() {
	if (this.isPaymentLink) {
		return this.getValue('data.url', this.sessionGateway);
	}
	return false;
}

function transactionPaymentLinkId() {
	if (this.isPaymentLink) {
		const gTransactionId = this.getValue('gatewayTransactionId', this.additionalInformation);
		const refId = this.getValue('paymentGateway.referenceId', this.additionalInformation);
		return refId || gTransactionId;
	}
	return false;
}

function gatewayName() {
	const { leadgods, pagopluxLink, placetopay } = gatewayCodes;
	const code = this.getValue('gatewayCode', this.additionalInformation);
	const options = {
		[leadgods]: 'Market Pago',
		[pagopluxLink]: 'Pago plux',
		[placetopay]: 'Place to Pay',
	};
	return options[code];
}

function pendingPayment() {
	return this.getValue('paymentStateName', this.getOrderInfo) === 'Pendiente';
}

function updateColumns() {
	this.columns = this.columns.reduce((list, col) => {
		if (!this.orderStatusIsGiven && col.value === 'action') {
			return list;
		}
		return list.concat(col);
	}, []);
}

function goTo() {
	this.$router.push({ name: 'user-orders' });
}

function addPaymentInfo() {
	this.$store.commit('UPDATE_FLAG_ADD_VOUCHER', true);
}

function getValue(route, order) {
	return getDeeper(route)(order);
}

function flagPickUp() {
	return getDeeper('flagPickUp')(this.getOrderInfo);
}

function details() {
	return getDeeper('details')(this.getOrderInfo);
}

function orderStatusIsGiven() {
	return getDeeper('orderState.code')(this.getOrderInfo) === 'GIVEN';
}

function onRating(product) {
	this.currentProduct = { ...product };
	this.$store.dispatch('setRatingProductId', product.productId);
	this.rating = !this.rating;
}

function isDeposit() {
	return getDeeper('wayPayment.code')(this.getOrderInfo) === deposit.code;
}

function copyLink() {
	const linkContainer = this.$refs.link;
	helper.copyFn(linkContainer);
	this.showNotification('Enlace copiado al porta papeles', 'primary');
}

function isPaymentez() {
	return getDeeper('paymentGateway')(this.additionalInformation);
}

function paymentezData() {
	if (this.isPaymentez) {
		return {
			id: this.isPaymentez.referenceId,
			code: this.isPaymentez.authorizationCode,
		};
	}
	return false;
}

function data() {
	return {
		additionalInformation: null,
		columns: [
			{ value: 'product', title: 'Producto', responsive: false },
			{ value: 'unitPrice', title: 'Precio Und', responsive: true },
			{ value: 'quantity', title: 'Cantidad', responsive: true },
			{ value: 'sub', title: 'Precio Subtotal', responsive: true },
			{ value: 'action', title: 'Acción', responsive: false },
		],
		currentProduct: {},
		orderId: 0,
		rating: false,
		sessionGateway: null,
	};
}

export default {
	name: 'user-order-details',
	components: {
		appButton,
		formOpinion,
		leftComponent,
		loadPayment,
		productRating,
		responsiveTable,
	},
	computed: {
		...mapGetters([
			'flagAddVoucher',
			'getOrderInfo',
		]),
		details,
		flagPickUp,
		gatewayName,
		isDeposit,
		isPaymentez,
		isPaymentLink,
		orderStatusIsGiven,
		paymentezData,
		paymentLink,
		pendingPayment,
		transactionPaymentLinkId,
	},
	created,
	data,
	methods: {
		addPaymentInfo,
		copyLink,
		getValue,
		goTo,
		onRating,
		updateColumns,
	},
};
</script>
<style lang="scss" scoped>
	.details-main-container {
		font-family: font(regular);
	}
	.product-info-container {
		align-items: center;
		display: grid;
		grid-column-gap: 20px;
		grid-template-columns: 50px 1fr;
	}

	.row-product {

		@media (max-width: 600px) {
			border: none;
		}
	}

	.product-img {
		height: 34px;
		object-fit: contain;
		width: 50px;
	}

	.table {

		td {
			padding: 10px 30px;
		}
	}

	.product-name {
		font-family: font(bold);
		font-size: size(medium);
		grid-column: 1;
		grid-row: 1;

		@media (max-width: 600px) {
			font-size: size(small);
		}
	}

	.product-description,
	.product-img {

		@media (max-width: 600px) {
			display: none;
		}
	}

	.product-unit-price {
		grid-column: 1;
		grid-row: 2;

		@media (max-width: 600px) {
			background-color: color(background);
			font-size: size(small);
		}
	}

	.product-quantity {
		grid-column: 2;
		grid-row: 2;

		@media (max-width: 600px) {
			background-color: color(background);
			font-size: size(small);
		}
	}

	.product-sub {
		grid-column: 3;
		grid-row: 2;

		@media (max-width: 600px) {
			background-color: color(background);
			font-size: size(small);
		}
	}

	.header {
		margin: 0 30px 10px;

		@media (max-width: 600px) {
			margin: 0 15px 30px;
		}
	}

	.order-info {
		align-items: center;
		border-bottom: 1px solid color(border);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 10px;
		padding: 10px 0;

		@media (max-width: 600px) {
			margin: 10px 0;
		}
	}

	.order-payment {
		padding: 10px 0;

		@media (max-width: 600px) {
			margin: 0;
		}
	}

	.label {
		color: color(dark);
		font-family: font(bold);
		font-size: size(small);
	}

	.order-info-data {
		color: color(dark);
		font-family: font(regular);
	}

	.nav {
		align-items: center;
		display: flex;
		justify-content: space-between;
		margin: 15px 24px 10px;
	}

	.order-head {
		font-family: font(demi);
		font-size: size(large);
		margin-bottom: 0;
		text-transform: uppercase;

		@media (max-width: 600px) {
			flex: 1 1 90%;
			font-size: size(small);
			text-align: center;
		}
	}

	.order-state {
		font-family: font(bold);
	}

	.order-payment-wrapper {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		min-width: 305px;
	}

	.payment-btn {
		display: flex;
		justify-content: flex-end;
		flex: 1 1 40%;

		@media (max-width: 600px) {
			justify-content: center;
			margin: auto;
		}
	}

	.go-back {

		@media (max-width: 600px) {
			flex: 1 1 5%;
		}
	}

	.delivery-address {
		flex: 1 1 50%;
	}

	.absolute {
		position: absolute;
	}

	.relative {
		position: relative;
	}

	.w-100 {
		width: 100%;
	}

	.rating-container {
		margin: 0 30px;

			@media (max-width: 600px) {
				margin: 0 10px;
			}
	}

	.rating-button {
		border-radius: 8px;
		border-style: solid;
		border-width: 1px;
		background-color: transparent;
		padding: 2px 10px;
	}

	.rating-button:hover {
		background-color: color(border);
	}

	.payment-link-data {
		align-items: flex-start;
		background-color: color(border);
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		font-size: size(small);
		justify-content: space-between;
		margin-bottom: 0.5rem;
		padding: 0.5rem 1rem;

		@media (min-width: 768px) {
			align-items: center;
			flex-direction: row;	
		}
	}

	.link-container {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 0.5rem;

		@media (min-width: 768px) {
			margin-bottom: 0rem;
		}

		span {
			flex-basis: 100%;

			@media (min-width: 768px) {
				flex-basis: auto;
			}
		}

		.link-wrapper {
			flex-basis: 70%;
			margin: 0 0.5rem;
			max-width: 17rem;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.copy-button {
		border: 1px solid color(dark);
		border-radius: 3px;
		font-family: font(regular);
		padding: 0.3rem 1.3rem;

		&:hover {
			background-color: color(dark);
			color: color(border);
		}
	}

</style>
