<template>
	<div>
		<section
			v-if="products.length > 0"
			class="product-section transition-product-section"
			data-cy="productsSection"
		>
			<product-card
				class="product-card"
				v-for="product in products"
				:key="product.id"
				:product="product"
			/>
		</section>
		<section v-else>
			<div class = "loading-products">
				<spinner-loading  :loading="loadingProducts" ></spinner-loading>
			</div>
			<h2 v-if="!loadingProducts" class="no-results" :style="`color: ${globalColors.primary}`">No se encontraron productos para su búsqueda</h2>
		</section>
		<div class="see-more-btn" v-if="products.length > 0">
			<button
				v-if="getProducts && getLastPage !== currentPage"
				type="button"
				:class="[
					{ 'loading': indeterminate },
				]"
				:style="`border:1px solid ${globalColors.primary};color:${globalColors.primary};`"
				@click="addMoreProduct"
			>Seguir Viendo</button>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import productCard from '@/components/products/product-card';
import SpinnerLoading from '@/components/shared/spinner/spinner-loading';

function addMoreProduct() {
	this.$store.dispatch('MORE_PRODUCTS');
	this.$store.dispatch('LOAD_PRODUCTS', { context: this });
}

function products() {
	return this.indeterminate ? this.defaultProducts : this.getProducts;
}

function data() {
	return {
		defaultProducts: Array(10).fill({}),
		search: '',
	};
}

export default {
	name: 'page-products',
	components: {
		productCard,
		SpinnerLoading,
	},
	computed: {
		...mapGetters([
			'currentPage',
			'getFilters',
			'getLastPage',
			'getProducts',
			'indeterminate',
			'loadingProducts',
		]),
		products,
	},
	data,
	methods: {
		addMoreProduct,
	},
};
</script>
<style lang="scss" scoped>
	.loading-products {
		margin-top: 7%;
		margin-bottom: 7%;
		text-align: center;
		width: 100%;
	}

	.product-section {
		align-items: center;
		display: grid;
		flex-wrap: wrap;
		grid-gap: 0;
		
		margin: 20px 1em;
		max-width: 1280px;

		@media (min-width: 600px) { 
			margin: 42px 1em;
			grid-gap: 1rem;
			grid-template-columns: repeat(auto-fill, minmax(214px, 1fr));
		}
		@media (min-width: 1280px) { 			
			margin: 42px auto;
		}
	}

	.see-more-btn {
		align-items: center;
		display: flex;
		justify-content: center;
		margin: 0 30px 2rem;

		button {
			background-color: white;
			border-radius: 3px;
			flex: 1 1 auto;
			font-family: font(heavy);
			font-size: size(large);
			padding: 7px 30px;
			max-width: 630px;
			min-width: 255px;
		}
	}

	.no-results {
		padding: 30px;
		text-align: center;
	}
</style>
