<template>
	<div v-if="conversionsComputed.length > 0"
		class="conversions-container"
	>
		<h3
			:class="[
				indeterminate ? 'loading' : 'conversions-title',
			]"
			:style="`color:${globalColors.title}`"
		>Presentaciones:</h3>
		<v-flex xs12>
			<div
				:class="{ 'loading conversions-select-container': indeterminate }"
			>
				<div v-if="!indeterminate">
					<v-btn
						v-for="(item, index) in conversionsComputed"
						class="btn-conversions pa-2"
						:style="`border:1px solid ${globalColors.primary};color: ${item.isSelected ? 'white' : globalColors.primary};background-color: ${item.isSelected ? globalColors.primary : 'white'}`"
						:key="index"
						type="button"
						v-model="conversionSelected"
						:value="defaultUnit"
						@click="selectedConversion(item)"
					>
						{{ item.name }}
					</v-btn>
				</div>
			</div>
		</v-flex>
	</div>
</template>
<script>
import AppSelect from '@/components/shared/inputs/app-select';
import { mapGetters } from 'vuex';
import { setNewProperty, map } from '@/shared/lib';

function conversionsChanges(conversions) {
	let conversionsFormatted = [];
	if (conversions) {
		conversionsFormatted = map(
			k => setNewProperty('id', Number(k))(conversions[k]),
			Object.keys(conversions),
		);
	}
	if (this.showUnit) {
		this.conversionsComputed = conversionsFormatted;
	} else {
		this.conversionsComputed = [].concat(this.defaultUnit, conversionsFormatted);
	}
	this.conversionsComputed = this.conversionsComputed.map((p, index) => {
		const newP = { ...p };
		newP.isSelected = index === 0;
		return newP;
	});
	if (this.$flagShowBaseUnit === 1) {
		this.conversionsComputed = this.conversionsComputed.filter(p => p.name !== 'UNIDAD');
	} else if (this.$flagShowBaseUnit === 2) {
		this.conversionsComputed = this.conversionsComputed.filter(p => p.name === 'UNIDAD');
	}
}

function selectedConversion(item)	{
	this.conversionsComputed = this.conversionsComputed.map((o) => {
		const newData = { ...o };
		newData.isSelected = item.id === o.id;
		return newData;
	});
	this.$emit('unit-selection', item);
}

function data() {
	return {
		conversionSelected: null,
		conversionsComputed: [],
	};
}

export default {
	name: 'product-conversions',
	components: {
		AppSelect,
	},
	computed: {
		...mapGetters([
			'indeterminate',
		]),
	},
	data,
	methods: {
		conversionsChanges,
		selectedConversion,
	},
	props: {
		conversions: {
			default: () => {},
			type: Object,
		},
		defaultUnit: {
			default: () => {},
			type: Object,
		},
		stockProduct: [Number],
		showUnit: {
			type: Boolean,
			default: true,
		},
	},
	watch: {
		conversions: {
			deep: true,
			handler: conversionsChanges,
		},
	},
};
</script>
<style lang="scss" scoped>
	.conversions-container {
		align-items: center;
		border-bottom: 1px solid color(border);
		border-top: 1px solid color(border);
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		margin-top: 10px;
		padding: 20px 0;

		@media (max-width: 960px) {
			display: none;
		}
	}

	.conversions-title {
		margin: 0 10px;
	}

	.conversions-select-container {
		height: 24px;
		margin-left: 10px;
		width: 100%;
	}

	.btn-conversions {
		border-radius: 7px;
		font-family: font(bold);

		&.active {
			background-color: red;
			color: white;
		}
	}
</style>
