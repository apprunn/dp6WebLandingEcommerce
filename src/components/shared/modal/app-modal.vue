<template>
	<div>
		<section class="modal-header">
			<div class="close-button">
				<button type="button" :style="`color:${globalColors.primary}`" @click="$emit('close-modal')">x</button>
			</div>
			<h3 class="header-text" :style="`color:${globalColors.title}`">Se añadió al carrito</h3>
		</section>
		<section class="modal-content">
			<img
				data-cy="modal-add-to-cart-img"
				:src="product.imagePresentation"
				alt="imagen del producto"
			>
			<p class="product-information">
				<span class="product-name">{{ product.name }}</span>
				<span>{{ product.description | cuttingWord(62) }}</span>
				<span 
					class="product-price"
					:style="`color:${globalColors.secondary}`"
					v-if="wholeSalePrice.length > 0 &&
					Number(product.quantity) >= wholeSalePrice[0].from &&
					Number(product.quantity) <= wholeSalePrice[0].to &&
					wholeSalePrice[0].price !== 0">
					{{getCurrencySymbol}}{{Number(product.quantity) * Number(wholeSalePrice[0].price) | currencyFormat}}
				</span>
				<span
					v-else
					class="product-price"
					:style="`color:${globalColors.secondary}`"
				>{{getCurrencySymbol}}{{Number(product.quantity) * Number(product.priceDiscount) | currencyFormat}}</span>
			</p>
			<trash-component class="action" @click="deleteProduct"/>
		</section>
		<section class="modal-footer">
			<button 
				data-cy="go-to-cart"
				type="button"
				:style="`color:${globalColors.primary};border-color:${globalColors.primary}`"
				@click="redirect('buy')"
			>Ir al carrito</button>
			<button 
				type="button"
				:style="`border-color:${globalColors.primary};background-color:${globalColors.primary};color:white`"
				@click="redirect('page-home')"
			>Seguir comprando</button>
		</section>
	</div>
</template>
<script>
import trashComponent from '@/components/shared/icons/trash-component';
import { mapGetters } from 'vuex';

function redirect(name) {
	this.goTo(name);
	this.$emit('close-modal');
}

function deleteProduct() {
	const { id, unitSelected } = this.product;
	this.$store.commit('DELETE_PRODUCT_BUY_CAR', { id, unitSelected });
}

export default {
	name: 'app-modal',
	components: {
		trashComponent,
	},
	computed: {
		...mapGetters([
			'getCurrencySymbol',
			'getTotalToBuy',
		]),
	},
	methods: {
		deleteProduct,
		redirect,
	},
	props: {
		product: {
			default: () => {},
			type: Object,
		},
		wholeSalePrice: {
			default: () => [],
			type: Array,
		},
	},
};
</script>
<style lang="scss" scoped>
.modal-header {
	border-bottom: 1px solid color(border);
	padding: 0 20px 10px;

	.close-button {
		align-items: center;
		display: flex;
		justify-content: flex-end;

		button {
			font-family: font(bold);
			padding: 0px 10px;
			transform: translateX(25px);
		}
	}

	.header-text {
		font-family: font(demi);
		text-align: center;
		text-transform: uppercase;
	}
}

.modal-content {
	align-items: center;
	border-bottom: 1px solid color(border);
	display: grid;
	font-size: size(small);
	grid-gap: 15px;
	grid-template-columns: 0.5fr 1fr 0.15fr;
	padding: 10px 20px;
	text-align: center;

	img {
		height: 62px;
		width: 80px;
	}

	.product-information {
		display: flex;
		flex-direction: column;
		margin: 0;
		text-align: left;

		.product-name {
			font-family: font(bold);
		}

		.product-price {
			font-family: font(bold);
			font-size: size(large);
			margin-top: 5px;
		}
	}
}

.modal-footer {
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 10px 45px;

	button {
		border-radius: 6px;
		border-style: solid;
		border-width: 1px;
		font-family: font(regular);
		font-size: size(msmall);
		margin: 5px 0;
		padding: 3px 0;
		width: 100%;
	}
}
</style>