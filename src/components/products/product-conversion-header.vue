<template>
	<!-- v-if="conversionsComputed.length > 0" -->
	<div
		class="conversions-container"
	>
		<v-flex xs12>
			<div
				:class="{ 'loading conversions-select-container': indeterminate }"
			>
				<div v-if="!indeterminate" class="column">
					<v-btn
						v-for="(item, index) in conversionsComputed"
						class="btn-conversions pa-1"
						:style="`border:1px solid ${item.isSelected ? globalColors.primary : '#bbbbbb'};color: ${item.isSelected ? globalColors.primary : '#bbbbbb'}`"
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
		display: flex;
		padding: 20px 0;
        position: absolute;
        right: 20px;
        top: 20px;

        @media (min-width: 950px) {
            display: none !important;
        }
	}

    .column {
        display: flex;
        flex-direction: column;
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
        background-color: white !important;
		box-shadow: none !important;
		border-radius: 16px;
		font-family: font(bold);
        font-size: 10px;
        height: 25px;
        margin: 3px 0px;

		&.active {
			background-color: red;
			color: white;
		}
	}
</style>
