<template>
	<div>
		<section>
			<h3
				:style="`color: ${globalColors.primary};`"
				class="section-title">Mis favoritos</h3>
		</section>
		<section class="table">
			<responsive-table
				align-left
				:columns="columns"
				:rows="getFavorites"
				:pages="totalPages"
				@page-changed="pageChange"
			>
				<template slot-scope="{ row }">
					<td class="row-product">
						<div class="product-info-container">
							<img :src="row.urlImage" alt="imagen del producto" class="product-img"/>
							<div class="text-xs-left">
								<h4 class="product-name">{{row.name}}</h4>
							</div>
						</div>
					</td>
					<td class="product-unit-price">{{row.priceDiscount}}</td>
					<td class="product-date">{{row.createdAt}}</td>
					<td class="product-actions">
						<div class="product-actions-wrapper">
							<car-component class="action-btn" @click="buyThisProduct(row)"/>
							<delete-component class="action-btn" @click="noMoreFavorite(row)"/>
						</div>
					</td>
				</template>
			</responsive-table>
		</section>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import carComponent from '@/components/shared/icons/car-component';
import deleteComponent from '@/components/shared/icons/delete-component';
import responsiveTable from '@/components/shared/table/respondive-table';

async function created() {
	this.totalPages = await this.$store.dispatch(
		'LOAD_FAVORITES_PRODUCTS',
		{ context: this, params: this.params },
	);
}

function buyThisProduct(product) {
	this.$store.dispatch('addProductToBuyCar', product);
	this.goTo('buy');
}

async function noMoreFavorite(product) {
	await this.$store.dispatch('SET_FAVORITE_FLAG', { context: this, product });
	this.$store.dispatch('LOAD_FAVORITES_PRODUCTS', { context: this, params: this.params });
}

function pageChange(page) {
	this.params.page = page;
	this.$store.dispatch('LOAD_FAVORITES_PRODUCTS', { context: this, params: this.params });
}

function data() {
	return {
		columns: [
			{ value: 'product', title: 'Producto', responsive: false },
			{ value: 'unitPrice', title: 'Precio Und', responsive: true },
			{ value: 'createdAt', title: 'Fecha de Creación', responsive: true },
			{ value: 'actions', title: 'Acción', responsive: true },
		],
		params: {
			page: 1,
			limit: 5,
		},
		totalPages: 0,
	};
}

export default {
	name: 'favorites',
	components: {
		carComponent,
		deleteComponent,
		responsiveTable,
	},
	computed: {
		...mapGetters([
			'getFavorites',
		]),
	},
	created,
	data,
	methods: {
		buyThisProduct,
		noMoreFavorite,
		pageChange,
	},
};
</script>
<style lang="scss" scoped>

	.product-info-container {
		align-items: center;
		display: grid;
		grid-column-gap: 20px;

		@media (min-width: 600px) {
			grid-template-columns: 50px 1fr;
		}
	}

	.table {
		margin: 0 50px;
		
		@media (max-width: 600px) {
			margin: 0 10px;
		}

		tr {
			background-color: red;

			td {
				padding: 10px 30px;
	
				@media (max-width: 600px) {
					padding: 10px 20px;
				}
			}
		}

	}

	.row-product {
		grid-column: 1/3;

		@media (max-width: 600px) {
			align-items: center;
			background-color: color(disabled);
			display: flex;
			height: 100%;
		}
	}

	.product-name {
		font-family: font(bold);
		font-size: size(medium);

		@media (max-width: 600px) {
			font-size: size(small);
		}
	}

	.product-img {

		@media (max-width: 600px) {
			display: none;
		}
	}

	.product-unit-price {
		grid-column: 1;
		grid-row: 2;

		@media (max-width: 600px) {
			font-size: size(small);
		}
	}

	.product-date {
		grid-column: 2/4;
		grid-row: 2;
		white-space: nowrap;

		@media (max-width: 600px) {
			font-size: size(small);
			text-align: left;
		}
	}

	.product-actions {
		align-items: center;
		display: flex;
		grid-column: 3;
		grid-row: 1 / 3;
		height: 65px;
		padding: 10px 5px !important;

		@media (max-width: 600px) {
			border-bottom: none;
			font-size: size(small);
		}
	}

	.product-actions-wrapper {
		display: flex;
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

	.action-btn {
		margin: 0 10px;
	}

	.section-title {
		font-family: font(bold);
		font-size: size(large);
		margin: 30px 0 40px 40px;
		text-transform: uppercase;

		@media (max-width: 500px) {
			margin-bottom: 20px;
		}
	}
</style>
