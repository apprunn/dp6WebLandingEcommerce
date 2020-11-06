<template>
	<div class="address-container mx-2">
		<app-select
			data-cy="address-selection"
			class="address-select"
			v-bind="$attrs"
			:items="options"
			:value="value"
			@input="sendValue"
		/>
		<app-button-img
			v-if="!hideMapButton"
			class="map-button"
			:style="`background-color: ${globalColors.primary};border: 1px solid ${globalColors.primary};`"
			:disabled="disableMap"
			:data="objImg"
			@click-image="openModal(true)"
		/>
		<modal-component v-model="showMap" @input="openModal">
			<section class="map-title">
				<h4 class="direction-title">Dirección: {{address}}</h4>
			</section>
			<map-component :markers="markers" :center="center" :zoom="zoom"/>
		</modal-component>
	</div>
</template>
<script>
import appButtonImg from '@/components/shared/buttons/app-button-image';
import appSelect from '@/components/shared/inputs/app-select';
import mapComponent from '@/components/shared/map/map-component';
import modalComponent from '@/components/shared/modal/modal-component';

function sendValue(val) {
	this.$emit('input', val);
}

function openModal(val) {
	this.showMap = val;
}

function data() {
	return {
		objImg: {
			image: '/static/icons/location.svg',
			name: 'imagen representativa del mapa',
		},
		showMap: false,
	};
}

export default {
	name: 'address-component',
	components: {
		appButtonImg,
		appSelect,
		mapComponent,
		modalComponent,
	},
	data,
	inheritAttrs: false,
	methods: {
		openModal,
		sendValue,
	},
	props: {
		address: {
			default: '',
			type: String,
		},
		center: {
			default: () => {},
			type: Object,
		},
		disableMap: {
			default: false,
			type: Boolean,
		},
		hideMapButton: {
			default: false,
			type: Boolean,
		},
		markers: {
			default: () => [],
			type: Array,
		},
		options: {
			default: () => [],
			type: Array,
		},
		zoom: Number,
		value: null,
	},
};
</script>
<style lang="scss" scoped>
	.address-container {
		align-items: center;
		display: flex;
		height: 46.8px;
	}

	.map-button {
		align-items: center;
		display: flex;
		flex: 1 1 6%;
		height: 100%;
		justify-content: center;
	}

	.address-select {
		flex: 1 1 100%;
	}

	.map-title {
		background-color: white;
	}

	.direction-title {
		color: color(dark);
		font-family: font(demi);
		font-size: size(large);
		padding: 20px 30px;
	}
</style>

