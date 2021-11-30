<template>
	<v-app class="main-container">
		<app-customer-discount
			v-if="user.discount && user.showCustomerDiscountMessage"
			:discount="user.discount"
		/>
		<app-banner-top ref="bannerTop" v-if="!indeterminate" :data="bannerTop"/>
		<app-header
			ref="ecoHeader"
			:logo="logo" 
			:menu="showMenu"
			:user="user"
			@change-menu="changeMenu" 
		/>
		<transition name="slide-fade">
			<div 
				class="v-overlay v-overlay--absolute v-overlay--active mobile-overlay" 
				@click="changeMenu"
				v-show="showMenu">
			</div>
  		</transition>
	<transition name="slide-fade">
		<app-menu-category 
			v-if="showMenu" 
			:img-user="user"
			:color-base="colorBase"
			:color-border="colorBorder"
		/>
  	</transition>
	<router-view></router-view>
	<section-visa v-if="existcreditsCard"></section-visa>
	<form-bulletin />
	<app-footer></app-footer>
	<v-snackbar
			:timeout="snackbar.timeout"
			:color="snackbar.color"
			top
			right
			v-model="snackbar.isVisible"
		>
			{{ snackbar.text }}
			<div
				v-if="snackbar.html"
				v-html="snackbar.html">
			</div>
		
			<v-btn
				flat
				class="white--text"
				@click.native="goToOpen"
				v-if="snackbar.isBtn"
			>
				Iniciar Sesión
			</v-btn>
			<v-btn
				v-else
				flat
				class="white--text"
				@click.native="snackbar.isVisible = false"
			>
				Cerrar
			</v-btn>
		</v-snackbar>
	</v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import appHeader from '@/components/header/app-header';
import { isEmpty, getDeeper } from '@/shared/lib';
import appCustomerDiscount from '@/components/header/app-customer-discount';

const appMenuCategory = () => import(/* webpackChunkName: "app-Menu-Category" */'@/components/header/app-category');
const formBulletin = () => import(/* webpackChunkName: "form-Bulletin" */'@/components/shared/form/form-bulletin');
const sectionVisa = () => import(/* webpackChunkName: "section-Visa" */'@/components/footer/section-visa');
const appFooter = () => import(/* webpackChunkName: "app-Footer" */'@/components/footer/app-footer');
const appBannerTop = () => import(/* webpackChunkName: "app-Banner-Top" */ '@/components/header/app-banner-top');

function mounted() {
	document.addEventListener('click', () => {
		if (this.showMenu) {
			this.showMenu = false;
		}
	});
	this.bannerTopAndHeaderHeight();
}

function bannerTopAndHeaderHeight() {
	const { bannerTop, ecoHeader } = this.$refs;
	const ecoHeaderEl = getDeeper('$el.offsetHeight')(ecoHeader) || 0;
	const bannerTopEl = getDeeper('$el.offsetHeight')(bannerTop) || 0;
	const h = bannerTopEl + ecoHeaderEl;
	this.$store.dispatch('topLocationOfModal', h);
}

function existcreditsCard() {
	if (!isEmpty(this.getCommerceData.wayPayment)) {
		const cards = this.getCommerceData.wayPayment.find(c => c.code === 'CDC');
		return Boolean(cards);
	}
	return false;
}

function indeterminate() {
	return this.$store.getters.indeterminate;
}

function snackbar() {
	return this.$store.getters.snackbar;
}

function changeMenu() {
	this.showMenu = !this.showMenu;
}


function routeHandler() {
	this.showMenu = false;
}

function getBanners(newBanners) {
	const bannerItem = newBanners.find(r => r.typeId === this.bannersTypes.Top);
	this.bannerTop = Object.assign({}, this.bannerTop, bannerItem);
}

function getCommerceData(newData) {
	this.logo = newData;
}

function goToOpen() {
	this.goTo('login');
}

function data() {
	return {
		logo: {
			urlImage: 'Cargando imagen',
			name: process.env.COMPANY_LOGIN_TITLE,
			height: 30,
		},
		showMenu: false,
		colorBase: process.env.COLOR_PRIMARY,
		colorBorder: process.env.COLOR_BORDER,
		bannerTop: {
			urlImage: '',
			image: 'descuento',
		},
	};
}

export default {
	name: 'app',
	computed: {
		indeterminate,
		snackbar,
		...mapGetters([
			'bannersTypes',
			'getBanners',
			'getCategories',
			'getCommerceData',
			'getFilters',
			'user',
		]),
		existcreditsCard,
	},
	data,
	components: {
		appBannerTop,
		appCustomerDiscount,
		appHeader,
		appFooter,
		appMenuCategory,
		formBulletin,
		sectionVisa,
	},
	methods: {
		bannerTopAndHeaderHeight,
		changeMenu,
		goToOpen,
	},
	mounted,
	watch: {
		$route: routeHandler,
		getBanners,
		getCommerceData,
	},
};
</script>

<style lang="scss">
html, body {
	color: color(black) !important;
	font-family: font(regular) !important;
	font-size: size(medium);
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

button {
	cursor: pointer;
	min-width: 5px;
	outline: none;
}

input.app-input::-webkit-input-placeholder {
	color: color(border);
	font-family: font(demi) !important;
	font-size: size(minmedium) !important;
	font-weight: normal !important;
}

.main-container {
	background-color: white !important;
}

.product-rating {
	.v-icon {
		padding: 0.2rem !important;
	}
}

.slide-fade-enter-active {
  	transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-leave-active {
  	transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.transparent-select {
	background-color: transparent !important;
	font-family: font(medium) !important;
	height: 30px !important;

	.v-input__control {
		
		.v-input__slot {
			border: 1px solid color(border) !important;
			border-radius: 7px !important;
			height: -webkit-fill-available !important;
			min-height: inherit !important;

			.v-select__selections {
				color: color(white);
				padding-top: 0 !important;

				input::placeholder {
					color: color(white);
					font-family: font(demi) !important;
					font-size: size(minmedium) !important;
					font-weight: normal !important;
				}
			}

			.v-input__append-inner {
				margin-top: 10px !important;

				.theme--light.v-icon {
					color: white;
				}
			}
		}
	}
}
.ecommerce-select {
	background-color: color(background) !important;
	font-family: font(medium) !important;
	height: 46.8px !important;

	.v-input__control {
		height: inherit;
		
		.v-input__slot {
			border: 1px solid color(border) !important;
			border-radius: 7px !important;
			height: inherit;
			min-height: inherit !important;

			.v-select__selections {
				color: color(base);
				padding-top: 0 !important;

				input::placeholder {
					color: color(border);
					font-family: font(demi) !important;
					font-size: size(minmedium) !important;
					font-weight: normal !important;
				}
			}

			.v-input__append-inner {
				margin-top: 10px !important;
			}
		}
	}
}

.slide-fade-enter, .slide-fade-leave-to {
	opacity: 0;
  transform: translateX(-10px);
}

.mobile-overlay {
	display: none;

	@media (max-width: 764px) {
		display: block;
	}
}

.banner-carousel {
	.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {
		border: 1px solid color(white);
		height: 12px;
    	width: 12px;
	}

	.swiper-pagination-bullet {
		background: transparent;
		cursor: pointer;
		opacity: 1;
	}

	.swiper-pagination-bullet-active {
		background: color(white);
	}

	.swiper-container-horizontal > .swiper-pagination-bullets {
		bottom: 71px;

		@media (max-width: 1161px) {
			bottom: 46px;
		}
	}
}

.categories-carousel-slider, .section-settlement  {
	.swiper-button-next {
		background-image: none;
		right: 0;
	}

	.swiper-button-prev {
		background-image: none;
		left: 0;
	}

	.swiper-button-next, .swiper-button-prev {
		background-size: auto;
		cursor: pointer;
		height: 40px;
		outline: none;
		top: 40%;
		width: 40px;
	}
}

.online-payment {
	.swiper-button-prev,
	.swiper-button-next {
		background-image: none;
		cursor: pointer;
	}
}


.filters-category {
	.theme--light.v-messages {
		display: none;
	}
	
	.v-input input {
		color: color(base);
	}

	.v-text-field__slot {
		color: color(base) !important;
		left: 1px;
		position: relative;
		top: 32px;
	}

	.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
		display: none !important;
	}

	.v-card__text {
		padding: 0;
	}

	.v-slider__thumb {
		background-color: color(base) !important;
		border-color: color(base) !important;
		left: -6px;
	}

	.v-slider__thumb-container .primary--text {
		color: color(base) !important;
	}

	.primary {
		background-color: color(base) !important;
	}

	.v-input--slider {
		position: relative;
   		right: 46px;
	}
}		   
.text-area {
	color: color(border) !important;
	font-family: font(medium) !important;
	font-size: size(small) !important;

	.v-input__control {
		
		.v-input__slot {
			background-color: white !important;
			border: solid 1px color(border) !important;
			border-radius: 5px !important;
		}
	}
}

.btn-order {
	width: 100%;
	
	button.app-button {
		height: 49px;
		max-width: 100% !important;

		@media (min-width: 764px) {
			height: 49px;
			max-width: 100% !important;
		}
	}

}

.section-settlement {
	.swiper-button-next, .swiper-button-prev {
		@media (max-width: 1161px) {
			display: none;
		}
	}
}

.start-js-btn.modal-opener.default {
	background: url('/static/img/icons/icon-visanet.png') !important;
	background-position: right 14px !important;
	background-repeat: no-repeat !important;
	border: 1px solid color(border) !important;
	border-radius: 8px !important;
	box-shadow: none !important;
	color: color(base) !important;
	font-family: font(demi) !important;
	font-size: size(large) !important;
	font-weight: normal !important;
	height: 65px !important;
	margin-top: 55px;
	position: relative;
	text-shadow: none !important;
	width: 213px !important;

	&:before {
		bottom: 0;
		color: color(base) !important;
		content: 'Paga con';
		font-family: font(demi) !important;
		font-size: size(large) !important;
		font-weight: normal !important;
		height: 22px;
		left: 18px;
		margin: auto;
		position: absolute;
		top: 0;
	}
}

.err-message {
	color: color(error);
	font-size: size(xsmall);
}

.component-filter {
	.swiper-slide {
		border-right: 1px solid color(white);
		display: flex;
		height: 51px;
		justify-content: center;
	}

	.swiper-container {
		width: 100%;
	}
	
	.swiper-button-next {
		background-image: none;
		height: 40px;
		position: absolute;
		right: 0;
		width: 40px;

		@media (max-width: 650px) {
			outline: none;
			right: -6px;
		}
	}

	.swiper-button-prev {
		background-image: none;
		height: 40px;
		left: 0;
		position: absolute;
		width: 40px;
		
		@media (max-width: 650px) {
			left: -6px;
			outline: none;
		}
	}
}

.product-tab {
	.v-tabs__container {
		border-radius: 5px;

		@media screen and (max-width: 996px) {
			height: 38px;
		}
	}

	.v-tabs__item {
		border-radius: 5px;
		padding: 0;
	}

	.v-tabs__wrapper {
		margin-bottom: 39px;
	}

	.material-icons {
		margin-top: 10px;
	}
}

.page-category {
	.v-breadcrumbs__item {
		color: color(base);
		font-family: font(bold);
		font-size: size(medium);
	}

	.theme--light.v-breadcrumbs .v-breadcrumbs__divider, .theme--light.v-breadcrumbs .v-breadcrumbs__item--disabled {
		color: color(primary);
		font-family: font(bold);
	}
}

.product-related {
	.swiper-button-next {
		background-image: url('/static/img/slider-arrow-rigth.svg');
	}

	.swiper-button-prev {
		background-image: url('/static/img/slider-arrow-left.svg');
	}

	.swiper-button-next, .swiper-button-prev {
		background-size: auto;
		cursor: pointer;
		height: 19px;
		outline: none;
		top: calc(50% - 26px);
		transform: translateY(50%);
		width: 13px;
	}

	@media screen and (max-width: 975px) {
		.swiper-button-next, .swiper-button-prev {
			display: none;
		}

		.product-container {
			.product-discount {
				display: none;
			}

			.product-favorite{
				margin: auto;
			}
		}
	}
}

.product-tab {
	.v-tabs__div {
		flex: 1 1 auto;
		max-width: none;
	}
}

.billing-style {

	.v-input--selection-controls__input {
		width: 46px !important;

		input {
			max-height: 46px !important;
		}

		.v-input--switch__track {
			border-radius: 3px !important;
			height: 20px !important;
		}

		.accent--text {
			color: color(primary) !important;
		}

		.v-input--switch__thumb {
			border-radius: 3px !important;
			top: calc(50% - 7px) !important;
		}

	}

	&.v-input--is-dirty .v-input--selection-controls__ripple,
	&.v-input--is-dirty .v-input--switch__thumb {
		transform: translate(24px, 0) !important;
	}

	.v-label {
		font-family: font(demi) !important;
		font-size: size(medium) !important;
	}
}

.page-category {
	.primary {
		background-color: color(secondary) !important;
		color: color(white) !important;
	}

	.v-pagination__item {
		box-shadow: none;
		color: color(base) !important;
		font-size: size(small) !important;
	}

	.v-pagination__item--active {
		color: color(white) !important;
	}

	.theme--light.v-pagination .v-pagination__item {
		color: color(base);
		font-family: font(medium);
		height: 20px;
		margin: 3px;
		min-width: 17px;
	}

	.v-pagination__navigation {
		box-shadow: none;
	}

	.v-pagination {
		height: 21px;
	}

	.theme--light.v-pagination .v-pagination__navigation .v-icon {
		padding: 0 !important;
	} 
}	
	.v-dialog {
		@media screen and (max-width: 764px) {
			margin: 0 !important;

			.v-card  {
				height: 100vh;
			}
		}
	}

	.v-dialog:not(.v-dialog--fullscreen) {
		@media screen and (max-width: 764px) {
			max-height: none !important;
		}
	}

	.go-left-enter {
		opacity: 0;
		transform: translateX(100%);
	}

	.go-right-enter {
		opacity: 0;
		transform: translateX(-100%);
	}

	.go-left-leave-to {
		opacity: 0;
		transform: translateX(-100%);
	}

	.go-right-leave-to {
		opacity: 0;
		transform: translateX(100%);
	}

	.go-left-enter-active,
	.go-right-enter-active,
	.go-right-leave-active,
	.go-left-leave-active {
		transition: all 0.2s cubic-bezier(.32,1.09,.62,.98);
}

.list-category {
		.slide-enter-active {
		transition-duration: 0.5s;
		transition-timing-function: ease-in;
	}

	.slide-leave-active {
		transition-duration: 0.5s;
		transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
	}

	.slide-enter-to, .slide-leave {
		max-height: 1000px;
		overflow: hidden;
	}

	.slide-enter, .slide-leave-to {
		overflow: hidden;
		max-height: 0;
	}
}

.page-category {
	.product-container {
		margin: 10px auto !important;

		@media (max-width: 986px) {
				margin: 0 !important;
		}
	}
}

.app-category {
	.menu-list-item {
		.v-treeview {
			display: flex;
			flex-wrap: wrap;
			height: 100%;

			& > .v-treeview-node {
				border-right: 1px solid color(border);
				flex: 0 0 33%;
				margin-left: 0 !important;
				padding: 10px 1.5%;

				& > .v-treeview-node__root {
					
					.v-treeview-node__label {
						font-family: font(demi);
					}

					.v-treeview-node__content {
						max-width: 100%;
					}
				}
				& > .v-treeview-node__children {
					color: color(base);

					.v-treeview-node__content {
						max-width: 100%;
					}
				}
			}
			& > .v-treeview-node:nth-child(3n) {
				border-right: none;
			}
		}

		.v-treeview-node__label {
			font-family: font(regular);
			font-size: size(medium);
			max-width: 100%;
		}

		.v-treeview-node {
			margin-left: 13px !important;
		}

		.v-treeview-node__root {
			height: auto !important;
		}

		.v-icon {
			display: none;
			@media (max-width: 764px) {
				display: block;
			}
		}

		.v-treeview-node--active {
			background: none;
		}
	}

	.menu-mobile {
		.v-icon {
			position: absolute;
			right: 0;
		}

		.v-treeview-node {
			margin-left: 13px !important;
			position: relative;
		}

		.v-treeview-node__label {
			font-size: size(small);
		}

		.v-treeview-node__root {
			height: 26px !important;
		}

		.v-treeview-node__toggle {
			transform: rotate(0deg);
			transition: none !important;
		}

		.v-treeview-node__toggle--open {
			transform: rotate(-180deg);
		}
	}
}

.list-category {
	.material-icons {
		font-size: 9px !important;
	}

	.v-treeview-node {
		margin-left: 13px !important;
	}

	.v-treeview-node__root {
		height: 25px;
	}

	.v-treeview-node__label {
		font-size: size(medium);
	}

	.v-treeview-node--active {
		background: transparent !important;
	}
}

.loading {
	background-color: color(border) !important;
	border-color: color(border) !important;
	border-radius: 3px;
	color: color(border) !important;
	fill: color(border) !important;
}

.loading-dark {
	filter: brightness(0.9);
}

.conversions-select {

	.ecommerce-select {
		background-color: white !important;
	}
}

.app-banner-cupons {
	.swiper-button-next {
		background-image: url('/static/img/icons/right-arrow-slider-coupons.svg');
		right: -10px;
		width: 35px;
	}

	.swiper-button-prev {
		background-image: url('/static/img/icons/image-slider-left-coupons.svg');
		left: -10px;
		width: 35px;
	}
}

.xchange-btn {

	button {
		background-position: top !important;
    	background-size: cover !important;
    	height: 50px !important;
		width: 210px !important;
	}
}

.table-online-transaction {
	tr:nth-child(even) {
		background-color: white !important;
	}
}

.payment-sections {
	font-family: font(medium);
}

.wpwl-brand-DINERS {
	height: 35px;
	width: 85px;
}

.wpwl-label-cardNumber {
	visibility: hidden;
	text-decoration: none;
}

.wpwl-label-cardNumber::after {
	content: "Numero de la Tarjeta:";
	position: relative;
    right: 80px;
	visibility: visible;
}

.wpwl-label-expiry {
	visibility: hidden;
	text-decoration: none;	
}

.wpwl-label-expiry::after {
	content: "Expira:";
	position: relative;
    right: 66px;
	visibility: visible;
}

.wpwl-label-cardHolder {
	visibility: hidden;
	text-decoration: none;
}

.wpwl-label-cardHolder::before {
	display: none;
}


.wpwl-label-cardHolder::after {
	content: "Nom. (Igual que en la tarjeta)";
	position: relative;
    right: 66px;
	visibility: visible;
}

.wpwl-label-brand {
	visibility: hidden;
	text-decoration: none;
	width: 133px;
}

.wpwl-label-brand::after {
	content: "Tipo de Tarjeta:";
	position: relative;
    right: 36px;
	top: 5px;
	visibility: visible;
}

.wpwl-label-brand, .wpwl-wrapper-brand, .wpwl-wrapper-registration-registrationId, .wpwl-wrapper-registration-brand, .wpwl-wrapper-registration-number, .wpwl-wrapper-registration-expiry {
	padding: 0 !important;
}

.wpwl-form {
	max-width: 32em;
}

.wpwl-control-brand {
	width: 127px !important;
}
.application--wrap {
	display: block;
}

.v-snack__content {
	height: auto !important;
}

.product-view {
	.swiper-pagination {
		background-color: white !important;
		padding: 8px 0;
		bottom: 0px;
	}
}
</style>
