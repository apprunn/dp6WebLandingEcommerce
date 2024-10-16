<template>
	<div class="payment-form-container">
		<div class="payment-form-card">
		<button class="close-button" @click="closeForm">&times;</button>
		<h1>Pago</h1>
		<form @submit.prevent="loadOpenPayScripts" id="payment-form">
			<div class="form-group">
				<label for="holder-name">Nombre del titular</label>
				<input 
					v-model="formData.holderName" 
					type="text" 
					id="holder-name" 
					required
				/>
				<span class="alert-message" v-if="!formData.holderName">Requiere el nombre completo*</span>
			</div>
			<div class="form-group">
				<label for="card-number">Número de tarjeta</label>
				<input 
					v-model="formData.cardNumber" 
					type="number" 
					id="card-number"
					required
				/>
				<span class="alert-message" v-if="!isOnlyNumber(formData.cardNumber, 'cardNumber')">Solo numeros*</span>
			</div>
			<div class="form-row">
				<div class="form-group">
					<label for="expiration-month">Mes</label>
					<select 
					v-model="formData.expMonth" 
					id="expiration-month" 
					required
					>
					<option v-for="month in months" :key="month" :value="month">
						{{ month < 10 ? '0' + month : month }}
					</option>
					</select>
				</div>
				<div class="form-group">
				<label for="expiration-year">Año</label>
				    <select 
						v-model="formData.expYear" 
						id="expiration-year" 
						required
					>
						<option v-for="year in years" :key="year" :value="year">
							{{ year }}
						</option>
					</select>
				</div>
				<div class="form-group">
				<label for="cvv">CVV</label>
				<input 
					v-model="formData.cvv" 
					type="number" 
					id="cvv"
					required
				/>
				<span class="alert-message" v-if="!isOnlyNumber(formData.cvv, 'cvv')" >3 digitos numericos*</span>
				</div>
			</div>
			<v-btn
				type="submit"
				class="pay-button"
				:loading="isLoading"
				:disabled="isLoading || isFormValid"
				color="primary"
				>
				<span v-if="isLoading">Cargando...</span>
				<span v-else>Pagar</span>
			</v-btn>
		</form>
		<div class="payment-info">
			<p>Transacciones realizadas vía: <strong>OpenPay</strong></p>
			<p class="security-info">Tus pagos se realizan de forma segura con encriptación de 256 bits</p>
		</div>
		</div>
	</div>
  </template>
  
  <script>
  function data() {
	return {
		deviceSessionId: '',
		months: Array.from({ length: 12 }, (_, i) => i + 1),
		formData: {
			holderName: '',
			cardNumber: '',
			expMonth: '',
			expYear: '',
			cvv: '',
		},
		years: this.generateYears(),
	};
  }
  
export default {
	name: 'open-pay-form',
	data,
	created() {
		this.cleanData();
		// this.loadOpenPayScripts();
	},
	props: {
		response: Object,
		isLoading: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		cleanData() {
			this.formData = {
				holderName: '',
				cardNumber: '',
				expMonth: '',
				expYear: '',
				cvv: '',
			};
		},
		isOnlyNumber(number, model) {
			if (model === 'cvv') {
				return /^\d+$/.test(number) && number.length === 3;
			}
			return /^\d+$/.test(number);
		},
		generateYears() {
			const currentYear = new Date().getFullYear();
			return Array.from({ length: 71 }, (_, i) => currentYear + i);
		},
		loadOpenPayScripts() {
			const openpayScript = document.createElement('script');
			openpayScript.src = 'https://js.openpay.pe/openpay.v1.min.js';
			openpayScript.async = true;

			openpayScript.onload = () => {
				window.OpenPay.setId(this.response.payboxMerchantId);
				window.OpenPay.setApiKey(this.response.payboxClientAppKey);
				window.OpenPay.setSandboxMode(!this.response.payboxProduction);

				const openpayDataScript = document.createElement('script');
				openpayDataScript.src = 'https://js.openpay.pe/openpay-data.v1.min.js';
				openpayDataScript.async = true;

				openpayDataScript.onload = () => {
					this.setupDeviceData();
				};

				document.head.appendChild(openpayDataScript);
			};

			document.head.appendChild(openpayScript);
		},
		setupDeviceData() {
			this.isLoading = true;
			try {
				const deviceDataId = window.OpenPay.deviceData.setup('payment-form');
				this.deviceSessionId = deviceDataId;
				this.handlePayment();
			} catch (error) {
				console.error('Error:', error);
			}
		},
		closeForm() {
			this.$emit('close');
			this.cleanData();
		},
		handlePayment() {
			const { holderName, cardNumber, expMonth, expYear, cvv } = this.formData;
			const cardData = {
				holder_name: holderName,
				card_number: cardNumber,
				expiration_month: expMonth,
				expiration_year: expYear % 100,
				cvv2: cvv,
				device_session_id: this.deviceSessionId,
			};
			window.OpenPay.token.create(cardData, this.successCallback, this.errorCallback);
		},
		successCallback(response) {
			const token = response.data.id;
			this.$emit('save-payment', token, this.deviceSessionId);
		},
		errorCallback(error) {
			this.isLoading = false;
			this.showNotification(error.data.description, 'error');
		},
	},
	computed: {
		isFormValid() {
			const { holderName, cardNumber, expMonth, expYear, cvv } = this.formData;
			const validate = Boolean(holderName && cardNumber && expMonth && expYear && cvv);
			return !validate;
		},
	},
};
</script>
  
<style scoped>
.alert-message {
  color: red;
  font-size: 9.5px;
  padding-left: 5px;
}

.year-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 200px; /* Ajusta el ancho máximo del contenedor */
  margin: 0 auto; /* Centra el contenedor */
}

select {
  width: 100px;
  padding: 7px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
  cursor: pointer;
  box-sizing: border-box; /* Incluye el padding en el ancho total */
}

select:focus {
  border-color: #4CAF50;
  outline: none;
}

/* Estilo para limitar el ancho de la lista desplegable */
select {
  max-width: 200px; /* Asegura que el menú no se expanda más allá del ancho deseado */
}
.payment-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  background-color: #f0f0f0;
  padding: 20px;
}

.payment-form-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-row {
  display: flex;
  gap: 10px;
}

.pay-button {
  width: 95%;
  padding: 10px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.pay-button:hover {
  background-color: #3a7bb5; /* Color más oscuro al pasar el ratón */
}

.pay-button:disabled {
  background-color: #c0c0c0; /* Color para el botón deshabilitado */
  cursor: not-allowed; /* Cursor de no permitido */
}

.payment-info {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.security-info {
  font-size: 12px;
  color: #666;
}

@media (max-width: 480px) {
  .form-row {
	flex-direction: column;
  }
}
</style>