<template>
  <div 
	data-cy="features-container"
  	:class="[
  		'my-4',
		{ 'border-bottom': features.length > 0 }
	]"
	>
	  <div
	  	v-for="(feature, index) in features"
		:key="index"
		:class="[
			isLoading ? 'loading features' : 'product-childrens',
		]">
	  	<h3
		  	v-if="feature.values && feature.values.length > 0"
		  	:class="[ 'mx-2', { 'loading': isLoading } ]"
			:style="`color:${globalColors.title}`"
		>{{feature.name}}:</h3>
		<div class="wrap-buttons" v-if="feature.values && feature.values.length > 0">
			<span
				class="ml-2"
				v-for="v in feature.values"
				:key="v.value"
			>
				<AppFeatureButton
					class="feature-button"
					v-show="!isLoading"
					:feature="v"
					:is-selected="v.isSelected"
					:not-allowed="v.notAllowed"
					@click="selectFeature(v)"
				/>
				</span>
			</div>
	  </div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import AppFeatureButton from '@/components/shared/buttons/app-feature-button';

function selectFeature(value) {
	this.$emit('selected', value);
}
export default {
	name: 'product-childrens',
	components: {
		AppFeatureButton,
	},
	computed: {
		...mapGetters('loading', [
			'isLoading',
		]),
	},
	methods: {
		selectFeature,
	},
	props: {
		features: {
			type: Array,
			default: () => [],
		},
	},
};
</script>
<style lang="scss" scoped>
	.product-childrens {
		align-items: center;
		display: grid;
		grid-template-columns: [linename] auto;
		margin-bottom: 10px;

		@media (max-width: 996px) {
			padding-left: 10px;
		}
	}

	.select-feature {
		margin-bottom: 22px;
		width: 45%;
	}

	.wrap-buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;

		@media (max-width: 996px) {
			overflow: auto;
			padding: 10px 0;
		}
	}

	.feature-button {
		min-width: 80px;
	}

	.features {
		margin-bottom: 10px;
	}

	.border-bottom {
		border-bottom: 1px solid color(border);
		padding-bottom: 29px;
	}
</style>