<template>
	<button 
		class="box-filter"
		:style="`border-right: ${borderRight ? `1px solid ${borderRight}` : null}`"
		@click="$emit('click', filter)"
	>
			<div v-if="filter.urlImage">
				<img :src="filter.urlImage" :alt="filter.title">
			</div>
			<div class="filter-title">
				<p class="title-filter">{{filter.title}}</p>
				<div class="content-select" v-if="filter.select">
					<div class="line"></div>
					<div class="circle"></div>
				</div>
			</div>
	</button>
</template>

<script>
export default {
	name: 'filter-product',
	props: {
		borderRight: String,
		filter: {
			default: () => {},
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.title-filter {
	color: color(white);
	font-family: font(demi);
	font-size: size(medium);
	margin-bottom: 0;
	padding-left: 7px;
	width: 80px;
	&:hover {
		border-radius: 3px;
		font-family: font(bold);
	}
}

.box-filter {
	align-items: center;
	display: flex;
	justify-content: center;
	width: auto;
}

.border-bottom-product {
	background-color: color(white);
	border-radius: 3px;
	height: 4px;
	width: 71px;
}

.content-border {
	display: flex;
	margin-left: 7px;
	position: relative;
}

.content-border:nth-child(4) {
	left: 50px;
	position: relative;
}

.filter-title {
	align-items: flex-start;
	display: flex;
	flex-direction: column;
}

.box-filter {
	img {
		height: 23px;
		width: 23px;
	}
}

.content-select {
	display: flex;
	margin-left: 7px;
	width: 100%;

	.line {
		background: color(white);
		border-radius: 4px;
		height: 4px;
		margin-right: 5px;
		width: 90%;
	}

	.circle {
		background: color(white);
		border-radius: 50%;
		height: 4px;
		width: 4px;
	}
}
</style>
