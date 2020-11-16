<template>
	<div class="main-container-delivery">
		<div class="section-title">
			<img :src="logo.section" alt="logo del método de pago">
			<h2 class="payment-section-title">¿COMÓ QUIERES RECIBIR TU PRODUCTO?</h2>
		</div>
		<section class="delivery" data-cy="delivery-buttons">
			<app-button-order
				v-if="atHouse"
				button-title="Envío a Domicilio"
				class="btn"
				:active="getFlagPickUp === house.value"
				@click="selected(house)"
			>
				<location-svg :active="getFlagPickUp === house.value"/>
			</app-button-order>
			<app-button-order
				v-if="atStore"
				button-title="Recoger en Tienda"
				class="btn"
				:active="getFlagPickUp === store.value"
				@click="selected(store)"
			>
				<coffee-svg :active="getFlagPickUp === store.value"/>
			</app-button-order>
		</section>
		<address-component
			v-if="getFlagPickUp === store.value && atStore"
			class="mt-4"
			placeholder="Seleccione una tienda"
			item-text="name"
			item-value="id"
			:address="selectedWarehouse.name"
			:center="warehouesesCenter"
			:disable-map="disableMapButtonByWarehouse"
			:markers="singleOrMultiMarkersOnWarehouses"
			:options="getWarehouses"
			:zoom="warehousesZoom"
			:value="selectedWarehouse.id"
			@input="warehouseSelected"
		/>
		<responsible-form/>
		<div v-if="getFlagPickUp === house.value && atHouse">
			<address-component
				data-cy="select-address-saved"
				hide-map-button
				placeholder="Seleccione una dirección"
				item-text="name"
				item-value="id"
				:options="getDirections"
				:value="selectedDirection.id"
				@input="directionSelected"
			/>
			<new-address v-if="selectedDirection.id === 0"/>
		</div>
		<section class="billing-section">
			<billing/>
		</section>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getDeeper, isEmpty } from '@/shared/lib';
import addressComponent from '@/components/order/address-component';
import appButtonOrder from '@/components/shared/buttons/app-button-order';
import billing from '@/components/order/billing';
import coffeeSvg from '@/components/shared/icons/coffee-shop';
import locationSvg from '@/components/shared/icons/location';
import newAddress from '@/components/order/new-address';
import responsibleForm from '@/components/order/responsible-form';
import waysDeliveries from '@/shared/enums/waysDeliveries';

function created() {
	const that = this;
	Promise.all([
		this.$store.dispatch('LOAD_DIRECTIONS', this),
		this.$store.dispatch('LOAD_WAREHOUSES', this),
	]).then(() => {
		if (that.noOrder) {
			that.setDefaultDelivery();
		} else {
			that.setOrderInfoByDefault();
		}
	});
}

function setDefaultDelivery() {
	const delivery = this.favoriteDirection || this.selectedDirection;
	this.$store.commit('SET_DELIVERY_PLACE', delivery);
}

function noOrder() {
	return isEmpty(this.getOrderInfo);
}

function setOrderInfoByDefault() {
	this.$store.commit('SET_DELIVERY_PLACE', this.getDeliveryAddress);
	if (this.getFlagPickUp === waysDeliveries.house.value) {
		this.selectedDirection = this.getDeliveryAddress || this.selectedDirection;
	} else {
		this.selectedWarehouse = this.getDeliveryAddress || this.selectedWarehouse;
	}
	this.$store.commit('SET_FLAG_PICKUP', this.getFlagPickUp);
}

function selected(val) {
	let delivery = null;
	if (val.code === this.house.code) {
		delivery = this.favoriteDirection || this.selectedDirection;
		this.selectedDirection = delivery;
		this.calculateShippingCost(delivery);
	} else {
		this.$store.dispatch('setNoShippingCost');
	}
	this.$store.commit('SET_DELIVERY_PLACE', delivery);
	this.$store.commit('SET_FLAG_PICKUP', val.value);
}

function warehousesMarkers() {
	const warehousesLocation = this.getWarehouses.reduce((list, w) => {
		const { name, id, location } = w;
		if (location) {
			const { x, y } = location;
			const marker = {};
			marker.id = id;
			marker.name = name;
			marker.location = location ? { lat: x, lng: y } : {};
			return list.concat(marker);
		}
		return list;
	}, []);
	return warehousesLocation;
}

function singleOrMultiMarkersOnWarehouses() {
	return this.selectedWarehouse.id ? [this.selectedWarehouse] : this.warehousesMarkers;
}

function warehouesesCenter() {
	const len = this.singleOrMultiMarkersOnWarehouses.length;
	const avrg = this.singleOrMultiMarkersOnWarehouses.reduce((o, { location }) => {
		const newO = o;
		if (location) {
			const { lat, lng, x, y } = location;
			newO.lat = (newO.lat || 0) + (lat || x);
			newO.lng = (newO.lng || 0) + (lng || y);
			return newO;
		}
		newO.lat = 0;
		newO.lng = 0;
		return newO;
	}, {});
	return { lat: avrg.lat / len, lng: avrg.lng / len };
}

function warehousesZoom() {
	return this.selectedWarehouse.id ? 16 : 12;
}

function disableMapButtonByWarehouse() {
	if (this.selectedWarehouse.id) {
		const { location } = this.selectedWarehouse;
		return !location;
	}
	return false;
}

function warehouseSelected(id) {
	const index = this.getWarehouses.findIndex(war => war.id === id);
	const w = this.getWarehouses[index];
	if (w.location) {
		const { x, y } = w.location;
		w.location = { lat: x, lng: y };
	}
	this.$store.commit('SET_DELIVERY_PLACE', w);
}

function directionSelected(id) {
	const w = this.getDirections.find(war => war.id === id);
	this.selectedDirection = w;
	this.$store.commit('SET_DELIVERY_PLACE', w);
	if (id === 0) {
		this.$store.dispatch('setNoShippingCost');
	} else {
		this.calculateShippingCost(w);
		this.$store.commit('SET_CUSTOMER_ADDRESS', null);
	}
}

function clearSelectedDirection() {
	this.selectedDirection = {
		id: 0,
		addressLine1: '',
		location: {},
	};
}

function clearSelectedWarehouse() {
	this.selectedWarehouse = {
		id: 0,
		name: '',
		location: {},
	};
}

function favoriteDirection() {
	return this.getDirections.find(f => f.isFavorite);
}

async function calculateShippingCost(location) {
	if (location && location.provinceId) {
		const { cityId, parishId, provinceId } = location;
		const url = '/weight/price';
		const body = this.buildBody(cityId, parishId, provinceId);
		try {
			const { data: amount } = await this.$httpProducts.post(url, body);
			this.$store.dispatch('setShippingCost', amount);
		} catch (error) {
			if (error.data.message === 'PRICE_NOT_CONFIGURATION') {
				this.$store.dispatch('setNoShippingCost');
				this.showNotification('No es posible hacer envios a ese destino.', 'error');
			}
		}
	}
}

function buildBody(cityId, parishId, provinceId) {
	const details = this.getProductToBuy.map((p) => {
		const newP = {};
		newP.weight = p.weigth || 0;
		newP.quantity = p.quantity;
		return newP;
	});
	return {
		cityId,
		details,
		parishId,
		provinceId,
	};
}

function atStore() {
	const deliveryType = getDeeper('deliveryType')(this.getCommerceData);
	if (deliveryType) {
		return !!deliveryType.find(d => d.code === this.store.code);
	}
	return false;
}

function store() {
	return waysDeliveries.store || {};
}

function atHouse() {
	const deliveryType = getDeeper('deliveryType')(this.getCommerceData);
	if (deliveryType) {
		return !!deliveryType.find(d => d.code === this.house.code);
	}
	return false;
}

function house() {
	return waysDeliveries.house || {};
}

function setDeliveryPlaceByDefault() {
	if (this.atHouse) {
		this.selected(this.house.code);
	} else {
		this.selected(this.store.code);
	}
}

function handlerOrderInfo() {
	this.setOrderInfoByDefault();
}

function data() {
	return {
		logo: {
			section: '/static/icons/delivery-truck.svg',
		},
		flagWatchOrderInfo: false,
		selectedDirection: {
			id: 0,
			addressLine1: '',
			location: {},
		},
		selectedWarehouse: {
			id: 0,
			name: '',
			location: {},
		},
	};
}

export default {
	name: 'delivery',
	components: {
		addressComponent,
		appButtonOrder,
		billing,
		coffeeSvg,
		locationSvg,
		newAddress,
		responsibleForm,
	},
	computed: {
		...mapGetters([
			'getCommerceData',
			'getCustomerAddress',
			'getDeliveryAddress',
			'getDirections',
			'getFlagPickUp',
			'getOrderInfo',
			'getProductToBuy',
			'getWarehouses',
		]),
		atHouse,
		atStore,
		disableMapButtonByWarehouse,
		favoriteDirection,
		house,
		noOrder,
		singleOrMultiMarkersOnWarehouses,
		store,
		warehouesesCenter,
		warehousesMarkers,
		warehousesZoom,
	},
	created,
	data,
	methods: {
		buildBody,
		calculateShippingCost,
		clearSelectedDirection,
		clearSelectedWarehouse,
		directionSelected,
		handlerOrderInfo,
		selected,
		setDefaultDelivery,
		setDeliveryPlaceByDefault,
		setOrderInfoByDefault,
		warehouseSelected,
	},
	watch: {
		getOrderInfo: handlerOrderInfo,
	},
};
</script>
<style lang="scss" scoped>
	.delivery {
		align-items: center;
		display: grid;
		grid-auto-flow: row;
		grid-gap: 10px;

		@media (min-width: 768px) {
			grid-auto-flow: column;
		}
	}

	.btn {
		flex: 1 1 40%;
		margin: 0 10px;

		@media (max-width: 600px) {
			font-size: size(msmall);
		}
	}

	.responsible {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 30px;
	}

	.responsible-field {
		flex: 1 1 47%;
		height: 68px;
	}

	.billing-section {
		margin-top: 50px;
	}

	.payment-section-title {
		font-size: size(large);
		font-family: font(bold);
		margin-left: 12px;
		text-transform: uppercase;
	}

	.section-title {
		align-items: baseline;
		display: flex;
		justify-content: flex-start;
		margin-bottom: 40px;
	}

	.main-container-delivery {
		margin-top: 60px;
	}
</style>
