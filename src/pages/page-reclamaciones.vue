<template>
	<div class="reclamations-container">
		<h2 class="main-title">Libro de reclamaciones</h2>
		<div class="section">
			<h3>Razón social: {{getCommerceData.rzSocial}}</h3>
			<h3>RUC: {{getCommerceData.documentNumber}}</h3>
		</div>
		<form>
			<div class="section">
				<label class="input">
					Fecha
					<app-input
						type="date"
						placeholder="Fecha"
						v-model="reclamation.claimDate"
					/>
				</label>
			</div>
			<div class="section">
				<h4>1. Identificación del consumidor reclamante</h4>
				<label class="input">
					Nombre
					<app-input
						type="text"
						v-model="reclamation.claimentName"
						placeholder="Nombre"
					/>
				</label>
				<label class="input">
					Domicilio
					<app-input
						type="text"
						v-model="reclamation.claimentAddress"
						placeholder="Domicilio"
					/>
				</label>
				<label class="input">
					Documento de identidad
					<app-input
						type="text"
						v-model="reclamation.claimentDocument"
						placeholder="Documento Identidad (DNI, CE)"
					/>
				</label>
				<label class="input">
					Teléfono o celular
					<app-input
						type="tel"
						v-model="reclamation.claimetPhone"
						placeholder="Teléfono"
					/>
				</label>
				<label class="input">
					Correo electrónico
					<app-input
						type="email"
						v-model="reclamation.claimentEmail"
						placeholder="Correo"
					/>
				</label>
				<label class="input">
					Padres (en caso de ser menor de edad)
					<app-input
						type="text"
						v-model="reclamation.parents"
						placeholder="Padre o Madre (en caso de ser menor de edad)"
					/>
				</label>
			</div>
			<div class="section">
				<h4>2. Identificación del bien contratado</h4>
				<div>
					<label for="product">
						Producto
						<input
							class="radio"
							type="radio"
							name="product"
							id="product"
							value="product"
							@input="typesGood"
						/>
					</label>
					<label for="services">
						Servicios
						<input
							class="radio"
							type="radio"
							name="product"
							id="services"
							value="services"
							@input="typesGood"
						/>
					</label>
				</div>
				<label class="input">
					Monto reclamado
					<app-input
						type="text"
						v-model="reclamation.claimentWellHired.amountClaiment"
						placeholder="Monto reclamado"
					/>
				</label>
				<label class="input">
					Descripción
					<text-area
						rows="5"
						placeholder="Descripción"
						v-model="reclamation.claimentWellHired.description"
					></text-area>
				</label>
			</div>
			<div class="section">
				<h4>3. Detalle de la reclamación y pedido del consumidor</h4>
				<label for="reclamo">
					Reclamo
					<input
						class="radio"
						type="radio"
						name="reclamacion"
						id="reclamo"
						:value="1"
						@input="reclamo"
					>
				</label>
				<label for="queja">
					Queja
					<input
						class="radio"
						type="radio"
						name="reclamacion"
						id="queja"
						:value="2"
						@input="reclamo"
					>
				</label>
				<text-area rows="5"
					placeholder="Detalle"
					v-model="reclamation.claimDetail"
				></text-area>
				<text-area
					class="consumer-order"
					rows="5"
					placeholder="Pedido"
					v-model="reclamation.claimOrder"
				></text-area>
			</div>
			<div class="section">
				<h4>4. Observaciones y acciones adoptadas por el proveedor</h4>
				<label>
					Fecha de comunicación de la respuesta
					<app-input
						class="input"
						type="date"
						v-model="reclamation.answerDate"
					/>
					<text-area
						rows="5"
						placeholder="Observaciones"
						v-model="reclamation.answerDescription"
					></text-area>
				</label>
			</div>
			<button
				type="button"
				:disabled="$v.$invalid"
				class="send-reclamation"
				:style="`background-color:${globalColors.primary}`"
				@click="reclamationAction"
			>Enviar Reclamación</button>
		</form>
		<small><b>*RECLAMO:</b> Disconformidad relacionada a los productos o servicios.</small>
		<small><b>*QUEJA:</b> Disconformidad no relacionada a los productos o servicios; o malestar o descontento respecto a la atención al público.</small>
	</div>
</template>
<script>
import { required, requiredIf, email, minValue } from 'vuelidate/lib/validators';
import appInput from '@/components/shared/inputs/app-input';
import textArea from '@/components/shared/inputs/text-area';
import { mapGetters } from 'vuex';

function mounted() {
	this.setCommerceData();
}

function setCommerceData() {
	const { address, documentNumber, id, rzSocial, code } = this.getCommerceData;
	this.reclamation.commerceAddress = address;
	this.reclamation.commerceCode = code;
	this.reclamation.commerceName = rzSocial;
	this.reclamation.commereRuc = documentNumber;
	this.reclamation.commerceId = id;
}

function getCommerceData() {
	this.setCommerceData();
}

function reclamo({ target }) {
	this.reclamation.orderClaimDetail = Number(target.value);
}

function typesGood({ target }) {
	this.reclamation.claimentWellHired.product = target.value === 'product';
	this.reclamation.claimentWellHired.services = target.value === 'services';
}

async function reclamationAction() {
	const body = this.reclamation;
	const url = 'claim-book';
	try {
		await this.$httpSales.post(url, body);
		this.showNotification(
			'Su reclamo ha sido registrado',
			'success',
		);
	} catch (err) {
		this.showGenericError();
	}
}

function validations() {
	return {
		reclamation: {
			answerDate: { required },
			answerDescription: { required },
			claimDetail: { required },
			claimDate: { required },
			claimOrder: { required },
			claimentAddress: { required },
			claimentDocument: { required },
			claimentEmail: { required, email },
			claimentName: { required },
			claimetPhone: { required },
			claimentWellHired: {
				product: {
					required: requiredIf(() => {
						const { services } = this.reclamation.claimentWellHired;
						return services === false || services === null;
					}),
				},
				services: {
					required: requiredIf(() => {
						const { product } = this.reclamation.claimentWellHired;
						return product === false || product === null;
					}),
				},
				amountClaiment: { required, minValue: minValue(1) },
				description: { required },
			},
			commerceAddress: { required },
			commerceCode: { required },
			commerceId: { required, minValue: minValue(1) },
			commerceName: { required },
			commereRuc: { required },
			orderClaimDetail: { required, minValue: minValue(1) },
		},
	};
}

function data() {
	return {
		reclamation: {
			answerDate: '',
			answerDescription: '',
			claimDetail: '',
			claimDate: '',
			claimOrder: '',
			claimentAddress: '',
			claimentDocument: '',
			claimentEmail: '',
			claimentName: '',
			claimetPhone: '',
			claimentWellHired: {
				product: null,
				services: null,
				amountClaiment: 0,
				description: '',
			},
			commerceAddress: '',
			commerceCode: '',
			commerceId: 0,
			commerceName: '',
			commereRuc: '',
			orderClaimDetail: 0,
		},
	};
}

export default {
	name: 'page-reclamaciones',
	components: {
		appInput,
		textArea,
	},
	computed: {
		...mapGetters([
			'getCommerceData',
		]),
	},
	data,
	methods: {
		reclamo,
		typesGood,
		reclamationAction,
		setCommerceData,
	},
	mounted,
	validations,
	watch: {
		getCommerceData,
	},
};
</script>
<style lang="scss" scoped>
.reclamations-container {
	margin: auto;
	padding-top: 20px;
	width: 500px;

	.main-title {
		margin-bottom: 15px;
		text-align: center;
	}

	.section {
		margin: 10px 0;
	}

	.input {
		margin-bottom: 15px;
		text-align: left;
		width: 100%;
	}

	.radio {
		margin: 10px 0;

		&:last-child {
			margin-right: 40px;
		}
	}

	.consumer-order {
		margin: 10px 0;
	}

	.sign {
		align-items: flex-end;
		display: flex;
		height: 80px;
		justify-content: center;
		width: 100%;
	}

	.send-reclamation {
		color: white;
		font-family: font(bold);
		height: 50px;
		width: 100%;
	}
	.send-reclamation[disabled] {
		cursor: not-allowed;
		opacity: 0.3;
	}
}
.flex {
	display: flex;
}

.items-center {
	align-items: center;
}

.justify-center {
	justify-content: center;
}

.text-center {
	text-align: center;
}

.flex50 {
	flex: 1 1 50%;
}

.col {
	flex-direction: column;
}

.w-full {
	width: 100%;
}
</style>
