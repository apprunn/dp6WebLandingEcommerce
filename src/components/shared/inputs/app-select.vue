<template>
	<div>
		<v-select
			outline
			hide-details
			menu-props="auto"
			append-icon="expand_more"
			:class="[
				light ? 'light-select' : 'ecommerce-select',
			]"
			v-bind="$attrs"
			:items="items"
			:value="value"
			@input="sendValue"
			@click:append-outer="clear"
		></v-select>
		<span class="err-message">
			<slot></slot>
		</span>
	</div>
</template>
<script>

function sendValue(val) {
	this.$emit('input', val);
}

function clear() {
	this.$emit('clear');
}

export default {
	name: 'app-select',
	inheritAttrs: false,
	methods: {
		sendValue,
		clear,
	},
	props: {
		items: {
			default: () => [],
			type: Array,
		},
		light: {
			default: false,
			type: Boolean,
		},
		value: null,
	},
};
</script>
<style lang="scss" scoped>
	.ecommerce-select {
		
		.v-input__control {

			.v-input__slot {
				border: none;
			}
		}
	}
</style>
