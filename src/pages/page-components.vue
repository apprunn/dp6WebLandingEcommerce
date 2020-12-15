<template>
	<div class="page-components">
		<div class="title">Componentes</div>
		<v-layout wrap mb-5>
			<v-flex xs12>
				Inputs
			</v-flex>
			<v-flex xs12>
				<app-input
					border-color="#f5f3f3"
					placeholder="E-mail"
				></app-input>
			</v-flex>
		</v-layout>
		<v-layout wrap mb-5>
			<v-flex xs12>
				Botones
			</v-flex>
			<v-flex xs12>
				<app-button
					action="Iniciar Sesión"
					background="yellow"
					img="/static/img/icons/icon-facebook.svg"
					img-border-color="#324988"
					img-height="25"
				></app-button>
			</v-flex>
		</v-layout>
		<v-layout wrap mb-5>
			<v-flex xs12>
				Boton categoría
			</v-flex>
			<v-flex xs12>
				<call-menu :color="baseColor" text="Categorías"/>
			</v-flex>
		</v-layout>
		<v-layout wrap>
			<v-flex xs12>
				Modal login
			</v-flex>
			<v-flex xs12>
				<modal-login />
			</v-flex>
		</v-layout>
		<v-layout wrap>
			<v-flex xs12>
				input search
			</v-flex>
			<v-flex xs12>
				<app-search image="/static/img/search.svg"/>
			</v-flex>
		</v-layout>		
		<v-layout wrap mb-5>
			<v-flex xs12>
				Botones Header
			</v-flex>
			<v-flex xs12>
				<button-image 
					:data="imagesButton[0]"
					/>
				<button-image
				:data="imagesButton[1]"
				:number="1"
				if-number/>
			</v-flex>
		</v-layout>
		<v-layout wrap>
			<v-flex xs12>
				Datos de Compañias
			</v-flex>
				<container-company-data></container-company-data>
		</v-layout>
		<v-layout mt-3>
			<app-footer></app-footer>
		</v-layout>
		<v-layout wrap>
			<v-flex xs12>
				item menu categoria
			</v-flex>
			<v-flex xs12>
				<item-menu 
				:data="dataCategory" 
				color-select="#ed0000"/>
			</v-flex>
		</v-layout>
		<v-layout xs12 mt-3>
			<menu-category></menu-category>
		</v-layout>
	</div>
</template>

<script>
	import appButton from '@/components/shared/buttons/app-button';
	import appInput from '@/components/shared/inputs/app-input';
	import callMenu from '@/components/header/call-menu';
	import containerCompanyData from '@/components/shared/company/container-company-data';
	import modalLogin from '@/components/header/modal-login';
	import appSearch from '@/components/shared/inputs/app-input-search';
	import buttonImage from '@/components/shared/buttons/app-button-image';
	import mediaCompanyData from '@/components/shared/company/media-company-data';
	import appFooter from '@/components/footer/app-footer';
	import itemMenu from '@/components/header/item-menu';
	import menuCategory from '@/components/shared/category/menu-category';

	function data() {
		return {
			baseColor: process.env.COLOR_PRIMARY,
			imagesButton: [
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
			nameCategory: 'Mallas',
			dataCategory: {
				urlImage: '/static/img/category-malla.svg',
				name: 'Malla',
				select: false,
			},
		};
	}
	export default {
		name: 'components',
		data,
		components: {
			appFooter,
			appButton,
			appInput,
			containerCompanyData,
			callMenu,
			modalLogin,
			appSearch,
			buttonImage,
			menuCategory,
			mediaCompanyData,
			itemMenu,
		},
	};
</script>

<style lang="scss" scoped>
	.page-components {
		background-color: color(background);
		color: color(black);
		height: 100vh;
		padding: 45px;
	}

	.title {
		margin-bottom: 20px;
	}
	
	.product-section {
		align-items: center;
		display: grid;
		flex-wrap: wrap;
		grid-gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(214px, 1fr));
		margin: auto;
		max-width: 1070px;
	}
</style>