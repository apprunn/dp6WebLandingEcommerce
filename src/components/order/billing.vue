<template>
<div>
	<section class="billing-header-content">
		<div class="billin-header">
			<img src="/static/icons/tax.svg" alt="ícono de impuestos">
			<h2 class="billing-section-title">Facturación</h2>
		</div>
	</section>
	<div class="billing-switch">
		<v-switch
			hide-details
			:label="labelByCountry"
			class="billing-style"
			:value="getFlagBill"
			:input-value="getFlagBill"
			@change="changeBillSelection"
		></v-switch>
	</div>	
	<form class="billing-form" v-if="getFlagBill">
		<div class="document-type-container">
			<app-select
				v-if="isEcuador"
				item-text="name"
				item-value="code"
				placeholder="Tipo de documento"
				class="mx-2 my-1 select-field"
				:items="typeDocuments"
				v-model="billing.documentType"
			>
			</app-select>
		</div>
		<app-input
			placeholder="Número de Documento"
			class="mx-2 my-1 ruc-field"
			v-model="billing.ruc"
			@input="checkingFalgValidDocumentNumber"
			@blur="onBlur"
		>
			<span
				v-if="$v.flagValidDocumentNumber.$invalid && $v.billing.ruc.required"
			>Documento {{rucWordByCountry}}</span>
			<span v-if="$v.billing.ruc.$invalid">Documento requerido</span>
		</app-input>
		<app-input
			:placeholder="rzSocialLabel"
			class="mx-2 my-1 rzSocial-field"
			v-model="billing.rzSocial"
			@input="validateForm"
		>
			<span v-if="$v.billing.rzSocial.$invalid">La razón social es requerida</span>
		</app-input>
		<app-input
			placeholder="Dirección de domicilio fiscal"
			class="mx-2 my-1 address-field"
			v-model="billing.address"
			@input="validateForm"
		>
			<span v-if="$v.billing.address.$invalid">El domicilio fiscal es requerido</span>
		</app-input>
	</form>
</div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import appInput from '@/components/shared/inputs/app-input';
import appSelect from '@/components/shared/inputs/app-select';

function mounted() {
	if (this.getOrderInfo && this.getOrderInfo.dataBill) {
		const { address, ruc, rzSocial } = this.getOrderInfo.dataBill;
		this.billing = { address, ruc, rzSocial };
		this.changeBillSelection(true);
		this.validateForm();
	}
}

function validateForm() {
	this.$store.commit('SET_BILLING_DATA', null);
	if (!this.$v.$invalid) {
		const { documentType, ...billing } = this.billing;
		this.$store.commit('SET_BILLING_DATA', billing);
	}
}

function changeBillSelection(val) {
	this.$store.commit('SET_BILL_SELECTION', val);
}

function onBlur(val) {
	this.billing.ruc = val;
	if (this.isEcuador && this.flagBillingValidate && val) {
		this.validatingDocumentNumber(val);
	}
}

async function validatingDocumentNumber(val) {
	this.showNotification('Validando documento', 'info', null, false, 8000);
	const countryCode = this.getLocalStorage('ecommerce::country');
	const url = `${this.billing.documentType}/${val}?codeCountry=${countryCode}`;
	try {
		const { data: res } = await this.$httpDocumentNumberValidating.get(url);
		this.billing.address = res.data.domicilio;
		this.billing.rzSocial = res.data.nombre || res.data.Nombre_completo;
		this.showNotification('Validación exitosa', 'success');
		this.flagValidDocumentNumber = true;
	} catch (error) {
		this.billing.address = '';
		this.billing.rzSocial = '';
		this.showNotification(
			'No fue posible validar el documento. Intente con otro.',
			'error',
		);
		this.flagValidDocumentNumber = false;
	}
}

function validations() {
	if (this.isPeru) {
		return {
			billing: {
				address: { required },
				ruc: { required },
				rzSocial: { required },
			},
			flagValidDocumentNumber: {
				valid: true,
			},
		};
	}
	return {
		billing: {
			address: { required },
			ruc: { required },
			rzSocial: { required },
		},
		flagValidDocumentNumber: {
			valid: v => !!v,
		},
	};
}

function rucWordByCountry() {
	return this.isPeru ? 'requerido' : 'inválido';
}

function handlerInvalid() {
	this.validateForm();
}

function labelByCountry() {
	return this.isEcuador ? 'Factura a terceros' : 'Solicitar Factura';
}

function checkingFalgValidDocumentNumber() {
	this.flagValidDocumentNumber = !!this.billing.ruc;
}

function flagBillingValidate() {
	return this.getCommerceData.settings.flagBillingValidate;
}

function rzSocialLabel() {
	return this.isEcuador ? 'Nombre o Razón Social' : 'Razón Social';
}

function data() {
	return {
		billing: {
			address: '',
			documentType: 'ruc',
			ruc: '',
			rzSocial: '',
		},
		flagValidDocumentNumber: true,
		typeDocuments: [
			{ name: 'CÉDULA', code: 'dni' },
			{ name: 'RUC', code: 'ruc' },
		],
	};
}

export default {
	name: 'billing',
	components: {
		appInput,
		appSelect,
	},
	computed: {
		...mapGetters([
			'getFlagBill',
			'getOrderInfo',
			'getCommerceData',
		]),
		flagBillingValidate,
		labelByCountry,
		rucWordByCountry,
		rzSocialLabel,
	},
	data,
	methods: {
		changeBillSelection,
		checkingFalgValidDocumentNumber,
		handlerInvalid,
		onBlur,
		validateForm,
		validatingDocumentNumber,
	},
	mounted,
	validations,
	watch: {
		'$v.$invalid': handlerInvalid,
	},
};
</script>
<style lang="scss" scoped>
	.billing-switch {
		margin-bottom: 30px;
	}
	
	.billing-form {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.rzSocial-field,
	.ruc-field {
		flex: 1 1 40%;
	}

	.address-field {
		flex: 1 1 100%;
	}

	.billin-header {
		color: color(dark);
		display: flex;
		font-size: size(medium);
		margin-bottom: 40px;
	}

	.billing-section-title {
		font-family: font(bold);
		font-size: size(large);
		margin-left: 20px;
		text-transform: uppercase;
	}

	.billing-text-regular {
		font-family: font(regular);
	}

	.billing-text-highlight {
		font-family: font(medium);
	}

	.billing-header-content {
		margin-bottom: 40px;
	}

	.billing-switch {
		margin-bottom: 30px;
	}

	.document-type-container {
		display: flex;
		flex: 0 1 100%;

		.select-field {
			flex: 1 1 100%;

			@media (min-width: 768px) {
				flex: 0 0 30%;
			}
		}
	}
</style>

