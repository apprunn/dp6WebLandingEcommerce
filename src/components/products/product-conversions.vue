<template>
	<div v-if="conversionsComputed.length > 0" class="conversions-container">
		<h3
			:class="[indeterminate ? 'loading' : 'conversions-title']"
			:style="`color:${globalColors.title}`"
		>
			Presentaciones:
		</h3>
		<v-flex xs12>
			<div :class="{ 'loading conversions-select-container': indeterminate }">
				<div v-if="!indeterminate">
					<v-btn
						v-for="(item, index) in conversionsComputed"
						class="btn-conversions pa-2"
						:style="
							`border:1px solid ${globalColors.primary};color: ${
								item.isSelected ? 'white' : globalColors.primary
							};background-color: ${
								item.isSelected ? globalColors.primary : 'white'
							}`
						"
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

function conversionsChanges() {
	let conversionsFormatted = [];
	if (this.conversions) {
		conversionsFormatted = map(
			k => setNewProperty('id', Number(k))(this.conversions[k]),
			Object.keys(this.conversions),
		);
	}
	const defaultUnitInConversions = conversionsFormatted.find(
		c => c.id === (this.defaultUnit && this.defaultUnit.id),
	);
	if (this.defaultUnit && !defaultUnitInConversions) {
		this.baseUnit = this.defaultUnit;
	}
	let list = [];
	if (this.baseUnit) {
		list.push(this.baseUnit);
	}
	conversionsFormatted.forEach(c => {
		if (!this.baseUnit || c.id !== this.baseUnit.id) {
			list.push(c);
		}
	});
	list = list.map(p => {
		const newP = { ...p };
		newP.isSelected = this.defaultUnit && p.id === this.defaultUnit.id;
		return newP;
	});
	const ecommerce = JSON.parse(
		localStorage.getItem('ecommerce::ecommerce-data'),
	);
	const flagShowBaseUnit = ecommerce && ecommerce.company && ecommerce.company.settings
		? ecommerce.company.settings.flagShowBaseUnit
		: null;
	if (flagShowBaseUnit === 1 && this.baseUnit) {
		list = list.filter(p => p.id !== this.baseUnit.id);
	} else if (flagShowBaseUnit === 2 && this.baseUnit) {
		list = list.filter(p => p.id === this.baseUnit.id);
	}
	this.conversionsComputed = list;
}

function selectedConversion(item) {
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
		baseUnit: null,
	};
}

export default {
	name: 'product-conversions',
	components: {
		AppSelect,
	},
	computed: {
		...mapGetters(['indeterminate']),
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
		defaultUnit: {
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
