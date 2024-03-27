<template>
<div class="cart-continer">
	<v-btn :style="activeStyle" class="btn-add-cart" depressed small type="button" @click="removeCarEvent"><span class="txt-icon-min"></span></v-btn>
	<!-- <button :style="activeStyle" class="btn-add-cart" @click="removeCarEvent"> <span class="txt-icon-min"></span></button> -->
	<v-btn :style="activeStyle" depressed small type="button" class="btn-add-cart" @click="addCarEvent"><span class="txt-icon-plus"> + </span></v-btn>
	<!-- <button :style="activeStyle" class="btn-add-cart" @click="addCarEvent"> <span class="txt-icon-plus"> + </span></button> -->
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
	// const borderColor = `border:1px solid ${this.globalColors.primary};`;
	const color = `color:${this.active ? 'white' : this.globalColors.primary};`;
	return `${bgColor}${color}`;
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
		disabledAdd: {
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
		border-radius: 100% !important;
		height: 32px !important;
		margin: 8px;
		min-width: 32px !important;

		@media screen and (max-width: 600px) {
			height: 32px !important;
			min-width: 32px !important;
		}
		@media screen and (max-width: 400px) {
			height: 28px !important;
			min-width: 28px !important;
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

