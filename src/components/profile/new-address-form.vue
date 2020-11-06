<template>
	<form class="new-addres-form">
		<app-input
			placeholder="Alias"
			class="mx-1 my-1 address-name addres-field"
			v-model="newAddress.name"
		>
			<span v-if="$v.newAddress.name.$invalid">El alias es requerido</span>
		</app-input>
		<app-select
			item-text="name"
			item-value="id"
			:placeholder="countryLabels.department"
			class="mx-1 my-1 address-department addres-field"
			:items="departments"
			v-model="newAddress.provinceId"
			@input="selectDepartment"
		>
			<span v-if="$v.newAddress.provinceId.$invalid">El {{countryLabels.department}} es requerido</span>
		</app-select>
		<app-select
			item-text="name"
			item-value="id"
			:placeholder="countryLabels.province"
			class="mx-1 my-1 address-province addres-field"
			:items="provinces"
			v-model="newAddress.cityId"
			@input="selectProvince"
		>
			<span v-if="$v.newAddress.cityId.$invalid">La {{countryLabels.province}} es requerida</span>
		</app-select>
		<app-select
			item-text="name"
			item-value="id"
			:placeholder="countryLabels.district"
			class="mx-1 my-1 address-district addres-field"
			:items="districts"
			v-model="newAddress.parishId"
		>
			<span v-if="$v.newAddress.parishId.$invalid">El {{countryLabels.district}} es requerido</span>
		</app-select>
		<app-input
			placeholder="Dirección"
			class="mx-1 my-1 address-location addres-field"
			v-model="newAddress.addressLine1"
		>
			<span v-if="$v.newAddress.addressLine1.$invalid">La dirección es requerida</span>
		</app-input>
		<app-input
			placeholder="Dpto. - Ofic."
			class="mx-1 my-1 address-number addres-field"
			v-model="newAddress.number"
		>
			<span v-if="$v.newAddress.number.$invalid">campo requerido</span>
		</app-input>
		<app-input
			placeholder="Referencia"
			class="mx-1 my-1 address-reference addres-field"
			v-model="newAddress.reference"
		>
			<span v-if="$v.newAddress.reference.$invalid">campo requerido</span>
		</app-input>
		<plus-component @click="addNewAddress" class="add-new-address-btn"/>
	</form>	
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import appInput from '@/components/shared/inputs/app-input';
import appSelect from '@/components/shared/inputs/app-select';
import plusComponent from '@/components/shared/icons/plus-component';

function created() {
	this.$store.dispatch('LOAD_DEPARTMENTS', this);
}

async function addNewAddress() {
	try {
		await this.$store.dispatch('NEW_ADDRESS', { context: this, newAddress: this.newAddress });
		this.showNotification('Nueva dirección agregada');
		this.clearNewAddressForm();
	} catch (error) {
		this.showGenericError('No fue posible agregar la nueva dirección. Verifique la información');
	}
}

function selectDepartment(id) {
	this.$store.dispatch('LOAD_PROVINCES', { context: this, provinceId: id });
}

function selectProvince(id) {
	this.$store.dispatch('LOAD_DISTRICTS', { context: this, cityId: id });
}

function validations() {
	return {
		newAddress: {
			addressLine1: { required },
			cityId: { required },
			name: { required },
			number: { required },
			parishId: { required },
			provinceId: { required },
			reference: { required },
		},
	};
}

function clearNewAddressForm() {
	this.newAddress = {
		addressLine1: '',
		addressLine2: '',
		cityId: null,
		name: '',
		number: null,
		parishId: null,
		provinceId: null,
		reference: null,
	};
}

function data() {
	return {
		newAddress: {
			addressLine1: '',
			addressLine2: '',
			cityId: null,
			name: '',
			number: null,
			parishId: null,
			provinceId: null,
			reference: null,
		},
	};
}

export default {
	name: 'new-address-form',
	components: {
		appInput,
		appSelect,
		plusComponent,
	},
	computed: {
		...mapGetters([
			'departments',
			'districts',
			'provinces',
		]),
	},
	created,
	data,
	methods: {
		addNewAddress,
		clearNewAddressForm,
		selectDepartment,
		selectProvince,
	},
	validations,
};
</script>
<style lang="scss" scoped>
	.new-addres-form {
		align-items: flex-start;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 50px 30px;

		@media (max-width: 600px) {
			margin: 0 10px 30px;
		}
	}

	.address-name,
	.address-department,
	.address-province,
	.address-district {
		flex: 1 1 30%;

		@media (max-width: 600px) {
			flex: 1 1 33%;
		}
	}

	.address-location {
		flex: 1 1 56%;
	}

	.address-number {
		flex: 1 1 30%;
	}

	.address-reference {
		flex: 1 1 60%;
	}

	.add-new-address-btn {
		flex: 1 1 5%;
		margin-top: 7px;
	}

	@media (max-width: 600px) {
		.address-name {
			order: 1;
		}

		.address-department {
			order: 2;
		}

		.address-district {
			order: 3;
		}

		.address-province {
			order: 4;
		}

		.address-location,
		.add-new-address-btn {
			order: 5;
		}
	}

	.addres-field {
		height: 62px;
	}
</style>