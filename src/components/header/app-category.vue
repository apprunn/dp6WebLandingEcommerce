<template>
	<div
		class="app-category"
		:class="{ scrolling: scrolled, isBanner: bannerTopExist}"
	>
		<div class="app-category-user">
			<div class="container-user" :style="`border-color: ${globalColors.primary}`">
				<img :src="imageUser" :alt="imgUser.name" class="user-avatar">
			</div>
			<div v-if="token">
				<p class="user-name">{{imgUser.name}} {{imgUser.lastname}}</p>
			</div>
			<div 
				class="container-link-user" :style="`border-color: ${globalColors.base}`"
				v-else>
				<router-link 
					:to="{ name: 'login'}"
					:style="`color: ${globalColors.primary}`"
					class="link">Iniciar Sesión</router-link>
				<router-link 
					:to="{ name: 'register'}"
					:style="`color: ${globalColors.primary}`"
					class="link">Crear cuenta</router-link>
			</div>
		</div>
		<div class="menu-app-category">
			<div class="menu-list-name-category">
				<div 
					v-for="(list, index) in categories" 
					:key="index"
					class="name-category"
					:class="{'select': list.select}"
				>
					<div
						class="list-name-category"
						:style="`background-color:${list.select ? globalColors.secondary : 'white'};transition:all 200ms ease-in;`"
					>
						<item-menu 
							:data="list" 
							color-select="#ed0000"
							@click-item="goToCategory(list)"
							@hover-item="hoverCategory"
						/>
						<button class="btn-collapse" @click="clickCategory(list)">
							<v-icon 
								:class="{'rotate-icon': list.select}"
								class="icon"
								v-if="list.detail.length">keyboard_arrow_down</v-icon>
						</button>
					</div>
					<div v-if="list.detail && list.select" class="menu-mobile">
						<v-treeview 
							:items="list.detail"
							item-children="detail"
							item-text="title"
							item-key="id"
							expand-icon="keyboard_arrow_down"
							activatable
							@update:active="goToCategories"
							return-object
						></v-treeview>
					</div>
				</div>
			</div>
			<div
				class="menu-list-item desktop"
				:class="!selectCategory.details || selectCategory.details.length === 0 ? 'menu-list-item-data' : ''"
				v-if="selectCategory"
			>
				<template v-if="selectCategory.details && selectCategory.details.length > 0">
					<v-treeview 
						:items="selectCategory.detail"
						item-children="detail"
						open-all
						item-text="title"
						item-key="id"
						activatable
						@update:active="goToCategories"
						return-object
						v-if="load">
					</v-treeview>
				</template>
				<template v-else>
					<div
						class="menu-list-item-title"
						:style="`color: ${globalColors.title};`"
					>
						{{ selectCategory.title }}
					</div>
					<div class="menu-list-item-description">
						{{ selectCategory.description || '...' }}
					</div>
					<button
						class="menu-list-item-btn"
						:style="
							`border: 1px solid ${selectCategory.select ? globalColors.secondary : 'white'};
							color: ${selectCategory.select ? globalColors.secondary : 'white'}`"
						type="button"
						@click="goToCategory({ slug: selectCategory.slug, id: selectCategory.id })"
					>
						Ver productos
					</button>
				</template>
			</div>
			<div class="menu-list-banner">
				<img :src="selectCategory.urlImage" alt="imagen de la categoria">
			</div>
		</div>
		<div class="container-option">
			<div class="option-user" v-if="token">
				<button class="option" @click="goTo('user-orders')">
					<img 
						:src="imageOrder.urlImage" 
						:alt="imageOrder.name"
						class="mr-8">
					<span>Mis órdenes</span>
				</button>
				<button class="option" @click="goTo('favorites')">
					<img 
						:src="imageFavorite.urlImage" 
						:alt="imageFavorite.name"
						class="mr-8">
					<span>Mis Favoritos</span>
				</button>
			</div>
			<div class="option-close">
				<button class="option" v-if="token" @click="logout">
					<img 
						:src="imageClose.urlImage" 
						:alt="imageClose.name"
						class="mr-8">
					<span class="text-gray">Cerrar Sesión</span>
				</button>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import itemMenu from '@/components/header/item-menu';

function created() {
	this.categories = this.getCategories;
	window.addEventListener('resize', this.oneSelectCategory);
	window.addEventListener('scroll', this.handleScroll);
	this.oneSelectCategory();
	this.handleScroll();
}

function clickCategory(item) {
	this.load = false;
	const windowWidth = window.innerWidth;
	this.categories = this.categories.map((c) => {
		const newCategory = { ...c };
		if (c.id === item.id) {
			newCategory.select = windowWidth >= 764 ? true : !c.select;
		} else {
			newCategory.select = false;
			newCategory.detail = c.detail.map((l) => {
				const newSub = { ...l };
				newSub.select = false;
				return newSub;
			});
		}
		return newCategory;
	});
	setTimeout(() => {
		this.load = true;
	}, 10);
}

function selectCategory() {
	const index = this.categories.findIndex(c => c.select);
	return this.categories[index] || {};
}

function isMoreTwo() {
	return this.selectCategory ? this.selectCategory.detail.length > 2 : false;
}

function oneSelectCategory() {
	const windowWidth = window.innerWidth;
	if (windowWidth >= 764) {
		this.categories[0].select = true;
	}
}

function destroyed() {
	window.removeEventListener('resize', this.oneSelectCategory);
	window.addEventListener('scroll', this.handleScroll);
}

function clickSubCategory(item, index) {
	if (this.categories[index].detail) {
		this.categories[index].detail = this.categories[index].detail.map((c) => {
			const newSubCategory = { ...c };
			if (item.id === c.id) {
				newSubCategory.select = !c.select;
			} else {
				newSubCategory.select = false;
			}
			return newSubCategory;
		});
	}
}

function imageUser() {
	return this.imgUser.urlImage || this.imgUser.logo || process.env.DEFAULT_AVATAR;
}

function handleScroll() {
	this.scrolled = window.scrollY > 87;
}

function logout() {
	this.goTo('page-home');
	this.$store.dispatch('clearUser');
	this.$store.dispatch('DEFAULT_USER');
	this.$store.dispatch('SET_DEFAULT_VALUES');
	localStorage.clear();
	this.$store.dispatch('SET_CURRENCY_DEFAULT', this);
	this.$store.dispatch('UPDATE_PRODUCT_FILTER', this.getFilters[0].id);
	this.$store.dispatch('LOAD_PRODUCTS', { context: this });
}

function goToCategories(item) {
	if (item.length) {
		const { slug, id } = item[0];
		this.goTo('category', { params: { slug: slug || id, id } });
	}
}

function bannerTopExist() {
	return Boolean(this.getBanners.find(r => r.typeId === this.bannersTypes.Top));
}

function hoverCategory(item) {
	if (window.innerWidth > 764) {
		this.clickCategory(item);
	}
}

function goToCategory({ slug, id }) {
	this.goTo('category', { params: { slug: slug || id, id } });
}

function data() {
	return {
		colorBorder: process.env.COLOR_TITLE,
		imageArrow: {
			urlImage: '/static/img/arrow-down.svg',
			name: 'Desplegar',
		},
		imageOrder: {
			urlImage: '/static/img/app-order.svg',
			name: 'Mis órdenes',
		},
		imageFavorite: {
			urlImage: '/static/img/app-favorite.svg',
			name: 'Mis favoritos',
		},
		imageClose: {
			urlImage: '/static/img/app-close.svg',
			name: 'Cerrar Sesión',
		},
		scrolled: false,
		load: true,
		categories: {},
	};
}

export default {
	name: 'app-category',
	data,
	components: {
		itemMenu,
	},
	computed: {
		...mapGetters([
			'bannersTypes',
			'getBanners',
			'getFilters',
			'token',
			'getCategories',
		]),
		bannerTopExist,
		selectCategory,
		isMoreTwo,
		imageUser,
	},
	created,
	destroyed,
	methods: {
		clickCategory,
		oneSelectCategory,
		clickSubCategory,
		handleScroll,
		goToCategories,
		logout,
		hoverCategory,
		goToCategory,
	},
	props: {
		imgUser: {
			type: Object,
			default: () => {},
		},
	},
};
</script>
<style lang="scss" scoped>
	.app-category {
		background: color(white);
		border-top: solid 1px color(border);
		box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.07);
		height: 460px;
		position: absolute;
		top: 99px;
		z-index: 5;
		width: 100%;

		@media (min-width: 926px) {
			max-width: 926px;
		}

		@media (max-width: 764px) {
			height: 100vh;
			max-height: none;
			min-height: none;
			overflow-y: scroll;
			padding: 22px 8%;
			position: fixed;
			top: 0;
			width: 85%;

			&.scrolling {
				top: 0 !important;
			}

			&.isBanner {
				top: 0 !important;
			}
		}

		&.isBanner {
			top: 188px;
		}
		
		&.scrolling {
			position: fixed;
			top: 99px;
		}
	}

	.menu-list-name-category {
		border-right: 3px solid color(border);
		// flex: 0 0 17%;
		flex: 0 0 26%;
		overflow-y: scroll;

		@media (max-width: 764px) {
			border: none;
			// flex: 1 1 17%;
			flex: 1 1 26%;
			max-height: none;
		}
	}

	.menu-app-category {
		display: flex;
		height: 100%;
		padding: 36px 34px;

		@media (max-width: 764px) {
			height: fit-content;
			padding: 0px;
		}
	}

	.name-category {
		cursor: pointer;
		margin-bottom: 20px;
	}

	.menu-list-item {
		cursor: pointer;
		display: flex;
		// flex: 1 1 auto;
		flex: 0 0 44%;
		height: 100%;
		overflow-y: scroll;

		&.menu-list-item-data {
			align-items: flex-start;
			flex-direction: column;
			flex-wrap: wrap;
			justify-content: center;
			padding-left: 60px;
			text-align: left;
		}

		&-title {
			font-family: font(bold);
			font-size: 15px;
		}

		&-description {
			color: #494949;
			font-family: font(demi);
			font-size: 12px;
			min-height: 136px;
			padding-bottom: 13px;
			padding-top: 13px;
		}

		&-btn {
			border-radius: 3px;
			font-family: font(bold);
			font-size: 15px;
			max-width: max-content;
			max-width: -moz-max-content;
			padding: 5px 20px;
		}
	}

	.desktop {
	
		@media (max-width: 764px) {
			display: none;
		}
	}

	.container-user {
		align-items: center;
		border: 1px solid;
		border-radius: 50%;
		display: flex;
		height: 53px;
		justify-content: center;
		margin: 0 auto;
		padding: 7px;
		width: 53px;
	}

	.container-link-user {
		border-bottom: 1px solid;
		display: flex;
		justify-content: space-between;
		margin-bottom: 33px;
		padding-bottom: 10px;

		

		.link {
			font-family: font(demi);
			font-size: size(small);
			text-decoration: none;
		}
	}

	.app-category-user, .btn-collapse, .menu-mobile {
		display: none;

		@media (max-width: 764px) {
			display: block;
		}
	}

	.list-name-category {
		border-radius: 3px;
		display: flex;
		justify-content: space-between;
		padding: 2px 0 2px 5px;
	}

	.list-item-name {
		color: color(base);
		text-align: left;

		&.bold {
			color: color(black);
			font-family: font(bold);
		}

		&:hover {
			color: color(black);
		}

		@media (max-width: 764px) {
			font-size: size(small);
		}
	}

	.list-item-sub {
		color: color(base);
		display: block;

		@media (max-width: 764px) {
			font-size: size(small);
		}
	}

	.menu-mobile {
		margin: 8px 16px 0 42px;
	}

	.icon {
		transform: rotateZ(0deg);
		transition: none;

		&.rotate-icon {
			transform: rotateZ(180deg);
		}
	}

	.list-subcategory {
		border-bottom: 1px solid map-get($colors, border);
		padding: 3px 0; 
	}

	.content-sub-subcategory {
		display: flex;
		flex-direction: column;

		.list-subcategory {
			&:last-child {
				border-bottom: none;
			}
		}
	}

	.menu-mobile {
		.content-list-subcategory {
			&:last-child {
				.list-subcategory {
				border-bottom: none;
				}
			}
		}
	}

	.container-option {
		display: none;
		height: 100px;

		@media (max-width: 764px) {
			display: block;
			font-size: size(small);
		}
	}

	.option-user {
		align-items: center;
		border-bottom: 1px solid map-get($colors, border);
		display: flex;
		height: 50px;
		justify-content: space-between;
		margin-bottom: 14px;
	}

	.user-name {
		border-bottom: 1px solid color(border);
		color: color(dark);
		font-family: font(bold);
		font-size: size(small);
		padding: 5px;
		text-align: center;
	}

	.option {
		align-items: center;
		display: flex;
	}

	.mr-8 {
		margin-right: 8px;
	}

	.text-gray {
		color: color(base);
	}

	.user-avatar {
		height: 100%;
		object-fit: cover;
		width: 100%;
	}

	.menu-list-banner {
		// flex: 0 0 20%;
		flex: 0 0 30%;
		text-align: end;

		img {
			height: 100%;
			object-fit: cover;
			// width: 202px;
			max-width: 100%;
		}
		
		@media (max-width: 764px) {
			display: none;
		}
	}

	.category-description {
		padding: 3rem;

		button {
			border-style: solid;
			border-width: 1px;
			font-family: font(bold);
			padding: 0.75rem;
		}
	}
</style>
