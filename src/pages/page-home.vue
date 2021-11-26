<template>
	<layout-admin>
		<banner-carousel :banners="getBannersHome"/>
		<div
			class="loading-categories-container"
			v-if="getCategories.length === 0 || indeterminate"
		>
			<div class="loading-categories loading"></div>
		</div>
		<categories-carousel
			v-else
 			:categories="getCategories"
			:len="getCategoriesLength"
			:color-base="colorBase"/>
		<component-filter-product 
			v-if="filtersExist"
			@click-filter="filterSelect"
		>
		</component-filter-product>
		<div class="page-products">
			<products-section/>
		</div>
		<app-banner-top
			v-if="getPromotionalBanner"
			:data="getPromotionalBanner"
			:color="colorSecondary"
			big/>
		<app-banner-credit
			v-if="getCreditBanner"
			:data="getCreditBanner"
			:title-btn="titleBtn"
		/>
		<app-banner-plans
			v-if="getPlansBanner"
			:data="getPlansBanner"
		/>
		<app-banner-coupons
			v-if="getCouponsBanner"
			:data="getCouponsBanner"
		/>
		<cart-bottom></cart-bottom>
	</layout-admin>
</template>

<script>
import { mapGetters } from 'vuex';
import appBannerCoupons from '@/components/home/app-banner-coupons';
import appBannerCredit from '@/components/home/app-banner-credit';
import appBannerPlans from '@/components/header/app-banner-plans';
import appBannerTop from '@/components/header/app-banner-top';
import bannerCarousel from '@/components/home/banner-carousel';
import categoriesCarousel from '@/components/home/categories-carousel';
import componentFilterProduct from '@/components/shared/products/component-filter-product';
import productsSection from '@/components/products/products-section';
import sectionSettlement from '@/components/home/section-settlement';
import cartBottom from '@/components/footer/cart-bottom';

function created() {
	this.updatePageTitle(this.getCommerceData.name);
	this.updateDescriptionTag(this.homeDescriptionMetaTag);
}

function filterSelect(filter) {
	if (filter.link) {
		window.open(filter.link, '_blank');
	} else {
		const filters = this.getFilters.map((f) => {
			const newFilter = { ...f };
			newFilter.select = f.id === filter.id;
			return newFilter;
		});
		this.$store.dispatch('START_PAGINATION');
		this.$store.dispatch('UPDATE_PRODUCT_FILTER', filter.id);
		this.$store.dispatch('CLEAN_PRODUCTS_ARRAY');
		this.$store.dispatch('LOAD_PRODUCTS', { context: this });
		this.$store.dispatch('updateFilters', filters);
	}
}

function filtersExist() {
	return this.getFilters && this.getFilters.length;
}

function getCategoriesLength() {
	const len = this.getCategories.length;
	return len > 6 ? 6 : len;
}

function data() {
	return {
		filters: [],
		categories: [
			{
				id: 1,
				title: 'Resortes',
				webImage: '/static/img/category-springs-white.svg',
				urlImage: 'https://s3.amazonaws.com/apprunn-acl/COM-PRU-01/ARQ88/image/resorte2.png',
				hover: false,
				select: false,
			},
			{
				id: 2,
				title: 'Mayas',
				webImage: '/static/img/category-mesh-white.svg',
				urlImage: 'https://s3.amazonaws.com/apprunn-acl/COM-PRU-01/ARQ88/image/mayas.png',
				hover: false,
				select: false,
			},
			{
				id: 3,
				title: 'Cables',
				webImage: '/static/img/category-cables-white.svg',
				urlImage: 'https://s3.amazonaws.com/apprunn-acl/COM-PRU-01/ARQ88/image/cables.png',
				hover: false,
				select: false,
			},
			{
				id: 4,
				title: 'Resortes',
				webImage: '/static/img/category-springs-white.svg',
				urlImage: 'https://s3.amazonaws.com/apprunn-acl/COM-PRU-01/ARQ88/image/resorte2.png',
				hover: false,
				select: false,
			},
			{
				id: 5,
				title: 'Cables',
				webImage: '/static/img/category-cables-white.svg',
				urlImage: 'https://s3.amazonaws.com/apprunn-acl/COM-PRU-01/ARQ88/image/cables.png',
				hover: false,
				select: false,
			},
		],
		colorDark: process.env.COLOR_TITLE,
		colorBase: process.env.COLOR_PRIMARY,
		colorSecondary: process.env.COLOR_SECONDARY,
		homeDescriptionMetaTag: 'Vende tus productos online con nosotros, el mejor ecommerce de América Latina',
		titleBtn: 'SOLICITA AQUÍ',
	};
}
export default {
	name: 'page-home',
	data,
	components: {
		appBannerCoupons,
		appBannerCredit,
		appBannerTop,
		appBannerPlans,
		bannerCarousel,
		categoriesCarousel,
		componentFilterProduct,
		productsSection,
		sectionSettlement,
		cartBottom,
	},
	computed: {
		...mapGetters([
			'getBannersHome',
			'getCouponsBanner',
			'getCreditBanner',
			'getPromotionalBanner',
			'getPlansBanner',
			'getCategories',
			'getCommerceData',
			'getFilters',
			'indeterminate',
		]),
		filtersExist,
		getCategoriesLength,
	},
	created,
	methods: {
		filterSelect,
	},
};
</script>
<style lang="scss" scoped>
	.loading-categories-container {
		padding: 8rem 15%;
	}

	.loading-categories {
		height: 200px;
	}

	.loading-banner-container {
		height: 616px;
	}
</style>