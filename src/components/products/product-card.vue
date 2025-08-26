<template>
	<div
		class="product-container"
		:class="{ small: small }"
		@mousemove="onCard"
		@mouseenter="mouseOnCard = true"
		@mouseleave="mouseOnCard = false"
		:style="animatingCard"
	>
		<div v-if="showViewProduct">
			<div :class="{ opacity: noStock }">
				<div v-if="noStock" class="without-stock-tag">
					<span
						:style="`background-color: ${globalColors.primary};`"
						class="without-stock-text"
						>Agotado</span
					>
				</div>
				<div class="position-relative">
					<div class="product-favorite-mobile">
						<div
							class="heart-content"
							:style="
								`background-color:${
									product.flagFavorite ? globalColors.primary : '#fff'
								}`
							"
							:class="[{ favorite: product.flagFavorite }]"
						>
							<heart-component
								@click="productFavo"
								:value="product.flagFavorite"
							/>
						</div>
					</div>
					<section
						:class="[
							'product-header',
							{ small: small },
							{ noDiscount: !discountPercentage },
						]"
					>
						<div
							v-if="!!discountPercentage"
							:style="
								`background-color:${indeterminate ? 'transparent' : '#f42b17'}`
							"
							:class="[
								'product-discount',
								{ 'loading loading-dark': indeterminate },
							]"
						>
							<span v-if="!indeterminate"
								>- {{ discountPercentage | round(0) }}%</span
							>
						</div>
						<div class="product-favorite">
							<div
								class="heart-content"
								:style="
									`background-color:${
										product.flagFavorite ? globalColors.primary : '#fff'
									}`
								"
								:class="[{ favorite: product.flagFavorite }]"
							>
								<heart-component
									@click="productFavo"
									:value="product.flagFavorite"
								/>
							</div>
						</div>
					</section>
					<section class="product-content" :class="[small ? 'small' : null]">
						<div
							class="product-content-img"
							:class="[{ 'loading img-space': indeterminate }]"
						>
							<div>
								<span class="show-add" v-if="showAdd">
									<v-icon color="#03ba00" size="15">check_circle</v-icon>
									<span class="pl-1">
										Agregado
									</span>
								</span>
								<span class="show-agot" v-if="showNotStock">
									<span class="pl-1">
										SIN STOCK
									</span>
								</span>
							</div>
							<img
								@click="goToProduct(product)"
								v-if="!indeterminate"
								:class="['product-img']"
								:src="validProductImage"
								@error="handleImageError"
								alt="imagen del product"
							/>
						</div>
						<div v-if="!indeterminate">
							<div class="bottom-position mt-2" v-if="addQuantity">
								<addcar-component
									:disabled-add="disabledAdd"
									active
									@add-car="eventAddQuantity"
									:class="{ outstock: noStock }"
								/>
							</div>
							<quantityButton
								v-else
								class="mt-3"
								isEditNumber
								:number="quantityAddProduct"
								:product="product"
								:max-quantity="maxQuantity"
								@input="inputQuantity"
								@click="clickQuantity"
							/>
						</div>
						<div class="product-description-wrapper">
							{{
								product.name && product.name.length > 60
									? product.name.slice(0, 60) + '...'
									: product.name
							}}
							<!--span
							v-if="product.description"
							:class="[
								indeterminate ? 'loading text-field' : 'product-description'
							]"
						>{{product.description | cuttingWord(53)}}</!--span-->
							<!-- <small
							v-if="product.warehouseProduct && product.warehouseProduct.brand"
							class="product-brand">{{product.warehouseProduct.brand.name}}</small> -->
							<h3
								class="mt-1"
								:style="
									`color: ${
										indeterminate ? 'transparent' : globalColors.primary
									};`
								"
								:class="[
									indeterminate
										? 'loading text-field'
										: 'product-price-discount',
								]"
							>
								{{ getCurrencySymbol }}
								{{ product.priceDiscount | currencyFormat }}
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
									indeterminate
										? 'loading text-field'
										: product.priceDiscount
										? 'product-price-whole'
										: 'product-price-whole',
								]"
								:style="
									`color: ${
										indeterminate ? 'transparent' : globalColors.primary
									};`
								"
							>
								x{{ WholeSalePrice.from }} {{ getCurrencySymbol }}
								{{ WholeSalePrice.price | currencyFormat }}
							</small>
						</div>
					</section>
				</div>
			</div>
		</div>
		<div class="select-presentation" v-else>
			<v-icon class="icon-close" @click="closeViewProduct">close</v-icon>
			<div class="content-conversions">
				<span class="title">Seleccione la presentación que desea añadir:</span>
				<div class="button-container">
					<v-btn
						v-for="item in conversionsProducts"
						:key="item.id"
						class="btn-conversions"
						@click="addToCar(item, false)"
					>
						{{
							item.name && item.name.length > 9
								? item.name.slice(0, 9)
								: item.name
						}}
						- {{ getCurrencySymbol }}

						{{
							item.price ? item.price : product.priceDiscount | currencyFormat
						}}
					</v-btn>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import heartComponent from '@/components/shared/icons/heart-component';
import addcarComponent from '@/components/shared/icons/addcar-component';
import quantityButton from '@/components/shared/buttons/quantity-button';
import { getDeeper } from '@/shared/lib';
import TypeProduct from '@/shared/enums/typeProduct';
import helper from '@/shared/helper';

const { stockProductByType } = helper;

function created() {
	const productsSelected =
		JSON.parse(localStorage.getItem('ecommerce::product-select')) || [];
	const product = productsSelected.find(p => p.id === this.product.id);
	this.showAdd = product && product.quantity > 0;
	this.getPriceList();
}

function mounted() {
	this.WholeSalePrice = this.getWholeSalePrice();
}

function addToCar(unit, show) {
	this.showViewProduct = !show;
	if (this.product.priceDiscount <= 0) {
		this.showNotification(
			'El producto no se puede agregar al carrito, porque su precio es 0.',
			'error',
			null,
		);
		return;
	}

	if (!this.noStock) {
		this.showAdd = true;
		// this.quantityAddProduct += 1;
		const productSelected = this.product;
		// const user = JSON.parse(localStorage.getItem('ecommerce::ecommerce-user')) || [];
		// productSelected.unitSelected = this.product.unitId;
		// const commercePriceListId = user && user.salPriceListId ? user.salPriceListId : null;
		// const priceListSelectedId = this.getCommerceData.settings.salPriceListId;
		// this.priceListId = commercePriceListId || priceListSelectedId;
		// const priceList = this.product.priceList[this.priceListId] || null;
		// const { units } = priceList;
		// const rightRanges = units[productSelected.unitSelected];
		// const { ranges } = rightRanges || priceList;
		productSelected.unitSelected = unit ? unit.id : this.product.unit.id;
		productSelected.wholeSalePrice = this.WholeSalePrice || [];
		productSelected.priceDiscountOrigin = this.product.priceDiscount || 0;
		const StockSoldOut =
			this.quantityAddProduct >= stockProductByType(productSelected);
		// this.quantityAddProduct >= productSelected.stockWarehouse &&
		// !this.$allowOrderStockNegative;
		this.disabledAdd = StockSoldOut;
		if (StockSoldOut) {
			this.showNotStock = true;
		}
		const ecommerce =
			JSON.parse(localStorage.getItem('ecommerce::ecommerce-data')) || null;
		const defaultIdPiceList = ecommerce.settings.salPriceListId;
		const priceList = this.product.priceList[defaultIdPiceList];
		const unitList = priceList && unit && priceList.units[unit.id];
		if (unit) {
			productSelected.unit = { ...unit, isSelected: false };
			productSelected.priceDiscountOrigin =
				unitList && unitList.price
					? unitList.price
					: this.product.priceDiscount * (unit.quantity || 1);
			productSelected.priceDiscount =
				unitList && unitList.price
					? unitList.price
					: this.product.priceDiscount * (unit.quantity || 1);
		}
		const { stock, stockWarehouse, stockComposite } = productSelected;
		const finalStock = helper.isComposed(productSelected)
			? stockComposite
			: stockWarehouse || stock;
		const validate =
			finalStock >= this.quantityAddProduct || this.$allowOrderStockNegative;
		const quantity = validate ? this.quantityAddProduct : finalStock;
		this.quantityAddProduct = quantity;
		productSelected.quantity = quantity;
		const unitDef = unit || productSelected.unit;
		const message = validate
			? 'agregado exitosamente'
			: 'ya no cuenta con stock';
		const color = validate ? 'success' : 'error';
		this.showNotification(
			`${this.product.name}(${
				unitDef ? unitDef.name : this.product.unitDefault.name
			}) ${message}`,
			`${color}`,
			null,
			false,
			1500,
		);
		this.$store.dispatch('addProductToBuyCar', productSelected);
		// this.quantityAddProduct = 1;
	}
}

function productFavo() {
	if (this.token) {
		this.$store.dispatch('SET_FAVORITE_FLAG', {
			context: this,
			product: this.product,
		});
		this.$set(this.product, 'flagFavorite', !this.product.flagFavorite);
	} else {
		this.showGenericError(
			'Debe iniciar sesión para seleccionar producto como favorito',
			50000,
		);
	}
}

function buyProduct() {
	this.$store.commit('SET_PRODUCT_TO_BUY', this.product);
}

function goToProduct({ slug, id }) {
	const params = { id: slug || id };
	let query = {};
	if (this.$route.name === 'category') {
		query = { pageLast: this.pageLast };
	}
	this.goTo('detail-product', { params, query });
}

function goToCategories(item) {
	if (item.length) {
		const { slug, id } = item[0];
		this.goTo('category', { params: { slug: slug || id, id } });
	}
}

function discountPercentage() {
	const { price, priceDiscount, priceList } = this.product;
	const ecommerce =
		JSON.parse(localStorage.getItem('ecommerce::ecommerce-data')) || null;
	const defaultIdPiceList = ecommerce.settings.salPriceListId;
	const discount =
		priceList && priceList[defaultIdPiceList]
			? priceList[defaultIdPiceList].discount
			: null;
	const percentage = Number(
		(((price - priceDiscount) / price) * 100).toFixed(2),
	);
	const validPercentage = percentage >= 0 ? percentage : 0;
	return discount || validPercentage;
}

function animatingCard() {
	if (this.mouseOnCard) {
		const middleX = this.elWidth / 2;
		const middleY = this.elHeight / 2;
		const maxDeg = 3;
		const rateX = (middleX - this.x) / (this.elWidth / 2);
		const rateY = (middleY - this.y) / (this.elHeight / 2);
		return `transform:perspective(500px) rotateY(${-rateX *
			maxDeg}deg) rotateX(${rateY * maxDeg}deg) scale3d(1.02, 1.02, 1.02);`;
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
	if (
		Object.keys(this.getCommerceData).length === 0 ||
		this.getCommerceData === null
	) {
		return {};
	}
	const commerceData = this.getCommerceData.settings
		? this.getCommerceData
		: this.getLocalStorage('ecommerce::ecommerce-data');
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
		addQuantity: true,
		disabledAdd: false,
		x: 0,
		y: 0,
		elWidth: 0,
		elHeight: 0,
		mouseOnCard: false,
		WholeSalePrice: null,
		quantityAddProduct: 1,
		maxQuantity: false,
		showAdd: false,
		showNotStock: false,
		fallbackImage: '/static/img/placeholder-product.png',
		showViewProduct: true,
		conversionsProducts: [],
	};
}

export default {
	name: 'product-card',
	components: {
		heartComponent,
		addcarComponent,
		quantityButton,
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
		validProductImage() {
			return this.product.urlImage && this.product.urlImage.trim() !== ''
				? this.product.urlImage
				: this.fallbackImage;
		},
	},
	data,
	methods: {
		buyProduct,
		goToProduct,
		onCard,
		productFavo,
		addToCar,
		getWholeSalePrice,
		goToCategories,
		inputQuantity(value) {
			this.quantityAddProduct = Number(value);
		},
		clickQuantity(val) {
			if (val === 'more') {
				this.quantityAddProduct += 1;
				this.addToCar();
			} else {
				this.removeProductFromCar();
			}
		},
		removeProductFromCar() {
			this.disabledAdd = !(
				this.quantityAddProduct < this.product.stockWarehouse
			);
			if (this.quantityAddProduct <= this.product.stockWarehouse) {
				this.showNotStock = false;
				this.showAdd = false;
			}
			const productsSelected =
				JSON.parse(localStorage.getItem('ecommerce::product-select')) || [];
			const product = productsSelected.find(p => p.id === this.product.id);
			const quantity = Math.max(product.quantity - this.quantityAddProduct, 0);
			this.showAdd = quantity;
			this.product.quantity = this.quantityAddProduct;
			this.$store.dispatch('removeProductToBuyCar', this.product);
			if (!quantity) {
				this.addQuantity = true;
			}
		},
		handleImageError(event) {
			const target = event.target;
			target.src = this.fallbackImage;
		},
		getPriceList() {
			const user =
				JSON.parse(localStorage.getItem('ecommerce::ecommerce-user')) || [];
			const salPriceListDefault =
				user.company && user.company.salPriceListDefault.id;
			if (!salPriceListDefault) return;
			const priceListDefault = this.product.priceList[salPriceListDefault];
			const priceList = Object.entries(priceListDefault.units).map(
				([id, unit]) => ({
					id,
					...unit,
				}),
			);
			if (this.$flagShowBaseUnit === 1 && priceList.length > 0) {
				this.product.priceDiscount = priceList[0].price;
			}
		},
		selectUnitCar() {
			if (
				this.product.conversions &&
				typeof this.product.conversions === 'object' &&
				this.$flagShowBaseUnit !== 2
			) {
				const { priceList } = this.product;
				const ecommerce =
					JSON.parse(localStorage.getItem('ecommerce::ecommerce-data')) || null;
				const defaultIdPiceList = ecommerce.settings.salPriceListId;
				const priceListUnits =
					priceList && priceList[defaultIdPiceList]
						? priceList[defaultIdPiceList].units
						: null;
				this.showViewProduct = false;
				if (this.$flagShowBaseUnit !== 2) {
					this.conversionsProducts = Object.keys(this.product.conversions).map(
						key => ({
							id: key,
							...priceListUnits[key],
							...this.product.conversions[key],
						}),
					);
				}
				if (this.$flagShowBaseUnit !== 1) {
					this.conversionsProducts.unshift(
						this.product.unitDefault || this.product.unit,
					);
				}

				if (this.conversionsProducts.length === 1) {
					this.addToCar(this.conversionsProducts[0]);
				}
				this.addQuantity = !this.addQuantity;
			} else {
				this.addQuantity = !this.addQuantity;
				this.addToCar();
			}
		},
		eventAddQuantity() {
			this.quantityAddProduct = 1;
			this.selectUnitCar();
		},
		closeViewProduct() {
			this.showViewProduct = true;
			this.addQuantity = true;
		},
	},
	created,
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
		pageLast: [String, Number],
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
	width: 20vh;
	margin: 3px auto;
	@media (min-width: 600px) {
		box-shadow: 0 2px 2px 0 rgba(31, 26, 26, 0.07);
		border: 1px solid color(border);
		border-radius: 5px;
		height: 375px;
		margin: 3px auto !important;
		width: 100%;
	}
	@media screen and (max-width: 600px) {
		padding: 0 5px;
		height: 380px;
	}

	&.small {
		min-height: 319px;
		width: 100%;
		max-width: none;
	}
}
.bottom-position {
	width: 50%;
	bottom: 3px;
	right: 0;
	@media (min-width: 600px) {
		width: 100%;
		bottom: 3px;
		right: 0;
	}

	@media (max-width: 600px) {
		width: 0;
	}
}

.column-custom {
	background-color: red;
	display: flex !important;
	flex-direction: column !important;
	padding: 0 !important;
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

	@media (max-width: 600px) {
		top: 3%;
	}

	@media (min-width: 600px) {
		top: 2%;
	}
}

.product-favorite,
.product-favorite-mobile {
	.heart-content {
		padding: 5px;
		border-radius: 100%;
		box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);
		&.favorite {
			/deep/ .heart-btn {
				svg {
					g {
						stroke: #fff;
						stroke-width: 3px;
					}
				}
			}
		}
		/deep/ .heart-btn {
			svg {
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
	flex-direction: column;
	display: flex;
	justify-content: center;
	padding: 1em 0;
	text-align: center;

	.product-content-img {
		margin-top: 6px;
		height: 190px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	@media (min-width: 600px) {
		display: flex;
		flex-direction: column;
		padding: 0;
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
	width: 107%;
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
	margin: 0 auto 8px;
	width: 80%;
	overflow: visible;
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
		.without-stock-tag {
			// background-color: #acacac;
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

			@media screen and (max-width: 600px) {
				top: 5%;
				width: 15%;
			}
		}
	}
}

.opacity {
	height: 100%;
	opacity: 0.43;
	position: relative;

	.without-stock-tag {
		// background-color: #acacac;
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
			top: 30%;
			width: 80%;
			height: 35px;
			z-index: 2;
		}

		@media screen and (max-width: 600px) {
			top: 30%;
			width: 75%;
			left: 17%;
			font-size: 2vw;
			border-radius: 10px;
		}
	}
}
.without-stock-text {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 40px;
	z-index: 1;
	color: white;
	content: 'Agotado';
	font-size: 18px;
	font-family: font(bold);
	text-transform: uppercase;
	@media screen and (min-width: 600px) {
		font-size: 20px;
		// margin-top: 10px;
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

.show-add {
	background-color: white;
	border-radius: 9px;
	bottom: 20px;
	box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
	color: #03ba00;
	font-size: 11px;
	padding: 2px 8px 2px 1px;
	position: absolute;

	@media (min-width: 1024px) {
		bottom: 41%;
	}

	@media (max-width: 600px) {
		bottom: auto;
		top: 52%;
	}
}
.show-agot {
	background-color: #002074;
	border-radius: 14.5px;
	bottom: 49px;
	color: white;
	font-family: font(bold);
	font-size: 10px;
	padding: 2px 8px;
	position: absolute;

	@media (min-width: 1024px) {
		bottom: 50%;
	}

	@media (max-width: 600px) {
		bottom: auto;
		top: 44%;
	}
}

.icon-close {
	font-size: 24px;
	color: #ff5722;
	cursor: pointer;
	margin: 10px;
}

.title {
	padding: 8px 10px 0 6px !important;
	font-size: 14px !important;
	font-weight: 600;
	color: #333;
}
.button-container {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 10px;
	margin-top: 16px;
}

.btn-conversions {
	border-radius: 10px;
	font-family: 'Roboto', sans-serif;
	font-weight: bold;
	padding: 5px 10px;
	text-transform: uppercase;
	transition: background-color 0.3s ease;
	border: 1px solid red;
	cursor: pointer;
	background-color: white !important;
	color: red;
}

.btn-conversions:hover {
	background-color: #3700b3;
}

.content-conversions {
	text-align: center;
}
</style>
