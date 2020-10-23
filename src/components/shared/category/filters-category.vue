<template>
	<div class="filters-category">
		<div
			class="section-filter-row"
			:style="`border-color:${globalColors.primary}`"
		>
			<div class="content-filter-title">
				<button-image
				:data="iconFilter"
				></button-image>
				<p
					class="title-section"
					:style="`color: ${globalColors.primary}`"
				>Filtros</p>
			</div>
			<div class="simple-svg-container">
				<simple-svg
					filepath="/static/img/arrow-left.svg"
					:fill="globalColors.primary"
					width="11"
					class="icon"
					:class="{'rotate-icon': false }"
				/>
			</div>
		</div>
		<div class="content-filter mt-4" v-if="contentFilters">
			<!-- <p class="text-price">Precio</p> -->
			<!-- <v-layout row>
				<v-flex shrink class="input-number-price-min">
				<v-text-field
					class="mt-0"
					hide-details
					single-line
					type="number"
				></v-text-field>
				</v-flex>
				<v-flex class="pl-3">
				<v-range-slider
					:step="1">
							</v-range-slider>
				</v-flex>
				<v-flex shrink class="input-number-price-max">
							<v-text-field
								class="mt-0 number"
								hide-details
								single-line
								type="number"
							></v-text-field>
				</v-flex>
			</v-layout>
		  	<div class="content-number">
				<p class="number-filter">{{getCurrencySymbol}} {{filters.priceMin}}</p>
				<p class="number-filter">{{getCurrencySymbol}} {{filters.priceMax}}</p>
			</div> -->
			<!-- <app-input
			class="field"
			type="text"
			v-model="filters.price" /> -->
			<v-layout mt-2 mb-2 v-for="(attr, indexAttr) in attributes" :key="indexAttr">
				<app-select 
					returnObject
					item-text="name"
					class="input-filter"
					:placeholder="attr.name"
					:items="attr.attributeDetail"
					v-model="filters[attr.name]"
					@input="setAttributes($event, attr)"
				/>
			</v-layout>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import appInput from '@/components/shared/inputs/app-input';
import appSelect from '@/components/shared/inputs/app-select';
import buttonImage from '@/components/shared/buttons/app-button-image';


function closeCategory() {
	this.closeFilters = true;
	this.contentFilters = true;
	this.openUp = false;
}

function openFilters() {
	this.closeFilters = false;
	this.contentFilters = false;
	this.openUp = true;
}

function setAttributes(detail, attr) {
	const { code } = detail;
	const { name: attrName } = attr;
	this.filters[attrName] = code;
	this.$emit('attributes', this.filters);
}

function resetAttributes(newValue) {
	if (newValue) {
		const keys = Object.keys(this.filters);
		keys.forEach((k) => {
			this.filters[k] = '';
		});
	}
}

function data() {
	return {
		filters: {},
		arrowUp: {
			image: 'https://s3.amazonaws.com/apprunn-acl/COM-PRU-01/ARQ88/image/arrow-down-sign-to-navigate.svg',
			name: 'up',
			height: 15,
		},
		arrowDown: {
			image: 'https://s3.amazonaws.com/apprunn-acl/COM-PRU-01/ARQ88/image/up-arrow.svg',
			name: 'down',
			height: 15,
		},
		iconFilter: {
			image: '/static/img/icons/filter-category-red.svg',
			name: 'icon-filter',
			height: 21,
		},
		closeFilters: true,
		contentFilters: true,
		openUp: false,
	};
}

export default {
	name: 'filters-category',
	computed: {
		...mapGetters([
			'getCurrencySymbol',
			'token',
		]),
	},
	components: {
		appInput,
		appSelect,
		buttonImage,
	},
	data,
	methods: {
		closeCategory,
		openFilters,
		setAttributes,
	},
	props: {
		attributes: {
			type: Array,
			required: true,
		},
		resetAttributes: {
			type: Boolean,
			required: true,
		},
	},
	watch: {
		resetAttributes,
	},
};
</script>

<style lang="scss" scoped>
.filters-category {
	border-top: 1px solid color(border);
	padding-top: 40px;
}

.title-section {
	font-family: font(bold);
	font-size: size(xlarge);
	margin: 0 0 0 11px;
}

.text-price {
	color: color(base);
	font-family: font(regular);
	font-size: size(medium);
	margin: 19px 0 0 0;
}

.section-filter-row {
	align-items: center;
	border-bottom: 3px solid;
	display: flex;
	justify-content: space-between;
	padding: 0 20px 15px 20px;
	width: 100%;
}

.input-price {
	background-color: color(white);
	border: solid 1px color(border);
	border-radius: 4px;
	color: color(base);
	font-family: font(regular);
	font-size: 12px;
	height: 24px;
	margin-top: 9px;
	padding-left: 10px;
	width: 92px;
}

.input-filter {
	width: 100%;
}

.number {
	position: relative;
	right: 20px;
}

.number-filter {
	color: color(base);
	font-family: font(regular);
	font-size: size(small);
}

.content-number {
	display: flex;
	justify-content: space-between;
	width: 78%;
}

.input-number-price-min {
	width: 75px;
}

.input-number-price-max {
	width: 20px;
}

.content-filter {
	padding: 0 30px;
}

.icon-filter {
	height: 21px;
}

.content-filter-title {
	display: flex;
}

.icon {
	transform: rotateZ(270deg);

	&.rotate-icon {
		transform: rotateZ(450deg);
	}
}
.simple-svg-container {
	width: 1rem;
}
</style>
