<template>
	<button
		:class="[
			{ 'loading': indeterminate },
			'app-button',
		]"
		@click="$emit('click-image')"
		v-bind="$attrs"
	>
		<div
			:style="`background: ${globalColors.primary};`"
			class="button-number" v-if="ifNumber"
		>{{number}}</div>
		<img 
			:src="indeterminate ? '' : imageUser"
			:alt="data.name"
			:height="data.height || 20" 
		>
		{{title}}
	</button>
</template>
<script>
import { mapGetters } from 'vuex';

function imageUser() {
	return this.data.image || this.data.logo || this.data.urlImage || process.env.DEFAULT_AVATAR;
}

export default {
	name: 'app-button-image',
	computed: {
		...mapGetters([
			'indeterminate',
		]),
		imageUser,
	},
	inheritAttrs: false,
	props: {
		data: {
			type: Object,
			default: () => {},
		},
		title: {
			type: String,
			default: '',
		},
		url: String,
		ifNumber: {
			type: Boolean,
			default: false,
		},
		number: [String, Number],
	},
};
</script>
<style lang="scss" scoped>
	.button-number {
		border-radius: 50%;
		color: color(white);
		height: 14px;
		font-family: font(bold);
		font-size: size(xsmall);
		position: absolute;
		right: -6px;
		text-align: center;
		top: -6px;
		width: 14px; 
	}

	.app-button {
		position: relative;
	}

	[disabled] {
		background-color: color(disabled);
		cursor: not-allowed;
	}
</style>


