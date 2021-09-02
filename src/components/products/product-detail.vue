<template>
	<div class="product-detail">
		<div>
			<heart-component
				v-model="data.flagFavorite"
				class="container-like"
				@click="addToFavorites"
				:value="data.flagFavorite"
			/>
		</div>
		<div class="container-detail-information">
			<div class="container-detail-name">
				<p
					data-cy="product-name"
					:class="[isLoading ? 'loading' : 'product-detail-name']"
				>{{ data.name }}</p>
				<p
					v-if="data.description"
					data-cy="product-description"
					:class="[isLoading ? 'loading' : 'product-detail-description']"
				>{{ data.description }}</p>
				<p
					v-if="data.getBrandName"
					:class="[isLoading ? 'loading' : 'product-detail-brand']"
				>{{ data.getBrandName }}</p>
			</div>
			<div class="d-center container-code-rating">
				<span
					:class="[isLoading ? 'loading' : 'product-detail-code']"
				>#{{ data.code }}</span>
				<div
					:class="[
						isLoading ? 'loading rating-loading' : 'container-rating d-center',
					]"
				>
					<v-rating
						v-show="!isLoading"
						small
						class="product-rating"
						background-color="#ffcc03"
						color="#f8e71c"
						v-model="data.rating"
						readonly
					></v-rating>
					<span
						v-show="!isLoading"
						class="text-rating"
					>{{ data.rating }} / 5</span>
				</div>
			</div>
		</div>
		<div class="container-detail-bottom">
			<div class="d-center">
				<span
					v-show="data.priceDiscount"
					:class="[isLoading ? 'loading' : 'text-price-dis']"
					:style="`color: ${globalColors.primary}`"
				>
					{{ getCurrencySymbol }} {{ data.priceDiscount | currencyFormat }}
				</span>
			</div>
			<span
				v-if="data.price"
				:class="[
					isLoading ? 'loading' : data.priceDiscount >= 0 ? 'text-price' : 'text-price-dis',
				]"
				:style="`color: ${globalColors.primary}`"
			>
				{{ getCurrencySymbol }} {{ data.price | currencyFormat }}
			</span>
		</div>
		<ProductConversions
			:show-unit="showUnity"
			:default-unit="data.unit"
			:conversions="data.conversions"
			:stock-product="data.stock"
			@unit-selection="unitSelection"
		/>
		<v-flex mt-3 text-xs-center class="content-dis" v-if="showUnity">
			<h4 :style="`color:${globalColors.title}`">Disponibilidad: <span class="number-dispon">{{ stockAvaible }}</span></h4>
		</v-flex>
		<product-childrens
			:features="features"
			@selected="selecFeature"
			@clear="$emit('clear')"/>
		<product-buy
			:disabled-order="!stockAvaible > 0"
			:open-warehouse="openWarehouse"
			:number="data.quantity"
			:product="data"
			@click="clickQuantity"
			@add-to-car="addToCar"
			@open-dialog="$emit('open-dialog')"
		/>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getDeeper } from '@/shared/lib';
import heartComponent from '@/components/shared/icons/heart-component';
import productChildrens from '@/components/products/product-childrens';
import productBuy from '@/components/products/product-buy';
import ProductConversions from '@/components/products/product-conversions';
import TypeProduct from '@/shared/enums/typeProduct';
import helper from '@/shared/helper';

function stopClick() {
	return false;
}

async function addToFavorites() {
	this.$store.dispatch('SET_FAVORITE_FLAG', { context: this, product: this.data });
	this.$set(this.data, 'flagFavorite', !this.data.flagFavorite);
}

function selecFeature(value) {
	this.$emit('selected', value);
}

function clickQuantity(value) {
	this.$emit('click-quantity', value);
}

function noStock() {
	return helper.stockGreaterThanCero(this.data);
}

function isVariation() {
	const variationCode = getDeeper('typeInfo.code')(this.data);
	return variationCode === TypeProduct.variation;
}

function isComposed() {
	const composeCode = getDeeper('typeInfo.code')(this.data);
	return composeCode === TypeProduct.compose;
}

function isService() {
	const serviceCode = getDeeper('typeInfo.code')(this.data);
	return serviceCode === TypeProduct.service;
}

function addToCar() {
	if (!this.noStock) {
		this.$store.dispatch('addProductToBuyCar', this.data);
		this.$emit('open-confirm-modal');
	} else {
		this.showGenericError('Producto sin stock', 80000);
	}
}

function getBrandName(data) {
	return getDeeper('warehouseProduct.brand.name')(data);
}

function unitSelection(item) {
	this.$emit('unit-selection', item);
}

export default {
	name: 'product-detail',
	components: {
		heartComponent,
		productChildrens,
		ProductConversions,
		productBuy,
	},
	computed: {
		...mapGetters([
			'getCurrencySymbol',
		]),
		...mapGetters('loading', [
			'isLoading',
		]),
		isComposed,
		isService,
		isVariation,
		noStock,
	},
	methods: {
		addToCar,
		addToFavorites,
		clickQuantity,
		getBrandName,
		stopClick,
		selecFeature,
		unitSelection,
	},
	props: {
		data: {
			default: () => {},
			type: Object,
		},
		features: {
			default: () => [],
			type: Array,
		},
		stockAvaible: {
			type: Number,
			default: 0,
		},
		showUnity: {
			type: Boolean,
			default: false,
		},
		openWarehouse: false,
	},
};
</script>
<style lang="scss" scoped>
	.product-detail-name {
		color: color(black);
		font-family: font(demi);
		font-size: size(xlarge);
		margin: 20px 0 5px 0;
		text-transform: uppercase;
	}

	.product-detail-description {
		text-transform: lowercase;
	}
	.product-detail-code {
		color: color(base);
		flex: 1 1 30%;
		font-family: font(medium);
		font-size: size(medium);

		@media screen and (max-width: 996px) {
			display: none;
		}
	}

	.d-center {
		align-items: center;
		display: flex;
	}

	.container-rating  {
		flex: 1 1 70%;

		@media screen and (max-width: 996px) {
			align-items: flex-end;
			flex-direction: column;
		}
	}

	.text-rating {
		color: color(base);
		font-size: size(small);
		margin-left: 8px;
	}

	.text-price-dis {
		font-family: font(bold);
		font-size: 26px;
	}

	.content-discount {
		align-items: center;
		border-radius: 5px;
		color: color(white);
		display: flex;
		height: 18px;
		justify-content: center;
		font-size: size(msmall);
		margin-left: 10px;
		width: 45px;
	}

	.text-price {
		color: color(base) !important;
		font-family: font(bold);
		font-size: size(large);
		position: relative;

		&::before {
			border-color: color(border);
			border-top: 2px solid;
			content: "";
			left: 0;
			position: absolute;
			right: 0;
			top: 50%;
			transform:rotate(-10deg);
		}
	}

	.mt-25 {
		margin: 25px 0 15px 0;

		@media screen and (max-width: 996px) {
			margin: 0;
		}
	}

	.product-detail {
		@media screen and (max-width: 996px) {
			margin-top: 39px;
		}
	}

	.container-like {
		margin-bottom: 5px;
		@media screen and (max-width: 996px) {
			margin: auto;
		}
	}

	.container-detail-information {
		@media screen and (max-width: 996px) {
			display: flex;
			padding: 0 5%;
		}
	}

	.container-detail-name {
		@media screen and (max-width: 996px) {
			flex: 1 1 60%;
		}
	}

	.container-code-rating {
		@media screen and (max-width: 996px) {
			flex: 1 1 40%;
		}
	}

	.product-detail-brand {
		color: color(dark);
		font-family: font(bold);
		font-size: size(small);
		text-transform: uppercase;

		@media screen and (max-width: 996px) {
			font-size: size(xsmall);
		}
	}

	.container-detail-bottom {
		height: 60px;
		@media screen and (max-width: 996px) {
			padding: 0 5%;
			margin-bottom: 50px;
		}
	}

	.rating-loading {
		height: 21px;
		margin-left: 10px;
		width: 100%;
	}

	.number-dispon {
		color: #acaaaa;
	}

	.content-dis {
		background-color: #ebebeb;
		border-radius: 15.5px;
		max-width: 178px;
		padding: 5px 8px;
	}
</style>
