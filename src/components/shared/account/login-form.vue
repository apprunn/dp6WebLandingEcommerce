<template>
	<div class="login-form">
		<v-layout wrap align-start justify-center>
			<v-flex xs12 pb-4 text-xs-left>
				<p class="caption ma-0">Si tienes una cuenta</p>
				<app-input
					data-cy="inputEmail"
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
					data-cy="inputPassword"
					type="password"
					placeholder="Contraseña"
					:value="model.password"
					@input="$emit('set-model', { model: 'password', value: $event })"
				></app-input>
				<span class="error-message" v-if="validatons.model.password.$invalid">
					La contraseña es requerida
				</span>
			</v-flex>
			<v-flex xs12 text-xs-right>
				<router-link to="recuperar-contrasena" class="form-link">¿Olvidaste tu contraseña?</router-link>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
	import appInput from '@/components/shared/inputs/app-input';

	/* eslint-disable arrow-body-style */

	export default {
		name: 'register-form',
		components: {
			appInput,
		},
		props: {
			model: {
				default: () => {},
				type: Object,
			},
			validatons: {
				default: () => {
					return {
						model: {
							email: {},
							password: {},
						},
					};
				},
				type: Object,
			},
		},
	};
</script>

<style lang="scss" scoped>
	.login-form {
		padding: 19.9px 30px 15.4px;

		@media (min-width: 768px) {
			padding: 16px 36px 15px;
		}

		.flex {
			position: relative;
		}
	}

	.form-label {
		color: color(border);
		font-family: font(demi);
		font-size: size(xsmall);
	}

	.caption, .form-link {
		color: color(base);
		font-family: font(demi);
		font-size: size(xsmall) !important;
	}

	.form-link {
		font-size: size(small) !important;
		text-decoration: none;
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