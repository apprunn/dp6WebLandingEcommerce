<template>
	<div>
		<nav @click="goShopping" v-if="(getTotalItems > 0 && !indeterminate) || iscar" :style="activeStyle"  class="nav">
			<div :style="activeStyle" class="nav-content-cart">
				<div  class="info-card">
					<button type="button">
						<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="28" viewBox="0 0 122.9 107.5" style="enable-background:new 0 0 122.9 107.5" xml:space="preserve">
							<g fill="#ffffff" fill-rule="nonzero">
								<path d="M3.9,7.9C1.8,7.9,0,6.1,0,3.9C0,1.8,1.8,0,3.9,0h10.2c0.1,0,0.3,0,0.4,0c3.6,0.1,6.8,0.8,9.5,2.5c3,1.9,5.2,4.8,6.4,9.1 c0,0.1,0,0.2,0.1,0.3l1,4H119c2.2,0,3.9,1.8,3.9,3.9c0,0.4-0.1,0.8-0.2,1.2l-10.2,41.1c-0.4,1.8-2,3-3.8,3v0H44.7 c1.4,5.2,2.8,8,4.7,9.3c2.3,1.5,6.3,1.6,13,1.5h0.1v0h45.2c2.2,0,3.9,1.8,3.9,3.9c0,2.2-1.8,3.9-3.9,3.9H62.5v0 c-8.3,0.1-13.4-0.1-17.5-2.8c-4.2-2.8-6.4-7.6-8.6-16.3l0,0L23,13.9c0-0.1,0-0.1-0.1-0.2c-0.6-2.2-1.6-3.7-3-4.5 c-1.4-0.9-3.3-1.3-5.5-1.3c-0.1,0-0.2,0-0.3,0H3.9L3.9,7.9z M96,88.3c5.3,0,9.6,4.3,9.6,9.6c0,5.3-4.3,9.6-9.6,9.6 c-5.3,0-9.6-4.3-9.6-9.6C86.4,92.6,90.7,88.3,96,88.3L96,88.3z M53.9,88.3c5.3,0,9.6,4.3,9.6,9.6c0,5.3-4.3,9.6-9.6,9.6 c-5.3,0-9.6-4.3-9.6-9.6C44.3,92.6,48.6,88.3,53.9,88.3L53.9,88.3z M33.7,23.7l8.9,33.5h63.1l8.3-33.5H33.7L33.7,23.7z"/>
							</g>
						</svg>
						
					</button>
					<div class="globe">
						<span class="total-items">{{getTotalItems}}</span>
					</div>
				</div>
				<div class="summary-info">
					<span>Total</span>
					<h2 class="total-sumary">{{getCurrencySymbol}} {{getTotalToBuy | currencyFormat}}</h2>
				</div>
				<div v-if="iscar" class="car-action">
					<button @click="onClickEvent($event,'less')" class="btn-add-cart"> <span :style="colorBackGroundStyle" class="txt-icon-min"></span></button>
					<div class="cube"><span class="txt-quantity"> {{number}} </span></div> 
					<button @click="onClickEvent($event,'more')" class="btn-add-cart" > <span :style="colorTextStyle" class="txt-icon-plus"> + </span></button>
					<button @click="onClickEvent($event,'add')" class="btn-confirm">
						Agregar
					</button>
				</div>
			</div>
		</nav>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getDeeper } from '@/shared/lib';

function onClickEvent($event, action = 'more') {
	$event.stopPropagation();
	if (action === 'add') {
		this.$emit('add-to-car');
	} else {
		this.$emit('click', action);
	}
}

function goShopping() {
	this.goTo('buy');
}

function addCarEvent($event) {
	$event.stopPropagation();
	this.$emit('add-car');
}

function removeCarEvent($event) {
	$event.stopPropagation();
	this.$emit('remove-car');
}

function productTypeService() {
	return getDeeper('typeInfo.code')(this.product) !== 'servicios';
}

function activeStyle() {
	const bgColor = `background-color:${this.active ? this.globalColors.primary : 'white'};`;
	const borderColor = `border:1px solid ${this.globalColors.primary};`;
	const color = `color:${this.active ? 'white' : this.globalColors.primary};`;
	return `${bgColor}${borderColor}${color}`;
}
function colorTextStyle() {
	const color = `color:${this.active ? this.globalColors.primary : 'white'};`;
	return `${color}`;
}
function colorBackGroundStyle() {
	const bgColor = `background-color:${this.active ? this.globalColors.primary : 'white'};`;
	return `${bgColor}`;
}

export default {
	name: 'cart-bottom',
	computed: {
		...mapGetters([
			'indeterminate',
			'getTotalItems',
			'getTotalToBuy',
			'getCurrencySymbol',
		]),
		productTypeService,
		activeStyle,
		colorTextStyle,
		colorBackGroundStyle,
	},
	methods: {
		addCarEvent,
		removeCarEvent,
		goShopping,
		onClickEvent,
	},
	props: {
		iscar: {
			type: Boolean,
			default: false,
		},
		number: Number,
		openWarehouse: false,
		product: {
			default: null,
			type: Object,
		},
		disabledOrder: {
			type: Boolean,
			default: false,
		},
		active: {
			default: true,
			type: Boolean,
		},
	},
};
</script>

<style lang="scss" scoped>
	.btn-confirm{
		background-color: color(primary);
		color: white;
		border: none;
		border-radius: 5px;
		width: 60px;
		height: 30px;
		font-size: 11px;
		cursor: pointer;
		margin-right: -25px;
		margin-left: 8px;
		font-weight: bold;
		@media (max-width: 500px){
			margin-right: -10px;
			margin-left: 5px;
		}
		@media (max-width: 435px){
			margin-right: -7px;
			margin-left: 5px;
		}
		@media (max-width: 360px){
			margin-right: 0px;
			margin-left: 5px;
		}
	}
    .nav {
        display:none;
		@media (max-width: 600px) {	
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 60px;
			background: color(primary) 0% 0% no-repeat padding-box;
			box-shadow: 0px -1px 6px #00000033;
			border-radius: 40px 40px 0px 0px;
			background-color: color(white);
			display: flex;
			overflow-x: auto;
			z-index: 9999;
		}
    }
	.nav-content-cart {
		display:none;	
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		padding-left: 20px;
		padding-right: 20px;
		padding-top: 20px;
	}

	.nav-content-info{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		padding-left: 20px;
		padding-right: 20px;
		padding-top: 20px;
		color: #ffffff;
	}
	.car-action{
		margin-right: -10px;
		margin-left: 30px;
		margin-bottom: 20px;
		float: left;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 50%;
		height: 100%;
		justify-content: right;
	}
	
	.txt-quantity{
		font-size: 18px;
		font-weight: bold;
		color: color(black);
		
	}
	.total-items {
		font-size: 10px;
		font-weight: normal;
		color: color(black);
	}
	.info-card{
		position: relative;
		flex-direction:column;
	}
	.globe {
		position: absolute;
		top: -10px;
		right: -10px;
		display: flex;
		font-size: 14px;
		font-weight: normal;
		margin-left: 10px;
		width: 19px;
		height: 19px;
		background-color: #ffffff;
		color: color(black);
		justify-content: center;
		align-items: center;
		border-radius: 100%;
	}
	.summary-info{
		position: relative;
		display: block;
		flex-direction: column;
		padding-left: 15px;
		width: auto;
		span {
			font-size: 13px;
			position: absolute;
			bottom: 30px;
			@media screen and (max-width: 600px) {
				bottom: 30px;
			}
			@media screen and (max-width: 400px) {
				font-size: 11px;
			}
			@media screen and (max-width: 340px) {
				font-size: 10px;
			}
		}
	}
	.total-sumary {
		width: 100%;
		font-size: 21px;
		font-weight: bold;
		color: color(white);
		@media screen and (max-width: 400px) {
			font-size: 18px;
			letter-spacing: 0;
			margin-bottom: 10px;
		}
		@media screen and (max-width: 340px) {
			margin-bottom: 10px;
			font-size: 15px;
		}	
		
	}
	.btn-add-cart {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: color(white);
		border-radius: 100%;
		height: 25px;
		width: 25px;
		@media screen and (max-width: 340px) {
			height: 25px;
			width: 25px;
		}	
	}
	.txt-icon-plus{
		display: flex;
		height:100%;
		width:100%;
		justify-content: center;
		align-items: center;
		font-size: 22px;
		font-weight: bold;
		color: color(primary);
	}
	.txt-icon-min{
		background-color: color(primary);
		height:4px;
		width:11px;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		
	}
	.cube{
		display: flex;
		justify-content: center;
		align-items: center;
		padding:10px;
		background-color: #ffffff;
		width: 40px;
		height: 30px;
		margin-left: 5px;
		margin-right: 5px;
	}
</style>