<template>
	<div class="app-category" :class="{ scrolling: scrolled }">
		<div class="app-category-user">
			<div class="container-user" :style="`border-color: ${globalColors.primary}`">
				<img :src="imageUser" :alt="imgUser.name" :height="imgUser.height">
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
					:class="{'select': list.select}">
					<div class="list-name-category">
						<item-menu 
						:data="list" 
						color-select="#ed0000"
						@click-item="clickCategory"/>
						<button class="btn-collapse" @click="clickCategory(list)">
							<simple-svg
								v-if="list.detail.length"
								:filepath="imageArrow.urlImage"
								:fill="globalColors.base"
								width="11"
								class="icon"
								:class="{'rotate-icon': list.select}"
							/>
						</button>
					</div>
					<div v-if="list.detail && list.select" class="menu-mobile">
						<div v-for="(listTwo, indexTwo) in list.detail" :key="indexTwo" class="content-list-subcategory">
							<div class="list-name-category list-subcategory">
								<span class="list-item-name bold" @click="goToCategories(list, listTwo)">{{listTwo.title}}</span>
								<button @click="clickSubCategory(listTwo,index)">
									<simple-svg
										v-if="listTwo.detail.length"
										:filepath="imageArrow.urlImage"
										:fill="colorBorder"
										width="11"
										class="icon"
										:class="{'rotate-icon': listTwo.select}"
									/>
								</button>
							</div>
							<div v-if="listTwo.detail && listTwo.select" class="content-sub-subcategory">
								<span 
									v-for="(listThree, indexThree) in listTwo.detail" 
									:key="indexThree"
									class="list-item-sub list-subcategory"
									@click="goToSubCategories(list, listTwo, listThree)">{{listThree.title}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="menu-list-item desktop" :class="isMoreTwo ? 'isMultiple' : 'isTwo'" v-if="selectCategory">
				<div 
					v-for="(item, index) in selectCategory.detail" 
					:key="index"
					class="list-item">
					<button 
						class="list-item-name bold"
						@click="goToCategories(selectCategory, item)">{{item.title}}</button>
					<div v-if="item.detail">
						<button 
							v-for="(itemList, indexItem) in item.detail" 
							:key="indexItem"
							@click="goToSubCategories(selectCategory, item, itemList)"
							class="list-item-sub">{{itemList.title}}</button>
					</div>
				</div>
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

const itemMenu = () => import('@/components/header/item-menu');

function created() {
	window.addEventListener('resize', this.oneSelectCategory);
	window.addEventListener('scroll', this.handleScroll);
	this.oneSelectCategory();
	this.handleScroll();
}

function clickCategory(item) {
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
}

function selectCategory() {
	const index = this.categories.findIndex(c => c.select);
	return this.categories[index];
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

function goToCategories(category, subCategory) {
	this.goTo('category', { params: { fisrt: category.id, second: subCategory.id } });
}

function goToSubCategories(category, subCategory, subSubCategory) {
	this.goTo('category', { params: { fisrt: category.id, second: subCategory.id, third: subSubCategory.id } });
}

function logout() {
	this.goTo('page-home');
	this.$store.dispatch('clearUser');
	this.$store.dispatch('DEFAULT_USER');
	this.$store.dispatch('SET_DEFAULT_VALUES');
	localStorage.clear();
	this.$store.dispatch('SET_CURRENCY_DEFAULT', this);
	const params = {
		filters: this.getFilters[0].id,
	};
	this.$store.dispatch('LOAD_PRODUCTS', { context: this, params });
}

function data() {
	return {
		colorBorder: process.env.COLOR_DARK,
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
	};
}

export default {
	name: 'app-category',
	data,
	components: {
		itemMenu,
	},
	computed: {
		selectCategory,
		isMoreTwo,
		...mapGetters([
			'getFilters',
			'token',
		]),
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
		goToSubCategories,
		logout,
	},
	props: {
		imgUser: {
			type: Object,
			default: () => {},
		},
		categories: {
			type: Array,
			default: () => [],
		},
	},
};
</script>
<style lang="scss" scoped>
	.app-category {
		background: color(white);
		border-top: solid 1px color(border);
		box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.07);
		max-height: 369.6px;
		min-height: 226px;
		position: absolute;
		top: 188px;
		z-index: 5;
		width: 100%;

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
		}

		&.scrolling {
			position: fixed;
			top: 99px;
		}
	}

	.menu-list-name-category {
		flex: 1 1 20%;
		overflow-y: scroll;
		max-height: 312.6px;

		@media (max-width: 764px) {
			max-height: none;
		}
	}

	.menu-app-category {
		display: flex;
		padding: 33px 10%;

		@media (max-width: 764px) {
			padding: 0px;
		}
	}

	.name-category {
		cursor: pointer;
		margin-bottom: 31px;
	}

	.menu-list-item {
		cursor: pointer;
		display: grid;
		flex: 1 1 80%;
		height: fit-content;

		.list-item {
			border-right: 1px solid color(dark);
			padding: 10px 10%;
		}

		&.isMultiple {
			grid-template-columns: 33% 33% 33%;

			.list-item {
				&:nth-child(3n) {
					border-right: none;
				}
			}
		}

		&.isTwo {
			grid-template-columns: 50% 50%;
			
			.list-item {
				&:nth-child(2n) {
					border-right: none;
				}
			}
		}
	}

	.desktop {
		display: grid;

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
		display: flex;
		justify-content: space-between;
	}

	.list-item-name {
		color: color(base);

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
</style>


