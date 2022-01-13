<template>
	<div>
		<button
			v-bind="$attrs"
			v-on="$listeners"
			class="app-button"
			:class="{ 'thin': thin, 'active' : active}"
			:style="`background-color: ${active ? background : 'transparent'}; text-align: ${!img ? 'center' : 'left'} ; color: ${active ? color : border}; border: ${border ? `1px solid ${border}` : null}; max-width: ${maxWidth}`"
		>
		<v-progress-circular
			v-if="spinner"
			indeterminate
			color="white"
			></v-progress-circular>
			<span class="span-img" :style="`border-color: ${imgBorderColor}`" v-if="img">
				<img
					v-if="img"
					:height="imgHeight"
					:width="imgWidth"
					:src="img"
					:alt="action"
				/>
			</span>
			{{ action }}
		</button>
	</div>
</template>

<script>
import SpinnerLoading from '@/components/shared/spinner/spinner-loading';

export default {
	name: 'app-button',
	inheritAttrs: false,
	components: {
		SpinnerLoading,
	},
	props: {
		action: String,
		active: {
			default: true,
			type: Boolean,
		},
		background: String,
		border: String,
		color: {
			type: String,
			default: 'white',
		},
		img: String,
		imgBorderColor: String,
		imgHeight: [String, Number],
		imgWidth: [String, Number],
		maxWidth: {
			type: String,
			default: '182px',
		},
		thin: Boolean,
		spinner: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="scss" scoped>
	.spinner{
		width: 20px;
		height: 20px;
		background-color: red;
	}
	.app-button {
		border-radius: 7px;
		font-family: font(bold);
		height: 39.5px;
		letter-spacing: 0;
		max-width: 175px;
		width: 100%;

		@media (min-width: 764px) {
			max-width: 182px;
		}

		.span-img {
			border-right-style: solid;
			border-right-width: 1px;
			display: inline-block;
			height: 31px;
			line-height: 31px;
			margin-right: 11px;
			padding: 3px 0px;
			text-align: center;
			vertical-align: middle;
			width: 41px;
		}

		&.thin {
			height: 24px;
			font-family: font(demi);
			font-size: size(small);
			width: 170px;
		}
	}

	[disabled] {
		opacity: 0.3;
		cursor: not-allowed;
	}
</style>