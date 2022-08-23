<template>
	<div>
		<section class="summary-header-container">
			<div class="summary-header">
				<div>
					<h2 class="title">{{addressPickUp}}</h2>
					<p class="data" :style="`color:${globalColors.title}`">
						<span>{{responsible.fullname}},</span>
						<span>{{countryLabels.dni}}: {{responsible.dni}},</span>
						<span>Teléfono: {{responsible.phone}}.</span>
					</p>
					<p class="address">Dirección: {{addressDel}}</p>
				</div>
				<div v-if="billing">
					<h2 class="title">Solicitud de Factura</h2>
					<p class="billing-data" :style="`color:${globalColors.title}`">
						<span>RUC: {{billing.ruc}},</span>
						<span>Razón social: {{billing.rzSocial}},</span>
						<span>Domicilio fiscal: {{billing.address}}.</span>
					</p>
				</div>
			</div>
		</section>
		<section class="summary-content-container">
			<h2 class="title" :style="`color:${globalColors.primary}`">
				Resumen de compra - Pedido: {{this.order.number}}
			</h2>
			<div class="summary-content">
				<div class="products-in-order">
					<productInSummary
						class="products"
						v-for="(product, productIndex) in order.details"
						:key="productIndex"
						:product="product"
					/>
				</div>
				<div class="delivery-and-payment">
					<div>
						<div class="payment-status-container">
							<span class="delivery-title">Estado del pago:</span>
							<span class="delivery-result">{{order.paymentStateName}}</span>
						</div>
						<div class="payment-reference" v-if="showReference">
							<span class="delivery-title">Su pedido ha sido pagado sobre la referencia:</span>
							<span class="delivery-result">{{showReference}}</span>
						</div>
						<div class="subtotal-container">
							<span class="delivery-title">Subtotal:</span>
							<span class="delivery-result">{{currency}}{{order.subtotal | currencyFormat}}</span>
						</div>
						<div class="discount-container">
							<span class="delivery-title">Descuentos:</span>
							<span class="delivery-result">{{currency}}{{discount | currencyFormat}}</span>
						</div>
						<div class="shipping-cost-container">
							<span class="delivery-title">Costo de envío:</span>
							<output class="delivery-result">{{currency}}{{order.costShipping | currencyFormat}}</output>
						</div>
						<output class="total" :style="`color:${globalColors.primary}`">
							{{currency}} {{order.formatNumbers.total}}
						</output>
						<div class="payment-strategy">
							<div v-if="isOnlinePayment" class="online-payment">
								<h3 class="online-payment-title" :style="`color:${globalColors.primary}`">Pago Online</h3>
								<div v-if="link.exist">
									<h4 class="payment-link">Enlace de pago</h4>
									<img v-if="false" src="" alt="logo de pasarela de pagos">
									<div class="link-style-container">
										<a
											target="_blank"
											ref="link"
											:href="link.link"
											:style="`color:${globalColors.primary};border-color:${globalColors.primary}`"
										>{{link.link}}</a>
										<button @click="copyLink" class="copy-button" type="button">copiar</button>
									</div>
								</div>
								<div v-else>
									<h4>Botón de pago</h4>
									<img src="" alt="logo de pasarela de pagos">
								</div>
							</div>
							<div v-if="isReciveAndPay.exist" class="online-payment">
								<h3 class="online-payment-title" :style="`color:${globalColors.primary}`">{{isReciveAndPay.title}}</h3>
								<h4 class="payment-link">{{isReciveAndPay.description}}</h4>
							</div>
							<div v-if="isDeposit.exist" class="online-payment">
								<h3 class="online-payment-title" :style="`color:${globalColors.primary}`">{{isDeposit.title}}</h3>
								<h4 class="payment-link">{{isDeposit.description}}</h4>
								<div v-if="true">
									<swiper :options="swiperOption" ref="swp">
										<swiper-slide
											v-for="bankAccount in isDeposit.bankAccounts"
											:key="bankAccount.id"
										>
											<div class="bankAccount-container">
												<h4>{{bankAccount.bank && bankAccount.bank.name}}</h4>
												<div class="bankAccount-data">
													<span>
														A nombre de:{{bankAccount.additionalInformation && bankAccount.additionalInformation.personName}}
													</span>
													<span>Nro. Cta: {{bankAccount.accountNumber}}</span>
												</div>
											</div>
										</swiper-slide>
										<div class="swiper-button-prev" slot="button-prev">
											<ArrowLeft
												:color="globalColors.primary"
												class="arrow"
											/>
										</div>
										<div class="swiper-button-next" slot="button-next">
											<ArrowRight
												:color="globalColors.primary"
												class="arrow"
											/>
										</div>
									</swiper>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section v-if="isYape.exist">
			<YapeComponent
				:yape-name="isYape.name"
				:yape-phone="isYape.phone"
				:url-image="isYape.urlImage"
			/>
		</section>
		<section
			v-if="isNiubiz && isOnlinePayment"
			class="card-data-niubiz"
			data-cy="online-payment-info"
		>
			<h4>Pago realizado con tarjeta: <span>{{niubizGateway.cardBrand}}</span>, nro: <span>{{niubizGateway.cardNumber}}</span></h4>
			<h5>el día <span>{{niubizGateway.createdAt | formatDate}}</span></h5>
			<h4>Código de Referencia: {{ order.id }}</h4>
		</section>
		<v-flex pl-5 text-xs-center mt-2 mb-2 :style="`color:${globalColors.secondary}`">* Recuerde que debe imprimir o tomar captura a su pedido</v-flex>
		<section class="summary-btns">
			<button :style="`background-color:${globalColors.primary}`" type="button" @click="seeOrder">Ver pedido</button>
			<button
				data-cy="cancel-order"
				:style="`background-color:${globalColors.primary}`"
				type="button"
				@click="cancelOrder"
			>Cancelar pedido</button>
			<button
				:style="`background-color:${globalColors.primary}`"
				type="button"
				@click="printOrder"
			>Imprimir pedido</button>
		</section>

	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { getDeeper, isEmpty } from '@/shared/lib';
import { niubiz } from '@/shared/enums/gatewayCodes';
import { creditCard, deposit, reciveAndPay } from '@/shared/enums/wayPayment';
import deliveryWays from '@/shared/enums/waysDeliveries';
import productInSummary from '@/components/products/product-in-summary';
import helper from '@/shared/helper';
import ArrowLeft from '@/components/svg/ArrowLeft';
import ArrowRight from '@/components/svg/ArrowRight';
import YapeComponent from '@/components/order/yape-component';
import orderStatesEnum from '@/shared/enums/orderStateId';
import { Yape } from '@/shared/enums/depositPayment';

const { store, house } = deliveryWays;

function created() {
	const { orderId: id } = this.$route.params;
	if (id) {
		this.$store.dispatch('GET_ORDER_INFO', { context: this, id });
		const order = JSON.parse(localStorage.getItem('ecommerce-order-state')) || [];
		console.log(order, 'created');
		// if (order.orderStateId === 8 && order.paymentStateId === 3) {
		// 	this.orderStateOrder();
		// }
	}
}

async function orderStateOrder() {
	const { orderId: id } = this.$route.params;
	const body = {
		orderStateCode: orderStatesEnum.confirmed.code,
	};
	await this.$store.dispatch('SET_STATE_ORDERS', { context: this, body, id });
	const orderNumber = JSON.parse(localStorage.getItem('order-state-order')) || [];
	this.order.number = orderNumber.number;
}

function addressPickUp() {
	const shop = 'Recojo en tienda';
	const delivery = 'Envío a domicilio';
	return this.isHome ? delivery : shop;
}

function isHome() {
	return this.flagPickUp === house.value;
}

function isStore() {
	return this.flagPickUp === store.value;
}

function addressDel() {
	const { address, name, addressLine1, parish, city, province } = this.addressObject || {};
	if (this.isStore) {
		return `${name}, ${address}.`;
	}
	return `${addressLine1} - ${parish.name || ''} - ${city.name || ''}, ${province.name || ''}.`;
}

function billing() {
	return getDeeper('dataBill')(this.order);
}

function wayPayment() {
	return this.order.wayPayment;
}
/**
 * Cuando el pago es online wayPayment es null
 */
function isOnlinePayment() {
	const online = isEmpty(this.wayPayment);
	if (online) {
		return online;
	}
	return this.wayPayment.code === creditCard.code;
}

function isReciveAndPay() {
	return {
		description: getDeeper('description')(this.wayPayment),
		exist: getDeeper('code')(this.wayPayment) === reciveAndPay.code,
		title: getDeeper('name')(this.wayPayment),
	};
}

function isDeposit() {
	return {
		bankAccounts: getDeeper('commerce.bankAccountsRelated')(this.order),
		description: 'Usa alguna de nuestras cuentas bancarias para realizar el pago.',
		exist: getDeeper('code')(this.wayPayment) === deposit.code,
		title: getDeeper('name')(this.wayPayment),
	};
}

function link() {
	if (this.isOnlinePayment) {
		const paymentLink = getDeeper('additionalInformation.paymentGateway.url')(this.order);
		return {
			exist: !isEmpty(paymentLink),
			link: paymentLink,
		};
	}
	return false;
}

function copyLink() {
	const linkContainer = this.$refs.link;
	helper.copyFn(linkContainer);
	this.showNotification('Enlace copiado al porta papeles', 'primary');
}

function isNiubiz() {
	const codeNiubiz = getDeeper('additionalInformation.gatewayCode')(this.order);
	return codeNiubiz === niubiz;
}

function seeOrder() {
	const { id } = this.order;
	this.$router.push({ name: 'order-detail', params: { id } });
}

async function cancelOrder() {
	const { id } = this.order;
	await this.CANCEL_ORDER({ context: this, id });
	this.goTo('page-home');
}

function beforeDestroy() {
	this.SET_DEFAULT_VALUES();
	this.removeProductFromLS();
}

function discount() {
	const percentage = this.user.discount || 0;
	const amount = this.order.total * (Number(percentage) / 100);
	return Number(amount.toFixed(2));
}

function niubizGateway() {
	const payment = getDeeper('additionalInformation.paymentGateway')(this.order);
	const { cardBrand, cardReference } = payment;
	return {
		createdAt: this.order.createdAt,
		cardBrand,
		cardNumber: cardReference,
	};
}

function showReference() {
	return getDeeper('additionalInformation.paymentGateway.referenceId')(this.order);
}

function isYape() {
	const yapeCode = getDeeper('wayPaymentDetailCode')(this.order);
	if (yapeCode === Yape.code) {
		const { walletNumber, walletQR } = getDeeper('additionalInfo')(this.order) || {};
		return {
			exist: true,
			name: '',
			phone: walletNumber,
			urlImage: walletQR,
		};
	}
	return {
		exist: false,
		name: '',
		phone: '',
		urlImage: '',
	};
}

function printOrder() {
	window.print();
}

function validOrder() {
	console.log(this.orderStateId);
	console.log(this.paymentStateId);
}

function data() {
	return {
		swiperOption: {
			slidesPerView: 2,
			spaceBetween: 5,
			slidesPerGroup: 1,
			allowTouchMove: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
		},
	};
}

export default {
	name: 'page-new-summary-order',
	beforeDestroy,
	components: {
		ArrowLeft,
		ArrowRight,
		productInSummary,
		YapeComponent,
	},
	computed: {
		...mapGetters({
			addressObject: 'getDeliveryAddress',
			currency: 'getCurrencySymbol',
			flagPickUp: 'getFlagPickUp',
			order: 'getOrderInfo',
			responsible: 'getResponsible',
			user: 'user',
			paymentStateId: 'getPaymentStateId',
			orderStateId: 'getOrderStateId',
		}),
		addressDel,
		addressPickUp,
		billing,
		discount,
		isHome,
		isDeposit,
		isNiubiz,
		isOnlinePayment,
		isReciveAndPay,
		isStore,
		isYape,
		link,
		niubizGateway,
		wayPayment,
		showReference,
	},
	created,
	data,
	methods: {
		...mapActions([
			'SET_DEFAULT_VALUES',
			'CANCEL_ORDER',
			'removeProductFromLS',
		]),
		cancelOrder,
		copyLink,
		printOrder,
		seeOrder,
		orderStateOrder,
		validOrder,
	},
};
</script>
<style lang="scss" scoped>
.summary-header-container {
	border-bottom: 1px solid color(border);
	margin-bottom: 3rem;
	padding: 1.5rem 3rem;

	.summary-header {
		display: grid;
		grid-gap: 4rem;
		grid-template-columns: 1fr;
		font-family: font(regular);
		font-size: size(medium);
		margin: 0 auto;
		max-width: 900px;

		@media (min-width: 600px) {
			grid-template-columns: 1fr 1fr;
		}

		.title {
			font-family: font(bold) !important;
			font-size: size(medium) !important;
			margin-bottom: 0.5rem;
		}
		.data {
			display: grid;
			grid-auto-flow: row;
			margin-bottom: 0;

			@media (min-width: 900px) {
				grid-auto-flow: column;
			}
		}
		.billing-data {
			display: grid;
			grid-auto-flow: row;
			margin-bottom: 0;
		}
	}
}

.summary-content-container {
	padding: 0 2.5rem;

	.title {
		background-color: color(background);
		font-family: font(bold) !important;
		margin-bottom: 2.5rem;
		padding: 1rem;
		text-align: center;
	}

	.summary-content {
		border-radius: 8px;
		display: grid;
		margin: 0 auto;
		margin-bottom: 3rem;
		max-width: 1024px;
		overflow: hidden;
		padding: 0 1rem;

		@media (min-width: 768px) {
			grid-template-columns: 1fr 1fr;
		}

		.products-in-order {
			border-bottom: 2px solid color(border);

			@media (min-width: 768px) {
				border-bottom: none;
				border-right: 2px solid color(border);
			}
			.products {
				margin-bottom: 3.5rem;
			}
		}

		.delivery-and-payment {
			color: color(dark) !important;
			padding-top: 2.5rem;
			position: sticky;
			text-align: left !important;
			top: 5rem;

			@media (min-width: 768px) {
				padding-left: 3rem;
				padding-right: 2rem;
				padding-top: 1.5rem;
				overflow: hidden;
			}

			.payment-status-container,
			.discount-container,
			.subtotal-container,
			.shipping-cost-container,
			.payment-reference {
				font-family: font(heavy);
				font-family: font(heavy);

				.delivery-title {
					color: color(base);
					font-size: size(medium);
				}
			}

			.payment-status-container {
				font-family: font(bold);
				font-size: size(large);
				margin-bottom: 0.5rem;
			}

			.shipping-cost-container {
				margin-bottom: 0.5rem;
			}

			.total {
				font-family: font(bold) !important;
				font-size: size(big) !important;
			}

			.payment-strategy {
				margin-top: 1.5rem;

				.online-payment {

					.online-payment-title {
						font-family: font(bold);
						font-size: size(small);
						margin-bottom: 0.25rem;
						text-transform: uppercase;
					}

					.payment-link {
						color: color(base);
						margin-bottom: 0.25rem;
					}

					.link-style-container {
						display: grid;
						grid-auto-flow: column;
						gap: 1rem;

						a {
							border: 1px solid;
							overflow: hidden;
							padding: 0.5rem 1rem;
							text-overflow: ellipsis;
						}

						.copy-button {
							padding: 0 0.5rem;

							&:hover {
								background-color: color(border);
							}
						}
					}

					.bankAccount-container {
						border: 1px solid color(border);
						margin: 0.5rem auto 0;
						padding: 1rem;
						width: fit-content;

						.bankAccount-data {
							display: grid;
							grid-auto-flow: row;
							margin-left: 0.25rem;
						}
					}
				}

				.arrow {
					height: 100%;
					width: 100%;
				}
			}
		}
	}
}

.summary-btns {
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	font-family: font(bold);
	justify-content: center;
	margin-top: 3rem;

	button {
		color: white;
		margin: 1rem;
		padding: 0.75rem 2rem;
		width: 14rem;
	}
}

.card-data-niubiz {
	align-items: center;
	display: flex;
	flex-direction: column;
	font-family: font(regular);
	justify-content: center;
}

</style>
