<template>
<div class="cart-continer">
	<button :style="activeStyle" class="btn-add-cart" @click="removeCarEvent"> <span class="txt-icon-min"></span></button>
	<button :style="activeStyle" class="btn-add-cart" @click="addCarEvent"> <span class="txt-icon-plus"> + </span></button>
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
		height: 32px;
		margin: 8px;
		width: 32px;
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
		font-size: 24px;
		font-weight: bold;
		color: color(white);
		@media screen and (max-width: 600px) {
			font-size: 20px;
		}
		@media screen and (max-width: 400px) {
			font-size: 18px;
		}
	}
	.txt-icon-min{
		background-color: color(white);
		height:4px;
		width:12px;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		color: color(white);
		@media screen and (max-width: 600px) {
			height:4px;
			width:11px;
		}
		@media screen and (max-width: 400px) {
			height:3px;
			width:10px;
		}
		
	}
	.cart-continer {
		align-items: center;
		justify-content: center;
		display: flex;
	}
</style>

