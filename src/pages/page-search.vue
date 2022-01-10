<template>
<div>
	<div class="page-category">
		<cart-bottom></cart-bottom>
		<div class="name-select-mobile" v-if="!open">
			<div class="flex-center flex-60">
				<img 
					src="/static/img/search.svg" 
					:alt="categorySelected.title" 
					class="mr-2" 
					height="21">
				<span class="text-select" :style="`color: ${globalColors.primary}`">{{getkeySearch}}</span>
			</div>
			<div class="flex-center flex-40">
				<button @click="toggleMenu">
					<img 
						src="/static/img/icons/icon-filter-category.svg" 
						alt="filtro"
						class="mr-2"
						height="16"
					>
					<span>Filtrar por</span>
				</button>
			</div>
		</div>
		<div class="menu-category" :class="{open: open, toggle: toggle}" v-if="open">
			<button class="btn-close" @click="closeOpen">
				<img 
					src="/static/img/icons/close.svg" 
					alt="cerrar" 
					height="17">
			</button>
			<menu-category
				:attributes="attributes"
				:categories="categories"
				:breadcrumbs="breadcrumbs"
				:toggle="toggle"
				:reset-attributes="resetAttributes"
				@attribute-selected="setAttribute"
				@change-category="changeCategory"
				@open-category="openCategory"
				@toggle="toggleCategory"
				@close="closeOpen"
			></menu-category>
		</div>
		<div class="wrapper-results" :class="{toggle: toggle, close: open}">
			<div class="wrapper-results-pagination">
				
				<span v-if="getkeySearch"
					:style="`color: ${globalColors.dark}; margin-top: 10px; margin-left: 10px;`"
					>Resultados para: "{{getkeySearch}}"  </span>
				<section class="section-pagination-category">
						<p class="total-products" v-if="listProducts.length">{{listProducts.length}} productos</p>
						<v-layout class="text-xs-center" v-show="totalPages" v-if="lastPage > 1">
							<v-pagination
								:length="lastPage"
								:total-visible="totalPages"
								v-model="page"
								@input="updateProductCard"
								:color="globalColors.secondary"
							></v-pagination>
						</v-layout>
				</section>
			</div>
			<div class = "loading-products">
				<spinner-loading  :loading="loadingProducts" ></spinner-loading>
			</div>
			<section 
				class="section-product-card"
				v-if="listProducts.length"
			>
				<product-card
					class="product-card"
					v-for="product in listProducts"
					:key="product.id"
					:product="product"
					/>
			</section>
			<p v-if="!loadingProducts && listProducts.length === 0" class="not-products">No se encontraron productos</p>
			<section class="section-pagination-category container-end">
				<p class="total-products" v-if="listProducts.length">{{listProducts.length}} productos</p>
				<div class="text-xs-center" v-show="totalPages" v-if="lastPage > 1">
					<v-pagination
						:length="lastPage"
						:total-visible="totalPages"
						v-model="page"
						@input="updateProductCard"
						:color="globalColors.secondary"
					></v-pagination>
				</div>
		</section>
		</div>
	</div>
	<app-banner-top
		v-if="getPromotionalBanner"
		:data="getPromotionalBanner"
		:color="globalColors.secondary"
		big/>
	
	</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import appBannerTop from '@/components/header/app-banner-top';
import buttonImage from '@/components/shared/buttons/app-button-image';
import menuCategory from '@/components/shared/category/menu-category';
import SpinnerLoading from '@/components/shared/spinner/spinner-loading';
import productCard from '@/components/products/product-card';
import productsSection from '@/components/products/products-section';
import cartBottom from '@/components/footer/cart-bottom';
import { compose, setNewProperty } from '@/shared/lib';
import helper from '@/shared/helper';

async function created() {
	const categoriesEcommerceLocal = this.getLocalStorage('ecommerce::categories');
	this.categories = this.getCategories.length === 0 ? categoriesEcommerceLocal : this.getCategories;
	this.keySearch = this.getLocalStorage('ecommerce::products::buscar');
}

function mounted() {
	this.loadingProducts = true;
	this.selectCategory();
	this.changeOpen();
	window.addEventListener('resize', this.changeOpen);
}

async function loadProduct() {
	try {
		const searchLocal = this.getLocalStorage('ecommerce::products::buscar');
		const params = {
			limit: 20,
			search: searchLocal,
			flagGrouper: this.$store.getters.productParams.flagGrouper,
			page: this.page,
			codeAttribute: this.attributeCodes,
		};
		const url = 'products-public';
		const { data: products, headers } = process.env.PRODUCTS_READ_REPORT
			? await this.$httpProductsReadPublic.get(url, { params }) :
			await this.$httpProductsPublic.get(url, { params });
		const commercePriceListId = this.getCommerceData.settings.salPriceListId;
		this.listProducts = products.map(
			compose(
				setNewProperty('price', product => helper.setPrices(product, commercePriceListId, 'price')),
				setNewProperty('priceDiscount', product => helper.setPrices(product, commercePriceListId, 'priceDiscount')),
				setNewProperty('createdAt', ({ createdAt }) => helper.formatDate(createdAt)),
			),
		);
		this.lastPage = Number(headers['x-last-page']);
		this.loadingProducts = false;
	} catch (error) {
		this.showGenericError();
	}
}

function updateProductCard(value) {
	this.page = value;
	this.loadProduct();
}

function selectCategory() {
	const categoriesEcommerceLocal = this.getLocalStorage('ecommerce::categories');
	this.breadcrumbs = [];
	this.setAttribute();
	this.loadProduct();
	this.categories = this.getCategories.length === 0 ? categoriesEcommerceLocal : this.getCategories;
	this.currentSelect = this.getCurrentcategory(this.categories, this.id);
	this.updateMetaTag(this.currentSelect);
	if (this.breadcrumbs.length) {
		this.breadcrumbs[0].disabled = true;
		this.breadcrumbs = this.breadcrumbs.reverse();
		this.categorySelected = this.breadcrumbs[0];
	}
}

function updateMetaTag(category) {
	this.updatePageTitle(category && category.title);
	this.updateDescriptionTag(category && category.description);
}

function getCurrentcategory(categories, id) {
	let current = categories.find(c => c.id === Number(id) || c.slug === id);
	if (current) {
		current = setNewProperty('disabled', false)(current);
		this.breadcrumbs.push(current);
		return current;
	}
	const len = categories.length;
	for (let i = 0; i < len; i += 1) {
		const detail = categories[i].detail;
		current = this.getCurrentcategory(detail, id);
		if (current) {
			this.breadcrumbs.push(setNewProperty('disabled', false)(categories[i]));
			return current;
		}
	}
	return current;
}

function changeCategory({ slug, id }) {
	this.goTo('category', { params: { slug: slug || id, id } });
	this.page = 1;
	if (window.innerWidth < 986) {
		this.open = false;
	}
}

function openCategory(id) {
	this.categories = this.categories.map((c) => {
		const newCategory = { ...c };
		newCategory.open = c.id === id ? !c.open : false;
		return newCategory;
	});
}

function toggleMenu() {
	this.open = true;
}

function changeOpen() {
	this.open = window.innerWidth > 986;
}

function closeOpen() {
	this.open = false;
}

function linkCategories({ slug, id }) {
	this.goTo('category', { params: { slug: slug || id, id } });
}

function toggleCategory() {
	this.toggle = !this.toggle;
}

function setAttribute(attr) {
	if (attr) {
		this.resetAttributes = false;
		const values = Object.values(attr);
		this.attributeCodesArr = [].concat(values);
		this.attributeCodes = this.attributeCodesArr.join(',');
	} else {
		this.attributeCodesArr = [];
		this.attributeCodes = null;
		this.resetAttributes = true;
	}
	this.loadProduct();
}

function data() {
	return {
		keySearch: '',
		attributeCodes: null,
		attributeCodesArr: [],
		bannerTop: {
			urlImage: 'https://s3.amazonaws.com/apprunn-acl/COM-PRU-01/ARQ88/image/big.png',
			image: 'descuento',
		},
		categories: [],
		categoryId: null,
		categorySelected: {},
		currentSelect: {},
		loadingProducts: false,
		lastPage: 0,
		listSubCategories: [],
		listProducts: [],
		page: 1,
		resetAttributes: false,
		totalPages: 7,
		open: false,
		breadcrumbs: [],
		toggle: false,
	};
}

export default {
	name: 'page-category',
	components: {
		appBannerTop,
		buttonImage,
		menuCategory,
		productCard,
		productsSection,
		SpinnerLoading,
		cartBottom,
	},
	computed: {
		...mapGetters([
			'getCategories',
			'getPromotionalBanner',
			'getCommerceData',
			'getkeySearch',
		]),
		...mapState({
			attributes: state => state.catAttributes,
		}),
		...mapGetters('loading', [
			'isLoading',
		]),
	},
	methods: {
		changeCategory,
		changeOpen,
		closeOpen,
		getCurrentcategory,
		linkCategories,
		loadProduct,
		openCategory,
		selectCategory,
		setAttribute,
		toggleCategory,
		toggleMenu,
		updateMetaTag,
		updateProductCard,
	},
	created,
	mounted,
	data,
	props: {
		id: {
			type: [String, Number],
			default: null,
		},
	},
	watch: {
		$route: selectCategory,
	},
};
</script>

<style lang="scss" scoped>
.menu-category {
	background-color: color(background);
	padding: 0 0 0 27px;
	left: 0;
	position: relative;
	transition: all .2s linear 0s;

	@media (max-width: 986px) {
		height: 100%;
		left: -150%;
		padding: 0;

		&.open {
			left: 0 !important;
			width: 100%;
		}
	}

	&.toggle {
		left: -327px;
		position: absolute;
		z-index: 2;
	}
}

.page-category {
	display: flex;
	position: relative;
	width: 100%;

	@media (max-width: 986px) {
		flex-direction: column;
	}
}

.content-sections {
	display: flex;
	justify-content: space-between;
	margin: 28px auto;
	width: 100%;
	
	@media (max-width: 980px) {
		border-bottom: 1px solid color(disabled);
		height: 77px;
		margin: 0;
	}
}

.total-products {
	color: color(base);
	font-family: font(medium);
	font-size: 12px;
	margin-bottom: 0;
}

.section-pagination-category {
	align-items: center;
	display: flex;
	padding: 1rem;
}

.section-product-card {
	display: grid;
	grid-auto-rows: minmax(min-content, max-content);
	grid-template-columns: repeat(auto-fill, minmax(214px, 1fr));

	@media (max-width: 986px) {
		margin: 0;
		width: 100%;
	}
}

.not-products {
	font-size: 18px;
	margin: 50px;
	text-align: center;
	width: 70%;
}

.name-select-mobile {
	background: color(white);
	box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.05);
	display: none;
	height: 59px;
	position: sticky;
  top: 75px;
	z-index: 3;

	@media (max-width: 986px) {
		display: flex;
	}
}

.flex-center {
	align-items: center;
	display: flex;
	justify-content: center;
}

.flex-60 {
	border-right: 1px solid color(border);
	flex: 1 60%;
}

.flex-40 {
	flex: 1 40%;
}

.text-select {
	font-family: font(bold);
	font-size: size(xlarge);
}

.btn-close {
	border-bottom: 1px solid color(border);
	display: none;
	padding: 15px;
	text-align: right;
	width: 100%;

	@media (max-width: 986px) {
		display: block;
	}
}

.wrapper-results {
	padding: 28px 50px;
	position: relative;
	width: 70%;

	&.toggle {
		width: 100%;
	}

	&.close {
		@media (max-width: 986px) {
			display: none;
		}
	}

	@media (max-width: 986px) {
		margin: 0;
		padding: 0;
		width: 100%;
	}
}

.wrapper-results-pagination {
	display: flex;
	font-family: font(demi);
	justify-content: space-between;
}

.container-end {
	justify-content: flex-end;
}

.loading-products {
	margin: 50px;
	text-align: center;
	width: 70%;
}
</style>
