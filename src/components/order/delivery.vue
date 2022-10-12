<template>
	<div class="main-container-delivery" :style="styleBtnMobile">
		<div @click="toogleCollapse('address')" class="contend-title">
			<div class="section-title">
				<img :src="logo.section" alt="logo del método de pago">
				<h2 class="payment-section-title">¿COMÓ QUIERES RECIBIR TU PRODUCTO? </h2>
			</div>
			<img height="16" width="18" :style="collapseStep" :src="arrow.section" alt="arrow" class="arrow"/>
		</div>
		<div v-show="collapseSection" class="section-forms">
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
				<div v-if="!isGetDirections" class="container-btn-new-address">
					<h5 class="mt-2 mx-2">Seleccionar dirección de envío </h5>
					<address-component
						class="select-address"
						v-if="getDirections.length > 1"
						data-cy="select-address-saved"
						hide-map-button
						placeholder="Seleccione una dirección"
						item-text="name"
						item-value="id"
						:disabled="visibleNewAddress"
						:options="getDirections"
						:value="selectedDirection.id"
						@input="directionSelected"
					/>
					<div :style="floatBtn" class="box-btn-address">
						<button @click="visibleFormAddress()" 
							class="btn-new-address mt-2 mx-2">
							{{txtBtnNewddress}}
						</button>
					</div>
				</div>
				<h5 class="mt-2 mx-2 txt-new-address" v-show="visibleNewAddress">Nueva Dirección</h5>
				<new-address v-show="visibleNewAddress"/>
			</div>
		</div>
		
		<section class="billing-section">
			<billing/>
		</section>
		<div @click="toogleCollapse('comment')" class="contend-title">
			<div class="section-title">
				<img height="26" width="28" :src="comment.section" alt="comentario icono">
				<h2 class="comment-section-title">COMENTARIO</h2>
			</div>
			<img height="16" width="18" :style="collapseStepComment" :src="arrow.section" alt="arrow" class="arrow"/>
		</div>
		<div v-show="collapseSectionComment" class="section-comments">
			<text-area
				data-cy="ref"
				placeholder="Escribe un comentario"
				type="text"
				class="mx-2 my-1 responsible-field"
				v-model="comments"
				@input="setComments"
			>
			</text-area>
		</div>
		
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getDeeper, isEmpty } from '@/shared/lib';
import textArea from '@/components/shared/inputs/text-area';
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
	this.collapseSection = true;
	Promise.all([
		this.$store.dispatch('LOAD_DIRECTIONS', this),
		this.$store.dispatch('LOAD_WAREHOUSES', { context: this, params: { flagEcommerce: 1 } }),
	]).then(() => {
		if (that.noOrder) {
			that.setDefaultDelivery();
			if (this.getDirections.length > 1) {
				const w = this.getDirections[1];
				this.directionSelected(w.id);
			}
			if (that.getFlagPickUp === that.store.value) {
				that.lonleyWarehouse();
			}
		} else {
			that.setOrderInfoByDefault();
		}
	});
}

function mounted() {
	this.comments = this.getComments;
	this.visibleNewAddress = this.getDirections.length === 1;
}

function lonleyWarehouse() {
	if (this.getWarehouses.length === 2) {
		const warehouse = this.getWarehouses[1];
		this.selectedWarehouse = warehouse;
		this.warehouseSelected(warehouse.id);
	}
}

function setDefaultDelivery() {
	this.selectedDirection = this.favoriteDirection || this.selectedDirection;
	this.$store.commit('SET_DELIVERY_PLACE', this.selectedDirection);
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
		this.$nextTick(() => {
			this.lonleyWarehouse();
		});
	}
	this.$store.commit('SET_DELIVERY_PLACE', delivery);
	this.$store.commit('SET_FLAG_PICKUP', val.value);
}

function warehousesMarkers() {
	const warehousesLocation = this.getWarehouses.reduce((list, w) => {
		const { name, id, location } = w;
		if (location) {
			const { lat, lng, x, y } = location;
			const marker = {};
			marker.id = id;
			marker.name = name;
			marker.location = location ? { lat: (lat || x), lng: (lng || y) } : {};
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
		const { lat, lng, x, y } = w.location;
		w.location = { lat: (lat || x), lng: (lng || y) };
	}
	this.$store.commit('SET_DELIVERY_PLACE', w);
	this.selectedWarehouse.id = w.id;
	this.selectedWarehouse.name = w.name;
	this.selectedWarehouse.location = w.location;
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
		this.visibleNewAddress = false;
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
			this.$store.dispatch('setShippingCostError', false);
		} catch (error) {
			if (error.data.message === 'PRICE_NOT_CONFIGURATION') {
				this.$store.dispatch('setShippingCostError', true);
				this.$store.dispatch('setNoShippingCost');
				this.showNotification('No es posible hacer envios a ese destino.', 'error', null, false, 8000);
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

function setComments() {
	this.$store.commit('UPDATE_COMENTS', this.comments);
}

function styleBtnMobile() {
	return {
		'--bg-mobile-color': this.globalColors.primary,
	};
}

function visibleFormAddress() {
	this.directionSelected(0);
	this.visibleNewAddress = !this.visibleNewAddress;
}

function floatBtn() {
	return `justify-content: ${this.getDirections.length <= 1 ? 'start' : 'end'}`;
}

function toogleCollapse(section) {
	if (section === 'address') {
		this.collapseSection = !this.collapseSection;
	} else if (section === 'comment') {
		this.collapseSectionComment = !this.collapseSectionComment;
	}
}

function collapseStep() {
	return `transform: ${this.collapseSection ? 'rotate(0deg)' : 'rotate(180deg)'};`;
}

function collapseStepComment() {
	return `transform: ${this.collapseSectionComment ? 'rotate(0deg)' : 'rotate(180deg)'};`;
}

function data() {
	return {
		logo: {
			section: '/static/icons/delivery-truck.svg',
		},
		arrow: {
			section: '/static/icons/arrow.svg',
		},
		comment: {
			section: '/static/icons/comment.svg',
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
		comments: '',
		visibleNewAddress: false,
		collapseSection: false,
		collapseSectionComment: false,
		isGetDirections: false,
	};
}

function handlerGetDirections() {
	this.visibleNewAddress = this.getDirections.length === 1;
	this.isGetDirections = this.getDirections.length === 1;
}

function txtBtnNewddress() {
	return this.visibleNewAddress ? 'Elejir una Dirección' : '+ Agregar Nueva Dirección';
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
		textArea,
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
			'getComments',
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
		styleBtnMobile,
		floatBtn,
		collapseStep,
		collapseStepComment,
		txtBtnNewddress,
	},
	created,
	mounted,
	data,
	methods: {
		buildBody,
		calculateShippingCost,
		clearSelectedDirection,
		clearSelectedWarehouse,
		directionSelected,
		handlerOrderInfo,
		lonleyWarehouse,
		selected,
		setDefaultDelivery,
		setDeliveryPlaceByDefault,
		setOrderInfoByDefault,
		warehouseSelected,
		setComments,
		visibleFormAddress,
		toogleCollapse,
	},
	watch: {
		getOrderInfo: handlerOrderInfo,
		getDirections: handlerGetDirections,
	},
};
</script>
<style lang="scss" scoped>
	.delivery {
		align-items: center;
		display: grid;
		grid-gap: 10px;
		grid-auto-flow: column;
		@media (max-width: 325px) {
			grid-auto-flow: row;
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
	}

	.select-address{
		margin-top: 10px;
	}

	.billing-section {
		margin-top: 40px;
	}

	.payment-section-title {
		color: color(dark);
		font-size: size(medium);
		font-family: font(bold);
		margin-left: 12px;
		text-transform: uppercase;
	}
	.comment-section-title{
		color: color(dark);
		font-size: size(medium);
		font-family: font(bold);
		margin-left: 19px;
		text-transform: uppercase;
	}

	.section-title {
		align-items: baseline;
		display: flex;
		justify-content: flex-start;
	}

	.main-container-delivery {
		margin-top: 60px;
	}

	.container-btn-new-address {
		color: #002074;
		
	}
	.box-btn-address{
		display: flex;
		align-items: center;
		justify-content: end;
		width: 100%;
	}

	.btn-new-address {
		background-color: var(--bg-mobile-color);
		border-radius: 10px;
		width: auto;
		height: 31px;
		padding: 6px 19px 7px;
		color: white;
		font-size: 13px;
		margin-bottom: 10px;
	}

	.txt-new-address {
		color: #002074;
	}

	.contend-title{
		display: flex;
		justify-content:space-between;
		align-items: center;
	}
	.arrow{
		transform: rotate(180deg);
	}

	.section-forms{
		margin-top: 20px;
	}

	.section-comments{
		margin-top: 20px;
	}

</style>
