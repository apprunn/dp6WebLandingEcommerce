<template>
	<div class="buyed-main-container">
		<ul class="buyed-products-container">
			<li
				:style="`color: ${globalColors.secondary};`"
				class="list buyed-main-container"
				v-for="product in getOrderDetails"
				:key="product.id"
			>
				<div class="grid-product">
					<div
						:class="[
							'product-info',
							{ 'show-description': currentProduct === product.id },
						]"
					>
						<h3 class="product-name">
							{{product.productName.toLowerCase()}}
						</h3>
						<span class="product-description">{{product.unitName.toLowerCase()}}</span>
					</div>
					<h3 class="product-quantity">Cantidad: {{product.quantity}} 
						<span class="product-unity">/ {{product.unitName.toLowerCase()}}</span>
					</h3>
					<h3
						class="product-total"
					>Total: {{getCurrencySymbol}}. {{product.total | currencyFormat}}</h3>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';

function toogleDescription({ id }) {
	if (this.currentProduct) {
		this.currentProduct = 0;
	} else {
		this.currentProduct = id;
	}
}

function moreInfoContent({ id }) {
	return this.currentProduct === id ? 'ver menos' : 'ver más';
}

function data() {
	return {
		currentProduct: 0,
		showAndHide: false,
	};
}

export default {
	name: 'products-buyed',
	computed: {
		...mapGetters([
			'getCurrencySymbol',
			'getOrderDetails',
		]),
	},
	data,
	methods: {
		moreInfoContent,
		toogleDescription,
	},
};
</script>
<style lang="scss" scoped>
	.buyed-products-container{
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	.buyed-main-container {
		background-color: white;
		font-family: font(bold);
		margin-bottom: 40px;
		padding: 10px 20px 10px 20px;
		@media (min-width: 768px) {
			padding: 0;
		}
	}

	.grid-product {
		align-items: center;
		display: grid;
    	grid-column-gap: 14px;
		grid-template-columns: 1.2fr 0.3fr 0.4fr;
		transform: translateX(15px);

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
			grid-column: 2/4;
			grid-row: 2;
			text-align: right;
		}
	}

	.product-info {
		max-height: 2rem;
		transition-duration: 200ms;
		text-transform:capitalize;
		@media (max-width: 600px) {
			grid-column: 1/4;
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
			@media (max-width: 385px) {
				display: none;
			}
		}
	}

	.product-quantity {
		color: color(dark);
		font-size: 12px;
		font-family: font(regular);
		@media (max-width: 600px) {
			grid-column: 1/2;
			grid-row: 2;
		}
	}
	.product-unity{
		@media (min-width: 385px) {
			display: none;
		}
	}

	.list {
		border-top: 1px solid color(border);
		border-radius: 8px;
		border: solid 1px color(border);
		margin-bottom: 5px;
		padding: 10px 20px 10px 20px;
		@media (min-width: 768px) {
			padding: 20px 32px 27px 20px;
		}
	}

	.list:first-child {
		border-top: none;
	}

	.show-description {
		max-height: 9rem;
	}

	.more-info-btn {
		font-family: font(regular);
		font-size: size(xsmall);
	}
</style>