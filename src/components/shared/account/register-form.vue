<template>
	<div class="register-form">
		<v-layout wrap align-start justify-center>
			<v-flex xs5 pr-2 pb-4 text-xs-left>
				<app-input
					placeholder="Nombre"
					:value="model.name"
					@input="$emit('set-model', { model: 'name', value: $event })"
				>
					<span class="error-message" v-if="!validatons.model.name.required">
						El nombre es requerido
					</span>
					<span
						class="error-message"
						v-if="!validatons.model.name.onlyCharacters && validatons.model.name.required"
					>
						Solo se permiten letras
					</span>
				</app-input>
			</v-flex>
			<v-flex xs7 pb-4 text-xs-left>
				<app-input
					placeholder="Apellidos"
					:value="model.lastname"
					@input="$emit('set-model', { model: 'lastname', value: $event })"
				>
					<span class="error-message" v-if="!validatons.model.lastname.required">
						El apellido es requerido
					</span>
					<span
						class="error-message"
						v-if="!validatons.model.lastname.onlyCharacters && validatons.model.lastname.required"
					>
						Solo se permiten letras
					</span>
				</app-input>
			</v-flex>
			<v-flex xs12 pb-4 text-xs-left>
				<app-input
					:disabled="emailDisabled"
					type="email"
					placeholder="E-mail"
					:value="model.email"
					@input="$emit('set-model', { model: 'email', value: $event })"
				></app-input>
				<span class="error-message" v-if="!validatons.model.email.required">
					El email es requerido
				</span>
				<span class="error-message" v-if="!validatons.model.email.email">
					Ingrese un email válido
				</span>
			</v-flex>
			<v-flex xs12 pb-4 text-xs-left>
				<app-input
					placeholder="Número de documento"
					:value="model.documentNumber"
					@input="$emit('set-model', { model: 'documentNumber', value: $event })"
				>
					<span class="error-message" v-if="!validatons.model.documentNumber.required">
						El número de documento es requerido
					</span>
					<span
						class="error-message"
						v-if="!validatons.model.documentNumber.onlyNumbers && validatons.model.documentNumber.required"
					>
						Solo se permiten números
					</span>
				</app-input>
			</v-flex>
			<v-flex xs12 pb-4 text-xs-left>
				<app-input
					placeholder="Télefono"
					:value="model.phone"
					@input="$emit('set-model', { model: 'phone', value: $event })"
				>
					<span class="error-message" v-if="!validatons.model.phone.required">
						El teléfono es requerido
					</span>
					<span
						class="error-message"
						v-if="!validatons.model.phone.onlyNumbers && validatons.model.phone.required"
					>
						Solo se permiten números
					</span>
				</app-input>
			</v-flex>
			<v-flex xs12 pb-4 text-xs-left v-if="noFacebookPass">
				<app-input
					type="password"
					placeholder="Contraseña"
					:value="model.password"
					@input="$emit('set-model', { model: 'password', value: $event })"
				></app-input>
				<span class="error-message" v-if="validatons.model.password.$invalid">
					La contraseña es requerida
				</span>
			</v-flex>
			<v-flex xs12 text-xs-left v-if="noFacebookPass">
				<app-input
					type="password"
					placeholder="Verificar contraseña"
					:value="passwordVerified"
					@input="$emit('set-model', { model: 'passwordVerified', value: $event })"
				></app-input>
				<span class="error-message" v-if="!validatons.passwordVerified.required">
					Vuelva a escribir la contraseña
				</span>
				<span class="error-message" v-else-if="!validatons.passwordVerified.sameAsPassword">
					Las contraseñas no coinciden
				</span>
			</v-flex>
			<v-flex xs12 mt-2 text-xs-left>
				<v-checkbox
					hide-details
					class="form-check"
					:value="flagTyc"
					:color="checkColor"
					@change="$emit('set-model', { model: 'flagTyc', value: $event })"
				>
					<label slot="label" class="form-label">
						Aceptar
						<router-link to="#">Términos y Condiciones</router-link>
					</label>
				</v-checkbox>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
import appInput from '@/components/shared/inputs/app-input';
import { mapState } from 'vuex';

/* eslint-disable arrow-body-style */

export default {
	name: 'register-form',
	components: {
		appInput,
	},
	computed: {
		...mapState('login', {
			noFacebookPass: state => !state.externalId,
		}),
	},
	props: {
		checkColor: String,
		emailDisabled: {
			default: false,
			type: Boolean,
		},
		flagTyc: {
			default: null,
			type: Boolean,
		},
		model: {
			default: () => {},
			type: Object,
		},
		password: [Number, String],
		passwordVerified: [Number, String],
		validatons: {
			default: () => {
				return {
					flagTyc: {},
					model: {
						dni: {},
						email: {},
						lastname: {},
						name: {},
						password: {},
						phone: {},
					},
					passwordVerified: {},
				};
			},
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
	.register-form {
		padding: 19.9px 30px 15.4px;

		@media (min-width: 768px) {
			padding: 16px 36px 30px;
		}

		.flex {
			position: relative;
		}
	}

	.form-label {
		color: color(base);
		font-family: font(demi);
		font-size: size(xsmall);
	}

	.form-check {
		margin-top: 9px !important;
		padding-top: 0px !important;

		@media (min-width: 768px) {
			margin-top: 13px !important;
		}
	}

	.error-message {
		color: color(error);
		display: block;
		font-size: size(xsmall);
		line-height: 1;
		margin-top: 2px;
		position: absolute;
		width: 100%;
	}
</style>