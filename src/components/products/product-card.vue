<template>
	<div
		class="product-container"
		:class="{ 'small': small }"
		@click="goToProduct(product)"
		@mousemove="onCard"
		@mouseenter="mouseOnCard = true"
		@mouseleave="mouseOnCard = false"
		:style="animatingCard"
	>
		<div :class="{ opacity: noStock}">
			<div v-if="noStock" class="without-stock-tag">
				<span class="without-stock-text">Agotado</span>
			</div>
			<div class="position-relative">
				<div class="product-favorite-mobile">
					<div class="heart-content"
						:style="`background-color:${product.flagFavorite ?  globalColors.primary : '#fff'}`"
						:class="[
							{ 'favorite': product.flagFavorite },
						]"
					>
						<heart-component @click="productFavo" :value="product.flagFavorite"/>
					</div>
				</div>
				<section
					:class="[
						'product-header',
						{ 'small': small },
						{ 'noDiscount': !discountPercentage },
					]"
				>
					<div
						v-if="!!discountPercentage"
						:style="`background-color:${indeterminate ? 'transparent' : '#f42b17'}`"
						:class="[
							'product-discount',
							{ 'loading loading-dark': indeterminate },
						]"
					>
						<span v-if="!indeterminate">- {{discountPercentage}}%</span>
					</div>
					<div class="product-favorite">
						<div class="heart-content"
							:style="`background-color:${product.flagFavorite ?  globalColors.primary : '#fff'}`"
							:class="[
								{ 'favorite': product.flagFavorite },
							]"
						>
							<heart-component @click="productFavo" :value="product.flagFavorite"/>
						</div>
					</div>
				</section>
				<section class="product-content" :class="[small ? 'small' : null]" >
					<div class="product-content-img"
						:class="[
							{ 'loading img-space': indeterminate },
						]"
					>
						<img
							v-if="!indeterminate"
							:class="[
							'product-img',
							]"
							:src="product.urlImage"
							alt="imagen del product"
						>
					</div>
					<div class="product-description-wrapper">
						<p
							:class="[
								indeterminate ? 'loading text-field' : 'product-name'
							]"
						>{{product.name}}</p>
						<!--span
							v-if="product.description"
							:class="[
								indeterminate ? 'loading text-field' : 'product-description'
							]"
						>{{product.description | cuttingWord(53)}}</!--span-->
						<small
							v-if="product.warehouseProduct && product.warehouseProduct.brand"
							class="product-brand">{{product.warehouseProduct.brand.name}}</small>
						<h3
							v-if="product.priceDiscount"
							:style="`color: ${indeterminate ? 'transparent' : globalColors.primary};`"
							:class="[
								indeterminate ? 'loading text-field' : 'product-price-discount'
							]"
						>
							{{getCurrencySymbol}} {{ product.priceDiscount | currencyFormat }}
						</h3>
						<!-- 
							<small
							v-if="product.price"
							:class="[
								indeterminate ? 'loading text-field' : product.priceDiscount ? 'product-price' : 'product-price-discount',
							]"
							:style="`color: ${indeterminate ? 'transparent' : globalColors.primary};`"
						>
							{{getCurrencySymbol}} {{ product.price | currencyFormat }}
						</small>
						-->
						<small
							v-if="WholeSalePrice && WholeSalePrice.price > 0"
							:class="[
								indeterminate ? 'loading text-field' : product.priceDiscount ? 'product-price-whole' : 'product-price-whole',
							]"
							:style="`color: ${indeterminate ? 'transparent' : globalColors.primary};`"
						>
						x{{WholeSalePrice.from}} {{getCurrencySymbol}} {{WholeSalePrice.price | currencyFormat }}
						</small>
					</div>
				</section>
			</div>
		</div>
		<div v-if="!indeterminate" class="bottom-position">
			<addcar-component active @add-car="addToCar" @remove-car="removeProductFromCar" :class="{ outstock: noStock}" />
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import heartComponent from '@/components/shared/icons/heart-component';
import addcarComponent from '@/components/shared/icons/addcar-component';
import { getDeeper } from '@/shared/lib';
import TypeProduct from '@/shared/enums/typeProduct';
import helper from '@/shared/helper';

function mounted() {
	this.WholeSalePrice = this.getWholeSalePrice();
}

function addToCar() {
	if (!this.noStock) {
		const productSelected = this.product;
		productSelected.unitSelected = this.product.unitId;
		this.$store.dispatch('addProductToBuyCar', productSelected);
	}
}

function removeProductFromCar() {
	this.$store.dispatch('removeProductToBuyCar', this.product);
}

function productFavo() {
	if (this.token) {
		this.$store.dispatch('SET_FAVORITE_FLAG', { context: this, product: this.product });
		this.$set(this.product, 'flagFavorite', !this.product.flagFavorite);
	} else {
		this.showGenericError('Debe iniciar sesión para seleccionar producto como favorito', 50000);
	}
}

function buyProduct() {
	this.$store.commit('SET_PRODUCT_TO_BUY', this.product);
}

function goToProduct({ slug, id }) {
	const params = { id: slug || id };
	this.goTo('detail-product', { params });
}

function discountPercentage() {
	const { price, priceDiscount } = this.product;
	const percentage = Number((((price - priceDiscount) / price) * 100).toFixed(2));
	return percentage >= 0 ? percentage : 0;
}

function animatingCard() {
	if (this.mouseOnCard) {
		const middleX = this.elWidth / 2;
		const middleY = this.elHeight / 2;
		const maxDeg = 3;
		const rateX = (middleX - this.x) / (this.elWidth / 2);
		const rateY = (middleY - this.y) / (this.elHeight / 2);
		return `transform:perspective(500px) rotateY(${(-rateX * maxDeg)}deg) rotateX(${(rateY * maxDeg)}deg) scale3d(1.02, 1.02, 1.02);`;
	}
	return 'transform: perspective(500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);';
}

function onCard(v) {
	this.elWidth = v.target.offsetWidth;
	this.elHeight = v.target.offsetHeight;
	this.x = v.offsetX;
	this.y = v.offsetY;
}

function noStock() {
	return helper.noStock(this.product);
}

function isVariation() {
	const variationCode = getDeeper('typeInfo.code')(this.product);
	return variationCode === TypeProduct.variation;
}

function isComposed() {
	const composeCode = getDeeper('typeInfo.code')(this.product);
	return composeCode === TypeProduct.compose;
}

function isService() {
	const serviceCode = getDeeper('typeInfo.code')(this.product);
	return serviceCode === TypeProduct.service;
}

function getWholeSalePrice() {
	const commerceData = this.getCommerceData.settings ? this.getCommerceData : this.getLocalStorage('ecommerce::ecommerce-data');
	const priceId = commerceData.settings.salPriceListId;
	const priceList = this.product.priceList || {};
	const { ranges } = priceList[priceId] || {};
	let prices = {};
	if (ranges) {
		prices = ranges.reduce((acc, range) => {
			if (range.from > 0 && range.to > 0 && range.price > 0) {
				acc.push(range);
			}
			return acc;
		}, []);
	}
	return prices.length > 0 ? prices[0] : {};
}

function data() {
	return {
		x: 0,
		y: 0,
		elWidth: 0,
		elHeight: 0,
		mouseOnCard: false,
		WholeSalePrice: null,
	};
}

export default {
	name: 'product-card',
	components: {
		heartComponent,
		addcarComponent,
	},
	computed: {
		...mapGetters([
			'getCommerceData',
			'getCurrencySymbol',
			'getProductsParams',
			'indeterminate',
		]),
		animatingCard,
		discountPercentage,
		isComposed,
		isService,
		isVariation,
		noStock,
	},
	data,
	methods: {
		buyProduct,
		goToProduct,
		onCard,
		productFavo,
		addToCar,
		removeProductFromCar,
		getWholeSalePrice,
	},
	mounted,
	props: {
		small: {
			type: Boolean,
			default: false,
		},
		product: {
			default: () => {},
			type: Object,
		},
	},
};
</script>
<style lang="scss" scoped>
	.product-container {
		background-color: color(white);	
		border-bottom: 1px solid color(border);	
		cursor: pointer;
		font-family: font(medium);
		height: auto;
		transform: perspective(0px) rotateY(deg) rotateX(0deg) scale3d(0, 0, 0);
  		transition: all 120ms ease;
		&:hover {
			border: 3px solid color(blueLight);
		}

		@media (min-width: 600px) {			
			box-shadow: 0 2px 2px 0 rgba(31, 26, 26, 0.07);
			border: 1px solid color(border);
			border-radius: 5px;
			height: 360px;
			margin: 3px auto;
			max-width: 250px;
			width: 100%;
			
		}

		&.small {
			min-height: 319px;
			max-width: 179px;
		}
		
		
	}
	.bottom-position {
		width: 50%;
		position: absolute;
		bottom: 3px;
		right: 0;
		@media (min-width: 600px) {
			width: 100%;
			position: absolute;
			bottom: 3px;
			right: 0;
		}
	}

	.column-custom {
		background-color:red;
		display: flex !important;
		flex-direction: column !important;
		padding:  0 !important;
	}
	.product-header {
		align-items: center;
		display: flex;
		height: 2rem;
		justify-content: space-between;
		position: absolute;
		left: 0;
		bottom: 10px;
		width: 100%;
		padding: 0 6px;
		&.noDiscount {
			justify-content: flex-end;
		}

		@media (min-width: 600px) {
			bottom: auto;
			top: 156px;
		}
	}

	.product-favorite, .product-favorite-mobile {
		.heart-content{
			padding: 5px;
			border-radius: 100%;
			box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);
			&.favorite{
				/deep/ .heart-btn{
				 	svg {
						g {
							stroke: #fff;
    						stroke-width: 3px;
						}
				 	}
				}
			}
			/deep/ .heart-btn{
				 svg{
					height: 15px;
					width: 15px;
					g {
						stroke: color(blueLight);
						stroke-width: 3px;
					}
				}
			}
			
		}
	}
	.product-favorite {
		display: none;
		@media (min-width: 600px) {
			display: block;
		}
	}

	.product-favorite-mobile {
		position: absolute;
		top: 10px;
		right: 10px;
		@media (min-width: 600px) {
			display: none;
		}
	}


	.product-discount {
		border-radius: 5px;
		color: color(white);
		font-family: font(medium);
		font-size: size(small);
		padding: 2px 8px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.product-content {
		align-items: center;
		display: flex;
		justify-content: center;
		margin: 0 0;
		padding: 1em 0;
		text-align: center;

		.product-content-img {
			height: 190px;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		div {
			margin: 0 10px;
		}

		@media (max-width: 500px) {
			&.small {
				//flex-direction: column;
			}
		}

		@media (min-width: 600px) {
			display: flex;
			flex-direction: column;
			padding:  0;
		}


		@media (max-width: 975px) {
			&.small {
				padding: 0px;
			}
		}
	}

	.product-description-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 1em 0 0;
	}

	.product-img {
		width: auto;
    	height: auto;
		max-height: 190px;
		max-width: 100%;
	}

	.product-name,
	.product-description {
		color: color(dark);
		font-size: size(small);
		font-family: font(regular);
		max-height: 35px;
		margin: 0 auto 8px;
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		text-transform: capitalize;
	}

	.product-description {
		font-family: font(medium);
	}

	.product-brand {
		color: color(base);
		font-size: size(xsmall);
		letter-spacing: 2px;
		margin: 0 auto 4px;
	}

	.product-price {
		font-size: size(medium);
		color: color(base) !important;
	}

	.product-price {
		text-decoration: line-through;
	}

	.product-price-whole {
		font-size: size(small);
	}

	.product-rating {
		margin: 0 !important;

		.v-icon {
			padding: 0.3rem !important;
		}
	}

	.opacity {
		height: 100%;
		opacity: 0.43;
		position: relative;

		.without-stock-tag {
			background-color: #acacac;
			color: white;
			display: flex;
			font-size: 18px;
			font-family: font(bold);
			align-items: center;
			justify-content: center;
			position: absolute;
			left: 0;
			top: 45%;
			width: 50%;
			height: 35px;
			z-index: 2;
			text-transform: uppercase;
			@media screen and (min-width: 600px) {
				font-size: 19px;
				background-color: #acacac;
				left: 10%;
				top: 20%;
				width: 80%;
				height: 35px;
				z-index: 2;
			}
		}
	}
	.without-stock-text {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		z-index: 1;
		color: white;
		content: 'Agotado';
		font-size: 18px;
		font-family: font(bold);
		text-transform: uppercase;
		@media screen and (min-width: 600px) {
			font-size: 20px;
			margin-top: 10px;
		}
	}

	.position-relative {
		position: relative;
	}

	.pd-10 {
		padding: 10px;
	}

	.img-space {
		height: 130px;
		margin: 5px 0 !important;
		width: 125px;
	}

	.text-field {
		height: 18px;
		margin: 3px 0;
	}

	.rating {
		height: 12px;
		margin: 13px 0 0 !important;
	}

	.outstock {
		opacity: 0.43;
	}

</style>

