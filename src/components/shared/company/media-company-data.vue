<template>
	<div class="container-media-company"
	:style="`border-right: ${borderRight ? `1px solid ${borderRight}` : null}; font-family: ${family ? `font(${family})` : null }`">
		<img :src="image" :height="imageHeight" alt="" class="image-company">
		<a href="#" v-if="categories">
			<p class="text-company-data">
				{{ description }}
			</p>
		</a>
		<p class="text-company-data" v-else>
			{{ description }}
		</p>
	</div>
</template>

<script>
export default {
	name: 'media-company-data',
	props: {
		image: String,
		imageHeight: [String, Number],
		description: [String, Number],
		borderCompany: String,
		borderRight: String,
		family: String,
		categories: Boolean,
	},
};
</script>

<style lang="scss" scoped>
.container-media-company {
	align-items: center;
	display: flex;
	flex: 1 1 33.3%;
	justify-content: center;
	padding: 0 30px;

	@media (max-width: 860px) {
		padding: 0 9px;
	}
}

.text-company-data {
	color: color(white);
	margin: 0 0 0 9px;
	max-width: 290px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

	@media (max-width: 860px) {
		font-size: 8px;
		margin-left: 6px;
		max-width: 80px;
    	overflow: auto;
    	text-overflow: initial;
	}
}

.image-company {
	@media (max-width: 860px) {
		height: 19px;
	}
}
</style>
