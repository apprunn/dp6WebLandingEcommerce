<template>
	<div>
		<form-container
			:background-image="backgroundImage"
			:color="globalColors.primary"
			:disabled="disabled"
			:heading-image="headingImage"
			:img-height="width > 768 ? '39.3' : '38'"
			title="Crear Cuenta"
			@on-submit="createAccount"
		>
			<register-form
				:check-color="globalColors.primary"
				:email-disabled="emailDisabled"
				:flag-tyc="flagTyc"
				:model="model"
				:password-verified="passwordVerified"
				:validatons="$v"
				@set-model="setModel"
			></register-form>
		</form-container>
	</div>
</template>

<script>
import { email, required, sameAs } from 'vuelidate/lib/validators';
import formContainer from '@/components/shared/account/form-container';
import registerForm from '@/components/shared/account/register-form';
import { mapState } from 'vuex';
import userDataValidation from '@/mixins/userDataValidation';

function created() {
	this.setWidth();
	this.modelFacebook = { ...this.$route.query };
	this.emailDisabled = !!this.modelFacebook.id;
	if (this.modelFacebook.id) {
		this.setModel({ model: 'email', value: this.modelFacebook.email });
		this.setModel({ model: 'lastname', value: this.modelFacebook.last_name });
		this.setModel({ model: 'name', value: this.modelFacebook.first_name });
		this.setModel({ model: 'password', value: this.facebookExternalId });
		this.setModel({ model: 'passwordVerified', value: this.facebookExternalId });
	}
}

function cleanForm() {
	this.flagTyc = false;
	this.model = {
		email: null,
		lastname: null,
		name: null,
		password: null,
	};
	this.modelFacebook = {
		email: null,
		first_name: null,
		id: null,
		last_name: null,
	};
	this.password = null;
	this.passwordVerified = null;
}

async function createAccount() {
	this.loading = true;
	const body = { ...this.model };
	const headers = {
		Authorization: `Bearer ${process.env.TOKEN}`,
	};
	body.codeApp = process.env.APP_CODE;
	body.codeProject = process.env.CODE_PROJECT;
	body.codeRole = process.env.ROLE_CODE;
	if (this.modelFacebook.id) {
		body.provider = 2;
		body.extUserId = this.modelFacebook.id;
		body.activation = Number(!this.modelFacebook.email);
		body.password = this.modelFacebook.id;
	}
	try {
		const { data: response } = await this.$httpSales.post(
			'customers-public',
			body,
			{ headers },
		);
		if (this.modelFacebook && this.modelFacebook.id) {
			if (response.data && response.data.token) {
				localStorage.clear();
				localStorage.setItem(`${process.env.STORAGE_USER_KEY}::token`, response.data.token);
				this.$store.dispatch('setToken', response.data.token);
				this.getCustomerData();
				this.cleanForm();
				this.showNotification('La cuenta ha sido creada exitosamente.');
				this.goTo('page-home');
			} else {
				this.showNotification('La cuenta ha sido creada exitosamente.');
				const self = this;
				setTimeout(() => {
					self.showNotification('Se le ha enviado un correo electrónico para validar su cuenta.');
				}, 5050);
			}
		} else {
			this.cleanForm();
			this.showNotification('La cuenta ha sido creada exitosamente.');
			const self = this;
			setTimeout(() => {
				self.showNotification('Se le ha enviado un correo electrónico para validar su cuenta.');
			}, 5050);
		}
	} catch (err) {
		if (err.status === 400) {
			if (err.data.message === 'CUSTOMER_EXIST_ERROR' || err.data.message === 'ACL_REGISTER_USER_ERROR') {
				this.showGenericError('El email ya ha sido registrado.');
			}
		} else if (err.status === 500) {
			this.showGenericError();
		}
	} finally {
		this.loading = false;
	}
}

function disabled() {
	return this.$v.$invalid || this.loading;
}

async function getCustomerData() {
	const headers = {
		Authorization: `Bearer ${this.token}`,
	};
	const { data: userInfo } = await this.$httpSales.get('customers/current', { headers });
	userInfo.dni = null;
	userInfo.avatar = userInfo.urlImage || process.env.DEFAULT_AVATAR;
	userInfo.fullName = userInfo.typePerson.fullName;
	this.$store.dispatch('setUser', userInfo);
}

function mounted() {
	window.addEventListener('resize', this.setWidth);
}

function setModel({ model, value }) {
	if (model === 'passwordVerified' || model === 'flagTyc') {
		this[model] = value;
	} else {
		if (model === 'password') {
			this[model] = value;
		}
		this.model[model] = value;
	}
}

function setWidth() {
	this.width = window.innerWidth;
}

function validations() {
	return {
		flagTyc: { required },
		model: {
			email: {
				required,
				email,
			},
			lastname: {
				required,
				onlyCharacters: this.onlyCharacters,
			},
			name: {
				required,
				onlyCharacters: this.onlyCharacters,
			},
			password: {
				required,
			},
		},
		passwordVerified: {
			required,
			sameAsPassword: sameAs('password'),
		},
	};
}

function data() {
	return {
		backgroundImage: process.env.FORM_BACKGROUND,
		emailDisabled: false,
		flagTyc: null,
		headingImage: '/static/img/sign-up.svg',
		loading: false,
		model: {
			email: null,
			lastname: null,
			name: null,
			password: null,
		},
		modelFacebook: {
			email: null,
			first_name: null,
			id: null,
			last_name: null,
		},
		password: null,
		passwordVerified: null,
		width: 0,
	};
}

export default {
	name: 'page-register',
	components: {
		formContainer,
		registerForm,
	},
	computed: {
		disabled,
		...mapState('login', {
			facebookExternalId: state => state.externalId,
		}),
	},
	created,
	data,
	methods: {
		cleanForm,
		createAccount,
		getCustomerData,
		setModel,
		setWidth,
	},
	mixins: [userDataValidation],
	mounted,
	validations,
};
</script>
