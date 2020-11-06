<template>
	<form class="responsible">
		<app-input
			data-cy="responsible-name"
			placeholder="Persona responsable de recibir"
			class="mx-2 my-1 responsible-field"
			v-model="responsible.name"
			@input="validateForm"
		>
			<span v-if="!$v.responsible.name.required">El nombre es requerido</span>
			<span v-if="!$v.responsible.name.onlyCharacters">Solo se permiten letras</span>
		</app-input>
		<app-input
			data-cy="responsible-lastname"
			placeholder="Apellido responsable de recibir"
			class="mx-2 my-1 responsible-field"
			v-model="responsible.lastname"
			@input="validateForm"
		>
			<span v-if="!$v.responsible.lastname.required">El Apellido es requerido</span>
			<span v-if="!$v.responsible.lastname.onlyCharacters">Solo se permiten letras</span>
		</app-input>
		<app-input
			data-cy="responsible-dni"
			:placeholder="labelCountry"
			class="mx-2 my-1 responsible-field"
			v-model="responsible.dni"
			@input="validateForm"
		>
			<span v-if="!$v.responsible.dni.required">{{labelError}}.</span>
			<span v-if="!$v.responsible.dni.onlyNumbers">Solo se permiten números</span>
		</app-input>
		<app-input
			data-cy="responsible-phone"
			placeholder="Celular"
			class="mx-2 my-1 responsible-field"
			v-model="responsible.phone"
			@input="validateForm"
		>
			<span v-if="!$v.responsible.phone.required">El teléfono es requerido</span>
			<span v-if="!$v.responsible.phone.onlyNumbers">Solo se permiten números</span>
		</app-input>
		<app-input
			data-cy="responsible-email"
			placeholder="Correo"
			type="email"
			class="mx-2 my-1 responsible-field"
			v-model="responsible.email"
			@input="validateForm"
		>
			<span v-if="!$v.responsible.email.required">El correo es requerido</span>
			<span v-if="!$v.responsible.email.email">El correo es inválido</span>
		</app-input>
	</form>
</template>
<script>
import { required, email } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import { getDeeper } from '@/shared/lib';
import appInput from '@/components/shared/inputs/app-input';
import userDataValidation from '@/mixins/userDataValidation';

function mounted() {
	if (getDeeper('responsiblePickUp')(this.getOrderInfo)) {
		this.responsible = { ...this.getOrderInfo.responsiblePickUp };
		this.loadedFromOrder = true;
		this.validateForm();
	} else {
		this.setUserData(this.user);
	}
}

function setUserData(user) {
	if (!this.loadedFromOrder) {
		const { dni, email: mail, name, phone, lastname } = user;
		this.responsible = { dni, name, email: mail, phone, lastname };
		this.validateForm();
	}
}

function validateForm() {
	this.$store.commit('SET_RESPONSIBLE', null);
	if (!this.$v.$invalid) {
		this.$store.commit('SET_RESPONSIBLE', this.responsible);
	}
}

function labelCountry() {
	return getDeeper('company.country.countryCode')(this.user) === 'ECU' ? 'Cédula' : 'DNI';
}

function labelError() {
	return getDeeper('company.country.countryCode')(this.user) === 'ECU' ? 'El número de documento es requerido' : 'El DNI es requerido';
}

function validations() {
	const validating = {
		responsible: {
			dni: {
				required,
				onlyNumbers: this.onlyNumbers,
			},
			email: { email, required },
			lastname: {
				required,
				onlyCharacters: this.onlyCharacters,
			},
			name: {
				required,
				onlyCharacters: this.onlyCharacters,
			},
			phone: {
				required,
				onlyNumbers: this.onlyNumbers,
			},
		},
	};
	return validating;
}

function data() {
	return {
		loadedFromOrder: false,
		responsible: {
			dni: '',
			email: '',
			lastname: '',
			name: '',
			phone: '',
		},
	};
}

export default {
	name: 'responsible-form',
	components: {
		appInput,
	},
	computed: {
		...mapGetters([
			'user',
			'getOrderInfo',
		]),
		labelCountry,
		labelError,
	},
	data,
	methods: {
		setUserData,
		validateForm,
	},
	mixins: [userDataValidation],
	mounted,
	validations,
	watch: {
		user: setUserData,
	},
};
</script>
<style lang="scss" scoped>
	.responsible {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 20px;
	}

	.responsible-field {
		flex: 1 1 47%;
		height: 68px;
	}
</style>
