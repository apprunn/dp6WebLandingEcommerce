<template>
	<form class="account-form" @submit.prevent="$emit('on-submit')">
		<v-layout wrap justify-center>
			<v-flex xs12 text-xs-center>
				<img :src="headingImage" :height="imgHeight" alt="">
				<div class="form-title">
					<span v-html="title"></span>
				</div>
			</v-flex>
			<v-flex xs12 text-xs-center>
				<slot name="form"></slot>
			</v-flex>
			<v-flex xs12 text-xs-center>
				<app-button
					data-cy="loginBtnAction"
					:action="titleBtn || title"
					:background="color"
					:disabled="disabled"
					v-if="visibleBtn"
					type="submit"
				></app-button>
			</v-flex>
			<v-flex xs12 mt-2 text-xs-center v-if="facebook">
				<app-button
					action="Iniciar Sesión"
					:background="colorFacebook"
					img="/static/img/icons/icon-facebook.svg"
					img-border-color="#324988"
					img-height="25"
					type="button"
					@click="$emit('authenticate', 'facebook')"
				></app-button>
			</v-flex>
		</v-layout>
		<v-flex xs12 text-xs-center mt-2>
			<router-link v-if="isLogin" to="registro" class="form-link">¿no tienes cuenta?, <span :style="`color:${globalColors.primary}`">regístrate</span></router-link>
			<router-link v-else to="login" class="form-link">¿ya tienes cuenta?, <span :style="`color:${globalColors.primary}`">inicia sesión</span></router-link>
		</v-flex>
	</form>
</template>

<script>
	import appButton from '@/components/shared/buttons/app-button';

	function isLogin() {
		return this.$route.name === 'login';
	}

	function data() {
		return {
			colorFacebook: '#3a559f',
		};
	}

	export default {
		name: 'account-form',
		components: {
			appButton,
		},
		computed: {
			isLogin,
		},
		data,
		props: {
			color: String,
			disabled: {
				default: false,
				type: Boolean,
			},
			facebook: {
				default: false,
				type: Boolean,
			},
			headingImage: String,
			imgHeight: [Number, String],
			title: String,
			titleBtn: String,
			visibleBtn: {
				default: true,
				type: Boolean,
			},
		},
	};
</script>

<style lang="scss" scoped>
	.account-form {
		background-color: color(white);
		border-radius: 7px;
		height: fit-content;
		max-width: 304px;
		padding-bottom: 54px;
		padding-top: 30px;
		width: 100%;
		z-index: 1;

		@media (min-width: 768px) {
			max-width: 379px;
			padding-bottom: 55px;
			padding-top: 50px;
		}
	}

	.form-title {
		color: color(dark);
		font-family: font(demi);
		font-size: 13px;
		font-weight: bold;
		margin-top: 14.5px;
		position: relative;

		@media (min-width: 768px) {
			font-size: size(medium);
			margin-top: 30.8px;
		}

		span {
			&:after,
			&:before {
				background-color: color(dark);
				border-radius: 100%;
				bottom: 0px;
				content: '';
				height: 3.2px;
				margin: auto;
				position: absolute;
				top: 0px;
				width: 3.2px;

				@media (min-width: 768px) {
					height: 4px;
					width: 4px;
				}
			}

			&:after {
				left: calc(35% - 12px);

				@media (min-width: 768px) {
					left: calc(38% - 12px);
				}
			}

			&:before {
				right: calc(35% - 12px);

				@media (min-width: 768px) {
					right: calc(38% - 12px);
				}
			}
		}

		&:after,
		&:before {
			background-color: color(dark);
			border-radius: 3px;
			bottom: 0px;
			content: '';
			height: 3.2px;
			margin: auto;
			position: absolute;
			top: 0px;
			width: 65.9px;

			@media (min-width: 768px) {
				height: 4px;
				width: 82px;
			}
		}

		&:after {
			left: 6%;

			@media (min-width: 768px) {
				left: 12%;
			}
		}

		&:before {
			right: 6%;

			@media (min-width: 768px) {
				right: 12%;
			}
		}
	}
	.form-link {
		color: color(base);
		font-family: font(demi);
		font-size: size(small) !important;
		text-decoration: none;
	}
</style>