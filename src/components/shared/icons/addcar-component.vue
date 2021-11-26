<template>
<div class="cart-continer">
	<button :style="activeStyle" class="btn-add-cart" @click="removeCarEvent"> <span class="txt-icon-min"></span></button>
	<button :style="activeStyle" class="btn-add-cart" @click="addCarEvent"> <span class="txt-icon-plus"> + </span></button>
	<!-- 
	<button
		:class="[
			indeterminate ? 'loading' : 'cart-btn',
		]"
		@click="clicked"
	>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="30" height="30" viewBox="0 0 256 256" xml:space="preserve">
            <g transform="translate(128 128) scale(0.72 0.72)" style="">
                <g :fill="`${globalColors.primary}`"  transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" >
                    <path :fill="`${globalColors.primary}`" d="M 72.975 58.994 H 31.855 c -1.539 0 -2.897 -1.005 -3.347 -2.477 L 15.199 13.006 H 3.5 c -1.933 0 -3.5 -1.567 -3.5 -3.5 s 1.567 -3.5 3.5 -3.5 h 14.289 c 1.539 0 2.897 1.005 3.347 2.476 l 13.309 43.512 h 36.204 l 10.585 -25.191 h -6.021 c -1.933 0 -3.5 -1.567 -3.5 -3.5 s 1.567 -3.5 3.5 -3.5 H 86.5 c 1.172 0 2.267 0.587 2.915 1.563 s 0.766 2.212 0.312 3.293 L 76.201 56.85 C 75.655 58.149 74.384 58.994 72.975 58.994 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10;  fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                    <circle cx="28.88" cy="74.33" r="6.16" :fill="`${globalColors.primary}`" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10;  fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                    <circle cx="74.59" cy="74.33" r="6.16" :fill="`${globalColors.primary}`" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10;  fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                    <path :fill="`${globalColors.primary}`" d="M 62.278 19.546 H 52.237 V 9.506 c 0 -1.933 -1.567 -3.5 -3.5 -3.5 s -3.5 1.567 -3.5 3.5 v 10.04 h -10.04 c -1.933 0 -3.5 1.567 -3.5 3.5 s 1.567 3.5 3.5 3.5 h 10.04 v 10.04 c 0 1.933 1.567 3.5 3.5 3.5 s 3.5 -1.567 3.5 -3.5 v -10.04 h 10.041 c 1.933 0 3.5 -1.567 3.5 -3.5 S 64.211 19.546 62.278 19.546 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10;  fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                </g>
            </g>
        </svg>
	</button>
	-->
</div>
	
</template>
<script>
import { mapGetters } from 'vuex';

function addCarEvent($event) {
	$event.stopPropagation();
	this.$emit('add-car');
}

function removeCarEvent($event) {
	$event.stopPropagation();
	this.$emit('remove-car');
}

function activeStyle() {
	const bgColor = `background-color:${this.active ? this.globalColors.primary : 'white'};`;
	const borderColor = `border:1px solid ${this.globalColors.primary};`;
	const color = `color:${this.active ? 'white' : this.globalColors.primary};`;
	return `${bgColor}${borderColor}${color}`;
}

export default {
	name: 'addcar-component',
	computed: {
		...mapGetters([
			'indeterminate',
		]),
		activeStyle,
	},
	methods: {
		addCarEvent,
		removeCarEvent,
	},
	props: {
		value: false,
		active: {
			default: false,
			type: Boolean,
		},
	},
};
</script>
<style lang="scss" scoped>
	.btn-add-cart {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: color(primary);
		border-radius: 100%;
		height: 35px;
		margin: 8px;
		width: 35px;
		@media screen and (max-width: 600px) {
			height: 31px;
			width: 31px;
		}
		@media screen and (max-width: 400px) {
			height: 27px;
			width: 27px;
		}
	}
	.txt-icon-plus{
		display: flex;
		height:100%;
		width:100%;
		justify-content: center;
		align-items: center;
		font-size: 28px;
		font-weight: bold;
		color: color(white);
		@media screen and (max-width: 600px) {
			font-size: 21px;
		}
		@media screen and (max-width: 400px) {
			font-size: 19px;
		}
	}
	.txt-icon-min{
		background-color: color(white);
		height:5px;
		width:15px;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		color: color(white);
		@media screen and (max-width: 600px) {
			height:4px;
			width:13px;
		}
		@media screen and (max-width: 400px) {
			height:3px;
			width:11px;
		}
		
	}
	.cart-continer {
		align-items: center;
		justify-content: center;
		display: flex;
	}
</style>

