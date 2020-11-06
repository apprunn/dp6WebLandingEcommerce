<template>
	<button
		data-cy="add-to-cart"
		type="button"
		v-on="$listeners"
		:style="activeStyle"
		class="btn-svg"
	>
		<span class="svg">
			<slot></slot>
		</span>
		<span class="btn-title">{{buttonTitle}}</span>
		<slot name="after"></slot>
	</button>
</template>
<script>

function activeStyle() {
	const bgColor = `background-color:${this.active ? this.globalColors.primary : 'white'};`;
	const borderColor = `border:1px solid ${this.globalColors.primary};`;
	const color = `color:${this.active ? 'white' : this.globalColors.primary};`;
	return `${bgColor}${borderColor}${color}`;
}

export default {
	name: 'app-button-order',
	inheritAttrs: false,
	computed: {
		activeStyle,
	},
	props: {
		active: {
			default: false,
			type: Boolean,
		},
		buttonTitle: {
			default: '',
			type: String,
		},
	},
};
</script>
<style lang="scss" scoped>
	.btn-svg {
		align-items: center;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		padding: 5px 0;
	}

	.svg {
		margin: 0 5px;
	}

	.btn-title {
		font-family: font(heavy);
	}
</style>

