<template>
	<div class="banner-carousel">
		<div
			:class="[
				indeterminate ? 'loading banner-height' : 'container-banner-carousel',
			]"
		>
			<swiper :options="swiperOption" v-if="!indeterminate">
				<swiper-slide 
					v-for="banner in banners" 
					:key="banner.id"
				>
					<div  class="img-carousel">
						<a 
							:href="banner.webLink"
							target="_blank"
							class="banner-link"
						>
							<div class="cover-all-container">
								<picture>
									<source :srcset="banner.webImage" media="(min-width: 600px)" class="cover-all-container">
									<img :src="banner.mobileImage" class="cover-all-container">
								</picture>
							</div>
						</a>
					</div>
				</swiper-slide>
				<div class="pagination-carousel swiper-pagination" slot="pagination"></div>
			</swiper>
			<div class="searcher-wrapper" v-if="showSearcher">
				<Searcher class="searcher" />
			</div>
		</div>
		<company-data class="banner-data"/>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import companyData from '@/components/shared/company/container-company-data';
import Searcher from '@/components/home/searcher';

function getBackground(value) {
	const web = value.webImage;
	const mobile = value.mobileImage;
	const img = window.innerWidth < 500 ? mobile : web;
	return `background-image: url(${img})`;
}

function showSearcher() {
	return process.env.BANNER_SEARCHER_SHOW === 'true';
}

function data() {
	return {
		swiperOption: {
			loop: true,
			autoplay: {
				delay: 5500,
				disableOnInteraction: false,
			},
			pagination: {
				el: '.pagination-carousel',
				clickable: true,
			},
		},
	};
}
export default {
	name: 'banner-carousel',
	data,
	components: {
		companyData,
		Searcher,
	},
	computed: {
		...mapGetters([
			'getCommerceData',
			'indeterminate',
		]),
		showSearcher,
	},
	methods: {
		getBackground,
	},
	props: {
		banners: {
			type: Array,
			default: () => [],
		},
	},
};
</script>
<style lang="scss" scoped>
	.img-carousel {
		height: 48vh;
    	width: 100%;
		
		@media (min-width: 600px) {
			height: 44vh;
		}

		@media (min-width: 700px) {
			height: 50vh;
		}

		@media (min-width: 768px) {
			height: 54vh;
		}

		@media (min-width: 900px) {
			height: 64vh;
		}

		@media (min-width: 1280px) {
			height: 68vh;
		}

		picture {
			height: 100%;
			// object-fit: cover;
			width: 100%;
		}
	}

	.banner-carousel {
		position: relative;
	}

	.banner-data {
		bottom: -43px;
		left: 50%;
		position: absolute;
		transform: translateX(-50%);
		z-index: 1;

		@media (max-width: 860px) {
			bottom: -26px;
		}
	}
	
	.banner-link {
		display: block;
		height: 100%;
	}

	.container-banner-carousel {
		position: relative;
	}

	.searcher-wrapper {
		align-items: flex-end;
		display: flex;
		height: 84%;
		justify-content: flex-start;
		padding-left: 60px;
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 2;

		@media (max-width: 600px) {
			justify-content: center;
			padding-left: 0;
		}
	}

	.searcher {
		height: 414px;
		width: 353px;
	}

	.banner-height {
		height: 616px;
	}
	.cover-all-container {
		height: 100%;
		// object-fit: cover;
		width: 100%;
	}
</style>
