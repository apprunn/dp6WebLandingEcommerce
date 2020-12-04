<template>
  <div>
		<form-container
			:background-image="backgroundImage"
			:color="globalColors.primary"
			:disabled="disabled"
			:heading-image="headingImage"
			:img-height="width > 768 ? '39.3' : '38'"
			:visible-btn="!isVisibleMessage"
			title="Nueva <br> contraseña"
			title-btn="Crear nueva contraseña"
			@on-submit="restorePassword"
		>
			<new-password 
				:model="model"
				:validatons="$v"
				@set-model="setModel"
			/>
		</form-container>
	</div>
</template>
<script>
	import { required, sameAs } from 'vuelidate/lib/validators';
	import formContainer from '@/components/shared/account/form-container';
	import newPassword from '@/components/shared/account/new-password';

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
				password: {
					required,
				},
				repeatPassword: {
					sameAsPassword: sameAs('password'),
				},
			},
		};
	}

	function disabled() {
		return this.$v.$invalid;
	}

	async function restorePassword() {
		const token = this.$route.params.token;
		const body = {
			password: this.model.password,
			token,
		};
		const headers = {
			Authorization: `Bearer ${process.env.TOKEN}`,
		};
		try {
			await this.$httpSales.post('password/reset', body, { headers });
			this.showNotification('La contraseña ha sido cambiada exitosamente');
			this.goTo('login');
		} catch (err) {
			if (err.status === 401) {
				if (err.data.message === 'TOKEN_NOT_FOUND') {
					this.showGenericError('Token no encontrado', 50000);
				}
				if (err.data.message === 'TOKEN_INVALITED') {
					this.showGenericError('Token invalido', 50000);
				}
			} else {
				this.$message.error({ message: err, showClose: true });
			}
		}
	}

	function data() {
		return {
			backgroundImage: process.env.FORM_BACKGROUND,
			headingImage: '/static/img/sign-in.svg',
			width: 0,
			model: {
				password: null,
				repeatPassword: null,
			},
			loading: false,
			isVisibleMessage: false,
		};
	}

	export default {
		name: 'page-restore-password',
		components: {
			formContainer,
			newPassword,
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