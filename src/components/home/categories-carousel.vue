<template>
	<div class="categories-carousel">
		<div>
			<title-section
				title="Categorías" 
				:color="colorBorder"
			/>
		</div>
		<div
			data-cy="categories-home"
			:class="[
				indeterminate ? 'loading loading-categories' : 'categories-carousel-slider',
			]"
		>
			<swiper v-if="!indeterminate" :options="swiperOption">
        		<swiper-slide v-for="(category, index) in categories" :key="category.id">
					<div 
						class="container-big-category" 
					>
						<div 
							class="container-category-image"
							:style="category.hover ? `border-color: ${colorBase}` : null"
							@click="goToCategory(category)"
							@mouseover="hoverCategory(index)"
							@mouseleave="leaveCategory(index)"
						>
							<div 
								:style="`background-image: url(${category.urlImage})`"
								:class="[
									'category-image',
									{ 'category-opacity': !applyBgOpacity && !category.urlImage},
								]"
							>
								<img
									v-if="!applyBgOpacity && !category.urlImage"
									:src="category.webImage" 
									:alt="category.name"
									class="image">	
							</div>
						</div>
						<div 
							class="category-title"
							:style="category.hover ? `color: ${colorBase}` : null"
							@click="goToCategory(category)"
							@mouseover="hoverCategory(index)"
							@mouseleave="leaveCategory(index)"
						>{{category.title}}</div>
						</div>
					</swiper-slide>
					<div class="swiper-button-prev" slot="button-prev">
						<ArrowLeft
							:color="globalColors.primary"
							class="arrow"
						/>
					</div>
					<div class="swiper-button-next" slot="button-next">
						<ArrowRight
							:color="globalColors.primary"
							class="arrow"
						/>
					</div>
			</swiper>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import titleSection from '@/components/home/title-section';
import ArrowLeft from '@/components/svg/ArrowLeft';
import ArrowRight from '@/components/svg/ArrowRight';

function hoverCategory(index) {
	this.categories[index].hover = true;
}

function leaveCategory(index) {
	this.categories[index].hover = false;
}

function goToCategory({ slug, id }) {
	this.goTo('category', { params: { slug: slug || id, id } });
}

function applyBgOpacity() {
	const opacity = process.env.NO_ICON_CATEGORY;
	return opacity && opacity === 'true';
}

function data() {
	return {
		swiperOption: {
			slidesPerView: this.len,
			spaceBetween: 0,
			slidesPerGroup: 1,
			allowTouchMove: false,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			breakpoints: {
				1280: {
					slidesPerView: this.len >= 4 ? 4 : this.len,
					slidesPerGroup: 1,
					allowTouchMove: true,
				},
				930: {
					slidesPerView: this.len >= 2 ? 2 : this.len,
					slidesPerGroup: 1,
					allowTouchMove: true,
				},
				600: {
					slidesPerView: 1,
					slidesPerGroup: 1,
					allowTouchMove: true,
				},
			},
		},
		colorBorder: process.env.COLOR_TITLE,
	};
}
export default {
	name: 'categories-carousel',
	data,
	components: {
		ArrowLeft,
		ArrowRight,
		titleSection,
	},
	computed: {
		...mapGetters([
			'indeterminate',
		]),
		applyBgOpacity,
	},
	methods: {
		hoverCategory,
		goToCategory,
		leaveCategory,
	},
	props: {
		categories: {
			type: Array,
			default: () => [],
		},
		colorBase: String,
		len: {
			type: Number,
			required: true,
		},
	},
};
</script>
<style lang="scss" scoped>
	.categories-carousel {
		background: color(white);
		padding: 80px 10% 60px;

		@media (max-width: 860px) {
			padding: 35px 10%;
		}
	}

	.category-opacity::before {
		background-image: linear-gradient(to bottom, rgba(60, 60, 60, 0.89), rgba(60, 60, 60, 0.50));
		border-radius: 9px;
		bottom: 0;
		content: '';
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
	}

	.category-image {
		align-items: center;
		background-size: cover;
		background-image: linear-gradient(to bottom, rgba(60, 60, 60, 0.89), rgba(60, 60, 60, 0.50));
		border-radius: 9px;
		display: flex;
		height: 100%;
		justify-content: center;
		position: relative;
		width: 100%;

		.image {
			filter: brightness(0) invert(1);
			height: 80px;
			position: absolute;
			width: 80px;
		}

		@media (max-width: 860px) {
			height: 111px;
			width: 140px;
		}
	}

	.container-category-image {
		align-items: center;
		border: 4px solid color(base);
		border-radius: 16px;
		cursor: pointer;
		display: flex;
		height: 115px;
		justify-content: center;
		margin: auto;
		padding: 0.7rem;
		transition: all .3s;
		width: 140px;

		@media (max-width: 860px) {
			height: 122px;
			width: 150px;
		}
	}

	.container-big-category {
		cursor: pointer;
		margin: auto;
		padding: 6px;

		&:hover {
			.container-category-image {
				transform: scale(1.05);
			}
		}
	}

	.categories-carousel-slider {
		margin-top: 25px;
	}

	.category-title {
		color: color(base);
		font-family: font(bold);
		font-size: size(large);
		margin-top: 16px;
		overflow: hidden;
		text-align: center;
		text-overflow: ellipsis;
	}

	.loading-categories {
		height: 190px;
		margin-top: 25px;
	}

	.arrow {
		height: 100%;
		width: 100%;
	}
</style>


