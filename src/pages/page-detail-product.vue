<template>
	<div class="page-detail-product">
		<div
			v-if="showConfirmModal"
			class="confirm-modal-container"
			:style="topLocation"
		>
			<app-modal
				:product="productDetails"
				@close-modal="closeConfirmModal"
			></app-modal>
		</div>
		<div v-if="disabled" class="product-disabled">
			<h1
				:style="`color:${globalColors.primary}`"
				class="sorry-text"
			>Lo sentimos, este producto está desactivado  :(</h1>
		</div>
		<div v-else class="detail-product-top">
			<product-view 
				:data="productDetails"
				:images="productImages"
				class="container-product-view"
			/>
			<product-detail
				:open-warehouse="stockWarehouse"
				:data="productDetails"
				:features="globalFeatures"
				class="container-product-detail"
				@update="loadData"
				@selected="selectFeature"
				@clear="clearFeatures"
				@click-quantity="clickQuantity"
				@open-dialog="openDialog"
				@open-confirm-modal="showConfirmModal = true"
				@unit-selection="selectedUnit"
			/>
		</div>
		<div v-if="!disabled" class="detail-tab-publicity">
			<product-publicity
				class="container-publicity desktop"
				:products-publicity="[]"
			/>
			<product-tab
				class="container-product-tab"
				:tabs="tabs"
				:sections="productDetails.sections"
				:lastIndex="lastIndex"
				:opinions="opinions"
				@update-opinion="loadOpinions"/>
		</div>
		<div>
			<product-related 
				:relateds="relateds"
				v-if="relateds.length"
			/>
		</div>
		<product-publicity class="container-publicity mobile"/>
		<app-banner-top
			:data="getPromotionalBanner"
			:color="globalColors.secondary"
			big
		/>
		<warehouses-modal 
			:dialog="dialogWarehouses"
			:rows="warehouses"
			@change-modal="closeModal"
		/>
	</div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import ProductDetails from '@/class/productDetails';
import appBannerTop from '@/components/header/app-banner-top';
import productView from '@/components/products/product-view';
import productDetail from '@/components/products/product-detail';
import productTab from '@/components/products/product-tab';
import productRelated from '@/components/products/product-related';
import warehousesModal from '@/components/products/warehouses-modal';
import productPublicity from '@/components/products/product-publicity';
import appModal from '@/components/shared/modal/app-modal';

async function created() {
	this.$loading(true);
	await this.loadProduct();
}

function isLoggedUser() {
	if (this.token) {
		return this.$httpProducts.get(`products/favorites/${this.id}`);
	}
	return this.$httpProductsPublic.get(`products-public/${this.id}`);
}

async function loadProduct() {
	try {
		const { data: response } = await this.isLoggedUser();
		this.product = response;
		this.updatePageTitle(this.product.name.toUpperCase());
		this.updateDescriptionTag(this.product.description);
		this.$store.dispatch('setRatingProductId', this.product.id);
		this.loadData(this.product.id);
		this.loadOpinions();
	} catch (error) {
		if (error.data.message === 'PRODUCT_NOT_FOUND') {
			this.disabled = true;
			this.showNotification('Este producto ya no está disponible', 'warning');
			this.$store.dispatch('LOAD_RELATED_PRODUCTS', { context: this, id: this.id });
		} else {
			this.showGenericError();
		}
	}
}

async function loadData(id) {
	this.$store.dispatch('LOAD_RELATED_PRODUCTS', { context: this, id });
	const requests = [
		this.$httpProductsPublic.get(`products-public/${id}/children`),
	];
	([
		{ data: this.childrens },
	] = await Promise.all(requests));
	this.product.images = this.product.images.map((i, index) => {
		const newImage = { ...i };
		newImage.select = index === 0;
		return newImage;
	});
	this.product.quantity = 1;
	this.productFather = { ...this.product };
	this.tabs = this.product.sections.map(p => p.name);
	this.tabs.push('Comentarios');
	this.lastIndex = this.product.sections.length;
	this.productInstance = new ProductDetails(
		this.childrens,
		this.getCommerceData.settings.salPriceListId,
	);
	this.productInstance.firstProductSelected(this.product);
	this.globalFeatures = [...this.productInstance.getFeatures()];
	this.productDetails = { ...this.productInstance.getProductDetails() };
	this.productImages = [...this.productInstance.getImages()];
	this.allFeatures = this.childrens.reduce((acum, children) => acum.concat(children.features), []);
	this.features = this.allFeatures.reduce((acum, feature) => {
		const index = acum.findIndex(a => a.name === feature.name);
		if (index > -1) {
			const indexValue = acum[index].values.findIndex(i => i.name === feature.value);
			if (indexValue === -1) {
				const value = {
					name: feature.value,
					active: false,
					possible: false,
					disabled: false,
					code: feature.code,
				};
				acum[index].values.push(value);
			}
		} else {
			acum.push(
				{
					name: feature.name,
					value: 'PADRE',
					values: [
						{ name: feature.name,
							active: false,
							possible: false,
							disabled: true,
							code: 'PADRE',
						},
						{ name: feature.value,
							active: false,
							possible: false,
							disabled: false,
							code: feature.code,
						},
					],
				});
		}
		return acum;
	}, []);
	if (this.childrens.length) {
		this.disabledBtn = true;
	}
}

function selectFeature(value) {
	this.productInstance.featureSelected(value);
	this.product.quantity = 1;
	this.globalFeatures = [...this.productInstance.getFeatures()];
	this.productImages = [...this.productInstance.getImages()];
	this.productDetails = { ...this.productInstance.getProductDetails() };
}

function possibleFeature(possibles) {
	this.features = this.features.map((element, index) => {
		element.values.forEach((value, indexValue) => {
			if (this.productsFilter.length === 1) {
				const flag = possibles.filter(p => p.value === value.code);
				this.$set(this.features[index].values[indexValue], 'active', !!flag.length);
				this.$set(this.features[index].values[indexValue], 'possible', false);
				this.$set(this.features[index].values[indexValue], 'disabled', !flag.length);
				if (value.code === 'PADRE') {
					this.$set(this.features[index].values[indexValue], 'disabled', true);
				}
				if (value.active) {
					this.$set(this.features[index], 'value', value.code);
				}
			} else {
				const flag = possibles.filter(p => p.value === value.code && !value.active);
				this.$set(this.features[index].values[indexValue], 'possible', !!flag.length);
				this.$set(this.features[index].values[indexValue], 'disabled', !flag.length);
			}
		});
		return element;
	});
	if (this.productsFilter.length === 1) {
		this.productsFilter[0].images = this.productsFilter[0].images.map((i, index) => {
			const newImage = { ...i };
			newImage.select = index === 0;
			return newImage;
		});
		this.assignProduct(this.productsFilter[0]);
		this.disabledBtn = false;
	}
}

function assignProduct(product) {
	this.product = { ...product };
	this.product.quantity = 1;
}

async function loadOpinions() {
	const params = {
		typeQuestionAnswer: 3,
		productId: this.product.id,
	};
	const { data: response } = await this.$httpProductsPublic.get('question-answer/public', { params });
	this.opinions = response;
	this.$loading(false);
}

function clearFeatures() {
	this.features = this.features.map((element) => {
		const newElement = { ...element };
		newElement.value = 'PADRE';
		newElement.values = element.values.map((v) => {
			const newValue = { ...v };
			newValue.active = false;
			newValue.possible = false;
			newValue.disabled = v.code === 'PADRE';
			return newValue;
		});
		return newElement;
	});
	this.featureSelect = [];
	this.arrayPossible = [];
	this.productsFilter = [];
	this.product = { ...this.productFather };
}

function newRoute() {
	this.loadProduct();
}

function clickQuantity(value) {
	let num = this.product.quantity;
	const newProductdetail = { ...this.product };
	if (value === 'less' && num === 1) {
		num = 1;
	} else {
		num = value === 'more' ? num += 1 : num -= 1;
	}
	const validQuantity = this.checkValidQuantity(num);
	if (validQuantity) {
		this.$set(newProductdetail, 'quantity', num);
		this.product = { ...newProductdetail };
		this.productInstance.updateQuantity(num);
		this.productDetails = { ...this.productInstance.getProductDetails() };
	} else {
		this.showNotification(`Cantidad: ${num} no disponible`, 'primary');
	}
}

function checkValidQuantity(quantity) {
	if (this.productInstance.isService) {
		return true;
	}
	const { stock } = this.productInstance;
	return stock >= quantity;
}

async function openDialog() {
	const id = this.productDetails.id;
	try {
		const { data: response } = await this.$httpProductsPublic.get(`products-public/${id}/stock-by-warehouse`);
		this.warehouses = response;
		this.dialogWarehouses = true;
	} catch (error) {
		this.showGenericError();
	}
}

function closeModal(value) {
	this.dialogWarehouses = value;
}

function selectedUnit(unit) {
	this.productInstance.updateUnit(unit);
	this.productImages = [...this.productInstance.getImages()];
	this.productDetails = { ...this.productInstance.getProductDetails() };
}

function closeConfirmModal() {
	this.showConfirmModal = false;
}

function topLocation() {
	return `top:${this.topModal}px`;
}

function data() {
	return {
		allFeatures: [],
		arrayPossible: [],
		bannerTop: {
			urlImage: 'https://s3.amazonaws.com/apprunn-acl/COM-PRU-01/ARQ88/image/big.png',
			image: 'descuento',
		},
		childrens: [],
		cities: [],
		disabled: false,
		disabledBtn: false,
		dialogWarehouses: false,
		features: [],
		featureSelect: [],
		featuresFather: [],
		globalFeatures: [],
		lastIndex: 0,
		opinions: [],
		product: {},
		productDetails: {
			conversions: {},
		},
		productInstance: {},
		productsFilter: [],
		productImages: [],
		productFather: {},
		showConfirmModal: false,
		stockWarehouse: false,
		tabs: [],
		warehouses: [],
	};
}

export default {
	name: 'page-detail-product',
	created,
	components: {
		appBannerTop,
		appModal,
		productDetail,
		productPublicity,
		productView,
		productTab,
		productRelated,
		warehousesModal,
	},
	computed: {
		...mapGetters([
			'getCommerceData',
			'getPromotionalBanner',
			'token',
		]),
		...mapGetters('loading', [
			'isLoading',
		]),
		...mapState({
			relateds: state => state.products.relateds,
			topModal: state => state.topLocationModal,
		}),
		topLocation,
	},
	data,
	methods: {
		...mapActions('loading', {
			$loading: 'SET_LOADING_FLAG',
		}),
		assignProduct,
		checkValidQuantity,
		clearFeatures,
		clickQuantity,
		closeConfirmModal,
		closeModal,
		isLoggedUser,
		loadData,
		loadOpinions,
		loadProduct,
		newRoute,
		openDialog,
		possibleFeature,
		selectFeature,
		selectedUnit,
	},
	props: {
		id: {
			type: [Number, String],
		},
	},
	watch: {
		$route: newRoute,
	},
};
</script>
<style lang="scss" scoped>
	.container-product-view {
		flex: 1 1 50%;
		margin-right: 15px;

		@media screen and (max-width: 996px) {
			flex: 1 1 100%;
			margin-right: 0;
		}
	}

	.page-detail-product {
		background: color(white);
		position: relative;

		@media screen and (max-width: 996px) {
			padding-top: 20px;
		}
	}

	.detail-product-top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 92px;
		padding: 53px 7% 0;

		@media screen and (max-width: 996px) {
			flex-direction: column;
			margin-bottom: 35px;
			padding: 0;
		}
	}

	.container-product-detail {
		flex: 1 1 40%;
		margin-left: 15px;

		@media screen and (max-width: 996px) {
			flex: 1 1 100%;
			margin-left: 0;
		}
	}

	.container-product-tab {
		flex: 1 1 70%;
	}

	.container-publicity {
		flex: 1 1 30%;
		margin-right: 29px;
	}

	.detail-tab-publicity {
		display: flex;
		justify-content: space-between;
		padding: 0 3%;

		@media screen and (max-width: 764px) {
			flex-direction: column;
			padding: 0;
		}
	}

	.mobile {
		display: none;
		@media screen and (max-width: 764px) {
			display: block;
		}
	}

	.desktop {
		@media screen and (max-width: 764px) {
			display: none;
		}
	}

	.container-general-tab {
		padding: 0 7%;

		@media screen and (max-width: 764px) {
			padding: 0 5%;
		}
	}

	.confirm-modal-container {
		background-color: white;
		border: 1px solid color(border);
		border-radius: 8px;
		box-shadow: 0 2px 4px 0 rgba(213, 213, 213, 0.5);
		margin-top: 1rem;
		padding: 10px;
		position: fixed;
		right: 37px;
		width: 350px;
		z-index: 2;
	}

	.product-disabled {
		align-items: center;
		display: flex;
		height: 300px;
		justify-content: center;
	}

	.sorry-text {
		margin: 0 20px;
		text-align: center;
	}
</style>

