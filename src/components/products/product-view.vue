<template>
  <div class="product-view">
	  	<ProductConversionsHeader
			:show-unit="showUnity"
			:default-unit="data.unit"
			:conversions="data.conversions"
			:stock-product="data.stock"
			@unit-selection="unitSelection"
		/>
		<div class="btns-product-view" v-if="webLocalImages.length > 0">
			<button 
				v-for="(image, index) in webLocalImages" 
				:key="image.id"
				class="btn-product-view"
				:class="{'select' : image.select, 'not-select' : !image.select}"
				:style="{'border-color': image.select ? globalColors.secondary : null}"
				@click="goToSlider(index, image)"
			>
				<picture>
					<img 
						:src="image.urlImage" 
						:alt="image.name" 
						class="image-slider"
					>
				</picture>
			</button>
		</div>
		<div class="slider-product-view-web" v-if="webLocalImages && webLocalImages.length">
			<swiper ref="mySwiper" :options="swiperOption">
				<swiper-slide 
					v-for="image in webLocalImages" 
					:key="image.id">
					<div
						:class="['wrapper-image', { 'sold-out': noStock }]"
						data-cy="presentation-img"
					>
						<img 
							:src="image.urlImage" 
							:alt="image.name"
							class="image-product-slider"
						>
					</div>
				</swiper-slide>
			</swiper>
		</div>
		<div
			v-else
			:class="['slider-product-view-one', { 'sold-out': noStock }]"
		>
			<img
				:src="data.urlImage"
				:alt="data.name"
				class="image-product-slider"
			>
		</div>
		<div class="slider-product-view-movil" v-if="movilLocalImages && movilLocalImages.length">
			<swiper ref="mySwiper" :options="swiperOption">
				<swiper-slide 
					v-for="image in movilLocalImages" 
					:key="image.id">
					<div
						:class="['wrapper-image', { 'sold-out': noStock }]"
						data-cy="presentation-img"
					>
						<img 
							:src="image.urlImage" 
							:alt="image.name"
							class="image-product-slider"
						>
					</div>
				</swiper-slide>
				<div class="pagination-carousel swiper-pagination" slot="pagination"></div>
			</swiper>
		</div>
		<div
			v-else
			:class="['slider-product-view-one-movil', { 'sold-out': noStock }]"
		>
			<img
				:src="data.urlImage"
				:alt="data.name"
				class="image-product-slider">
		</div>
		<!-- <button class="btn-unit"
		v-for="(item, index) in conversionsComputed"
		:key="index"
		type="button"
		:style="`border:1px solid ${globalColors.primary};color: ${item.isSelected ? 'white' : globalColors.primary};background-color: ${item.isSelected ? globalColors.primary : 'white'}`"
		>
			{{ item.name }}
		</button> -->
	</div>
</template>
<script>
import { getDeeper, isEmpty, map, setNewProperty } from '@/shared/lib';
import TypeProduct from '@/shared/enums/typeProduct';
import ProductConversionsHeader from '@/components/products/product-conversion-header';
import helper from '@/shared/helper';

function swiper() {
	return this.$refs.mySwiper.swiper;
}

function goToSlider(index, image) {
	this.swiper.slideTo(index + 1, 1000, false);
	this.webLocalImages = map(
		setNewProperty('select', img => img.id === image.id),
		this.webLocalImages,
	);
}

function imagesHandler(newImages) {
	if (!isEmpty(newImages)) {
		this.movilLocalImages = [];
		this.webLocalImages = [];

		newImages.forEach((img) => {
			if (img.fromApp === 0) {
				this.webLocalImages.push(img);
			} else if (img.fromApp === 1) {
				this.movilLocalImages.push(img);
			} else {
				this.webLocalImages.push(img);
				this.movilLocalImages.push(img);
			}
		});
		this.$set(this.webLocalImages[0], 'select', true);
	}
}

function noStock() {
	return helper.noStock(this.data);
}

function isVariation() {
	const variationCode = getDeeper('typeInfo.code')(this.data);
	return variationCode === TypeProduct.variation;
}

function isComposed() {
	const composeCode = getDeeper('typeInfo.code')(this.data);
	return composeCode === TypeProduct.compose;
}

function isService() {
	const serviceCode = getDeeper('typeInfo.code')(this.data);
	return serviceCode === TypeProduct.service;
}

function unitSelection(item) {
	this.$emit('unit-selection', item);
}

function data() {
	return {
		localImages: [],
		movilLocalImages: [],
		swiperOption: {
			allowTouchMove: false,
			breakpoints: {
				996: {
					allowTouchMove: true,
					centeredSlides: true,
					grabCursor: true,
					spaceBetween: 30,
					width: 298,
				},
			},
			loop: true,
			width: 362,
			pagination: {
				el: '.swiper-pagination',
			},
		},
		webLocalImages: [],
	};
}
export default {
	name: 'product-view',
	components: {
		ProductConversionsHeader,
	},
	computed: {
		isComposed,
		isService,
		isVariation,
		noStock,
		swiper,
	},
	data,
	methods: {
		unitSelection,
		goToSlider,
		imagesHandler,
	},
	props: {
		data: {
			default: () => {},
			type: Object,
		},
		images: {
			default: () => [],
			type: Array,
		},
		showUnity: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		images: {
			deep: true,
			handler: imagesHandler,
		},
	},
};
</script>
<style lang="scss" scoped>
	.btn-product-view {
		background: color(white);
		border: 2px solid color(border);
		border-radius: 7px;
		height: 74px;
		margin-bottom: 14px;
		max-width: 94px;
		transition: all .3s;

		&.not-select {
			opacity: 0.3;
		}
	}

	.btns-product-view {
		display: none;
		flex-direction: column;
		margin-right: 20px;
		width: 94px;

		@media screen and (min-width: 768px) {
			display: flex;
			height: fit-content;
			position: sticky;
			top: 135px;
		}
	}

	.product-view {
		display: flex;
		justify-content: center;

		@media screen and (max-width: 996px) {
			border: 1px solid #f1eaea;
			border-radius: 9px;
			padding: 9px;
		}
	}

	.slider-product-view-web {
		display: none;

		@media screen and (min-width: 996px) {
			background: color(white);
			border-radius: 7px;
			box-shadow: 0 2px 4px 0 rgba(213, 213, 213, 0.5);
			display: flex;
			height: fit-content;
			padding: 0 19px;
			position: sticky;
			top: 135px;
			width: 400px;
		}
	}

	.slider-product-view-movil {
		background: transparent;
		box-shadow: none;
		display: flex;
		height: 217px;
		padding: 0;
		width: 298px;

		@media screen and (min-width: 996px) {
			display: none;
		}
	}

	.slider-product-view-one-movil {
		width: 70%;

		@media screen and (min-width: 996px) {
			display: none;
		}
	}

	.wrapper-image {
		align-items: center;
		display: flex;
		height: 487px;
		justify-content: center;
		width: 100%;

		@media screen and (max-width: 996px) {
			height: 217px;
		}
	}

	.image-product-slider {
		width: 100%;

		@media screen and (max-width: 996px) {
			object-fit: contain;
			max-height: 217px;
		}
	}

	.slider-product-view-one-web {
		display: none;

		@media screen and (min-width: 996px) {
			align-items: center;
			background: color(white);
			border-radius: 7px;
			box-shadow: 0 2px 4px 0 rgba(213, 213, 213, 0.5);
			display: flex;
			height: 487px;
			justify-content: center;
			padding: 0 19px;
			width: 80%;
		}
	}

	.image-slider {
		height: 70%;
	}

	.slider-product-view-one {
		display: none;

		@media screen and (min-width: 996px) {
			display: block;
		}
	}

	.sold-out {
		overflow: hidden;
		position: relative;		

		&::after {
			align-items: center;
			background-color: rgba(0,0,0,0.6);
			color: white;
			content: 'Agotado';
			display: flex;
			font-size: 20px;
			font-family: font(bold);
			height: 60px;
			justify-content: center;
			position: absolute;
			right: 34%;
			top: 5%;
			transform: rotate(-45deg);
			width: 100%;
			z-index: 99;

			@media screen and (min-width: 996px) {
				font-size: 30px;
			}
		}
	}

	.btn-unit {
		border: 1px solid #dedede;
		border-radius: 16px;
		color: #dedede;
		font-size: 10px;
		height: 25px;
		width: 53px;
	}
</style>
