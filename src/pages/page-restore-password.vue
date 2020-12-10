<template>
  <div>
		<form-container
			:background-image="backgroundImage"
			:color="globalColors.primary"
			:disabled="disabled"
			:heading-image="headingImage"
			:img-height="width > 768 ? '39.3' : '38'"
			:visible-btn="!isVisibleMessage"
			title="¿Olvidaste tu <br> contraseña?"
			title-btn="Enviar"
			@on-submit="restorePassword"
		>
			<div 
				v-if="isVisibleMessage"
				class="container-checked">
				<img 
					src="/static/img/check.svg" 
					alt="checked"
					class="checked">
				<span>Se le ha enviado un correo electrónico con instrucciones 
					para crear una nueva contraseña</span>
			</div>
			<restore-form
				v-else
				:model="model"
				:validatons="$v"
				@set-model="setModel"/>
		</form-container>
	</div>
</template>
<script>
	import { email, required } from 'vuelidate/lib/validators';
	import formContainer from '@/components/shared/account/form-container';
	import restoreForm from '@/components/shared/account/restore-form';
	
	function created() {
		this.setWidth();
	}

	function mounted() {
		window.addEventListener('resize', this.setWidth);
	}

	function setWidth() {
		this.width = window.innerWidth;
	}

	function setModel({ model, value }) {
		this.model[model] = value;
	}

	function validations() {
		return {
			model: {
				email: {
					required,
					email,
				},
			},
		};
	}

	function disabled() {
		return this.$v.$invalid;
	}

	async function restorePassword() {
		const body = {
			email: this.model.email,
			codeApp: process.env.APP_CODE,
		};
		const headers = {
			Authorization: `Bearer ${process.env.TOKEN}`,
		};
		try {
			await this.$httpSales.post('password/email', body, { headers });
			this.isVisibleMessage = true;
		} catch (err) {
			if (err.status === 400) {
				if (err.data.message === 'CUSTOMER_NOT_FOUND') {
					this.showGenericError('El usuario no existe', 50000);
				}
			} else {
				this.showGenericError();
			}
		}
	}

	function data() {
		return {
			backgroundImage: process.env.FORM_BACKGROUND,
			headingImage: '/static/img/sign-in.svg',
			width: 0,
			model: {
				email: null,
			},
			loading: false,
			isVisibleMessage: false,
		};
	}

	export default {
		name: 'page-restore-password',
		components: {
			formContainer,
			restoreForm,
		},
		computed: {
			disabled,
		},
		created,
		data,
		methods: {
			setWidth,
			setModel,
			restorePassword,
		},
		mounted,
		validations,
	};
</script>
<style lang="scss" scoped>
	.checked {
		height: 16px;
	}

	.container-checked {
		background: color(dark);
		border-radius: 3px;
		color: color(white);
		margin: 100px 42px 0;
		padding: 10px;
	}
</style>