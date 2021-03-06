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
			<span v-if="$v.newAddress.department.$invalid">El {{countryLabels.department}} es requerido</span>
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
			<span v-if="$v.newAddress.province.$invalid">La {{countryLabels.province}} es requerida</span>
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
			<span v-if="$v.newAddress.district.$invalid">El {{countryLabels.district}} es requerido</span>
		</app-select>
		<app-input
			data-cy="direccion"
			placeholder="Dirección"
			class="mx-2 my-1 address-field field"
			v-model="newAddress.addressLine1"
		>
			<span v-if="$v.newAddress.addressLine1.$invalid">La dirección es requerida</span>
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
			v-model="newAddress.reference"
		>
			<span v-if="$v.newAddress.reference.$invalid">La referencia es requerida</span>
		</app-input>
	</form>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import appInput from '@/components/shared/inputs/app-input';
import appSelect from '@/components/shared/inputs/app-select';

function created() {
	this.$store.dispatch('LOAD_DEPARTMENTS', this);
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
			this.showNotification('No es posible hacer envios a ese destino.', 'error', null, false, 8000);
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
			cityId: this.newAddress.province,
			name: this.newAddress.name,
			number: this.newAddress.number,
			parishId: this.newAddress.district,
			provinceId: this.newAddress.department,
			reference: this.newAddress.reference,
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
			reference: { required },
		},
	};
}


function data() {
	return {
		newAddress: {
			addressLine1: '',
			department: null,
			district: null,
			name: '',
			number: '',
			province: null,
			reference: '',
		},
	};
}

export default {
	name: 'new-address',
	components: {
		appInput,
		appSelect,
	},
	computed: {
		...mapGetters([
			'departments',
			'districts',
			'getProductToBuy',
			'provinces',
		]),
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
	},
	validations,
};
</script>
<style lang="scss" scoped>
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
		flex: 60%;
	}
</style>
