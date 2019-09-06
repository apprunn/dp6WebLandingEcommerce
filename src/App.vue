<template>
	<v-app class="main-container">
		<app-banner-top :data="bannerTop"/>
		<app-header
			:logo="logo" 
			@change-menu="changeMenu" 
			:menu="showMenu"
			:user="user"/>
		<transition name="slide-fade">
			<div 
				class="v-overlay v-overlay--absolute v-overlay--active mobile-overlay" 
				@click="changeMenu"
				v-show="showMenu"></div>
  	</transition>
	<transition name="slide-fade">
		<app-menu-category 
			v-if="showMenu" 
			:img-user="user"
			:color-base="colorBase"
			:color-border="colorBorder"
			:categories="getCategories"/>
  	</transition>
	<router-view></router-view>
	<section-visa></section-visa>
	<form-bulletin />
	<app-footer></app-footer>
	<v-snackbar
			:timeout="5000"
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
				@click.native="snackbar.isVisible = false"
			>
				Cerrar
			</v-btn>
		</v-snackbar>
	</v-app>
</template>

<script>
import { mapGetters } from 'vuex';

const appHeader = () => import('@/components/header/app-header');
const appMenuCategory = () => import('@/components/header/app-category');
const appBannerTop = () => import('@/components/header/app-banner-top');
const formBulletin = () => import('@/components/shared/form/form-bulletin');
const sectionVisa = () => import('@/components/footer/section-visa');
const appFooter = () => import('@/components/footer/app-footer');

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

function data() {
	return {
		logo: {
			image: process.env.COMPANY_LOGO,
			name: process.env.COMPANY_LOGIN_TITLE,
			height: 30,
		},
		showMenu: false,
		colorBase: process.env.COLOR_BASE,
		colorBorder: process.env.COLOR_BORDER,
		bannerTop: {
			urlImage: 'https://s3.amazonaws.com/apprunn-acl/COM-PRU-01/ARQ88/image/banner-top.png',
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
			'user',
			'getCategories',
			'getFilters',
		]),
	},
	data,
	components: {
		appFooter,
		appHeader,
		appBannerTop,
		appMenuCategory,
		formBulletin,
		sectionVisa,
	},
	methods: {
		changeMenu,
	},
	watch: {
		$route: routeHandler,
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

.light-select {
	background-color: color(white) !important;

	.v-input__control {
		
		.v-input__slot {
			border: 1px solid color(border) !important;
			border-radius: 7px !important;
			height: -webkit-fill-available !important;
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
				margin-top: 4px !important;
			}
		}
	}
}

.ecommerce-select {
	background-color: color(background) !important;
	font-family: font(medium) !important;
	height: 46.8px !important;

	.v-input__control {
		
		.v-input__slot {
			border: 1px solid color(border) !important;
			border-radius: 7px !important;
			height: -webkit-fill-available !important;
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
		background-image: url('/static/img/icons/arrow-button-next-white.svg');
		position: absolute;
		right: 0;

		@media (max-width: 650px) {
			outline: none;
			right: -6px;
		}
	}

	.swiper-button-prev {
		background-image: url('/static/img/icons/arrow-button-prev-white.svg');
		left: 0;
		position: absolute;
		
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
		font-family: font(medium);
		font-size: size(medium);
	}

	.theme--light.v-breadcrumbs .v-breadcrumbs__divider, .theme--light.v-breadcrumbs .v-breadcrumbs__item--disabled {
		color: color(primary);
		font-family: font(medium);
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

	.go-left-leave-to {
		opacity: 0;
		transform: translateX(-100%);
	}

	.go-left-enter-active,
	.go-left-leave-active {
		transition: all 0.2s cubic-bezier(.32,1.09,.62,.98);
}

.list-category {
		.slide-enter-active {
		transition-duration: 0.4s;
		transition-timing-function: ease-in;
	}

	.slide-leave-active {
		transition-duration: 0.3s;
		transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
	}

	.slide-enter-to, .slide-leave {
		max-height: 100px;
		overflow: hidden;
	}

	.slide-enter, .slide-leave-to {
		overflow: hidden;
		max-height: 0;
	}
}

.fade-vertical-enter,
.fade-vertical-leave-to {
	transform: rotateX(90deg);
}

.fade-vertical-enter-active {
	transition: transform .3s ease;
}

.fade-vertical-leave-active {
	transition: transform .5s ease-in;
}
</style>
