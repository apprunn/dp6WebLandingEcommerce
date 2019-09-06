<template>
	<div class="wrapper-big-category">
		<div class="wrapper-list-category">
			<list-category 
				v-for="category in categories"
				:data="category"
				:key="category.id"
        @change-category="changeCategory"
				@change-sub-category="changeSubCategory"
				@change-sub-sub-category="changeSubSubCategory"
				@open-category="openCategory"/>
			<filters-category></filters-category>
		</div>
		<button class="btn-menu-category">
			<img src="https://s3.amazonaws.com/apprunn-acl/COM-PRU-01/ARQ88/image/arrow-point-to-right-(1).svg" alt="" width="15px" height="15px">
		</button>
	</div>
</template>

<script>
const filtersCategory = () => import('@/components/shared/category/filters-category');
const listCategory = () => import('@/components/shared/category/list-category');

function filterCategory() {
	this.$emit('filter', this.categories);
}

function changeCategory(id) {
	this.$emit('change-category', id);
}

function changeSubCategory(id, idCategory) {
	this.$emit('change-sub-category', id, idCategory);
}

function changeSubSubCategory(id, idCategory, idSubCategory) {
	this.$emit('change-sub-sub-category', id, idCategory, idSubCategory);
}

function openCategory(id) {
	this.$emit('open-category', id);
}

function data() {
	return {
		close: true,
	};
}

export default {
	data,
	name: 'menu-category',
	components: {
		filtersCategory,
		listCategory,
	},
	methods: {
		changeCategory,
		changeSubCategory,
		changeSubSubCategory,
		filterCategory,
		openCategory,
	},
	props: {
		categories: {
			type: Array,
			default: () => [],
		},
		titleCategory: {
			type: String,
			default: '',
		},
	},
};
</script>

<style lang="scss" scoped>
.wrapper-big-category {
	border-right: 1px solid color(border);
	display: flex;
	position: relative;

	@media (max-width: 986px) {
		border-right: none;
	}
}

.btn-menu-category {
	width: 30px;

	@media (max-width: 986px) {
		display: none;
	}
}

.wrapper-list-category {
	border-right: 1px solid color(border);
	max-width: 300px;
	padding-right: 20px;

	@media (max-width: 986px) {
		border-right: none;
		max-width: none;
		padding-right: 0;
		width: 100%;
	}
}

</style>
