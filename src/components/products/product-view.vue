<template>
  <div class="product-view">
		<div class="btns-product-view" v-if="localImages.length > 0">
			<button 
				v-for="(image, index) in localImages" 
				:key="image.id"
				class="btn-product-view"
				:class="{'select' : image.select, 'not-select' : !image.select}"
				:style="{'border-color': image.select ? globalColors.secondary : null}"
				@click="goToSlider(index, image)"
			>
				<img 
					:src="image.urlImage" 
					:alt="image.name" 
					class="image-slider">
			</button>
		</div>
		<div class="slider-product-view" v-if="images && images.length">
			<swiper ref="mySwiper" :options="swiperOption">
				<swiper-slide 
					v-for="image in localImages" 
					:key="image.id">
					<div class="wrapper-image">
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
		<div v-else class="slider-product-view-one">
			<img :src="data.urlImage" :alt="data.name" class="image-product-slider">
		</div>
	</div>
</template>
<script>
import { isEmpty } from '@/shared/lib';

function swiper() {
	return this.$refs.mySwiper.swiper;
}

function goToSlider(index, image) {
	this.swiper.slideTo(index + 1, 1000, false);
	this.localImages = this.localImages.map((i) => {
		const newImage = { ...i };
		newImage.select = i.id === image.id;
		return newImage;
	});
}

function imagesHandler(newImages) {
	if (!isEmpty(newImages)) {
		this.localImages = [...newImages];
		this.$set(this.localImages[0], 'select', true);
	}
}


function data() {
	return {
		localImages: [],
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
		},
	};
}
export default {
	name: 'product-view',
	computed: {
		swiper,
	},
	data,
	methods: {
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
		display: flex;
		flex-direction: column;
		margin-right: 20px;
		width: 94px;

		@media screen and (max-width: 996px) {
			display: none;
		}
	}

	.product-view {
		display: flex;
		justify-content: center;
	}

	.slider-product-view {
		background: color(white);
		border-radius: 7px;
		box-shadow: 0 2px 4px 0 rgba(213, 213, 213, 0.5);
		padding: 0 19px;
		width: 400px;

		@media screen and (max-width: 996px) {
			background: transparent;
			box-shadow: none;
			height: 217px;
			padding: 0;
			width: 298px;
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

	.slider-product-view-one {
		align-items: center;
		background: color(white);
		border-radius: 7px;
		box-shadow: 0 2px 4px 0 rgba(213, 213, 213, 0.5);
		display: flex;
		height: 487px;
		justify-content: center;
		padding: 0 19px;
		width: 80%;

		@media screen and (max-width: 764px) {
			height: 217px;
			width: 70%;
		}
	}

	.image-slider {
		height: 70%;
	}
</style>


