<template>
	<form class="new-address-form" @input="setCustomerAddress">
		<app-input
			data-cy="alias"
			placeholder="Tipo de Vivienda (mi casa, mi oficina, etc)"
			class="mx-2 my-1 name-field field"
			v-model="newAddress.name"
		>
			<span v-if="$v.newAddress.name.$invalid">Este campo es requerido</span>
		</app-input>
		<app-select
			item-text="name"
			item-value="id"
			class="mx-2 my-1 department-field field"
			data-cy="province"
			:placeholder="countryLabels.department"
			:items="departments"
			v-model="newAddress.department"
			@input="selectDepartment"
		>
			<div></div>
			<span v-if="$v.newAddress.department.$invalid"
				>El {{ countryLabels.department }} es requerido
				<v-progress-circular
					v-if="isToogleDp"
					indeterminate
					color="deep-orange"
					:width="2"
					:size="15"
				></v-progress-circular>
			</span>
		</app-select>
		<app-select
			item-text="name"
			item-value="id"
			class="mx-2 my-1 province-field field"
			data-cy="city"
			:placeholder="countryLabels.province"
			:items="provinces"
			:disabled="!newAddress.department"
			@input="selectProvince"
			v-model="newAddress.province"
		>
			<div class="divSpinner">
				<span v-if="$v.newAddress.province.$invalid"
					>La {{ countryLabels.province }} es requerida</span
				>
				<v-progress-circular
					v-if="isTooglePr"
					indeterminate
					color="deep-orange"
					:width="2"
					:size="15"
				></v-progress-circular>
			</div>
		</app-select>
		<app-select
			item-text="name"
			item-value="id"
			class="mx-2 my-1 district-field field"
			data-cy="parish"
			:placeholder="countryLabels.district"
			:items="districts"
			:disabled="!newAddress.department"
			v-model="newAddress.district"
			@input="selectDistrict"
		>
			<div class="divSpinner">
				<span v-if="$v.newAddress.district.$invalid"
					>El {{ countryLabels.district }} es requerido</span
				>
				<v-progress-circular
					v-if="isTooglePs"
					indeterminate
					color="deep-orange"
					:width="2"
					:size="15"
				></v-progress-circular>
			</div>
		</app-select>
		<app-input
			data-cy="direccion"
			placeholder="Dirección"
			class="mx-2 my-1 address-field field"
			v-model="newAddress.addressLine1"
		>
			<span v-if="$v.newAddress.addressLine1.$invalid"
				>La dirección es requerida</span
			>
		</app-input>
		<app-input
			data-cy="apto"
			placeholder="Nro Dpto/Oficina"
			class="mx-2 my-1 number-field field"
			v-model="newAddress.number"
		>
			<span v-if="$v.newAddress.number.$invalid">Este campo es requerido</span>
		</app-input>
		<app-input
			data-cy="ref"
			placeholder="Referencia"
			type="email"
			class="mx-2 my-1 reference-field field"
			v-model="newAddress.addressLine2"
		>
		</app-input>
		<div class="mx-2 my-1 button-field field">
			<a href="#" class="btn" @click.prevent="getMap()">Ubicar en el Mapa</a>
		</div>
		<div class="map mx-2 my-1 map-field" v-if="showMap">
			<map-component
				:zoom="16"
				:markers="[
					{ location: { lat: newAddress.latitude, lng: newAddress.longitude } },
				]"
				:location="{ lat: newAddress.latitude, lng: newAddress.longitude }"
				:center="{ lat: newAddress.latitude, lng: newAddress.longitude }"
			/>
		</div>
	</form>
</template>
<script>
/* global google */
import { required } from 'vuelidate/lib/validators';
import { mapGetters, mapState } from 'vuex';
import appInput from '@/components/shared/inputs/app-input';
import appSelect from '@/components/shared/inputs/app-select';
import appButton from '@/components/shared/buttons/app-button';
import mapComponent from '@/components/shared/map/map-component';

function created() {
	this.$store.dispatch('LOAD_DEPARTMENTS', this);
}

function flagMap() {
	return this.getCommerceData.settings.flagShowMap;
}

function getMap() {
	if (
		this.newAddress.department !== null &&
		this.newAddress.province !== null &&
		this.newAddress.district
	) {
		this.googleSearch();
	} else {
		this.showNotification(
			'Debe seleccionar el Departamento, Provincia y Distrito.',
			'warning',
			null,
			false,
			2000,
		);
	}
}

function googleSearch() {
	const geocoder = new google.maps.Geocoder();
	const departmentName = this.departments.filter(
		d => d.id === this.newAddress.department,
	);
	const provinceName = this.provinces.filter(
		p => p.id === this.newAddress.province,
	);
	const disctrictName = this.districts.filter(
		d => d.id === this.newAddress.district,
	);
	geocoder.geocode(
		{
			address: `${departmentName[0].name} ${provinceName[0].name} ${disctrictName[0].name} ${this.newAddress.addressLine1}`,
		},
		(results, status) => {
			if (status === google.maps.GeocoderStatus.OK) {
				const lat = results[0].geometry.location.lat();
				const lng = results[0].geometry.location.lng();
				this.newAddress.latitude = lat;
				this.newAddress.longitude = lng;
				this.showMap = true;
				this.setCustomerAddress();
			} else {
				this.showNotification(
					'No se encontro esa ubicación en el mapa.',
					'error',
					null,
					false,
					4000,
				);
				console.error('Request failed.');
			}
		},
	);
}

function selectDepartment(provinceId) {
	this.newAddress.province = null;
	this.newAddress.district = null;
	this.$store.commit('SET_PROVINCES', []);
	this.$store.commit('SET_DISTRICTS', []);
	// this.calculateShippingCost({ provinceId });
	this.$store.dispatch('LOAD_PROVINCES', { context: this, provinceId });
	this.setCustomerAddress();
}

function selectProvince(cityId) {
	this.newAddress.districts = null;
	this.$store.commit('SET_DISTRICTS', []);
	// this.calculateShippingCost({
	// 	provinceId: this.newAddress.department,
	// 	cityId,
	// });
	this.$store.dispatch('LOAD_DISTRICTS', { context: this, cityId });
	this.setCustomerAddress();
}

function selectDistrict(parishId) {
	this.calculateShippingCost({
		provinceId: this.newAddress.department,
		cityId: this.newAddress.province,
		parishId,
	});
	this.setCustomerAddress();
}

async function calculateShippingCost(locationId, location) {
	const url = '/weight/price';
	const body = this.buildBody(locationId, location);
	try {
		const { data: amount } = await this.$httpProducts.post(url, body);
		this.$store.dispatch('setShippingCost', amount);
		this.$store.dispatch('setShippingCostError', false);
	} catch (error) {
		if (error.data.message === 'PRICE_NOT_CONFIGURATION') {
			this.$store.dispatch('setShippingCostError', true);
			this.$store.dispatch('setNoShippingCost');
			this.showNotification(
				'No es posible hacer envios a ese destino.',
				'error',
				null,
				false,
				8000,
			);
		}
	}
}

/**
 * @param { object } geoLocation - objeto con provincia, ciudad y parroquia
 * @param { number } geoLocation.provinceId - id de la provincia seleccionada
 * @param { number } geoLocation.cityId - id de la ciudad seleccionada
 * @param { number } geoLocation.parishId - id de la parroquia seleccionada
 */
function buildBody(geoLocation) {
	const details = this.getProductToBuy.map((p) => {
		const newP = {};
		newP.weight = p.weigth || 0;
		newP.quantity = p.quantity;
		return newP;
	});
	return {
		details,
		...geoLocation,
	};
}

function setCustomerAddress() {
	if (this.$v.$invalid) {
		this.$store.commit('SET_CUSTOMER_ADDRESS', null);
	} else {
		const newAddress = {
			addressLine1: this.newAddress.addressLine1,
			addressLine2: this.newAddress.addressLine2,
			cityId: this.newAddress.province,
			name: this.newAddress.name,
			number: this.newAddress.number,
			parishId: this.newAddress.district,
			provinceId: this.newAddress.department,
			latitude: this.newAddress.latitude,
			longitude: this.newAddress.longitude,
			type: 1,
		};
		this.$store.commit('SET_CUSTOMER_ADDRESS', newAddress);
	}
}

function validations() {
	return {
		newAddress: {
			addressLine1: { required },
			department: { required },
			district: { required },
			name: { required },
			number: { required },
			province: { required },
		},
	};
}

function data() {
	return {
		newAddress: {
			addressLine1: '',
			addressLine2: '',
			department: null,
			district: null,
			name: '',
			number: '',
			province: null,
			latitude: null,
			longitude: null,
			type: 1,
		},
		address: '',
		showMap: false,
		labels: {},
	};
}

export default {
	name: 'new-address',
	components: {
		appInput,
		appSelect,
		appButton,
		mapComponent,
	},
	computed: {
		...mapState({
			locationAddress: state => state.order.locationAddress,
		}),
		...mapGetters([
			'departments',
			'districts',
			'getProductToBuy',
			'provinces',
			'getCommerceData',
			'getLocationAddress',
			'isToogleDp',
			'isTooglePs',
			'isTooglePr',
		]),
		flagMap,
	},
	created,
	data,
	methods: {
		buildBody,
		calculateShippingCost,
		selectDepartment,
		selectDistrict,
		selectProvince,
		setCustomerAddress,
		googleSearch,
		getMap,
	},
	validations,
	watch: {
		locationAddress(location) {
			this.newAddress.latitude = location.lat;
			this.newAddress.longitude = location.lng;
			this.setCustomerAddress();
		},
	},
};
</script>
<style lang="scss" scoped>
.divSpinner {
	margin: 2px;
	justify-content: space-between;
}
.v-progress-circular {
	float: right;
}
.new-address-form {
	align-items: center;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	margin-top: 20px;
}

.field {
	height: 68px;
}

.name-field,
.department-field {
	flex: 1 1 40%;

	@media (max-width: 925px) {
		flex: 1 1 100%;
	}
}

.district-field,
.province-field {
	flex: 1 1 40%;
}

.address-field {
	flex: 1 1 60%;
}

.number-field {
	flex: 1 1 20%;

	@media (max-width: 925px) {
		flex: 1 1 100%;
	}
}

.reference-field {
	flex: 1 1 60%;
	@media (max-width: 925px) {
		flex: 1 1 100%;
	}
}

.button-field {
	flex: 1 1 20%;

	@media (max-width: 925px) {
		flex: 1 1 100%;
	}
}

.map-field {
	flex: 1 1 100%;
}

.btn {
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: 'Avenir Next Medium';
	font-size: 12px;
	height: 46.8px;
	outline: none;
	border: 1px solid rgb(227, 5, 23);
	border-radius: 7px;
	color: rgb(227, 5, 23);
	text-decoration: none;
}
</style>
