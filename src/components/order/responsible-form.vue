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
			
			<v-tooltip top>
				<div slot="activator">
					<button @click="showResponsible" class="show-data-responsible">
						<svg width="25px" height="15px" viewBox="0 0 25 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							<g id="PERFIL" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g id="3_PERFIL_V3" transform="translate(-1089.000000, -474.000000)" :fill="showResponsibleSelected ? this.globalColors.secondary : '#4A4A4A'" fill-rule="nonzero">
									<g id="Group-15" transform="translate(69.000000, 250.000000)">
										<g id="Group-5">
											<g id="Group-4" transform="translate(1020.000000, 224.000000)">
												<g id="eye-copy-13">
													<path d="M10.5680397,4.04413978 C10.3589494,3.79293701 10.0190437,3.79293701 9.80995338,4.04413978 C9.60032696,4.2947001 9.60032696,4.70202122 9.80995338,4.95258153 C10.0190437,5.2037843 10.3589494,5.2037843 10.5680397,4.95258153 C10.7776661,4.70202122 10.7776661,4.2947001 10.5680397,4.04413978 Z" id="Shape"></path>
													<path d="M13.4065744,2.5704918 C12.7322103,2.5704918 12.0801078,2.73380639 11.4685468,3.05595328 C11.1635204,3.21666525 11.0249434,3.64320623 11.1589957,4.00873016 C11.2930481,4.3742541 11.6490529,4.54024361 11.9540793,4.37967623 C12.4116792,4.13864443 12.9004092,4.01639344 13.4065744,4.01639344 C15.4025184,4.01639344 17.0263495,5.96228787 17.0263495,8.35409836 C17.0263495,10.7459089 15.4025184,12.6918033 13.4065744,12.6918033 C11.4106304,12.6918033 9.78679931,10.7459089 9.78679931,8.35409836 C9.78679931,8.32937344 9.78673898,8.30522689 9.78722162,8.28050197 C9.7949438,7.88136082 9.53118286,7.55024934 9.19810322,7.54099557 C8.86448062,7.53101885 8.58871408,7.84774361 8.5809919,8.24695705 C8.58026794,8.28296 8.58020761,8.31809541 8.58020761,8.35409836 C8.58020761,11.543179 10.7453158,14.1377049 13.4065744,14.1377049 C16.067833,14.1377049 18.2329412,11.543179 18.2329412,8.35409836 C18.2329412,5.1650177 16.067833,2.5704918 13.4065744,2.5704918 Z" id="Shape"></path>
													<path d="M26.6819679,8.46398689 C23.3551987,3.84230689 18.4155027,0 13.4065744,0 C8.39696524,0 3.45732167,3.84327082 0.131180839,8.46398689 C-0.0602818674,8.73003279 -0.0397530433,9.13610623 0.177004107,9.37104918 C0.393813628,9.60599213 0.724788547,9.58080131 0.916198885,9.31481967 C1.02779818,9.15975475 1.14212069,9.0052682 1.25790954,8.85174557 C3.84574588,13.6498256 8.53689641,16.7081967 13.4065744,16.7081967 C18.2762524,16.7081967 22.9674029,13.6498256 25.5552392,8.85174557 C25.6710281,9.00533246 25.7853506,9.15981902 25.8969499,9.31481967 C26.0877842,9.5799659 26.4187067,9.60669902 26.6361447,9.37104918 C26.8529018,9.13610623 26.8734307,8.72996852 26.6819679,8.46398689 Z M13.4065744,15.4229508 C8.80251426,15.4229508 4.3743631,12.4875134 2.00632134,7.90554754 C3.87214008,5.66208656 8.18329789,1.2852459 13.4065744,1.2852459 C18.6299033,1.2852459 22.9410087,5.66208656 24.8068274,7.90548328 C22.4387857,12.4875134 18.0106345,15.4229508 13.4065744,15.4229508 Z" id="Shape"></path>
												</g>
											</g>
										</g>
									</g>
								</g>
							</g>
						</svg>
					</button>
				</div>
				<span> {{!showResponsibleSelected ? 'Ver formulario' : 'Ocultar Formulario'}}</span>
			</v-tooltip>
		</section>

		<form v-show="showResponsibleSelected" class="responsible">
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
				@input="setResponsiblePhones"
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
	this.showResponsibleSelected = (!this.meResponsible &&
		this.otherResponsible) || (this.responsible.dni === '' || this.responsible.phone === '');
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
		if (this.responsible.dni && this.responsible.phone) {
			helper.setLocalData('responsible::user', this.responsible);
		}
		const responsibleLocal = this.getLocalStorage('ecommerce::responsible::user');
		const phonesLocal = this.getLocalStorage('ecommerce::phonesList::user');
		if (responsibleLocal) {
			const newPhone = phonesLocal ? phonesLocal.phone : responsibleLocal.phone;
			this.responsible.dni = !this.responsible.dni ? responsibleLocal.dni :
				this.responsible.dni;
			this.responsible.phone = !this.responsible.phone ? newPhone :
				this.responsible.phone;
		}
		this.open = !this.responsible.dni;
	}
	this.validateForm();
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
		this.showResponsibleSelected = (this.responsible.dni === '' || this.responsible.phone === '');
	} else {
		this.showResponsibleSelected = true;
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
	helper.setLocalData('responsible::user', body);
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

function setResponsiblePhones(value) {
	this.responsible.phone = value;
	this.validateForm();
	helper.setLocalData('responsible::user', this.responsible);
	if (this.responsible.phone.length < 6) {
		return;
	}
	const newPhones = {
		phone: this.responsible.phone,
	};
	helper.setLocalData('phonesList::user', newPhones);
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

function showResponsible() {
	if (!this.otherResponsible) {
		this.showResponsibleSelected = !this.showResponsibleSelected;
	}
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
		showResponsibleSelected: false,
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
		setResponsiblePhones,
		showResponsible,
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
	.show-data-responsible {
		width: 25px;
		height: 25px;
		border-radius: 100%;
		color: color(dark);
		margin: 3px 10px 0 10px;
	}
</style>
