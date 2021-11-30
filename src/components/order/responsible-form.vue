<template>
	<div class="main-container-responsible-form">
		<section class="responsible-pickup-container">
			<button
				type="button"
				data-cy="me-responsible"
				:class="['pickup-responsible']"
				:style="activeStyleMe"
				@click="setResponsible('meResponsible')"
			>Yo recogere</button>
			<button
				data-cy="other-responsible"
				type="button"
				:class="['pickup-responsible']"
				:style="activeStyleOther"
				@click="setResponsible('otherResponsible')"
			>Otro recogera</button>
		</section>

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
				v-on:blur="getResponsiblePhones"
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

		<modalComponent
			persistent
			v-model="open"
			maxWidth="40%"
		>
			<div class="update-customer-dni-modal">
				<h4 class="update-customer-dni-title">Estimado usuario, debe actualizar su documento de identidad para continuar</h4>
				<form>
					<label for="customer-dni">Introduzca su {{labelCountry}}</label>
					<app-input
						id="customer-dni"
						data-cy="update-customer-dni"
						type="number"
						:placeholder="labelCountry"
						class="mx-2 my-1 responsible-field"
						v-model="customerDni"
						@input="validateForm"
					>
					</app-input>

					<section class="update-customer-dni-buttons-container">
						<button
							type="button"
							:disabled="!customerDni"
							:style="saveCustomerDniButtonStyle"
							@click="updateCustomerDni"
						>Aceptar</button>
					</section>
				</form>
			</div>
		</modalComponent>

	</div>
</template>
<script>
import { required, email } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import { getDeeper, compose, setNewProperty } from '@/shared/lib';
import appInput from '@/components/shared/inputs/app-input';
import userDataValidation from '@/mixins/userDataValidation';
import modalComponent from '@/components/shared/modal/modal-component';
import helper from '@/shared/helper';

function mounted() {
	this.setResponsibleData();
}

function setResponsibleData() {
	if (getDeeper('responsiblePickUp')(this.getOrderInfo)) {
		this.responsible = { ...this.getOrderInfo.responsiblePickUp };
		this.loadedFromOrder = true;
		this.validateForm();
	} else {
		this.setUserData(this.user);
	}

	this.open = !this.responsible.dni;
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

function setResponsible(who) {
	this.meResponsible = false;
	this.otherResponsible = false;
	this[who] = true;

	if (this.meResponsible) {
		this.setResponsibleData();
	} else {
		this.cleanForm();
	}
}

function cleanForm() {
	this.responsible = {
		dni: '',
		email: '',
		lastname: '',
		name: '',
		phone: '',
	};
}

function activeStyleMe() {
	const bgColor = `background-color:${this.meResponsible ? this.globalColors.secondary : 'white'};`;
	const borderColor = `border:1px solid ${this.globalColors.secondary};`;
	const color = `color:${this.meResponsible ? 'white' : this.globalColors.secondary};`;
	return `${bgColor}${borderColor}${color}`;
}

function activeStyleOther() {
	const bgColor = `background-color:${this.otherResponsible ? this.globalColors.secondary : 'white'};`;
	const borderColor = `border:1px solid ${this.globalColors.secondary};`;
	const color = `color:${this.otherResponsible ? 'white' : this.globalColors.secondary};`;
	return `${bgColor}${borderColor}${color}`;
}

function cancelButtonStyle() {
	const bgColor = `background-color:${this.globalColors.secondary};`;
	const borderColor = `border:1px solid ${this.globalColors.secondary};`;
	const color = 'color:white';
	return `${bgColor}${borderColor}${color}`;
}

function saveCustomerDniButtonStyle() {
	const bgColor = `background-color:${this.globalColors.primary};`;
	const borderColor = `border:1px solid ${this.globalColors.primary};`;
	const color = 'color:white';
	return `${bgColor}${borderColor}${color}`;
}

function closeModal() {
	this.open = false;
	this.customerDni = '';
}

function updateCustomerDni() {
	const body = this.buildBody();
	this.$store.dispatch('UPDATE_USER_DATA', { context: this, body });
	this.closeModal();
}

function buildBody() {
	return compose(
		setNewProperty('name', this.user.name),
		setNewProperty('lastname', this.user.lastname),
		setNewProperty('rzSocial', this.user.rzSocial),
		setNewProperty('address', this.user.address),
		setNewProperty('phone', this.user.phone),
		setNewProperty('phoneNumbers', this.user.phoneNumbers),
		setNewProperty('ruc', this.user.ruc),
		setNewProperty('dni', this.customerDni),
		setNewProperty('gender', this.user.gender),
		setNewProperty('postalCode', this.user.postalCode),
		setNewProperty('provinceId', this.user.provinceId),
		setNewProperty('cityId', this.user.cityId),
		setNewProperty('countryId', this.user.countryId),
		setNewProperty('parishId', this.user.parishId),
	)({});
}

function getResponsiblePhones() {
	if (this.responsible.phone.length < 6) {
		return;
	}
	const { phoneNumbers } = this.user ? this.user : [];
	const currentPhone = phoneNumbers.find(p => p === this.responsible.phone);
	if (!currentPhone) {
		phoneNumbers.push(this.responsible.phone);
		const newPhones = {
			phone: this.responsible.phone,
			phoneNumbers,
		};
		helper.setLocalData('phonesList::user', newPhones);
	}
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
		customerDni: '',
		loadedFromOrder: false,
		meResponsible: true,
		open: false,
		otherResponsible: false,
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
		modalComponent,
	},
	computed: {
		...mapGetters([
			'user',
			'getOrderInfo',
		]),
		activeStyleMe,
		activeStyleOther,
		cancelButtonStyle,
		labelCountry,
		labelError,
		saveCustomerDniButtonStyle,
	},
	data,
	methods: {
		buildBody,
		cleanForm,
		closeModal,
		setResponsible,
		setResponsibleData,
		setUserData,
		updateCustomerDni,
		validateForm,
		getResponsiblePhones,
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
	.main-container-responsible-form {
		position: relative;

		.responsible {
			align-items: center;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top: 7px;
		}
	
		.responsible-field {
			flex: 1 1 47%;
			height: 68px;
		}
	
		.responsible-pickup-container {
			display: flex;
			justify-content: flex-start;
			margin-top: 1.5rem;
			padding-left: 1rem;
	
			.pickup-responsible {
				background-color: white;
				font-family: font(bold);
				font-size: 12px;
				padding: 0.25rem 0.75rem;
			}
		}

	}
	.update-customer-dni-modal {
		background-color: white;
		border-radius: 10px;
		padding: 2rem;

		.update-customer-dni-buttons-container {
			align-items: center;
			display: flex;
			justify-content: center;

			button {
				font-family: font(bold);
				margin: 0.5rem;
				padding: 0.5rem 1rem;

				&[disabled] {
					cursor: not-allowed;
					opacity: 0.5;
				}
			}
		}

		.update-customer-dni-title {
			text-align: center;
			margin-bottom: 20px;
		}
	}
</style>
