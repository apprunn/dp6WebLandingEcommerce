<template>
  <header class="app-header">
		<div class="app-wrapper">
			<div class="flex container-call-menu">
				<call-menu
					text="Menú"
					:color="globalColors.primary"
					:menu="menu"
					@change-menu="changeMenu"
				/>
			</div>
			<div class="flex container-header-logo">
				<h1
					:class="[
						'app-header-logo',
						{ 'hide-logo': isSearchMobile },
						{ 'loading': indeterminate },
					]"
				>
					<router-link to="/" class="link-logo" v-if="!indeterminate">
						<img
							v-if="logo.urlImage"
							:src="logo.urlImage"
							alt="Logo de compañía"
							class="logo-image"
						/>
					</router-link>
				</h1>
				<div 
					class="container-search flex"
					:class="isSearchMobile ? 'open' : null">
					<app-search 
						image="/static/img/search.svg"
						color="#4a4a4a"
						@search="searchProduct"/>
					<button-image 
						:data="close" 
						class="icon-close"
						@click-image="toogleSearch"/>
				</div>
			</div>
			<div
				data-cy="loginBtn"
				class="flex container-button-image align-center"
				:class="{'opacity' : isSearchMobile}">
				<button
					class="icon-mobile"
					@click="toogleSearch"
				>
					<SearchIcon v-if="!indeterminate"/>
				</button>
				<UserSvg
					class="icon-desktop"
					@click="openModalLogin"
				/>
				<button 
					class="icon-mobile" 
					@click="goToFavorites">
					<UserSvg
						@click="openModalLogin"
					/>
				</button>
					<button 
					class="icon-desktop" 
					@click="goToFavorites">
					<HeartComponent @click="goToFavorites"/>
				</button>
				<CarComponent @click="goShopping" :count="totalProducts"/>
			</div>
		</div>
		<modal-login 
			class="app-modal-login"
			v-show="showLoginModal"
			@close-modal="closeModal"
		/>
	</header>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import callMenu from '@/components/header/call-menu';
import appSearch from '@/components/shared/inputs/app-input-search';
import buttonImage from '@/components/shared/buttons/app-button-image';
import modalLogin from '@/components/header/modal-login';
import CarComponent from '@/components/shared/icons/car-component';
import HeartComponent from '@/components/shared/icons/heart-component';
import UserSvg from '@/components/shared/icons/user-svg';
import SearchIcon from '@/components/shared/icons/search-component';

function mounted() {
	const ls = this.getLocalStorage(`${process.env.STORAGE_USER_KEY}::product-select`);
	this.$store.dispatch('updateProductSelect', ls);
}

function destroyed() {
	window.removeEventListener('scroll', this.handleScroll);
}

function toogleSearch() {
	this.isSearchMobile = !this.isSearchMobile;
}

function changeMenu() {
	this.$emit('change-menu');
}

function openModalLogin() {
	if (this.token) {
		this.goTo('profile');
	} else {
		this.$store.commit('toogleLoginModal');
	}
}

function closeModal() {
	this.$store.commit('toogleLoginModal');
}

function getData($event) {
	this.searchText = $event.target.value;
}

function searchProduct(value) {
	const search = value.trim() ? value : null;
	const filterId = this.getFilters[0] ? this.getFilters[0].id : null;
	const id = search ? null : filterId;
	if (!search || this.productParams.search !== search) {
		this.$store.dispatch('START_PAGINATION');
	}
	this.$store.dispatch('CLEAN_PRODUCTS_ARRAY');
	this.$store.dispatch('UPDATE_PRODUCT_FILTER', null);
	this.$store.dispatch('UPDATE_PRODUCT_SEARCH', search);
	this.$store.dispatch('LOAD_PRODUCTS', { context: this });
	this.isSearchMobile = false;
	this.updateFilter(id);
	if (this.$route.name !== 'page-home') {
		this.goTo('page-home');
		setTimeout(() => {
			this.scrollTo('transition-product-section', 800, true);
		}, 1000);
	} else {
		this.scrollTo('transition-product-section', 800, true);
	}
}

function updateFilter(id) {
	const filters = this.getFilters.map((f) => {
		const newFilter = { ...f };
		newFilter.select = f.id === id;
		return newFilter;
	});
	this.$store.dispatch('updateFilters', filters);
}

function goShopping() {
	this.goTo('buy');
}

function goToFavorites() {
	if (this.token) {
		this.goTo('favorites');
	} else {
		this.goTo('login');
	}
}

function data() {
	return {
		imagesButton: [
			{
				image: '/static/img/user.svg',
				name: 'Usuario',
				height: 20,
			},
			{
				image: '/static/img/heart.svg',
				name: 'Mis órdenes',
				height: 20,
			},
			{
				image: '/static/img/car.svg',
				name: 'Carrito de compras',
				height: 20,
			},
		],
		close: {
			image: '/static/img/close.svg',
			name: 'Cerrar',
			height: 13,
		},
		search: {
			image: '/static/img/search.svg',
			name: 'Buscar',
			height: 20,
		},
		isSearchMobile: false,
		scrolled: false,
		searchText: null,
	};
}

export default {
	name: 'app-header',
	components: {
		appSearch,
		buttonImage,
		callMenu,
		CarComponent,
		HeartComponent,
		modalLogin,
		SearchIcon,
		UserSvg,
	},
	computed: {
		...mapGetters([
			'token',
			'totalProducts',
			'getFilters',
			'getTotalQuantityProducts',
			'indeterminate',
			'productParams',
		]),
		...mapState({
			showLoginModal: state => state.openSignInModal,
		}),
	},
	data,
	destroyed,
	methods: {
		changeMenu,
		closeModal,
		getData,
		goShopping,
		goToFavorites,
		openModalLogin,
		searchProduct,
		updateFilter,
		toogleSearch,
	},
	mounted,
	props: {
		logo: {
			type: Object,
			default: () => {},
		},
		menu: {
			type: Boolean,
			default: false,
		},
		user: {
			type: Object,
			default: () => {},
		},
	},
};
</script>
<style lang="scss" scoped>
	.app-header {
		background: color(white);
		box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.11);box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.11);
		display: flex;
		height: inherit;
		overflow: hidden;
		padding: 0px 6%;
		position: sticky;
		top: 0;
		transition: all .2s linear 0s;
		width: 100vw;
		z-index: 5;

		@media (min-width: 768px) {
			height: 99px;
			overflow: inherit;
			padding: 0px 6%;
		}
	}

	.app-wrapper {
		align-items: center;
		display: flex;
		height: 75px;
		position: relative;
		width: 100%;

		@media (min-width: 768px) {
			height: 95px;
		}
	}

	.flex {
		display: flex;
	}

	.container-call-menu {
		align-items: center;
		border-right: 1px solid color(border);
		flex: 1 1 10%;
		justify-content: center;

		
	}

	.container-header-logo {
		align-items: center;
		flex: 1 1 70%;
		height: inherit;
		padding: 1.5rem 0;

		@media (max-width: 764px) {
			justify-content: center;
			padding: 1rem 0;
		}
	}

	.container-button-image {
		flex: 1 1 20%;
		justify-content: flex-end;

		& > button, div {
			margin-left: 20px;
		}

		@media (max-width: 764px) {
			justify-content: space-between;

			&.opacity {
				opacity: 0;
			}
		}
	}

	.app-header-logo {
		height: 100%;
		margin: 0 1rem;
		@media (max-width: 768px) {
			flex-basis: 64%;
			transform: translateX(0);
			transition: transform 220ms ease-out;
		}
	}

	.hide-logo {

		@media (max-width: 768px) {
			transform: translateX(-200%);
		}
	}

	.icon-medium {
		margin: 0 25px;
	}

	.container-search {
		align-items: center;
		background: color(white);
		flex-basis: 70%;
		transition: .3s ease-in-out;
		width: 100%;
		z-index: 1;

		@media (max-width: 764px) {
			left: 107%;
			position: absolute;

			&.open {
				left: 0;
			}
		}
	}

	.icon-close {
		display: none;

		@media (max-width: 764px) {
			display: block;
			margin-left: 11px;
		}
	}

	.icon-mobile {
		display: none;

		@media (max-width: 764px) {
			align-items: center;
			display: flex;
			justify-content: center;
			height: 25px;
			margin-top: 5px;
			width: auto;
		}
	}

	.icon-desktop {
		display: block;

		@media (max-width: 764px) {
			display: none;
		}
	}

	.logo-image {
		height: 67px;
		object-fit: contain;
		width: 103px;
	}

	.app-modal-login {
		position: absolute;
		right: calc(6% + 85px);
		top: 70px;
		z-index: 6;

		@media (max-width: 764px) {
			display: none !important;
		}
	}

	.align-center {
		align-items: center;
	}
</style>


