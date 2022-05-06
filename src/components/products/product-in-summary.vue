<template>
	<div class="product-container">
		<div class="product-img-container">
			<img :src="product.productImage" alt="imagen del producto">
		</div>
		<div class="product-content-container">
			<div>
				<h3 class="product-name">{{product.productName}}</h3>
				<span class="product-description">{{product.description}}</span>
			</div>
			<!-- <span class="product-brand">{{product.brandName}}</span> -->
			<span class="product-price">{{currency}} {{product.salePrice | currencyFormat}}</span>
			<span class="product-quantity">
				Cantidad: 
				<output class="quantity">{{product.quantity}}</output>
				<span class="product-unit">{{product.unitName}}</span>
			</span>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
	name: 'product-in-summary',
	computed: {
		...mapGetters({
			currency: 'getCurrencySymbol',
		}),
	},
	props: {
		product: {
			type: Object,
			required: true,
		},
	},
};
</script>
<style lang="scss" scoped>
.product-container {
	display: grid;
	grid-gap: 1rem;
	grid-template-columns: 90px 1fr;
	line-height: 1;

	.product-img-container {
		border: 1px solid color(border);
		height: 90px;
		padding: 1rem;
		width: 90px;

		img {
			height: 100%;
			object-fit: contain;
			width: 100%;
		}
	}

	.product-content-container {
		display: grid;
		font-family: font(bold);
		grid-auto-flow: row;
		grid-gap: 0.5rem;

		.product-name {
			color: color(dark);
			font-size: size(medium);
		}

		.product-description {
			font-family: font(regular);
			font-size: size(msmall);
		}

		.product-brand,
		.product-quantity {
			color: color(base);
			font-size: size(msmall);
		}

		.product-quantity {
			padding: 0.25rem 0;
		}

		.product-price,
		.quantity {
			color: color(dark);
			font-size: size(medium);
		}

		.product-price {
			font-size: size(large);
		}

		.product-unit {
			color: color(dark);
			font-family: font(regular);
		}
	}
}
</style>