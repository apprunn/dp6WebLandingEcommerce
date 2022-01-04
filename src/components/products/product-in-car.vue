<template>
	<div class="product-container">
		<trash-component v-if="stepOne" class="action" @click="deleteProduct"/>
		<section v-if="stepOne" class="grid-areas">
			<img
				@click="goToProduct(product)"
				:src="product.imagePresentation || (product.images ? (product.images.length > 0 ? product.images[0].urlImage : ''):'')"
				alt="imagen del producto"
				class="product-img image"
			>
			<div class="description">
				<p
					:style="`color: ${globalColors.primary};`"
					class="product-name">{{product.name}}</p>
				<p
					:style="`color: ${globalColors.subtitle};`"
					class="product-content">{{product.description}}</p>
				<p class="product-brand">{{product.unit.name}}</p>
				<p
					v-if="showUnity"
					:style="`color: ${globalColors.primary};`"
					class="product-title"> Disponibilidad: <span class="product-price">
						{{ stockAvaible }}
					</span>
				</p>
			</div>
			<div class="price">
				<p
					:style="`color: ${globalColors.primary};`"
					class="product-title">P.U.</p>
				<p class="product-price">{{getCurrencySymbol}} {{ product.priceDiscount | currencyFormat }}</p>
			</div>
			<div class="quantity">
				<p
					:style="`color: ${globalColors.primary};`"
					class="product-title">Cantidad</p>
				<div v-if="stepOne" class="quantity-button-container">
					<quantityButton
						class="continer-quantity-button"
						:number="product.quantity"
						@click="clickQuantity"
						:max-quantity="maxQuantity"
					/>
				</div>
				<p class="product-quantity" v-else>{{product.quantity}}</p>
			</div>
			<div class="total text-xs-center">
				<p
					:style="`color: ${globalColors.primary};`"
					class="product-title">Total</p>
				<p class="product-total">{{getCurrencySymbol}} {{product.total | currencyFormat}}</p>
			</div>
			<!-- <div class="comments">
				<text-area
					v-if="show"
					label="Comentarios"
					v-model="comments"
				/>
			</div> -->
		</section>
		
		<div v-else class="grid-product">
			<img class="img-pro" height="75" width="80" 
			:src="product.imagePresentation || (product.images ? (product.images.length > 0 ? product.images[0].urlImage : ''):'')"
			alt="Imagen">
			<div
				:class="[
					'product-info'
				]"
			>
				<h3 class="product-name">
					{{product.name ? product.name.toLowerCase(): product.name}}
				</h3>
				<span class="product-description">{{product.unit ? product.unit.name.toLowerCase() : product.unit.name}}</span>
			</div>
			<h3 class="product-quantity">Cantidad: {{product.quantity}} 
				<span class="product-unity">/ {{product.unit ? product.unit.name.toLowerCase(): product.unit}}</span>
			</h3>
			<h3
				class="product-total"
			>Total: {{getCurrencySymbol}}. {{product.total | currencyFormat}}</h3>
		</div>
				
		<!-- <section class="actions">
			<comments-component class="action" @click="showComments"/>
			<trash-component class="action" @click="deleteProduct"/>
		</section> -->
	</div>
</template>
<script>
import commentsComponent from '@/components/shared/icons/comments-component';
import textArea from '@/components/shared/inputs/text-area';
import trashComponent from '@/components/shared/icons/trash-component';
import quantityButton from '@/components/shared/buttons/quantity-button';
import { mapGetters } from 'vuex';


function goToProduct({ slug, id }) {
	const params = { id: slug || id };
	this.goTo('detail-product', { params });
}


function showComments() {
	this.show = !this.show;
}

function clickQuantity(val) {
	let { quantity } = this.product;
	const opt = {
		more: 1,
		less: -1,
	};
	quantity += opt[val];
	quantity = quantity < 1 ? 1 : quantity;
	if (this.showUnity) {
		if (quantity >= this.stockAvaible) {
			this.maxQuantity = true;
			this.showNotification('No cuenta con la disponibilidad de stock del producto', 'warning');
		} else {
			this.maxQuantity = false;
		}
	}
	this.$set(this.product, 'quantity', quantity);
	this.$forceUpdate();
	this.$store.commit('UPDATE_PRODUCTS_TO_BUY', { product: this.product, context: this });
}

function stepOne() {
	return this.$route.meta.step === 1;
}

function deleteProduct() {
	const { id, unitSelected } = this.product;
	this.$store.commit('DELETE_PRODUCT_BUY_CAR', { id, unitSelected });
}

function data() {
	return {
		comments: '',
		show: false,
		maxQuantity: false,
	};
}

export default {
	name: 'product-in-car',
	components: {
		commentsComponent,
		textArea,
		trashComponent,
		quantityButton,
	},
	computed: {
		...mapGetters([
			'getCurrencySymbol',
			'stockAvaible',
		]),
		stepOne,
	},
	data,
	methods: {
		clickQuantity,
		deleteProduct,
		showComments,
		goToProduct,
	},
	props: {
		product: {
			default: () => {},
			type: Object,
		},
		showUnity: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
<style lang="scss" scoped>
	.product-container {
		background-color: color(background);
		border-radius: 20px;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.18);
		margin-bottom: 10px;
		padding: 10px;
		position: relative;
	}

	.grid-areas {
		display: grid;
		grid-template-areas:
			"image image description description"
			"price quantity quantity total";
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: 1fr 0.2fr;
		padding-bottom: 8px;

		@media (min-width: 800px) {
			grid-gap: 10px;
			grid-template-columns: 0.5fr 0.5fr 1fr 0.5fr;
			grid-template-rows: 0fr 0fr;
			grid-template-areas:
				"image description description description "
				"image price quantity total";
			margin-bottom: 0px;
		}

		@media (min-width: 925px) {
			grid-gap: 10px;
			grid-template-columns: 0.5fr 0.5fr 0.5fr 1fr 0.5fr;
			grid-template-areas:
				"image image description description description "
				"image image price quantity total";
			margin-bottom: 0px;
		}
	}

	.comments {
		display: none;
		grid-area: comments;
		margin-top: 20px;
		margin: 0;

		@media (min-width: 800px) {
			display: block;
		}
	}

	.image {
		grid-area: image;
	}

	.description {
		grid-area: description;
		place-self: flex-start;
		margin-top: 15px;
		text-transform: lowercase;
		width: 100%;
		@media (min-width: 800px) {
			margin-top: 0;
			padding-left: 20px;
		}
	}

	.price {
		grid-area: price;
		padding-left: 15px;
		@media (min-width: 800px) {
			margin-top: 0;
			padding-left: 20px;
		}
	}

	.quantity {
		align-items: center;
		display: flex;
		flex-direction: column;
		grid-area: quantity;
		place-self: stretch;

		@media (min-width: 800px) {
			justify-self: center;
		}
	}

	.total {
		grid-area: total;
		place-self: flex-end;
		padding-right: 10px;

		@media (min-width: 800px) {
			place-self: stretch;
		}
	}

	.product-img {
		height: 6rem;
		object-fit: contain;
		margin: 0 auto;
		width: 6rem;

		@media (min-width: 800px) {
			height: 9rem;
			width: 9rem;
		}
	}

	.product-title {
		font-family: font(regular);
		margin-bottom: 0;
	}

	.product-name {
		color: color(dark);
		font-size: size(medium);
		margin-bottom: 0px;
		padding-right: 2rem;
		text-align: left;
		width: inherit;
		text-transform: lowercase;
	}
	.product-name:first-letter {
		text-transform: uppercase
	}
	.product-content {
		color: color(dark);
		font-family: font(regular);
		font-size: size(medium);
		font-weight: bold;
		margin-bottom: 0px;
		padding-right: 2rem;
		text-align: left;
		text-transform: lowercase;
		width: inherit;
		@media screen and (max-width: 800px) {
			display: none;
		}
	}

	.product-brand {
		color: color(base);
		font-size: size(msmall);
	}

	.product-price {
		color: color(dark);
		font-family: font(bold);
		font-size: size(medium);
		white-space: nowrap;
	}

	.product-total {
		color: color(dark);
		font-family: font(bold);
		font-size: size(sbig);
		white-space: nowrap;
	}

	.product-quantity {
		color: color(base);
		font-family: font(bold);
		font-size: size(large);
	}

	.actions {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: auto;
		flex-direction: row;
	}

	.action {
		margin: 5px 15px;
		position: absolute;
		right: 10px;
		top: 10px;
	}
	.continer-quantity-button {
		margin-top: -12px;
	}

	.quantity-button-container {
		display: flex;
		justify-content: center;
		margin-top: 16px;
	}


	.grid-product {
		align-items: center;
		display: grid;
		grid-column-gap: 14px;
		grid-template-columns: 0.5fr 1.1fr 0.3fr 0.4fr;
		transform: translateX(15px);
		padding: 10px;

		@media (max-width: 600px) {
			grid-column-gap: 0px;
			grid-row-gap: 10px;
			transform: translateX(0px);
		}
	}

	.product-total {
		color: color(dark);
		font-size: 12px;
		font-family: font(regular);
		text-align: center;

		@media (max-width: 600px) {
			grid-column: 2/5;
			grid-row: 2;
			text-align: right;
		}
	}

	.img-pro {
		@media (max-width: 600px) {
			grid-column: 1/2;
			grid-row: span 2;
		}
	}

	.product-info {
		max-height: 2rem;
		transition-duration: 200ms;
		text-transform:capitalize;
		@media (max-width: 600px) {
			grid-column: 2/5;
			grid-row: 1;
		}
		
		.product-name {
			color: color(dark);
			text-transform:capitalize;
			font-size: 13px;
		}
		.product-description {
			color: color(dark);
			font-family: font(regular);
			font-size: size(small);
			@media (max-width: 550px) {
				display: none;
			}
		}
	}

	.product-quantity {
		color: color(dark);
		font-size: 12px;
		font-family: font(regular);
		@media (max-width: 600px) {
			grid-column: 2/2;
			grid-row: 2;
		}
	}
	.product-unity{
		text-transform: capitalize;
		@media (min-width: 550px) {
			display: none;
		}
	}

	.show-description {
		max-height: 9rem;
	}

	.more-info-btn {
		font-family: font(regular);
		font-size: size(xsmall);
	}
</style>
